import re
import os
import chromadb
from chromadb.utils import embedding_functions
from sentence_transformers import SentenceTransformer
import pypdf
import requests
import json
from pathlib import Path
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import requests

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize RAG Components
# Persistent Client for Chroma
chroma_path = BASE_DIR / "chroma_db"
chroma_client = chromadb.PersistentClient(path=str(chroma_path))

# Embedding Function (All-MiniLM-L6-v2)
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')

class MiniLMEmbeddingFunction(embedding_functions.EmbeddingFunction):
    def __call__(self, input):
        return embedding_model.encode(input).tolist()

collection = chroma_client.get_or_create_collection(
    name="resume_chunks",
    embedding_function=MiniLMEmbeddingFunction()
)

class RAGService:

    @staticmethod
    def extract_text_from_pdf(file_path):
        text = ""
        with open(file_path, 'rb') as f:
            reader = pypdf.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        return text

    @staticmethod
    def extract_candidate_info(text, filename=""):
        info = {
            "name": "Unknown Candidate",
            "email": None
        }
        
        print(f"DEBUG: --- Starting Extraction for {filename} ---")
        print(f"DEBUG: Text Length: {len(text)}")

        # 1. Regex Email
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        email_match = re.search(email_pattern, text)
        if email_match:
            info["email"] = email_match.group(0)
            print(f"DEBUG: Email found: {info['email']}")

        # 2. Heuristic Name
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        for i in range(min(5, len(lines))):
            potential_name = lines[i]
            if (1 <= len(potential_name.split()) <= 4 and 
                len(potential_name) < 50 and 
                "@" not in potential_name and
                not any(char.isdigit() for char in potential_name)):
                
                info["name"] = potential_name.title()
                print(f"DEBUG: Heuristic Name found: {info['name']}")
                break

        # 3. AI Fallback
        if not info["email"] or info["name"] == "Unknown Candidate":
            print("DEBUG: Triggering AI Extraction...")
            try:
                header_text = text[:3000]
                ai_extracted = RAGService.extract_with_llm(header_text)
                
                if ai_extracted.get("name") and ai_extracted["name"] not in ["Unknown", "Null", None]:
                    info["name"] = ai_extracted["name"]
                    print(f"DEBUG: AI Name found: {info['name']}")
                if ai_extracted.get("email") and not info["email"]:
                    info["email"] = ai_extracted["email"]
                    print(f"DEBUG: AI Email found: {info['email']}")
            except Exception as e:
                print(f"DEBUG: AI Failed: {e}")

        # 4. Filename Fallback
        print(f"DEBUG: Name before fallback: {info['name']}")
        if info["name"] in ["Unknown Candidate", "Resume", "Cv", "Curriculum Vitae"] and filename:
            print(f"DEBUG: Attempting Filename Fallback with '{filename}'")
            base = os.path.splitext(filename)[0]
            clean_name = base.replace("_", " ").replace("-", " ").title()
            clean_name = re.sub(r'\bresume\b|\bcv\b|\bprofile\b', '', clean_name, flags=re.IGNORECASE).strip()
            if clean_name:
                info["name"] = clean_name
                print(f"DEBUG: Filename Fallback used. Name: {info['name']}")
            else:
                print("DEBUG: Filename cleaned to empty string.")

        print(f"DEBUG: Final Extracted Info: {info}")
        return info

    @staticmethod
    def extract_with_llm(text_chunk):
        """
        Uses Groq to parse structured contact info from raw text.
        """
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key: 
            return {}

        try:
            return RAGService._inner_extract_with_llm(text_chunk, api_key)
        except Exception as e:
            print(f"DEBUG: Groq Extraction Exception after retries: {e}")
            return {}

    @staticmethod
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=2, max=10),
        retry=retry_if_exception_type(requests.exceptions.HTTPError)
    )
    def _inner_extract_with_llm(text_chunk, api_key):
        prompt = f"""
        Extract the **Candidate Name** and **Email Address** from the text below.
        If email is not found, return null.
        If name is not found, return null.
        
        TEXT:
        {text_chunk}
        
        OUTPUT JSON ONLY:
        {{
            "name": "Full Name",
            "email": "email"
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        url = "https://api.groq.com/openai/v1/chat/completions" 
        payload = {
            "messages": [
                {"role": "system", "content": "You are a data extraction assistant. Output valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            "model": "llama-3.1-8b-instant",
            "temperature": 0.1,
            "response_format": {"type": "json_object"}
        }
        
        # DEBUG
        print(f"DEBUG: Calling Groq for extraction on {len(text_chunk)} chars...")
        
        # Increased timeout to 15s
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        response.raise_for_status() # Trigger tenacity retry
        
        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            print(f"DEBUG: Groq Response: {content}")
            return json.loads(content)
        
        return {}

    @staticmethod
    def chunk_text(text, chunk_size=500, overlap=50):
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start = end - overlap
        return chunks

    @staticmethod
    def ingest_resume(user_id, resume_id, file_path):
        """
        1. Extract Text
        2. Chunk & Embed -> Store in ChromaDB
        """
        full_text = RAGService.extract_text_from_pdf(file_path)
        
        # Chunking
        chunks = RAGService.chunk_text(full_text)
        ids = [f"{resume_id}_{i}" for i in range(len(chunks))]
        metadatas = [{"resume_id": str(resume_id), "chunk_index": i} for i in range(len(chunks))]

        # Add to Chroma
        collection.add(
            documents=chunks,
            ids=ids,
            metadatas=metadatas
        )
        
        return resume_id

    @staticmethod
    def screen_resume(jd_text, resume_id, resume_context=""):
        """
        Ingests strict context and scores.
        """
        # 0. Validate JD
        clean_jd = jd_text.strip()
        if len(clean_jd) < 15 or len(clean_jd.split()) < 3:
             return {
                "score": 0, 
                "reasoning": "Job Description is too vague or invalid (Text too short). Please provide a detailed description.", 
                "key_skills_match": [],
                "missing_skills": []
            }

        # 1. Fallback to Chroma if context is empty
        if not resume_context:
            print("Fallback to Chroma Chunks...")
            results = collection.query(
                query_texts=[jd_text],
                n_results=10, # Increase chunks to get more context
                where={"resume_id": str(resume_id)}
            )
            if not results['documents'] or not results['documents'][0]:
                return {"score": 0, "reasoning": "No context found", "key_skills_match": [], "missing_skills": []}
            matched_chunks = results['documents'][0]
            resume_context = "\n".join(matched_chunks)
        
        # 3. Call Groq API with context
        api_key = os.getenv("GROQ_API_KEY")
        return RAGService.call_groq_api(jd_text, resume_context, api_key)

    @staticmethod
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=2, min=2, max=10),
        retry=retry_if_exception_type(requests.exceptions.HTTPError)
    )
    def call_groq_api(jd, resume_context, api_key):
        if not api_key:
            return {"score": 0, "reasoning": "Missing API Key", "key_skills_match": [], "missing_skills": []}
            
        prompt = f"""
        Act as a Senior Technical Recruiter evaluation engine.
        
        JOB DESCRIPTION:
        {jd}
        
        CANDIDATE RESUME:
        {resume_context[:25000]} 
        
        TASK:
        Evaluate the candidate against the Job Description using the EXACT scoring rubric below.
        
        SCORING LOGIC (Total 100%):
        1. Skills Matching (40%): Extract required skills from JD and compare with resume (semantic + keyword). Score = (matched/total) * 40.
        2. Experience Relevance (25%): Compare years of experience and role relevance. Full match = 25. Partial = proportional. No match = 0.
        3. Project / Role Alignment (20%): Analyze project complexity and impact vs JD responsibilities.
        4. Education Match (10%): Full match (meets req) = 10. Related degree = 6-8. Unrelated/Missing = 0-4.
        5. Preferred / Bonus Skills (5%): Award bonus for nice-to-have skills.

        OUTPUT REQUIREMENTS:
        - Return a precise integer Total Score (0-100).
        - Provide component scores.
        - List matched and missing skills.
        - Generate a normalized "extracted_role" (e.g. "Senior Frontend Engineer").
        - Provide a short 2-3 line explanation.
        
        Return STRICT JSON only:
        {{
            "score": (0-100 integer),
            "component_scores": {{
                "skills": (0-40),
                "experience": (0-25),
                "projects": (0-20),
                "education": (0-10),
                "bonus": (0-5)
            }},
            "key_skills_match": ["Skill A", "Skill B"],
            "missing_skills": ["Skill X", "Skill Y"],
            "reasoning": "Reasoning...",
            "extracted_role": "Job Title"
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        try:
            url = "https://api.groq.com/openai/v1/chat/completions" 
            payload = {
                "messages": [
                    {"role": "system", "content": "You are a helpful and accurate recruitment assistant. You only output valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                "model": "llama-3.1-8b-instant",
                "temperature": 0.1,
                "response_format": {"type": "json_object"}
            }
            
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status() 
            
            data = response.json()
            content = data['choices'][0]['message']['content']
            
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                content = content.replace("```json", "").replace("```", "").strip()
                return json.loads(content)
            
        except Exception as e:
            print(f"Groq API Error: {e}")
            return {
                "score": 0, 
                "reasoning": f"AI Analysis Failed: {str(e)}",
                "key_skills_match": [],
                "missing_skills": []
            }

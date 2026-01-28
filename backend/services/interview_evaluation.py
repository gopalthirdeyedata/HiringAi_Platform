import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def evaluate_interview_transcript(transcript: list, candidate_name: str, role: str, resume_summary: str = ""):
    """
    Analyzes interview transcript and generates AI-based scoring.
    
    Returns:
    {
        "technical_accuracy": 85,
        "communication_clarity": 90,
        "problem_solving": 88,
        "depth_of_knowledge": 82,
        "overall_score": 86.25,
        "feedback": "Strong technical foundation with excellent communication..."
    }
    """
    if not transcript or len(transcript) == 0:
        return {
            "technical_accuracy": 0,
            "communication_clarity": 0,
            "problem_solving": 0,
            "depth_of_knowledge": 0,
            "overall_score": 0,
            "feedback": "No transcript available for evaluation."
        }
    
    # Format transcript for AI analysis
    conversation = ""
    try:
        # Robust parsing handling both dicts and potentially strings if mixed
        for msg in transcript:
            if isinstance(msg, dict):
                speaker = "AI Interviewer" if msg.get("speaker") == "ai" else "Candidate"
                text = msg.get("text", "")
                conversation += f"{speaker}: {text}\n"
            elif isinstance(msg, str):
                conversation += f"{msg}\n"
    except Exception as e:
        print(f"DEBUG: Transcript parsing error: {e}")
        conversation = str(transcript)
    
    print(f"DEBUG: Formatted conversation for AI (first 100 chars): {conversation[:100]}...")
    
    evaluation_prompt = f"""
You are an expert technical recruiter evaluating an interview transcript.

CANDIDATE: {candidate_name}
ROLE: {role}
RESUME SUMMARY: {resume_summary if resume_summary else "Not provided"}

TRANSCRIPT:
{conversation}

Analyze the candidate's performance and provide scores (0-100) for:
1. Technical Accuracy - Correctness and depth of technical answers
2. Communication Clarity - Ability to explain concepts clearly
3. Problem-Solving Approach - Logical thinking and methodology
4. Depth of Knowledge - Understanding beyond surface level

Also provide:
- Overall Score (weighted average: 40% Technical, 25% Communication, 20% Problem-Solving, 15% Depth)
- Brief feedback (2-3 sentences)

Return ONLY valid JSON in this exact format:
{{
    "technical_accuracy": 85,
    "communication_clarity": 90,
    "problem_solving": 88,
    "depth_of_knowledge": 82,
    "overall_score": 86.25,
    "feedback": "Brief evaluation summary here"
}}
"""
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert technical interview evaluator. Return only valid JSON."},
                {"role": "user", "content": evaluation_prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Ensure all required fields exist with defaults
        return {
            "technical_accuracy": result.get("technical_accuracy", 0),
            "communication_clarity": result.get("communication_clarity", 0),
            "problem_solving": result.get("problem_solving", 0),
            "depth_of_knowledge": result.get("depth_of_knowledge", 0),
            "overall_score": result.get("overall_score", 0),
            "feedback": result.get("feedback", "Evaluation completed.")
        }
        
    except Exception as e:
        print(f"Interview evaluation error: {e}")
        return {
            "technical_accuracy": 0,
            "communication_clarity": 0,
            "problem_solving": 0,
            "depth_of_knowledge": 0,
            "overall_score": 0,
            "feedback": f"Evaluation failed: {str(e)}"
        }

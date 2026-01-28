
import requests
import json

PISTON_API_URL = "https://emkc.org/api/v2/piston/execute"

# Language Mapping (Frontend/Internal -> Piston)
LANGUAGE_MAP = {
    "javascript": {"language": "javascript", "version": "18.15.0"},
    "python": {"language": "python", "version": "3.10.0"},
    "python3": {"language": "python", "version": "3.10.0"},
    "java": {"language": "java", "version": "15.0.2"},
    "cpp": {"language": "c++", "version": "10.2.0"},
    "c": {"language": "c", "version": "10.2.0"},
    "go": {"language": "go", "version": "1.16.2"}
}

def execute_code(language_key: str, code: str, stdin: str = ""):
    """
    Executes code using Piston API.
    """
    config = LANGUAGE_MAP.get(language_key)
    if not config:
        return {"error": f"Unsupported language: {language_key}"}
    
    payload = {
        "language": config["language"],
        "version": config["version"],
        "files": [
            {
                "content": code
            }
        ],
        "stdin": stdin,
        "run_timeout": 3000,
        "compile_timeout": 10000
    }

    try:
        response = requests.post(PISTON_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        
        # Parse Piston Response
        # Result structure: { "run": { "stdout": "...", "stderr": "...", "code": 0, "signal": null, "output": "..." }, "compile": { ... } }
        
        run_output = result.get("run", {})
        compile_output = result.get("compile", {})
        
        output = run_output.get("stdout", "") or run_output.get("stderr", "")
        # If compiled failed
        if compile_output.get("code", 0) != 0:
            return {
                "status": "error",
                "output": compile_output.get("stderr") or compile_output.get("stdout", "Compilation Failed"),
                "raw": result
            }
            
        if run_output.get("code", 0) != 0:
             return {
                "status": "failed", # Runtime Error
                "output": run_output.get("stderr") or run_output.get("stdout", "Runtime Error"),
                "raw": result
            }

        return {
            "status": "success",
            "output": output,
            "raw": result
        }

    except Exception as e:
        print(f"Piston Execution Error: {e}")
        return {"error": str(e)}

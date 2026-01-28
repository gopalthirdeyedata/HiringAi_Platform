from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter(
    prefix="/api/settings",
    tags=["settings"]
)

class SettingsUpdate(BaseModel):
    config: Dict[str, Any]

@router.get("/")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(models.GlobalSettings).filter(models.GlobalSettings.key == "default").first()
    if not settings:
        # Create default if not exists
        default_config = {
            "orgName": "My Organization",
            "timezone": "UTC",
            "pipeline": {
                "stages": ["Resume Screening", "Aptitude Round", "Coding Round", "Technical Interview", "Offer Sent"],
                "autoReject": False
            }
        }
        settings = models.GlobalSettings(key="default", config=default_config)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    # Return directly the config dict
    return settings.config

@router.put("/")
def update_settings(settings_update: SettingsUpdate, db: Session = Depends(get_db)):
    db_settings = db.query(models.GlobalSettings).filter(models.GlobalSettings.key == "default").first()
    if not db_settings:
        db_settings = models.GlobalSettings(key="default", config=settings_update.config)
        db.add(db_settings)
    else:
        # Update logic: Replace or Merge? 
        # Replace is simpler for JSON config usually, as frontend sends full state
        db_settings.config = settings_update.config
    
    db.commit()
    return {"message": "Settings updated", "config": db_settings.config}

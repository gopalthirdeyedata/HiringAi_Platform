from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import schemas, models, database

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"]
)

@router.get("/activity/", response_model=List[schemas.ActivityLogResponse])
def get_activity_log(db: Session = Depends(database.get_db)):
    return db.query(models.ActivityLog).order_by(models.ActivityLog.timestamp.desc()).limit(20).all()

@router.get("/insights/")
def get_insights(db: Session = Depends(database.get_db)):
    # Simple insights logic derived from stats
    candidates = db.query(models.Candidate).all()
    
    high_score_count = sum(1 for c in candidates if c.score > 80)
    
    alerts = []
    if high_score_count > 0:
        alerts.append({
            "id": 1,
            "type": "success",
            "message": f"{high_score_count} Top Candidates identified with score > 80."
        })
    
    # Placeholder for more complex logic
    return alerts
@router.get("/notifications/") # Use a schema if possible, or just dict for now
def get_notifications(db: Session = Depends(database.get_db)):
    # Fetch unread logs as notifications
    # We treat ActivityLog as notifications for admins
    notes = db.query(models.ActivityLog).filter(models.ActivityLog.is_read == False).order_by(models.ActivityLog.timestamp.desc()).all()
    return notes

@router.put("/notifications/{id}/read")
def mark_notification_read(id: int, db: Session = Depends(database.get_db)):
    note = db.query(models.ActivityLog).filter(models.ActivityLog.id == id).first()
    if note:
        note.is_read = True
        db.commit()
    return {"status": "success"}

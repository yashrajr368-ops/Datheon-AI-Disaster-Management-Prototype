from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models import ActivityLog
from app.schemas import AdminLogin, TokenResponse, ActivityLogResponse
from app.auth import create_access_token, verify_token

router = APIRouter(prefix="/api/admin", tags=["Admin"])

@router.post("/login", response_model=TokenResponse)
def admin_login(creds: AdminLogin, db: Session = Depends(get_db)):
    # Verify username and password
    if creds.username != settings.ADMIN_USERNAME or creds.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials. Access denied."
        )

    token = create_access_token(data={"sub": creds.username, "role": "admin"})

    db.add(ActivityLog(
        action="ADMIN_LOGIN_SUCCESS",
        details=f"Administrator '{creds.username}' successfully authenticated.",
        user_role="admin"
    ))
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "username": creds.username,
        "role": "admin"
    }

@router.get("/me")
def get_current_admin(admin: dict = Depends(verify_token)):
    return {
        "authenticated": True,
        "username": admin.get("sub", settings.ADMIN_USERNAME),
        "role": admin.get("role", "admin")
    }

@router.get("/logs", response_model=list[ActivityLogResponse])
def get_admin_audit_logs(
    db: Session = Depends(get_db),
    admin: dict = Depends(verify_token)
):
    logs = db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(50).all()
    return logs

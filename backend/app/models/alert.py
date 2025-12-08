from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ticker = Column(String, nullable=False, index=True)
    alert_type = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    condition = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    triggered = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    triggered_at = Column(DateTime(timezone=True), nullable=True)
    
    user = relationship("User", back_populates="alerts")

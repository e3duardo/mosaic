from datetime import datetime
from typing import Any, Literal, Union

from pydantic import BaseModel, Field


class ExpenseArtifact(BaseModel):
    amount: float
    description: str
    account: str = "main"
    date: str | None = None


class EarningArtifact(BaseModel):
    amount: float
    description: str
    account: str = "main"
    date: str | None = None


class MedicineArtifact(BaseModel):
    name: str
    quantity: int = 1
    taken_at: str | None = None


class AppointmentArtifact(BaseModel):
    description: str
    scheduled_at: str | None = None


class IdeaArtifact(BaseModel):
    content: str


class ReminderArtifact(BaseModel):
    content: str
    due_at: str | None = None


Category = Literal["financial", "medical", "ideas", "remember", "message_only"]


class ProcessResponse(BaseModel):
    category: Category
    artifacts: dict[str, Any] | list[Any] = Field(default_factory=dict)

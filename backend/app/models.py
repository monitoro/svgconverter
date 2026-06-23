from pydantic import BaseModel, Field


class ConvertParams(BaseModel):
    threshold: int = Field(default=128, ge=0, le=255)
    smoothing: float = Field(default=0.2, ge=0, le=1.5)
    invert: bool = False

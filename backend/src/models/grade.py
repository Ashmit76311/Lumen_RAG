from pydantic import BaseModel, Field


class Grade(BaseModel):
    """Model for grading relevance of retrieved documents."""

    binary_score: str = Field(description="Relevance score: 'yes' or 'no'")

from pydantic import BaseModel # type: ignore

class Term(BaseModel):
    term: str
    definition: str

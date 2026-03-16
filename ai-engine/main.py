"""
Golf Platform AI Engine — FastAPI service
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn

from handicap import RoundResult, handicap_index, course_handicap, score_differential
from score_analyzer import HoleScore, analyze_round, trending_scores

app = FastAPI(title="Golf Platform AI Engine", version="1.0.0")


# --- Handicap endpoints ---

class RoundResultRequest(BaseModel):
    gross_score: int
    course_rating: float
    slope_rating: int = Field(ge=55, le=155)
    number_of_holes: int = 18


class HandicapRequest(BaseModel):
    rounds: list[RoundResultRequest]


@app.post("/ai/handicap/index")
def calculate_handicap_index(req: HandicapRequest):
    """Calculate Handicap Index from a list of rounds (WHS method)."""
    rounds = [RoundResult(**r.model_dump()) for r in req.rounds]
    idx = handicap_index(rounds)
    if idx is None:
        raise HTTPException(status_code=400, detail="At least 3 rounds required")
    return {"handicap_index": idx}


class CourseDifferentialRequest(BaseModel):
    gross_score: int
    course_rating: float
    slope_rating: int = Field(ge=55, le=155)
    number_of_holes: int = 18


@app.post("/ai/handicap/differential")
def calculate_differential(req: CourseDifferentialRequest):
    """Compute Score Differential for a single round."""
    result = RoundResult(**req.model_dump())
    diff = score_differential(result)
    return {"score_differential": round(diff, 2)}


class CourseHandicapRequest(BaseModel):
    handicap_index: float
    slope_rating: int = Field(ge=55, le=155)
    course_rating: float
    par: int = 72


@app.post("/ai/handicap/course")
def calculate_course_handicap(req: CourseHandicapRequest):
    """Convert a Handicap Index to a Course Handicap."""
    ch = course_handicap(req.handicap_index, req.slope_rating, req.course_rating, req.par)
    return {"course_handicap": ch}


# --- Score analysis endpoints ---

class HoleScoreRequest(BaseModel):
    hole_number: int
    par: int = Field(ge=3, le=6)
    strokes: int = Field(ge=1, le=20)
    fairway_hit: Optional[bool] = None
    green_in_regulation: Optional[bool] = None
    putts: Optional[int] = None


class RoundAnalysisRequest(BaseModel):
    holes: list[HoleScoreRequest]


@app.post("/ai/analysis/round")
def analyze_round_endpoint(req: RoundAnalysisRequest):
    """Analyze scoring stats for a single round."""
    holes = [HoleScore(**h.model_dump()) for h in req.holes]
    analysis = analyze_round(holes)
    return analysis.__dict__


class TrendRequest(BaseModel):
    scores: list[int]
    window: int = 5


@app.post("/ai/analysis/trend")
def score_trend(req: TrendRequest):
    """Return rolling average scores."""
    return {"trend": trending_scores(req.scores, req.window)}


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8081, reload=True)

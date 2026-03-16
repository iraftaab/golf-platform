"""
Handicap index calculation following the World Handicap System (WHS).
Reference: https://www.usga.org/content/usga/home-page/handicapping/world-handicap-system.html
"""

from dataclasses import dataclass
from typing import Sequence


@dataclass
class RoundResult:
    gross_score: int
    course_rating: float
    slope_rating: int
    number_of_holes: int = 18


def score_differential(result: RoundResult) -> float:
    """Compute the Score Differential for a single round."""
    adjusted = result.gross_score * (18 / result.number_of_holes)
    return (113 / result.slope_rating) * (adjusted - result.course_rating)


def handicap_index(rounds: Sequence[RoundResult]) -> float | None:
    """
    Calculate the Handicap Index from a sequence of rounds.

    Uses the best differentials from the most recent eligible rounds
    according to WHS rules (up to 20 rounds, best 8 of last 20).

    Returns None if fewer than 3 rounds are provided.
    """
    if len(rounds) < 3:
        return None

    differentials = sorted(score_differential(r) for r in rounds[-20:])

    count = len(differentials)
    if count < 6:
        best_count = 1
    elif count < 9:
        best_count = 2
    elif count < 12:
        best_count = 3
    elif count < 15:
        best_count = 4
    elif count < 17:
        best_count = 5
    elif count < 19:
        best_count = 6
    elif count == 19:
        best_count = 7
    else:
        best_count = 8

    avg = sum(differentials[:best_count]) / best_count
    return round(avg * 0.96, 1)


def course_handicap(handicap_idx: float, slope_rating: int, course_rating: float, par: int) -> int:
    """Convert a Handicap Index to a Course Handicap."""
    return round(handicap_idx * (slope_rating / 113) + (course_rating - par))

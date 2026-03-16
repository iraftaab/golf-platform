"""
Analyzes a player's scoring patterns across rounds to surface insights.
"""

from dataclasses import dataclass, field
from typing import Sequence


@dataclass
class HoleScore:
    hole_number: int
    par: int
    strokes: int
    fairway_hit: bool | None = None
    green_in_regulation: bool | None = None
    putts: int | None = None

    @property
    def score_to_par(self) -> int:
        return self.strokes - self.par


@dataclass
class RoundAnalysis:
    total_score: int
    score_to_par: int
    eagles: int
    birdies: int
    pars: int
    bogeys: int
    double_bogeys: int
    worse_than_double: int
    fairways_hit: float | None      # percentage, or None if not tracked
    greens_in_regulation: float | None
    average_putts: float | None


def analyze_round(holes: Sequence[HoleScore]) -> RoundAnalysis:
    """Compute statistics for a single round."""
    totals = {k: 0 for k in ("eagles", "birdies", "pars", "bogeys", "doubles", "worse")}
    putts_list = []
    fir_list = []
    gir_list = []

    for h in holes:
        stp = h.score_to_par
        if stp <= -2:
            totals["eagles"] += 1
        elif stp == -1:
            totals["birdies"] += 1
        elif stp == 0:
            totals["pars"] += 1
        elif stp == 1:
            totals["bogeys"] += 1
        elif stp == 2:
            totals["doubles"] += 1
        else:
            totals["worse"] += 1

        if h.putts is not None:
            putts_list.append(h.putts)
        if h.fairway_hit is not None:
            fir_list.append(h.fairway_hit)
        if h.green_in_regulation is not None:
            gir_list.append(h.green_in_regulation)

    total = sum(h.strokes for h in holes)
    par_total = sum(h.par for h in holes)

    return RoundAnalysis(
        total_score=total,
        score_to_par=total - par_total,
        eagles=totals["eagles"],
        birdies=totals["birdies"],
        pars=totals["pars"],
        bogeys=totals["bogeys"],
        double_bogeys=totals["doubles"],
        worse_than_double=totals["worse"],
        fairways_hit=sum(fir_list) / len(fir_list) * 100 if fir_list else None,
        greens_in_regulation=sum(gir_list) / len(gir_list) * 100 if gir_list else None,
        average_putts=sum(putts_list) / len(putts_list) if putts_list else None,
    )


def trending_scores(round_totals: Sequence[int], window: int = 5) -> list[float]:
    """Return rolling average scores over the last `window` rounds."""
    result = []
    for i in range(len(round_totals)):
        chunk = round_totals[max(0, i - window + 1): i + 1]
        result.append(sum(chunk) / len(chunk))
    return result

package com.golf.service;

import com.golf.model.Round;
import com.golf.model.Score;
import com.golf.repository.RoundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class RoundService {

    private final RoundRepository roundRepository;
    private final PlayerService playerService;
    private final CourseService courseService;

    public List<Round> findByPlayer(Long playerId) {
        playerService.findById(playerId); // validate player exists
        return roundRepository.findByPlayerIdOrderByDatePlayedDesc(playerId);
    }

    public Round findById(Long id) {
        return roundRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Round not found: " + id));
    }

    public Round create(Round round) {
        round.setPlayer(playerService.findById(round.getPlayer().getId()));
        round.setCourse(courseService.findById(round.getCourse().getId()));
        return roundRepository.save(round);
    }

    public Round addScore(Long roundId, Score score) {
        Round round = findById(roundId);
        score.setRound(round);
        round.getScores().add(score);
        recalculateTotals(round);
        return roundRepository.save(round);
    }

    public Round complete(Long roundId) {
        Round round = findById(roundId);
        recalculateTotals(round);
        round.setStatus(Round.RoundStatus.COMPLETED);
        return roundRepository.save(round);
    }

    private void recalculateTotals(Round round) {
        int total = round.getScores().stream()
                .mapToInt(Score::getStrokes)
                .sum();
        round.setTotalScore(total);
    }
}

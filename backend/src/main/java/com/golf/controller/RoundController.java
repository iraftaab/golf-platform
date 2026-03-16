package com.golf.controller;

import com.golf.model.Round;
import com.golf.model.Score;
import com.golf.service.RoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoundController {

    private final RoundService roundService;

    @GetMapping("/players/{playerId}/rounds")
    public List<Round> getRoundsByPlayer(@PathVariable Long playerId) {
        return roundService.findByPlayer(playerId);
    }

    @GetMapping("/rounds/{id}")
    public Round getById(@PathVariable Long id) {
        return roundService.findById(id);
    }

    @PostMapping("/rounds")
    public ResponseEntity<Round> create(@Valid @RequestBody Round round) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roundService.create(round));
    }

    @PostMapping("/rounds/{id}/scores")
    public Round addScore(@PathVariable Long id, @Valid @RequestBody Score score) {
        return roundService.addScore(id, score);
    }

    @PostMapping("/rounds/{id}/complete")
    public Round complete(@PathVariable Long id) {
        return roundService.complete(id);
    }
}

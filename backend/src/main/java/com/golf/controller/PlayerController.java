package com.golf.controller;

import com.golf.model.Player;
import com.golf.service.PlayerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;

    @GetMapping
    public List<Player> getAll() {
        return playerService.findAll();
    }

    @GetMapping("/{id}")
    public Player getById(@PathVariable Long id) {
        return playerService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Player> create(@Valid @RequestBody Player player) {
        return ResponseEntity.status(HttpStatus.CREATED).body(playerService.create(player));
    }

    @PutMapping("/{id}")
    public Player update(@PathVariable Long id, @Valid @RequestBody Player player) {
        return playerService.update(id, player);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        playerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

package com.golf.service;

import com.golf.model.Player;
import com.golf.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<Player> findAll() {
        return playerRepository.findAll();
    }

    public Player findById(Long id) {
        return playerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Player not found: " + id));
    }

    public Player create(Player player) {
        if (playerRepository.existsByEmail(player.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + player.getEmail());
        }
        return playerRepository.save(player);
    }

    public Player update(Long id, Player updated) {
        Player existing = findById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setPhone(updated.getPhone());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setHandicapIndex(updated.getHandicapIndex());
        return playerRepository.save(existing);
    }

    public void delete(Long id) {
        playerRepository.delete(findById(id));
    }
}

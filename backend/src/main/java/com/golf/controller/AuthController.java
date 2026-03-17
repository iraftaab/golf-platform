package com.golf.controller;

import com.golf.model.Player;
import com.golf.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PlayerRepository playerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String pin   = body.get("pin");

        if (email == null || pin == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and PIN required"));
        }

        Player player = playerRepository.findByEmail(email.trim().toLowerCase())
                .orElse(null);

        if (player == null || player.getMemberPin() == null
                || !passwordEncoder.matches(pin, player.getMemberPin())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or PIN"));
        }

        // Return player info without the PIN hash
        Map<String, Object> resp = new HashMap<>();
        resp.put("id",             player.getId());
        resp.put("firstName",      player.getFirstName());
        resp.put("lastName",       player.getLastName());
        resp.put("email",          player.getEmail());
        resp.put("phone",          player.getPhone() != null ? player.getPhone() : "");
        resp.put("handicapIndex",  player.getHandicapIndex() != null ? player.getHandicapIndex() : "");
        resp.put("membershipTier", player.getMembershipTier().name());
        resp.put("tierDisplayName",player.getMembershipTier().displayName);
        resp.put("tierDescription",player.getMembershipTier().description);
        resp.put("maxBookingsPerWeek", player.getMembershipTier().maxBookingsPerWeek == Integer.MAX_VALUE
                                    ? "Unlimited" : player.getMembershipTier().maxBookingsPerWeek);
        resp.put("guestPrivileges",player.getMembershipTier().guestPrivileges);
        return ResponseEntity.ok(resp);
    }

    @PatchMapping("/pin")
    public ResponseEntity<?> changePin(@RequestBody Map<String, String> body) {
        String email      = body.get("email");
        String currentPin = body.get("currentPin");
        String newPin     = body.get("newPin");

        if (email == null || currentPin == null || newPin == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email, currentPin and newPin are required"));
        }
        if (!newPin.matches("\\d{4}")) {
            return ResponseEntity.badRequest().body(Map.of("error", "New PIN must be 4 digits"));
        }

        Player player = playerRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
        if (player == null || player.getMemberPin() == null
                || !passwordEncoder.matches(currentPin, player.getMemberPin())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Current PIN is incorrect"));
        }

        player.setMemberPin(passwordEncoder.encode(newPin));
        playerRepository.save(player);
        return ResponseEntity.ok(Map.of("message", "PIN updated successfully"));
    }
}

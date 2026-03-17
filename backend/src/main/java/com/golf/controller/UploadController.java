package com.golf.controller;

import com.golf.model.Player;
import com.golf.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/players")
@RequiredArgsConstructor
public class UploadController {

    private final PlayerRepository playerRepository;

    @Value("${app.upload-dir}")
    private String uploadDir;

    @PostMapping("/{id}/picture")
    public ResponseEntity<?> uploadPicture(@PathVariable Long id,
                                           @RequestParam("file") MultipartFile file) throws IOException {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found: " + id));

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only image files are allowed"));
        }

        // Derive extension from content type
        String ext = contentType.contains("png") ? ".png"
                   : contentType.contains("gif") ? ".gif"
                   : ".jpg";

        Path dir = Paths.get(uploadDir, "players");
        Files.createDirectories(dir);

        // Use a stable filename per player (overwrite previous picture)
        String filename = "player_" + id + "_" + UUID.randomUUID().toString().substring(0, 8) + ext;
        Path dest = dir.resolve(filename);
        file.transferTo(dest);

        String url = "/uploads/players/" + filename;
        player.setProfilePicture(url);
        playerRepository.save(player);

        return ResponseEntity.ok(Map.of("url", url));
    }
}

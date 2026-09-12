package com.hushevents.images;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/images")
public class AdminImageController {

    private final ImageService service;

    public AdminImageController(
            ImageService service
    ) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> uploadImage(
            @RequestParam("file")
            MultipartFile file
    ) {

        StoredImage image =
                service.upload(file);

        return Map.of(
                "id",
                image.getId(),

                "url",
                "/api/images/" + image.getId()
        );
    }
}
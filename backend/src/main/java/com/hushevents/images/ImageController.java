package com.hushevents.images;

import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/images")
public class ImageController {

    private final ImageService service;

    public ImageController(
            ImageService service
    ) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(
            @PathVariable Long id
    ) {

        StoredImage image =
                service.getImage(id);

        MediaType mediaType;

        try {
            mediaType =
                    MediaType.parseMediaType(
                            image.getContentType()
                    );
        } catch (Exception exception) {
            mediaType =
                    MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity
                .ok()
                .contentType(mediaType)
                .cacheControl(
                        CacheControl
                                .maxAge(
                                        30,
                                        TimeUnit.DAYS
                                )
                                .cachePublic()
                )
                .body(
                        image.getData()
                );
    }
}
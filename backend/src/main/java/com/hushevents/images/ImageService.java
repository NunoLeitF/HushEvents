package com.hushevents.images;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

@Service
public class ImageService {

    private final StoredImageRepository repository;

    public ImageService(
            StoredImageRepository repository
    ) {
        this.repository = repository;
    }

    public StoredImage upload(
            MultipartFile file
    ) {

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Image file is required"
            );
        }

        String contentType =
                file.getContentType();

        if (
                contentType == null ||
                !contentType.startsWith("image/")
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Uploaded file must be an image"
            );
        }

        try {

            StoredImage image =
                    new StoredImage();

            image.setFilename(
                    file.getOriginalFilename() != null
                            ? file.getOriginalFilename()
                            : "image"
            );

            image.setContentType(
                    contentType
            );

            image.setData(
                    file.getBytes()
            );

            return repository.save(image);

        } catch (IOException exception) {

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not store image"
            );
        }
    }

    public StoredImage getImage(
            Long id
    ) {

        return repository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Image not found"
                                )
                );
    }
}
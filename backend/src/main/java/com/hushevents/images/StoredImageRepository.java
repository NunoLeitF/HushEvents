package com.hushevents.images;

import org.springframework.data.jpa.repository.JpaRepository;

public interface StoredImageRepository
        extends JpaRepository<StoredImage, Long> {
}
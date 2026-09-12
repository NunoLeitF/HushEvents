package com.hushevents.guides;

import jakarta.validation.constraints.NotBlank;

public record GuideImageRequestDTO(

        @NotBlank
        String imageUrl,

        int sortOrder

) {
}
package com.hushevents.participants;

import jakarta.validation.constraints.NotBlank;

public record ParticipantRequestDTO(

        @NotBlank
        String name,

        @NotBlank
        String type,

        String category,

        @NotBlank
        String imageUrl,

        String link1Label,
        String link1Url,

        String link2Label,
        String link2Url,

        String link3Label,
        String link3Url,

        int sortOrder

) {
}
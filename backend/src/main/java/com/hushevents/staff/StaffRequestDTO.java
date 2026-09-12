package com.hushevents.staff;

import jakarta.validation.constraints.NotBlank;

public record StaffRequestDTO(

        @NotBlank
        String name,

        @NotBlank
        String role,

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
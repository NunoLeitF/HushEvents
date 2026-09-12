package com.hushevents.events;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public record EventRequestDTO(

        @NotBlank
        String name,

        @NotBlank
        String location,

        @NotNull
        Instant startAt,

        @NotNull
        Instant endAt,

        String backgroundImageUrl,

        String logoImageUrl,

        boolean published

) {
}
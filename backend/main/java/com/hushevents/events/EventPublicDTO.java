package com.hushevents.events;

import java.time.Instant;

public record EventPublicDTO(

        Long id,

        String name,

        String location,

        Instant startAt,

        Instant endAt,

        String backgroundImageUrl,

        String logoImageUrl

) {

    public static EventPublicDTO from(
            Event event
    ) {

        return new EventPublicDTO(

                event.getId(),

                event.getName(),

                event.getLocation(),

                event.getStartAt(),

                event.getEndAt(),

                event.getBackgroundImageUrl(),

                event.getLogoImageUrl()
        );
    }
}
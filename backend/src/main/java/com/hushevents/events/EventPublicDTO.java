package com.hushevents.events;

import com.hushevents.guides.GuideImageDTO;
import com.hushevents.participants.ParticipantDTO;
import com.hushevents.staff.StaffDTO;

import java.time.Instant;
import java.util.List;

public record EventPublicDTO(

        Long id,
        String name,
        String location,

        Instant startAt,
        Instant endAt,

        String backgroundImageUrl,
        String logoImageUrl,

        List<GuideImageDTO> guideImages,
        List<ParticipantDTO> participants,
        List<StaffDTO> staff

) {
}
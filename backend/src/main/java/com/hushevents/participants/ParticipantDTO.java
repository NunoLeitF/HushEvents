package com.hushevents.participants;

public record ParticipantDTO(

        Long id,
        String name,
        String type,
        String category,
        String imageUrl,

        String link1Label,
        String link1Url,

        String link2Label,
        String link2Url,

        String link3Label,
        String link3Url,

        int sortOrder

) {

    public static ParticipantDTO from(
            EventParticipant participant
    ) {

        return new ParticipantDTO(

                participant.getId(),
                participant.getName(),
                participant.getType(),
                participant.getCategory(),
                participant.getImageUrl(),

                participant.getLink1Label(),
                participant.getLink1Url(),

                participant.getLink2Label(),
                participant.getLink2Url(),

                participant.getLink3Label(),
                participant.getLink3Url(),

                participant.getSortOrder()
        );
    }
}
package com.hushevents.staff;

public record StaffDTO(

        Long id,
        String name,
        String role,
        String imageUrl,

        String link1Label,
        String link1Url,

        String link2Label,
        String link2Url,

        String link3Label,
        String link3Url,

        int sortOrder

) {

    public static StaffDTO from(
            StaffMember staff
    ) {

        return new StaffDTO(

                staff.getId(),
                staff.getName(),
                staff.getRole(),
                staff.getImageUrl(),

                staff.getLink1Label(),
                staff.getLink1Url(),

                staff.getLink2Label(),
                staff.getLink2Url(),

                staff.getLink3Label(),
                staff.getLink3Url(),

                staff.getSortOrder()
        );
    }
}
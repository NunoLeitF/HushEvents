package com.hushevents.guides;

public record GuideImageDTO(

        Long id,
        String imageUrl,
        int sortOrder

) {

    public static GuideImageDTO from(
            GuideImage image
    ) {

        return new GuideImageDTO(

                image.getId(),

                image.getImageUrl(),

                image.getSortOrder()
        );
    }
}
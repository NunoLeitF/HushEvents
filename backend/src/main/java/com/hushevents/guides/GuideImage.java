package com.hushevents.guides;

import jakarta.persistence.*;

@Entity
@Table(name = "guide_images")
public class GuideImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(
            name = "event_id",
            nullable = false
    )
    private Long eventId;


    @Column(
            name = "image_url",
            nullable = false
    )
    private String imageUrl;


    @Column(
            name = "sort_order",
            nullable = false
    )
    private int sortOrder = 0;


    public GuideImage() {
    }


    public Long getId() {
        return id;
    }


    public Long getEventId() {
        return eventId;
    }


    public void setEventId(
            Long eventId
    ) {
        this.eventId =
                eventId;
    }


    public String getImageUrl() {
        return imageUrl;
    }


    public void setImageUrl(
            String imageUrl
    ) {
        this.imageUrl =
                imageUrl;
    }


    public int getSortOrder() {
        return sortOrder;
    }


    public void setSortOrder(
            int sortOrder
    ) {
        this.sortOrder =
                sortOrder;
    }
}
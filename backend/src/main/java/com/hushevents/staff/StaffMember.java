package com.hushevents.staff;

import jakarta.persistence.*;

@Entity
@Table(name = "staff_members")
public class StaffMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String role;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String link1Label;
    private String link1Url;

    private String link2Label;
    private String link2Url;

    private String link3Label;
    private String link3Url;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    public StaffMember() {
    }

    public Long getId() {
        return id;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLink1Label() {
        return link1Label;
    }

    public void setLink1Label(String link1Label) {
        this.link1Label = link1Label;
    }

    public String getLink1Url() {
        return link1Url;
    }

    public void setLink1Url(String link1Url) {
        this.link1Url = link1Url;
    }

    public String getLink2Label() {
        return link2Label;
    }

    public void setLink2Label(String link2Label) {
        this.link2Label = link2Label;
    }

    public String getLink2Url() {
        return link2Url;
    }

    public void setLink2Url(String link2Url) {
        this.link2Url = link2Url;
    }

    public String getLink3Label() {
        return link3Label;
    }

    public void setLink3Label(String link3Label) {
        this.link3Label = link3Label;
    }

    public String getLink3Url() {
        return link3Url;
    }

    public void setLink3Url(String link3Url) {
        this.link3Url = link3Url;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(int sortOrder) {
        this.sortOrder = sortOrder;
    }
}
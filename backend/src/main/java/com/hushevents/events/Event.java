package com.hushevents.events;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String location;


    @Column(name = "start_at", nullable = false)
    private Instant startAt;


    @Column(name = "end_at", nullable = false)
    private Instant endAt;


    @Column(name = "background_image_url")
    private String backgroundImageUrl;


    @Column(name = "logo_image_url")
    private String logoImageUrl;


    @Column(nullable = false)
    private boolean published = false;


    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;


    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;


    public Event() {
    }


    @PrePersist
    public void onCreate() {

        Instant now = Instant.now();

        createdAt = now;
        updatedAt = now;
    }


    @PreUpdate
    public void onUpdate() {
        updatedAt = Instant.now();
    }


    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }


    public String getLocation() {
        return location;
    }


    public void setLocation(String location) {
        this.location = location;
    }


    public Instant getStartAt() {
        return startAt;
    }


    public void setStartAt(Instant startAt) {
        this.startAt = startAt;
    }


    public Instant getEndAt() {
        return endAt;
    }


    public void setEndAt(Instant endAt) {
        this.endAt = endAt;
    }


    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }


    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
    }


    public String getLogoImageUrl() {
        return logoImageUrl;
    }


    public void setLogoImageUrl(String logoImageUrl) {
        this.logoImageUrl = logoImageUrl;
    }


    public boolean isPublished() {
        return published;
    }


    public void setPublished(boolean published) {
        this.published = published;
    }


    public Instant getCreatedAt() {
        return createdAt;
    }


    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
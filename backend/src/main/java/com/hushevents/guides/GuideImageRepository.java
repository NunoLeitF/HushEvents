package com.hushevents.guides;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GuideImageRepository
        extends JpaRepository<GuideImage, Long> {

    List<GuideImage>
    findAllByEventIdOrderBySortOrderAsc(
            Long eventId
    );


    void deleteAllByEventId(
            Long eventId
    );
}
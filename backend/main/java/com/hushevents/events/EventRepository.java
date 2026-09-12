package com.hushevents.events;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface EventRepository
        extends JpaRepository<Event, Long> {

    Optional<Event>
    findFirstByPublishedTrueAndEndAtAfterOrderByStartAtAsc(
            Instant now
    );


    List<Event>
    findAllByOrderByStartAtDesc();
}
package com.hushevents.participants;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventParticipantRepository
        extends JpaRepository<EventParticipant, Long> {

    List<EventParticipant>
    findAllByEventIdOrderBySortOrderAsc(Long eventId);

    void deleteAllByEventId(Long eventId);
}
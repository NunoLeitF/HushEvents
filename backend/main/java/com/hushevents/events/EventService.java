package com.hushevents.events;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository repository;


    public EventService(
            EventRepository repository
    ) {
        this.repository = repository;
    }


    // =====================================================
    // PUBLIC
    // =====================================================

    public Optional<EventPublicDTO>
    getCurrentEvent() {

        return repository
                .findFirstByPublishedTrueAndEndAtAfterOrderByStartAtAsc(
                        Instant.now()
                )
                .map(EventPublicDTO::from);
    }


    // =====================================================
    // ADMIN
    // =====================================================

    public List<Event> getAllEvents() {

        return repository
                .findAllByOrderByStartAtDesc();
    }


    public Event getEvent(
            Long id
    ) {

        return repository
                .findById(id)
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Event not found"
                                )
                );
    }


    public Event createEvent(
            EventRequestDTO request
    ) {

        validateDates(request);

        Event event =
                new Event();

        applyRequest(
                event,
                request
        );

        return repository.save(event);
    }


    public Event updateEvent(
            Long id,
            EventRequestDTO request
    ) {

        validateDates(request);

        Event event =
                getEvent(id);

        applyRequest(
                event,
                request
        );

        return repository.save(event);
    }


    public void deleteEvent(
            Long id
    ) {

        Event event =
                getEvent(id);

        repository.delete(event);
    }


    // =====================================================
    // INTERNAL
    // =====================================================

    private void applyRequest(
            Event event,
            EventRequestDTO request
    ) {

        event.setName(
                request.name().trim()
        );

        event.setLocation(
                request.location().trim()
        );

        event.setStartAt(
                request.startAt()
        );

        event.setEndAt(
                request.endAt()
        );

        event.setBackgroundImageUrl(
                cleanNullable(
                        request.backgroundImageUrl()
                )
        );

        event.setLogoImageUrl(
                cleanNullable(
                        request.logoImageUrl()
                )
        );

        event.setPublished(
                request.published()
        );
    }


    private void validateDates(
            EventRequestDTO request
    ) {

        if (
                !request.endAt()
                        .isAfter(
                                request.startAt()
                        )
        ) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Event end time must be after the start time"
            );
        }
    }


    private String cleanNullable(
            String value
    ) {

        if (
                value == null ||
                value.isBlank()
        ) {
            return null;
        }

        return value.trim();
    }
}
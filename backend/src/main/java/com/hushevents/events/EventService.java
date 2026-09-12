package com.hushevents.events;

import com.hushevents.guides.GuideImageDTO;
import com.hushevents.guides.GuideImageRepository;
import com.hushevents.participants.EventParticipantRepository;
import com.hushevents.participants.ParticipantDTO;
import com.hushevents.staff.StaffDTO;
import com.hushevents.staff.StaffMemberRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository repository;

    private final GuideImageRepository guideRepository;

    private final EventParticipantRepository participantRepository;

    private final StaffMemberRepository staffRepository;


    public EventService(
            EventRepository repository,
            GuideImageRepository guideRepository,
            EventParticipantRepository participantRepository,
            StaffMemberRepository staffRepository
    ) {

        this.repository =
                repository;

        this.guideRepository =
                guideRepository;

        this.participantRepository =
                participantRepository;

        this.staffRepository =
                staffRepository;
    }


    /* =====================================================
       PUBLIC
       ===================================================== */

    public Optional<EventPublicDTO> getCurrentEvent() {

        return repository
                .findFirstByPublishedTrueAndEndAtAfterOrderByStartAtAsc(
                        Instant.now()
                )
                .map(
                        event ->
                                new EventPublicDTO(

                                        event.getId(),

                                        event.getName(),

                                        event.getLocation(),

                                        event.getStartAt(),

                                        event.getEndAt(),

                                        event.getBackgroundImageUrl(),

                                        event.getLogoImageUrl(),

                                        guideRepository
                                                .findAllByEventIdOrderBySortOrderAsc(
                                                        event.getId()
                                                )
                                                .stream()
                                                .map(
                                                        GuideImageDTO::from
                                                )
                                                .toList(),

                                        participantRepository
                                                .findAllByEventIdOrderBySortOrderAsc(
                                                        event.getId()
                                                )
                                                .stream()
                                                .map(
                                                        ParticipantDTO::from
                                                )
                                                .toList(),

                                        staffRepository
                                                .findAllByEventIdOrderBySortOrderAsc(
                                                        event.getId()
                                                )
                                                .stream()
                                                .map(
                                                        StaffDTO::from
                                                )
                                                .toList()
                                )
                );
    }


    /* =====================================================
       ADMIN
       ===================================================== */

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

        validateDates(
                request
        );


        Event event =
                new Event();


        applyRequest(
                event,
                request
        );


        return repository.save(
                event
        );
    }


    public Event updateEvent(
            Long id,
            EventRequestDTO request
    ) {

        validateDates(
                request
        );


        Event event =
                getEvent(id);


        applyRequest(
                event,
                request
        );


        return repository.save(
                event
        );
    }


    @Transactional
    public void deleteEvent(
            Long id
    ) {

        Event event =
                getEvent(id);


        guideRepository
                .deleteAllByEventId(
                        id
                );


        participantRepository
                .deleteAllByEventId(
                        id
                );


        staffRepository
                .deleteAllByEventId(
                        id
                );


        repository.delete(
                event
        );
    }


    /* =====================================================
       INTERNAL
       ===================================================== */

    private void applyRequest(
            Event event,
            EventRequestDTO request
    ) {

        event.setName(
                request.name()
                        .trim()
        );


        event.setLocation(
                request.location()
                        .trim()
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
                !request
                        .endAt()
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
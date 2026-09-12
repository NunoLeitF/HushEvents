package com.hushevents.participants;

import com.hushevents.events.EventRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events/{eventId}/participants")
public class AdminParticipantController {

    private final EventParticipantRepository repository;
    private final EventRepository eventRepository;

    public AdminParticipantController(
            EventParticipantRepository repository,
            EventRepository eventRepository
    ) {
        this.repository = repository;
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public List<ParticipantDTO> list(
            @PathVariable Long eventId
    ) {

        ensureEventExists(eventId);

        return repository
                .findAllByEventIdOrderBySortOrderAsc(eventId)
                .stream()
                .map(ParticipantDTO::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ParticipantDTO create(
            @PathVariable Long eventId,
            @Valid @RequestBody ParticipantRequestDTO request
    ) {

        ensureEventExists(eventId);

        EventParticipant participant =
                new EventParticipant();

        apply(
                participant,
                eventId,
                request
        );

        return ParticipantDTO.from(
                repository.save(participant)
        );
    }

    @PutMapping("/{participantId}")
    public ParticipantDTO update(
            @PathVariable Long eventId,
            @PathVariable Long participantId,
            @Valid @RequestBody ParticipantRequestDTO request
    ) {

        EventParticipant participant =
                getParticipant(
                        eventId,
                        participantId
                );

        apply(
                participant,
                eventId,
                request
        );

        return ParticipantDTO.from(
                repository.save(participant)
        );
    }

    @DeleteMapping("/{participantId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long eventId,
            @PathVariable Long participantId
    ) {

        repository.delete(
                getParticipant(
                        eventId,
                        participantId
                )
        );
    }

    private void apply(
            EventParticipant participant,
            Long eventId,
            ParticipantRequestDTO request
    ) {

        String type =
                request.type()
                        .trim()
                        .toUpperCase();

        if (
                !type.equals("VENDOR") &&
                !type.equals("RPER")
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Participant type must be VENDOR or RPER"
            );
        }

        participant.setEventId(eventId);

        participant.setName(
                request.name().trim()
        );

        participant.setType(type);

        participant.setCategory(
                clean(request.category())
        );

        participant.setImageUrl(
                request.imageUrl().trim()
        );

        participant.setLink1Label(
                clean(request.link1Label())
        );

        participant.setLink1Url(
                clean(request.link1Url())
        );

        participant.setLink2Label(
                clean(request.link2Label())
        );

        participant.setLink2Url(
                clean(request.link2Url())
        );

        participant.setLink3Label(
                clean(request.link3Label())
        );

        participant.setLink3Url(
                clean(request.link3Url())
        );

        participant.setSortOrder(
                request.sortOrder()
        );
    }

    private EventParticipant getParticipant(
            Long eventId,
            Long participantId
    ) {

        EventParticipant participant =
                repository
                        .findById(participantId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Participant not found"
                                )
                        );

        if (
                !participant
                        .getEventId()
                        .equals(eventId)
        ) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Participant not found"
            );
        }

        return participant;
    }

    private void ensureEventExists(
            Long eventId
    ) {

        if (
                !eventRepository
                        .existsById(eventId)
        ) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event not found"
            );
        }
    }

    private String clean(
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
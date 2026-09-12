package com.hushevents.staff;

import com.hushevents.events.EventRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events/{eventId}/staff")
public class AdminStaffController {

    private final StaffMemberRepository repository;
    private final EventRepository eventRepository;

    public AdminStaffController(
            StaffMemberRepository repository,
            EventRepository eventRepository
    ) {
        this.repository = repository;
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public List<StaffDTO> list(
            @PathVariable Long eventId
    ) {

        ensureEventExists(eventId);

        return repository
                .findAllByEventIdOrderBySortOrderAsc(eventId)
                .stream()
                .map(StaffDTO::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StaffDTO create(
            @PathVariable Long eventId,
            @Valid @RequestBody StaffRequestDTO request
    ) {

        ensureEventExists(eventId);

        StaffMember staff =
                new StaffMember();

        apply(
                staff,
                eventId,
                request
        );

        return StaffDTO.from(
                repository.save(staff)
        );
    }

    @PutMapping("/{staffId}")
    public StaffDTO update(
            @PathVariable Long eventId,
            @PathVariable Long staffId,
            @Valid @RequestBody StaffRequestDTO request
    ) {

        StaffMember staff =
                getStaff(
                        eventId,
                        staffId
                );

        apply(
                staff,
                eventId,
                request
        );

        return StaffDTO.from(
                repository.save(staff)
        );
    }

    @DeleteMapping("/{staffId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long eventId,
            @PathVariable Long staffId
    ) {

        repository.delete(
                getStaff(
                        eventId,
                        staffId
                )
        );
    }

    private void apply(
            StaffMember staff,
            Long eventId,
            StaffRequestDTO request
    ) {

        staff.setEventId(eventId);

        staff.setName(
                request.name().trim()
        );

        staff.setRole(
                request.role().trim()
        );

        staff.setImageUrl(
                request.imageUrl().trim()
        );

        staff.setLink1Label(
                clean(request.link1Label())
        );

        staff.setLink1Url(
                clean(request.link1Url())
        );

        staff.setLink2Label(
                clean(request.link2Label())
        );

        staff.setLink2Url(
                clean(request.link2Url())
        );

        staff.setLink3Label(
                clean(request.link3Label())
        );

        staff.setLink3Url(
                clean(request.link3Url())
        );

        staff.setSortOrder(
                request.sortOrder()
        );
    }

    private StaffMember getStaff(
            Long eventId,
            Long staffId
    ) {

        StaffMember staff =
                repository
                        .findById(staffId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Staff member not found"
                                )
                        );

        if (
                !staff
                        .getEventId()
                        .equals(eventId)
        ) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Staff member not found"
            );
        }

        return staff;
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
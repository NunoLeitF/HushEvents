package com.hushevents.events;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
public class AdminEventController {

    private final EventService service;


    public AdminEventController(
            EventService service
    ) {
        this.service = service;
    }


    @GetMapping
    public List<Event> getAllEvents() {

        return service
                .getAllEvents();
    }


    @GetMapping("/{id}")
    public Event getEvent(
            @PathVariable Long id
    ) {

        return service
                .getEvent(id);
    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Event createEvent(

            @Valid
            @RequestBody
            EventRequestDTO request

    ) {

        return service
                .createEvent(request);
    }


    @PutMapping("/{id}")
    public Event updateEvent(

            @PathVariable Long id,

            @Valid
            @RequestBody
            EventRequestDTO request

    ) {

        return service
                .updateEvent(
                        id,
                        request
                );
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(
            @PathVariable Long id
    ) {

        service.deleteEvent(id);
    }
}
package com.hushevents.events;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;


    public EventController(
            EventService service
    ) {
        this.service = service;
    }


    @GetMapping("/current")
    public ResponseEntity<EventPublicDTO>
    getCurrentEvent() {

        return service
                .getCurrentEvent()
                .map(ResponseEntity::ok)
                .orElseGet(
                        () ->
                                ResponseEntity
                                        .noContent()
                                        .build()
                );
    }
}
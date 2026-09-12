package com.hushevents.guides;

import com.hushevents.events.EventRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events/{eventId}/guide-images")
public class AdminGuideImageController {

    private final GuideImageRepository repository;
    private final EventRepository eventRepository;

    public AdminGuideImageController(
            GuideImageRepository repository,
            EventRepository eventRepository
    ) {
        this.repository = repository;
        this.eventRepository = eventRepository;
    }

    @GetMapping
    public List<GuideImageDTO> list(
            @PathVariable Long eventId
    ) {

        ensureEventExists(eventId);

        return repository
                .findAllByEventIdOrderBySortOrderAsc(eventId)
                .stream()
                .map(GuideImageDTO::from)
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GuideImageDTO create(
            @PathVariable Long eventId,
            @Valid @RequestBody GuideImageRequestDTO request
    ) {

        ensureEventExists(eventId);

        GuideImage image = new GuideImage();

        image.setEventId(eventId);
        image.setImageUrl(request.imageUrl().trim());
        image.setSortOrder(request.sortOrder());

        return GuideImageDTO.from(
                repository.save(image)
        );
    }

    @DeleteMapping("/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long eventId,
            @PathVariable Long imageId
    ) {

        GuideImage image =
                repository.findById(imageId)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Guide image not found"
                                )
                        );

        if (!image.getEventId().equals(eventId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Guide image not found"
            );
        }

        repository.delete(image);
    }

    private void ensureEventExists(Long eventId) {

        if (!eventRepository.existsById(eventId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Event not found"
            );
        }
    }
}
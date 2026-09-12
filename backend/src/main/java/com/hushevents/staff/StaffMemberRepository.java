package com.hushevents.staff;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StaffMemberRepository
        extends JpaRepository<StaffMember, Long> {

    List<StaffMember>
    findAllByEventIdOrderBySortOrderAsc(Long eventId);

    void deleteAllByEventId(Long eventId);
}
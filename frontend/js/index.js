const API_BASE = "http://localhost:8080/api";

let currentEvent = null;


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializePage
);


async function initializePage() {

    try {

        const response = await fetch(
            `${API_BASE}/events/current`
        );


        if (response.status === 204) {
            showNoEvent();
            return;
        }


        if (!response.ok) {

            throw new Error(
                `Could not load event: ${response.status}`
            );
        }


        currentEvent = await response.json();

        showEvent(currentEvent);

    } catch (error) {

        console.error(
            "Failed to load Hush event:",
            error
        );

        showNoEvent();
    }

}


/* =========================================================
   NO EVENT
   ========================================================= */

function showNoEvent() {

    document
        .getElementById("event-page")
        .hidden = true;

    document
        .getElementById("no-event")
        .hidden = false;
}


/* =========================================================
   EVENT
   ========================================================= */

function showEvent(event) {

    document
        .getElementById("no-event")
        .hidden = true;

    document
        .getElementById("event-page")
        .hidden = false;


    /* =====================================================
       BACKGROUND
       ===================================================== */

    if (event.backgroundImageUrl) {

        document.documentElement.style.setProperty(
            "--event-background",
            `url("${event.backgroundImageUrl}")`
        );

    } else {

        document.documentElement.style.setProperty(
            "--event-background",
            "none"
        );
    }


    /* =====================================================
       LOGO
       ===================================================== */

    const logo =
        document.getElementById("event-logo");


    if (event.logoImageUrl) {

        logo.src =
            event.logoImageUrl;

        logo.alt =
            `${event.name} logo`;

        logo.hidden =
            false;

    } else {

        logo.hidden =
            true;
    }


    /* =====================================================
       LOCATION
       ===================================================== */

    document
        .getElementById("event-location")
        .textContent =
        event.location;


    /* =====================================================
       COUNTDOWN
       ===================================================== */

    startCountdown(
        event.startAt
    );


    /*
     * These sections will be populated once we add
     * their backend models.
     */

    prepareFutureSections();
}


/* =========================================================
   FUTURE SECTIONS
   ========================================================= */

function prepareFutureSections() {

    /*
     * For now our API only contains the basic Event.
     *
     * Hide these sections until Guide Images,
     * Vendors/RPers and Staff have been implemented.
     */

    setSectionVisible(
        "guide",
        false
    );

    setSectionVisible(
        "participants",
        false
    );

    setSectionVisible(
        "staff",
        false
    );


    setNavVisible(
        "#guide",
        false
    );

    setNavVisible(
        "#participants",
        false
    );

    setNavVisible(
        "#staff",
        false
    );
}


function setSectionVisible(
    id,
    visible
) {

    const section =
        document.getElementById(id);

    if (!section) {
        return;
    }

    section.hidden =
        !visible;
}


function setNavVisible(
    href,
    visible
) {

    const link =
        document.querySelector(
            `.event-nav a[href="${href}"]`
        );

    if (!link) {
        return;
    }

    link.hidden =
        !visible;
}


/* =========================================================
   COUNTDOWN
   ========================================================= */

function startCountdown(
    startAt
) {

    const target =
        new Date(startAt);


    function update() {

        let difference =
            target.getTime() -
            Date.now();


        if (difference <= 0) {

            difference = 0;
        }


        const days =
            Math.floor(
                difference /
                86400000
            );


        difference -=
            days * 86400000;


        const hours =
            Math.floor(
                difference /
                3600000
            );


        difference -=
            hours * 3600000;


        const minutes =
            Math.floor(
                difference /
                60000
            );


        difference -=
            minutes * 60000;


        const seconds =
            Math.floor(
                difference /
                1000
            );


        setCountdownValue(
            "countdown-days",
            days
        );

        setCountdownValue(
            "countdown-hours",
            hours
        );

        setCountdownValue(
            "countdown-minutes",
            minutes
        );

        setCountdownValue(
            "countdown-seconds",
            seconds
        );
    }


    update();

    setInterval(
        update,
        1000
    );
}


function setCountdownValue(
    id,
    value
) {

    document
        .getElementById(id)
        .textContent =
        String(value)
            .padStart(
                2,
                "0"
            );
}
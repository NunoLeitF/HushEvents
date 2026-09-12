/* =========================================================
   CONFIG
   ========================================================= */

const API_BASE =
    "http://localhost:8080/api";

const BACKEND_ORIGIN =
    "http://localhost:8080";


/* =========================================================
   STATE
   ========================================================= */

let currentEvent =
    null;

let countdownInterval =
    null;

let currentParticipantFilter =
    "all";


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializePage
);


async function initializePage() {

    console.log(
        "Hush public page loaded"
    );


    try {

        const response =
            await fetch(
                `${API_BASE}/events/current`
            );


        console.log(
            "Event API status:",
            response.status
        );


        if (
            response.status === 204
        ) {

            showNoEvent();

            return;
        }


        if (!response.ok) {

            throw new Error(
                `Backend returned ${response.status}`
            );
        }


        currentEvent =
            await response.json();


        console.log(
            "Current event:",
            currentEvent
        );


        showEvent(
            currentEvent
        );

    } catch (error) {

        console.error(
            "Could not load Hush event:",
            error
        );


        showNoEvent();
    }
}


/* =========================================================
   NO EVENT
   ========================================================= */

function showNoEvent() {

    stopCountdown();


    const eventPage =
        document.getElementById(
            "event-page"
        );


    const noEvent =
        document.getElementById(
            "no-event"
        );


    if (eventPage) {

        eventPage.hidden =
            true;
    }


    if (noEvent) {

        noEvent.hidden =
            false;
    }
}


/* =========================================================
   EVENT
   ========================================================= */

function showEvent(
    event
) {

    const eventPage =
        document.getElementById(
            "event-page"
        );


    const noEvent =
        document.getElementById(
            "no-event"
        );


    if (noEvent) {

        noEvent.hidden =
            true;
    }


    if (eventPage) {

        eventPage.hidden =
            false;
    }


    renderBackground(
        event
    );


    renderLogo(
        event
    );


    renderLocation(
        event
    );


    startCountdown(
        event.startAt
    );


    renderGuide(
        event.guideImages || []
    );


    renderParticipants(
        event.participants || []
    );


    renderStaff(
        event.staff || []
    );


    setupParticipantFilters();
}


/* =========================================================
   BACKGROUND
   ========================================================= */

function renderBackground(
    event
) {

    if (
        event.backgroundImageUrl
    ) {

        const url =
            resolveBackendUrl(
                event.backgroundImageUrl
            );


        document.documentElement
            .style
            .setProperty(
                "--event-background",
                `url("${url}")`
            );

    } else {

        document.documentElement
            .style
            .setProperty(
                "--event-background",
                "none"
            );
    }
}


/* =========================================================
   LOGO
   ========================================================= */

function renderLogo(
    event
) {

    const logo =
        document.getElementById(
            "event-logo"
        );


    const name =
        document.getElementById(
            "event-name"
        );


    if (
        event.logoImageUrl
    ) {

        if (logo) {

            logo.src =
                resolveBackendUrl(
                    event.logoImageUrl
                );


            logo.alt =
                `${event.name} logo`;


            logo.hidden =
                false;
        }


        if (name) {

            name.hidden =
                true;
        }

    } else {

        if (logo) {

            logo.hidden =
                true;
        }


        if (name) {

            name.textContent =
                event.name;


            name.hidden =
                false;
        }
    }
}


/* =========================================================
   LOCATION
   ========================================================= */

function renderLocation(
    event
) {

    const location =
        document.getElementById(
            "event-location"
        );


    if (!location) {

        return;
    }


    location.textContent =
        event.location || "";
}


/* =========================================================
   GUIDE
   ========================================================= */

function renderGuide(
    guideImages
) {

    const section =
        document.getElementById(
            "guide"
        );


    const nav =
        document.getElementById(
            "nav-guide"
        );


    const grid =
        document.getElementById(
            "guide-grid"
        );


    console.log(
        "Guide images:",
        guideImages
    );


    if (!grid) {

        console.error(
            "Could not find #guide-grid"
        );

        return;
    }


    grid.innerHTML =
        "";


    if (
        guideImages.length === 0
    ) {

        if (section) {

            section.hidden =
                true;
        }


        if (nav) {

            nav.hidden =
                true;
        }


        return;
    }


    if (section) {

        section.hidden =
            false;
    }


    if (nav) {

        nav.hidden =
            false;
    }


    for (
        const guide
        of guideImages
    ) {

        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            "guide-image";


        const image =
            document.createElement(
                "img"
            );


        image.src =
            resolveBackendUrl(
                guide.imageUrl
            );


        image.alt =
            "Event guide image";


        wrapper.appendChild(
            image
        );


        grid.appendChild(
            wrapper
        );
    }
}


/* =========================================================
   PARTICIPANTS
   ========================================================= */

function renderParticipants(
    participants
) {

    const section =
        document.getElementById(
            "participants"
        );


    const nav =
        document.getElementById(
            "nav-participants"
        );


    console.log(
        "Participants:",
        participants
    );


    if (
        participants.length === 0
    ) {

        if (section) {

            section.hidden =
                true;
        }


        if (nav) {

            nav.hidden =
                true;
        }


        return;
    }


    if (section) {

        section.hidden =
            false;
    }


    if (nav) {

        nav.hidden =
            false;
    }


    renderParticipantCards(
        participants,
        currentParticipantFilter
    );
}


/* =========================================================
   PARTICIPANT CARDS
   ========================================================= */

function renderParticipantCards(
    participants,
    filter
) {

    const grid =
        document.getElementById(
            "participant-grid"
        );


    if (!grid) {

        console.error(
            "Could not find #participant-grid"
        );

        return;
    }


    grid.innerHTML =
        "";


    const filtered =
        participants.filter(
            participant => {

                if (
                    filter === "all"
                ) {

                    return true;
                }


                const type =
                    String(
                        participant.type || ""
                    )
                        .toLowerCase();


                return type === filter;
            }
        );


    for (
        const participant
        of filtered
    ) {

        let subtitle;


        if (
            participant.type === "RPER"
        ) {

            subtitle =
                "RPer";

        } else {

            subtitle =
                "Vendor";
        }


        if (
            participant.category
        ) {

            subtitle +=
                ` · ${participant.category}`;
        }


        grid.appendChild(

            createPersonCard(

                participant.name,

                subtitle,

                participant.imageUrl,

                linksFromObject(
                    participant
                )
            )
        );
    }
}


/* =========================================================
   PARTICIPANT FILTERS
   ========================================================= */

function setupParticipantFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(
        button => {

            button.onclick =
                () => {

                    buttons.forEach(
                        other => {

                            other
                                .classList
                                .remove(
                                    "active"
                                );
                        }
                    );


                    button
                        .classList
                        .add(
                            "active"
                        );


                    currentParticipantFilter =
                        button.dataset.filter;


                    renderParticipantCards(

                        currentEvent
                            ?.participants ||
                        [],

                        currentParticipantFilter
                    );
                };
        }
    );
}


/* =========================================================
   STAFF
   ========================================================= */

function renderStaff(
    staffMembers
) {

    const section =
        document.getElementById(
            "staff"
        );


    const nav =
        document.getElementById(
            "nav-staff"
        );


    const grid =
        document.getElementById(
            "staff-grid"
        );


    console.log(
        "Staff:",
        staffMembers
    );


    if (!grid) {

        console.error(
            "Could not find #staff-grid"
        );

        return;
    }


    grid.innerHTML =
        "";


    if (
        staffMembers.length === 0
    ) {

        if (section) {

            section.hidden =
                true;
        }


        if (nav) {

            nav.hidden =
                true;
        }


        return;
    }


    if (section) {

        section.hidden =
            false;
    }


    if (nav) {

        nav.hidden =
            false;
    }


    for (
        const staff
        of staffMembers
    ) {

        grid.appendChild(

            createPersonCard(

                staff.name,

                staff.role,

                staff.imageUrl,

                linksFromObject(
                    staff
                )
            )
        );
    }
}


/* =========================================================
   PERSON CARD
   ========================================================= */

function createPersonCard(
    name,
    subtitle,
    imageUrl,
    links
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "person-card";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        resolveBackendUrl(
            imageUrl
        );


    image.alt =
        name;


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "person-card-info";


    const title =
        document.createElement(
            "h3"
        );


    title.textContent =
        name;


    const typeElement =
        document.createElement(
            "p"
        );


    typeElement.className =
        "person-type";


    typeElement.textContent =
        subtitle;


    info.appendChild(
        title
    );


    info.appendChild(
        typeElement
    );


    if (
        links.length > 0
    ) {

        const linkContainer =
            document.createElement(
                "div"
            );


        linkContainer.className =
            "person-links";


        for (
            const link
            of links
        ) {

            const anchor =
                document.createElement(
                    "a"
                );


            anchor.href =
                link.url;


            anchor.textContent =
                link.label;


            anchor.target =
                "_blank";


            anchor.rel =
                "noopener noreferrer";


            linkContainer.appendChild(
                anchor
            );
        }


        info.appendChild(
            linkContainer
        );
    }


    card.appendChild(
        image
    );


    card.appendChild(
        info
    );


    return card;
}


/* =========================================================
   OPTIONAL LINKS
   ========================================================= */

function linksFromObject(
    object
) {

    const links =
        [];


    for (
        let index = 1;
        index <= 3;
        index++
    ) {

        const label =
            object[
                `link${index}Label`
            ];


        const url =
            object[
                `link${index}Url`
            ];


        /*
         * A URL without a custom label is still useful.
         * Give it a generic "Link" label.
         */

        if (url) {

            links.push({

                label:
                    label ||
                    (
                        index === 1
                            ? "Link"
                            : `Link ${index}`
                    ),

                url:
                    url
            });
        }
    }


    return links;
}


/* =========================================================
   COUNTDOWN
   ========================================================= */

function startCountdown(
    startAt
) {

    stopCountdown();


    const target =
        new Date(
            startAt
        );


    function update() {

        let difference =
            target.getTime() -
            Date.now();


        if (
            difference < 0
        ) {

            difference =
                0;
        }


        const days =
            Math.floor(
                difference /
                86400000
            );


        difference -=
            days *
            86400000;


        const hours =
            Math.floor(
                difference /
                3600000
            );


        difference -=
            hours *
            3600000;


        const minutes =
            Math.floor(
                difference /
                60000
            );


        difference -=
            minutes *
            60000;


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


    countdownInterval =
        setInterval(
            update,
            1000
        );
}


/* =========================================================
   STOP COUNTDOWN
   ========================================================= */

function stopCountdown() {

    if (
        countdownInterval === null
    ) {

        return;
    }


    clearInterval(
        countdownInterval
    );


    countdownInterval =
        null;
}


/* =========================================================
   SET COUNTDOWN VALUE
   ========================================================= */

function setCountdownValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;
    }


    element.textContent =
        String(
            value
        )
            .padStart(
                2,
                "0"
            );
}


/* =========================================================
   BACKEND URL
   ========================================================= */

function resolveBackendUrl(
    url
) {

    if (!url) {

        return "";
    }


    if (
        url.startsWith(
            "http://"
        ) ||
        url.startsWith(
            "https://"
        ) ||
        url.startsWith(
            "data:"
        ) ||
        url.startsWith(
            "blob:"
        )
    ) {

        return url;
    }


    return `${BACKEND_ORIGIN}${url}`;
}
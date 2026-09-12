/* =========================================================
   TEMPORARY EVENT DATA
   This will eventually come from the backend.
   ========================================================= */

const event = {
    active: true,

    name: "Hush Event",

    location:
        "Crystal • Balmung • The Goblet W12 P34",

    startAt:
        "2026-10-24T21:00:00+01:00",

    backgroundUrl:
        "assets/example-background.webp",

    logoUrl:
        "assets/example-logo.webp",

    guideImages: [
        "assets/guide/guide-1.webp",
        "assets/guide/guide-2.webp",
        "assets/guide/guide-3.webp"
    ],

    participants: [
        {
            name: "Moonlight Atelier",
            type: "vendor",
            label: "Vendor",

            image:
                "assets/participants/vendor-1.webp",

            links: [
                {
                    label: "Carrd",
                    url: "https://example.com"
                }
            ]
        },

        {
            name: "Aurelia Vale",
            type: "rper",
            label: "RPer",

            image:
                "assets/participants/rper-1.webp",

            links: []
        }
    ],

    staff: [
        {
            name: "Harpocrates",
            role: "Event Organizer",

            image:
                "assets/staff/staff-1.webp",

            links: [
                {
                    label: "Carrd",
                    url: "https://example.com"
                }
            ]
        },

        {
            name: "Mika",
            role: "Security",

            image:
                "assets/staff/staff-2.webp",

            links: []
        }
    ]
};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializePage
);


function initializePage() {

    if (!event || !event.active) {
        showNoEvent();
        return;
    }

    showEvent();

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

function showEvent() {

    document
        .getElementById("no-event")
        .hidden = true;

    document
        .getElementById("event-page")
        .hidden = false;


    document.documentElement.style.setProperty(
        "--event-background",
        `url("${event.backgroundUrl}")`
    );


    const logo =
        document.getElementById("event-logo");

    logo.src =
        event.logoUrl;

    logo.alt =
        `${event.name} logo`;


    document
        .getElementById("event-location")
        .textContent =
        event.location;


    renderGuide();

    renderParticipants();

    renderStaff();

    setupFilters();

    startCountdown(
        event.startAt
    );

}


/* =========================================================
   GUIDE
   ========================================================= */

function renderGuide() {

    const grid =
        document.getElementById(
            "guide-grid"
        );

    grid.innerHTML = "";


    for (
        const imageUrl
        of event.guideImages
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
            imageUrl;

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
    filter = "all"
) {

    const grid =
        document.getElementById(
            "participant-grid"
        );

    grid.innerHTML = "";


    const participants =
        event.participants.filter(
            participant =>
                filter === "all" ||
                participant.type === filter
        );


    for (
        const participant
        of participants
    ) {

        grid.appendChild(
            createPersonCard(
                participant.name,
                participant.label,
                participant.image,
                participant.links
            )
        );
    }

}


/* =========================================================
   STAFF
   ========================================================= */

function renderStaff() {

    const grid =
        document.getElementById(
            "staff-grid"
        );

    grid.innerHTML = "";


    for (
        const staff
        of event.staff
    ) {

        grid.appendChild(
            createPersonCard(
                staff.name,
                staff.role,
                staff.image,
                staff.links
            )
        );
    }

}


/* =========================================================
   PERSON CARD
   ========================================================= */

function createPersonCard(
    name,
    type,
    imageUrl,
    links = []
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
        imageUrl;

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
        type;


    info.appendChild(
        title
    );

    info.appendChild(
        typeElement
    );


    if (
        links &&
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
   FILTERS
   ========================================================= */

function setupFilters() {

    const buttons =
        document.querySelectorAll(
            ".filter-button"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    buttons.forEach(
                        other =>
                            other.classList.remove(
                                "active"
                            )
                    );


                    button.classList.add(
                        "active"
                    );


                    renderParticipants(
                        button.dataset.filter
                    );
                }
            );

        }
    );

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


        if (
            difference <= 0
        ) {

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
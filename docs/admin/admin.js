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

let events = [];

let selectedEventId = null;

let backgroundImageUrl = null;
let logoImageUrl = null;

let guideImages = [];
let participants = [];
let staffMembers = [];


/* =========================================================
   ELEMENT HELPERS
   ========================================================= */

function getElement(id) {
    return document.getElementById(id);
}


function bindClick(id, handler) {

    const element =
        getElement(id);


    if (!element) {

        console.warn(
            `Hush Admin: missing element #${id}`
        );

        return;
    }


    element.addEventListener(
        "click",
        handler
    );
}


function setHidden(id, hidden) {

    const element =
        getElement(id);


    if (!element) {
        return;
    }


    element.hidden =
        hidden;
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeAdmin
);


async function initializeAdmin() {

    console.log(
        "Hush Admin loaded"
    );


    setupListeners();


    await loadEvents();
}


/* =========================================================
   LISTENERS
   ========================================================= */

function setupListeners() {

    bindClick(
        "new-event-button",
        startNewEvent
    );


    const eventForm =
        getElement(
            "event-form"
        );


    if (eventForm) {

        eventForm.addEventListener(
            "submit",
            saveEvent
        );

    } else {

        console.warn(
            "Hush Admin: missing #event-form"
        );
    }


    bindClick(
        "delete-button",
        deleteCurrentEvent
    );


    bindClick(
        "add-guide-button",
        addGuideImage
    );


    bindClick(
        "save-participant-button",
        saveParticipant
    );


    bindClick(
        "cancel-participant-edit",
        resetParticipantEditor
    );


    bindClick(
        "save-staff-button",
        saveStaffMember
    );


    bindClick(
        "cancel-staff-edit",
        resetStaffEditor
    );


    const backgroundFileInput =
        getElement(
            "background-file"
        );


    const backgroundPreview =
        getElement(
            "background-preview"
        );


    if (
        backgroundFileInput &&
        backgroundPreview
    ) {

        backgroundFileInput
            .addEventListener(
                "change",
                () => {

                    previewSelectedFile(
                        backgroundFileInput,
                        backgroundPreview
                    );
                }
            );
    }


    const logoFileInput =
        getElement(
            "logo-file"
        );


    const logoPreview =
        getElement(
            "logo-preview"
        );


    if (
        logoFileInput &&
        logoPreview
    ) {

        logoFileInput
            .addEventListener(
                "change",
                () => {

                    previewSelectedFile(
                        logoFileInput,
                        logoPreview
                    );
                }
            );
    }
}


/* =========================================================
   LOAD EVENTS
   ========================================================= */

async function loadEvents() {

    const eventList =
        getElement(
            "event-list"
        );


    if (!eventList) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/admin/events`
            );


        if (!response.ok) {

            throw new Error(
                `Could not load events: ${response.status}`
            );
        }


        events =
            await response.json();


        renderEventList();

    } catch (error) {

        console.error(
            error
        );


        eventList.innerHTML =
            `
            <p style="
                padding:20px;
                color:#777;
                font-size:.8rem;
            ">
                Could not load events.
            </p>
            `;
    }
}


/* =========================================================
   EVENT LIST
   ========================================================= */

function renderEventList() {

    const eventList =
        getElement(
            "event-list"
        );


    if (!eventList) {
        return;
    }


    eventList.innerHTML =
        "";


    if (
        events.length === 0
    ) {

        eventList.innerHTML =
            `
            <p style="
                padding:20px;
                color:#666;
                font-size:.8rem;
            ">
                No events yet.
            </p>
            `;

        return;
    }


    for (
        const event of events
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "event-list-item";


        if (
            event.id ===
            selectedEventId
        ) {

            button
                .classList
                .add(
                    "active"
                );
        }


        const start =
            new Date(
                event.startAt
            );


        button.innerHTML =
            `
            <strong>
                ${escapeHtml(event.name)}
            </strong>

            <div class="event-meta">

                <span>
                    ${formatShortDate(start)}
                </span>

                <span
                    class="
                        event-state
                        ${event.published
                            ? "published"
                            : ""
                        }
                    "
                >
                    ${event.published
                        ? "Published"
                        : "Draft"
                    }
                </span>

            </div>
            `;


        button.addEventListener(
            "click",
            () => {

                editEvent(
                    event.id
                );
            }
        );


        eventList.appendChild(
            button
        );
    }
}


/* =========================================================
   NEW EVENT
   ========================================================= */

function startNewEvent() {

    console.log(
        "Starting new event"
    );


    selectedEventId =
        null;


    backgroundImageUrl =
        null;


    logoImageUrl =
        null;


    guideImages =
        [];


    participants =
        [];


    staffMembers =
        [];


    const eventForm =
        getElement(
            "event-form"
        );


    if (!eventForm) {

        console.error(
            "Hush Admin: #event-form does not exist"
        );

        return;
    }


    eventForm.reset();


    const editorTitle =
        getElement(
            "editor-title"
        );


    if (editorTitle) {

        editorTitle.textContent =
            "New Event";
    }


    setHidden(
        "empty-editor",
        true
    );


    setHidden(
        "event-form",
        false
    );


    setHidden(
        "delete-button",
        true
    );


    setHidden(
        "related-content",
        true
    );


    setHidden(
        "save-first-message",
        false
    );


    const backgroundPreview =
        getElement(
            "background-preview"
        );


    if (backgroundPreview) {

        clearImagePreview(
            backgroundPreview,
            "No background selected"
        );
    }


    const logoPreview =
        getElement(
            "logo-preview"
        );


    if (logoPreview) {

        clearImagePreview(
            logoPreview,
            "No logo selected"
        );
    }


    const guideList =
        getElement(
            "guide-list"
        );


    if (guideList) {

        guideList.innerHTML =
            "";
    }


    const participantList =
        getElement(
            "participant-list"
        );


    if (participantList) {

        participantList.innerHTML =
            "";
    }


    const staffList =
        getElement(
            "staff-list"
        );


    if (staffList) {

        staffList.innerHTML =
            "";
    }


    resetParticipantEditor();

    resetStaffEditor();


    const saveStatus =
        getElement(
            "save-status"
        );


    if (saveStatus) {

        saveStatus.textContent =
            "";
    }


    renderEventList();
}


/* =========================================================
   EDIT EVENT
   ========================================================= */

async function editEvent(
    id
) {

    try {

        const response =
            await fetch(
                `${API_BASE}/admin/events/${id}`
            );


        if (!response.ok) {

            throw new Error(
                `Could not load event ${id}`
            );
        }


        const event =
            await response.json();


        selectedEventId =
            event.id;


        backgroundImageUrl =
            event.backgroundImageUrl;


        logoImageUrl =
            event.logoImageUrl;


        const editorTitle =
            getElement(
                "editor-title"
            );


        if (editorTitle) {

            editorTitle.textContent =
                event.name;
        }


        setInputValue(
            "name",
            event.name
        );


        setInputValue(
            "location",
            event.location
        );


        setInputValue(
            "start-at",
            instantToLocalInput(
                event.startAt
            )
        );


        setInputValue(
            "end-at",
            instantToLocalInput(
                event.endAt
            )
        );


        const published =
            getElement(
                "published"
            );


        if (published) {

            published.checked =
                event.published;
        }


        const backgroundFile =
            getElement(
                "background-file"
            );


        if (backgroundFile) {

            backgroundFile.value =
                "";
        }


        const logoFile =
            getElement(
                "logo-file"
            );


        if (logoFile) {

            logoFile.value =
                "";
        }


        const backgroundPreview =
            getElement(
                "background-preview"
            );


        if (backgroundPreview) {

            showStoredImage(
                backgroundPreview,
                backgroundImageUrl,
                "No background selected"
            );
        }


        const logoPreview =
            getElement(
                "logo-preview"
            );


        if (logoPreview) {

            showStoredImage(
                logoPreview,
                logoImageUrl,
                "No logo selected"
            );
        }


        setHidden(
            "empty-editor",
            true
        );


        setHidden(
            "event-form",
            false
        );


        setHidden(
            "delete-button",
            false
        );


        setHidden(
            "save-first-message",
            true
        );


        setHidden(
            "related-content",
            false
        );


        const saveStatus =
            getElement(
                "save-status"
            );


        if (saveStatus) {

            saveStatus.textContent =
                "";
        }


        resetParticipantEditor();

        resetStaffEditor();


        await loadRelatedContent();


        renderEventList();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not open event."
        );
    }
}


/* =========================================================
   SAVE EVENT
   ========================================================= */

async function saveEvent(
    submitEvent
) {

    submitEvent.preventDefault();


    const saveStatus =
        getElement(
            "save-status"
        );


    if (saveStatus) {

        saveStatus.textContent =
            "Saving…";
    }


    try {

        const backgroundFileInput =
            getElement(
                "background-file"
            );


        if (
            backgroundFileInput &&
            backgroundFileInput
                .files
                .length > 0
        ) {

            backgroundImageUrl =
                await uploadImage(
                    backgroundFileInput
                        .files[0]
                );
        }


        const logoFileInput =
            getElement(
                "logo-file"
            );


        if (
            logoFileInput &&
            logoFileInput
                .files
                .length > 0
        ) {

            logoImageUrl =
                await uploadImage(
                    logoFileInput
                        .files[0]
                );
        }


        const name =
            getInputValue(
                "name"
            );


        const location =
            getInputValue(
                "location"
            );


        const startAt =
            getInputValue(
                "start-at"
            );


        const endAt =
            getInputValue(
                "end-at"
            );


        if (
            !name ||
            !location ||
            !startAt ||
            !endAt
        ) {

            alert(
                "Please fill in the event name, location, start and end time."
            );

            if (saveStatus) {

                saveStatus.textContent =
                    "";
            }

            return;
        }


        const published =
            getElement(
                "published"
            );


        const payload = {

            name:
                name,

            location:
                location,

            startAt:
                localInputToInstant(
                    startAt
                ),

            endAt:
                localInputToInstant(
                    endAt
                ),

            backgroundImageUrl:
                backgroundImageUrl,

            logoImageUrl:
                logoImageUrl,

            published:
                published
                    ? published.checked
                    : false
        };


        const editing =
            selectedEventId !== null;


        const url =
            editing
                ? `${API_BASE}/admin/events/${selectedEventId}`
                : `${API_BASE}/admin/events`;


        const response =
            await fetch(
                url,
                {
                    method:
                        editing
                            ? "PUT"
                            : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            const body =
                await response.text();


            throw new Error(
                body ||
                `Save failed: ${response.status}`
            );
        }


        const saved =
            await response.json();


        selectedEventId =
            saved.id;


        if (saveStatus) {

            saveStatus.textContent =
                "Saved";
        }


        await loadEvents();


        await editEvent(
            saved.id
        );

    } catch (error) {

        console.error(
            error
        );


        if (saveStatus) {

            saveStatus.textContent =
                "Save failed";
        }


        alert(
            "Could not save the event."
        );
    }
}


/* =========================================================
   DELETE EVENT
   ========================================================= */

async function deleteCurrentEvent() {

    if (
        selectedEventId === null
    ) {

        return;
    }


    const confirmed =
        confirm(
            "Delete this event and all of its content?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/admin/events/${selectedEventId}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Delete failed: ${response.status}`
            );
        }


        selectedEventId =
            null;


        setHidden(
            "event-form",
            true
        );


        setHidden(
            "empty-editor",
            false
        );


        await loadEvents();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not delete the event."
        );
    }
}


/* =========================================================
   RELATED CONTENT
   ========================================================= */

async function loadRelatedContent() {

    if (
        selectedEventId === null
    ) {

        return;
    }


    try {

        await Promise.all([
            loadGuideImages(),
            loadParticipants(),
            loadStaff()
        ]);

    } catch (error) {

        console.error(
            "Could not load event content:",
            error
        );
    }
}


/* =========================================================
   GUIDE IMAGES
   ========================================================= */

async function loadGuideImages() {

    if (
        selectedEventId === null
    ) {

        return;
    }


    const response =
        await fetch(
            `${API_BASE}/admin/events/${selectedEventId}/guide-images`
        );


    if (!response.ok) {

        throw new Error(
            "Could not load guide images"
        );
    }


    guideImages =
        await response.json();


    renderGuideImages();
}


async function addGuideImage() {

    if (
        selectedEventId === null
    ) {

        alert(
            "Save the event first."
        );

        return;
    }


    const input =
        getElement(
            "guide-file"
        );


    if (
        !input ||
        input.files.length === 0
    ) {

        alert(
            "Choose an image first."
        );

        return;
    }


    try {

        const imageUrl =
            await uploadImage(
                input.files[0]
            );


        const response =
            await fetch(
                `${API_BASE}/admin/events/${selectedEventId}/guide-images`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            imageUrl:
                                imageUrl,

                            sortOrder:
                                guideImages.length
                        })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not save guide image"
            );
        }


        input.value =
            "";


        await loadGuideImages();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not add the guide image."
        );
    }
}


function renderGuideImages() {

    const container =
        getElement(
            "guide-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    for (
        const image of guideImages
    ) {

        const item =
            document.createElement(
                "article"
            );


        item.className =
            "guide-admin-item";


        const img =
            document.createElement(
                "img"
            );


        img.src =
            resolveBackendUrl(
                image.imageUrl
            );


        img.alt =
            "Guide image";


        const footer =
            document.createElement(
                "footer"
            );


        const deleteButton =
            document.createElement(
                "button"
            );


        deleteButton.type =
            "button";


        deleteButton.className =
            "small-button danger";


        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            () => {

                deleteGuideImage(
                    image.id
                );
            }
        );


        footer.appendChild(
            deleteButton
        );


        item.appendChild(
            img
        );


        item.appendChild(
            footer
        );


        container.appendChild(
            item
        );
    }
}


async function deleteGuideImage(
    imageId
) {

    if (
        !confirm(
            "Remove this guide image?"
        )
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/admin/events/${selectedEventId}/guide-images/${imageId}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete guide image"
            );
        }


        await loadGuideImages();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not remove the image."
        );
    }
}


/* =========================================================
   PARTICIPANTS
   ========================================================= */

async function loadParticipants() {

    if (
        selectedEventId === null
    ) {

        return;
    }


    const response =
        await fetch(
            `${API_BASE}/admin/events/${selectedEventId}/participants`
        );


    if (!response.ok) {

        throw new Error(
            "Could not load participants"
        );
    }


    participants =
        await response.json();


    renderParticipants();
}


function renderParticipants() {

    const container =
        getElement(
            "participant-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    for (
        const participant
        of participants
    ) {

        const subtitle =
            participant.category
                ? `${participant.type} · ${participant.category}`
                : participant.type;


        const row =
            createPersonRow(

                participant.imageUrl,

                participant.name,

                subtitle,

                () => {

                    editParticipant(
                        participant
                    );
                },

                () => {

                    deleteParticipant(
                        participant.id
                    );
                }
            );


        container.appendChild(
            row
        );
    }
}


async function saveParticipant() {

    if (
        selectedEventId === null
    ) {

        alert(
            "Save the event first."
        );

        return;
    }


    try {

        const idInput =
            getElement(
                "participant-id"
            );


        const currentImageInput =
            getElement(
                "participant-current-image"
            );


        const fileInput =
            getElement(
                "participant-file"
            );


        const name =
            getInputValue(
                "participant-name"
            );


        if (!name) {

            alert(
                "Participant name is required."
            );

            return;
        }


        let imageUrl =
            currentImageInput
                ? currentImageInput.value
                : "";


        if (
            fileInput &&
            fileInput.files.length > 0
        ) {

            imageUrl =
                await uploadImage(
                    fileInput.files[0]
                );
        }


        if (!imageUrl) {

            alert(
                "Participant image is required."
            );

            return;
        }


        const id =
            idInput &&
            idInput.value
                ? Number(
                    idInput.value
                )
                : null;


        const existing =
            id
                ? participants.find(
                    participant =>
                        participant.id === id
                )
                : null;


        const payload = {

            name:
                name,

            type:
                getInputValue(
                    "participant-type"
                ) || "VENDOR",

            category:
                cleanValue(
                    getInputValue(
                        "participant-category"
                    )
                ),

            imageUrl:
                imageUrl,

            link1Label:
                cleanValue(
                    getInputValue(
                        "participant-link1-label"
                    )
                ),

            link1Url:
                cleanValue(
                    getInputValue(
                        "participant-link1-url"
                    )
                ),

            link2Label:
                cleanValue(
                    getInputValue(
                        "participant-link2-label"
                    )
                ),

            link2Url:
                cleanValue(
                    getInputValue(
                        "participant-link2-url"
                    )
                ),

            link3Label:
                cleanValue(
                    getInputValue(
                        "participant-link3-label"
                    )
                ),

            link3Url:
                cleanValue(
                    getInputValue(
                        "participant-link3-url"
                    )
                ),

            sortOrder:
                existing
                    ? existing.sortOrder
                    : participants.length
        };


        const url =
            id
                ? `${API_BASE}/admin/events/${selectedEventId}/participants/${id}`
                : `${API_BASE}/admin/events/${selectedEventId}/participants`;


        const response =
            await fetch(
                url,
                {
                    method:
                        id
                            ? "PUT"
                            : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            const body =
                await response.text();


            throw new Error(
                body ||
                "Could not save participant"
            );
        }


        resetParticipantEditor();


        await loadParticipants();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not save Vendor / RPer."
        );
    }
}


function editParticipant(
    participant
) {

    setInputValue(
        "participant-id",
        participant.id
    );


    setInputValue(
        "participant-current-image",
        participant.imageUrl
    );


    setInputValue(
        "participant-name",
        participant.name
    );


    setInputValue(
        "participant-type",
        participant.type
    );


    setInputValue(
        "participant-category",
        participant.category || ""
    );


    fillLinkFields(
        "participant",
        participant
    );


    const file =
        getElement(
            "participant-file"
        );


    if (file) {

        file.value =
            "";
    }


    const saveButton =
        getElement(
            "save-participant-button"
        );


    if (saveButton) {

        saveButton.textContent =
            "Save changes";
    }


    setHidden(
        "cancel-participant-edit",
        false
    );
}


function resetParticipantEditor() {

    setInputValue(
        "participant-id",
        ""
    );


    setInputValue(
        "participant-current-image",
        ""
    );


    setInputValue(
        "participant-name",
        ""
    );


    setInputValue(
        "participant-type",
        "VENDOR"
    );


    setInputValue(
        "participant-category",
        ""
    );


    const file =
        getElement(
            "participant-file"
        );


    if (file) {

        file.value =
            "";
    }


    clearLinkFields(
        "participant"
    );


    const saveButton =
        getElement(
            "save-participant-button"
        );


    if (saveButton) {

        saveButton.textContent =
            "Add Vendor / RPer";
    }


    setHidden(
        "cancel-participant-edit",
        true
    );
}


async function deleteParticipant(
    participantId
) {

    if (
        !confirm(
            "Delete this Vendor / RPer?"
        )
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/admin/events/${selectedEventId}/participants/${participantId}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete participant"
            );
        }


        resetParticipantEditor();


        await loadParticipants();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not delete the Vendor / RPer."
        );
    }
}


/* =========================================================
   STAFF
   ========================================================= */

async function loadStaff() {

    if (
        selectedEventId === null
    ) {

        return;
    }


    const response =
        await fetch(
            `${API_BASE}/admin/events/${selectedEventId}/staff`
        );


    if (!response.ok) {

        throw new Error(
            "Could not load staff"
        );
    }


    staffMembers =
        await response.json();


    renderStaff();
}


function renderStaff() {

    const container =
        getElement(
            "staff-list"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    for (
        const staff of staffMembers
    ) {

        const row =
            createPersonRow(

                staff.imageUrl,

                staff.name,

                staff.role,

                () => {

                    editStaffMember(
                        staff
                    );
                },

                () => {

                    deleteStaffMember(
                        staff.id
                    );
                }
            );


        container.appendChild(
            row
        );
    }
}


async function saveStaffMember() {

    if (
        selectedEventId === null
    ) {

        alert(
            "Save the event first."
        );

        return;
    }


    try {

        const idInput =
            getElement(
                "staff-id"
            );


        const currentImageInput =
            getElement(
                "staff-current-image"
            );


        const fileInput =
            getElement(
                "staff-file"
            );


        const name =
            getInputValue(
                "staff-name"
            );


        const role =
            getInputValue(
                "staff-role"
            );


        if (
            !name ||
            !role
        ) {

            alert(
                "Staff name and role are required."
            );

            return;
        }


        let imageUrl =
            currentImageInput
                ? currentImageInput.value
                : "";


        if (
            fileInput &&
            fileInput.files.length > 0
        ) {

            imageUrl =
                await uploadImage(
                    fileInput.files[0]
                );
        }


        if (!imageUrl) {

            alert(
                "Staff image is required."
            );

            return;
        }


        const id =
            idInput &&
            idInput.value
                ? Number(
                    idInput.value
                )
                : null;


        const existing =
            id
                ? staffMembers.find(
                    staff =>
                        staff.id === id
                )
                : null;


        const payload = {

            name:
                name,

            role:
                role,

            imageUrl:
                imageUrl,

            link1Label:
                cleanValue(
                    getInputValue(
                        "staff-link1-label"
                    )
                ),

            link1Url:
                cleanValue(
                    getInputValue(
                        "staff-link1-url"
                    )
                ),

            link2Label:
                cleanValue(
                    getInputValue(
                        "staff-link2-label"
                    )
                ),

            link2Url:
                cleanValue(
                    getInputValue(
                        "staff-link2-url"
                    )
                ),

            link3Label:
                cleanValue(
                    getInputValue(
                        "staff-link3-label"
                    )
                ),

            link3Url:
                cleanValue(
                    getInputValue(
                        "staff-link3-url"
                    )
                ),

            sortOrder:
                existing
                    ? existing.sortOrder
                    : staffMembers.length
        };


        const url =
            id
                ? `${API_BASE}/admin/events/${selectedEventId}/staff/${id}`
                : `${API_BASE}/admin/events/${selectedEventId}/staff`;


        const response =
            await fetch(
                url,
                {
                    method:
                        id
                            ? "PUT"
                            : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        if (!response.ok) {

            const body =
                await response.text();


            throw new Error(
                body ||
                "Could not save staff member"
            );
        }


        resetStaffEditor();


        await loadStaff();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not save staff member."
        );
    }
}


function editStaffMember(
    staff
) {

    setInputValue(
        "staff-id",
        staff.id
    );


    setInputValue(
        "staff-current-image",
        staff.imageUrl
    );


    setInputValue(
        "staff-name",
        staff.name
    );


    setInputValue(
        "staff-role",
        staff.role
    );


    fillLinkFields(
        "staff",
        staff
    );


    const file =
        getElement(
            "staff-file"
        );


    if (file) {

        file.value =
            "";
    }


    const saveButton =
        getElement(
            "save-staff-button"
        );


    if (saveButton) {

        saveButton.textContent =
            "Save changes";
    }


    setHidden(
        "cancel-staff-edit",
        false
    );
}


function resetStaffEditor() {

    setInputValue(
        "staff-id",
        ""
    );


    setInputValue(
        "staff-current-image",
        ""
    );


    setInputValue(
        "staff-name",
        ""
    );


    setInputValue(
        "staff-role",
        ""
    );


    const file =
        getElement(
            "staff-file"
        );


    if (file) {

        file.value =
            "";
    }


    clearLinkFields(
        "staff"
    );


    const saveButton =
        getElement(
            "save-staff-button"
        );


    if (saveButton) {

        saveButton.textContent =
            "Add staff member";
    }


    setHidden(
        "cancel-staff-edit",
        true
    );
}


async function deleteStaffMember(
    staffId
) {

    if (
        !confirm(
            "Delete this staff member?"
        )
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `${API_BASE}/admin/events/${selectedEventId}/staff/${staffId}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not delete staff member"
            );
        }


        resetStaffEditor();


        await loadStaff();

    } catch (error) {

        console.error(
            error
        );


        alert(
            "Could not delete staff member."
        );
    }
}


/* =========================================================
   PERSON ROW
   ========================================================= */

function createPersonRow(

    imageUrl,

    name,

    subtitle,

    onEdit,

    onDelete

) {

    const row =
        document.createElement(
            "article"
        );


    row.className =
        "admin-person-row";


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


    const title =
        document.createElement(
            "h4"
        );


    title.textContent =
        name;


    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        subtitle;


    info.appendChild(
        title
    );


    info.appendChild(
        description
    );


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "row-actions";


    const editButton =
        document.createElement(
            "button"
        );


    editButton.type =
        "button";


    editButton.className =
        "small-button";


    editButton.textContent =
        "Edit";


    editButton.addEventListener(
        "click",
        onEdit
    );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "small-button danger";


    deleteButton.textContent =
        "Delete";


    deleteButton.addEventListener(
        "click",
        onDelete
    );


    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    row.appendChild(
        image
    );


    row.appendChild(
        info
    );


    row.appendChild(
        actions
    );


    return row;
}


/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

async function uploadImage(
    file
) {

    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    const response =
        await fetch(
            `${API_BASE}/admin/images`,
            {
                method:
                    "POST",

                body:
                    formData
            }
        );


    if (!response.ok) {

        const body =
            await response.text();


        throw new Error(
            body ||
            `Image upload failed: ${response.status}`
        );
    }


    const result =
        await response.json();


    return result.url;
}


/* =========================================================
   IMAGE PREVIEW
   ========================================================= */

function previewSelectedFile(

    input,

    preview

) {

    if (
        !input ||
        !preview
    ) {

        return;
    }


    const file =
        input.files[0];


    if (!file) {
        return;
    }


    const temporaryUrl =
        URL.createObjectURL(
            file
        );


    preview.innerHTML =
        "";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        temporaryUrl;


    image.onload =
        () => {

            URL.revokeObjectURL(
                temporaryUrl
            );
        };


    preview.appendChild(
        image
    );
}


function showStoredImage(

    preview,

    url,

    fallbackText

) {

    if (
        !preview
    ) {

        return;
    }


    if (!url) {

        clearImagePreview(
            preview,
            fallbackText
        );

        return;
    }


    preview.innerHTML =
        "";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        resolveBackendUrl(
            url
        );


    preview.appendChild(
        image
    );
}


function clearImagePreview(

    preview,

    text

) {

    if (!preview) {
        return;
    }


    preview.innerHTML =
        "";


    const span =
        document.createElement(
            "span"
        );


    span.textContent =
        text;


    preview.appendChild(
        span
    );
}


/* =========================================================
   LINKS
   ========================================================= */

function fillLinkFields(
    prefix,
    object
) {

    for (
        let index = 1;
        index <= 3;
        index++
    ) {

        setInputValue(
            `${prefix}-link${index}-label`,
            object[
                `link${index}Label`
            ] || ""
        );


        setInputValue(
            `${prefix}-link${index}-url`,
            object[
                `link${index}Url`
            ] || ""
        );
    }
}


function clearLinkFields(
    prefix
) {

    for (
        let index = 1;
        index <= 3;
        index++
    ) {

        setInputValue(
            `${prefix}-link${index}-label`,
            ""
        );


        setInputValue(
            `${prefix}-link${index}-url`,
            ""
        );
    }
}


/* =========================================================
   INPUT HELPERS
   ========================================================= */

function getInputValue(
    id
) {

    const element =
        getElement(id);


    if (!element) {

        return "";
    }


    return String(
        element.value ?? ""
    )
        .trim();
}


function setInputValue(
    id,
    value
) {

    const element =
        getElement(id);


    if (!element) {

        return;
    }


    element.value =
        value ?? "";
}


/* =========================================================
   URL HELPERS
   ========================================================= */

function resolveBackendUrl(
    url
) {

    if (!url) {

        return null;
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
        )
    ) {

        return url;
    }


    return `${BACKEND_ORIGIN}${url}`;
}


/* =========================================================
   VALUE HELPERS
   ========================================================= */

function cleanValue(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return null;
    }


    const cleaned =
        String(value)
            .trim();


    return cleaned
        ? cleaned
        : null;
}


/* =========================================================
   DATE HELPERS
   ========================================================= */

function instantToLocalInput(
    instant
) {

    const date =
        new Date(
            instant
        );


    const local =
        new Date(
            date.getTime() -
            date.getTimezoneOffset() *
            60000
        );


    return local
        .toISOString()
        .slice(
            0,
            16
        );
}


function localInputToInstant(
    value
) {

    return new Date(
        value
    )
        .toISOString();
}


function formatShortDate(
    date
) {

    return date
        .toLocaleDateString(
            undefined,
            {
                day:
                    "2-digit",

                month:
                    "short",

                year:
                    "numeric"
            }
        );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(
    value
) {

    return String(
        value
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            "\"",
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}
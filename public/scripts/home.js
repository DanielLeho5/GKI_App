import { formatDate } from "./utils/date.js"
import {host_url} from "./utils/settings.js"

async function addNewRecordFunctionality() {
    const newRecordForm = document.querySelector('.js-new-record-form')

    newRecordForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const formData = new FormData(newRecordForm)
        const glucose = formData.get("glucose")
        const glucose_unit = formData.get("glucose_unit")
        const ketone = formData.get("ketone")
        const ketone_unit = formData.get("ketone_unit")
        const measurement_time = formData.get("measurement_time")

        //console.log(glucose, glucose_unit, ketone, ketone_unit, measurement_time)

        const res = await fetch(`${host_url}/api/gk`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                glucose, glucose_unit, ketone, ketone_unit, measurement_time
            })
        })

        if (res.ok) {
            renderStats()
            newRecordForm.reset()
            setNowAsDefaultTime()
        }
    })
}

function setNowAsDefaultTime() {
    const now = new Date()
    const offset = now.getTimezoneOffset() * 60000
    const local  = new Date(now.getTime() - offset).toISOString().slice(0, 16)
    document.querySelector('.js-date-time-input').value = local
}

async function renderStats() {
    const res = await fetch(`${host_url}/api/gk`)
   
    if (!res.ok) {
        console.log("Couldn't fetch data or invalid token")
        window.location.href = `${host_url}/login`
        return
    }

    const {message, records} = await res.json()

    let statsHTML = `
        <div class="row labels">
            <div>Glucose</div>
            <div>Ketones</div>
            <div class="gki-label">GKI</div>
            <div>Date</div>
            <div>Edit</div>
        </div>
    `

    if (records) {
        records.forEach(record => {
        const {glucose, glucose_unit, ketone, ketone_unit, measurement_time} = record
        const gki = (glucose/ketone).toFixed(1)
        const date = new Date(measurement_time)

        //console.log(glucose, glucose_unit, ketone, ketone_unit, gki, date)

        statsHTML += `
            <div class="row record">
                <div class="glucose-grid">
                    <span class="glucose glucose-${record._id}">${glucose}</span>
                    <span class="glucose-unit glucose-unit-${record._id}">${glucose_unit}</span>
                </div>
                <div class="ketone-grid">
                    <span class="ketones ketones-${record._id}">${ketone}</span>
                    <span class="ketone-unit ketone-unit-${record._id}">${ketone_unit}</span>
                </div>
                <div class="gki-disp">${gki}</div>
                <div class="time-disp time-${record._id}">${formatDate(date)}</div>
                <div class="icons-container">
                    <button class="edit-button action-button js-update-button" data-record-id="${record._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="M210.78-109.78q-42.24 0-71.62-29.38-29.38-29.38-29.38-71.62v-538.44q0-42.24 29.38-71.62 29.38-29.38 71.62-29.38h353.44l-101 101H210.78v538.44h538.44v-252.81l101-101v353.81q0 42.24-29.38 71.62-29.38 29.38-71.62 29.38H210.78ZM480-480ZM353.46-353.46v-179.5l360.02-359.45q15.45-15.46 33.48-22.41 18.02-6.94 37.38-6.94 19.75 0 38.05 6.94 18.31 6.95 33.76 22.41l35.76 36.19q15.02 15.46 22.22 33.82 7.2 18.36 7.2 37.89t-6.9 37.78q-6.89 18.25-22.52 33.88L532.96-353.46h-179.5Zm483.69-431.11-52.65-52.58 52.65 52.58Zm-394 341.42h52.09l229.41-229.92-25.83-26.04-26.19-25.54-229.48 228.41v53.09Zm255.67-255.96-26.19-25.54 26.19 25.54 25.83 26.04-25.83-26.04Z"/></svg>
                    </button>
                    <button class="delete-button action-button js-delete-button" data-record-id="${record._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M272-96q-50.94 0-85.97-35.03T151-217v-489H89v-121h250v-61h281v61h252v121h-62v489q0 50.94-35.03 85.97T689-96H272Zm75-188.5h98v-355h-98v355Zm169 0h98v-355h-98v355Z"/></svg>
                    </button>
                </div>
            </div>
        `
        })
    }

    document.querySelector(".js-stats-container").innerHTML = statsHTML
    deleteFunctionality()
    updateFunctionality()
}

async function deleteFunctionality() {
    const deleteButtons = document.querySelectorAll(".js-delete-button")

    deleteButtons.forEach(async (button) => {
        button.addEventListener("click", async () => {
            const recordId = button.dataset.recordId
            
            await fetch(`${host_url}/api/gk/${recordId}`, {
                method: "DELETE"
            })

            renderStats()
        })
    })
}

async function updateFunctionality() {
    const updateButtons = document.querySelectorAll(".js-update-button");

    updateButtons.forEach((button) => {
        // First click enters edit mode
        button.addEventListener("click", enterEditMode);
    });

    function enterEditMode(e) {
        const button = e.currentTarget;

        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00b909ff"><path d="m422.3-284.7 290.48-290.47L641.52-647 422.3-427.78 315.09-535l-71.26 71.83L422.3-284.7ZM480-60.78q-87.52 0-163.91-32.96-76.38-32.96-132.88-89.47-56.51-56.5-89.47-132.88Q60.78-392.48 60.78-480t32.96-163.91q32.96-76.38 89.47-132.88 56.5-56.51 132.88-89.47 76.39-32.96 163.91-32.96t163.91 32.96q76.38 32.96 132.88 89.47 56.51 56.5 89.47 132.88 32.96 76.39 32.96 163.91t-32.96 163.91q-32.96 76.38-89.47 132.88-56.5 56.51-132.88 89.47Q567.52-60.78 480-60.78Zm0-106q131.74 0 222.48-90.74 90.74-90.74 90.74-222.48t-90.74-222.48Q611.74-793.22 480-793.22t-222.48 90.74Q166.78-611.74 166.78-480t90.74 222.48q90.74 90.74 222.48 90.74ZM480-480Z"/></svg>`

        const recordId = button.dataset.recordId;

        const glucoseSpan = document.querySelector(`.glucose-${recordId}`);
        const glucoseUnitSpan = document.querySelector(`.glucose-unit-${recordId}`);
        const ketonesSpan = document.querySelector(`.ketones-${recordId}`);
        const ketonesUnitSpan = document.querySelector(`.ketone-unit-${recordId}`);
        const timeDiv = document.querySelector(`.time-${recordId}`);

        glucoseSpan.innerHTML = `<input type="number" step="0.1" class="glucose-input-${recordId} edit-input-field">`;
        glucoseUnitSpan.innerHTML = `<select class="glucose-unit-input-${recordId} edit-input-field">
                                        <option value="mmol/L">mmol/L</option>
                                        <option value="mg/dL">mg/dL</option>
                                    </select>`;
        ketonesSpan.innerHTML = `<input type="number" step="0.1" class="ketone-input-${recordId} edit-input-field">`;
        ketonesUnitSpan.innerHTML = `<select class="ketone-unit-input-${recordId} edit-input-field">
                                        <option value="mmol/L">mmol/L</option>
                                        <option value="mg/dL">mg/dL</option>
                                    </select>`;
        timeDiv.innerHTML = `<input type="datetime-local" class="time-input-${recordId} edit-time-input">`;

        // Remove THIS handler (enterEditMode)
        button.removeEventListener("click", enterEditMode);

        // Create save handler
        const saveHandler = async () => {
            const newGlucose = document.querySelector(`.glucose-input-${recordId}`).value;
            const newGlucoseUnit = document.querySelector(`.glucose-unit-input-${recordId}`).value;
            const newKetone = document.querySelector(`.ketone-input-${recordId}`).value;
            const newKetoneUnit = document.querySelector(`.ketone-unit-input-${recordId}`).value;
            const newTime = document.querySelector(`.time-input-${recordId}`).value;

            const data = {
                glucose: newGlucose,
                glucose_unit: newGlucoseUnit,
                ketone: newKetone,
                ketone_unit: newKetoneUnit,
                measurement_time: newTime
            };

            const filtered = Object.fromEntries(
                Object.entries(data).filter(([_, v]) => v != null && v !== "")
            );

            await fetch(`${host_url}/api/gk/${recordId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filtered)
            });

            // re-render here
            renderStats()
        };

        // Store handler on the element so we can remove it later if needed
        button._saveHandler = saveHandler;

        // Add save handler
        button.addEventListener("click", saveHandler);
    }
}

setNowAsDefaultTime()
renderStats()
addNewRecordFunctionality()
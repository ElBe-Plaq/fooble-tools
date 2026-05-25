import {TIMEZONE_OPTIONS} from "./timezone-zones.js";
import {
    formatInTimeZone,
    formatLongInTimeZone,
    toUtcMillis,
} from "./timezone-utils.js";

const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const fromSelect = document.getElementById("from-timezone");
const toSelect = document.getElementById("to-timezone");
const outputInput = document.getElementById("output");
const metaOutput = document.getElementById("meta");
const statusEl = document.getElementById("status");
const nowBtn = document.getElementById("now-btn");
const swapBtn = document.getElementById("swap-btn");
const copyBtn = document.getElementById("copy-btn");
const clearBtn = document.getElementById("clear-btn");

function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.className = "status";
    if (type) statusEl.classList.add(type);
}

function fillTimezones() {
    TIMEZONE_OPTIONS.forEach((tz) => {
        const option = document.createElement("option");
        option.value = tz;
        option.textContent = tz.replace("_", " ");
        fromSelect.appendChild(option.cloneNode(true));
        toSelect.appendChild(option);
    });
}

function setDefaultTimezones() {
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    fromSelect.value = TIMEZONE_OPTIONS.includes(local) ? local : "UTC";
    toSelect.value = fromSelect.value === "UTC" ? "Europe/London" : "UTC";
}

function getDateParts() {
    if (!dateInput.value || !timeInput.value) return null;

    const [year, month, day] = dateInput.value.split("-").map(Number);
    const [hour, minute] = timeInput.value.split(":").map(Number);

    if ([year, month, day, hour, minute].some((value) => Number.isNaN(value))) {
        return null;
    }

    return {year, month, day, hour, minute};
}

function updateConversion() {
    const parts = getDateParts();
    if (!parts) {
        outputInput.value = "";
        metaOutput.textContent = "";
        setStatus("Choose a date and time to begin...");
        return;
    }

    try {
        const utcMillis = toUtcMillis(parts, fromSelect.value);
        const shortFormat = formatInTimeZone(utcMillis, toSelect.value);
        const longFormat = formatLongInTimeZone(utcMillis, toSelect.value);

        outputInput.value = shortFormat;
        metaOutput.textContent = longFormat;
        setStatus("Conversion updated.", "success");
    } catch (error) {
        outputInput.value = "";
        metaOutput.textContent = "";
        setStatus("Unable to convert with the selected timezones!", "error");
    }
}

function setNow() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: fromSelect.value,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    const parts = formatter.formatToParts(now);
    const map = Object.fromEntries(
        parts
            .filter((part) => part.type !== "literal")
            .map((part) => [part.type, part.value])
    );

    dateInput.value = `${map.year}-${map.month}-${map.day}`;
    timeInput.value = `${map.hour}:${map.minute}`;
    updateConversion();
}

function swapTimezones() {
    const from = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = from;
    updateConversion();
}

async function copyOutput() {
    const value = outputInput.value.trim();
    if (!value) {
        setStatus("Nothing to copy yet!", "error");
        return;
    }

    try {
        await navigator.clipboard.writeText(value);
        setStatus("Converted time copied!", "success");
    } catch (error) {
        setStatus("Unable to copy to clipboard!", "error");
    }
}

function clearAll() {
    dateInput.value = "";
    timeInput.value = "";
    outputInput.value = "";
    metaOutput.textContent = "";
    setStatus("Choose a date and time to begin...");
}

fillTimezones();
setDefaultTimezones();
setNow();

[dateInput, timeInput, fromSelect, toSelect].forEach((input) => {
    input.addEventListener("input", updateConversion);
    input.addEventListener("change", updateConversion);
});

nowBtn.addEventListener("click", setNow);
swapBtn.addEventListener("click", swapTimezones);
copyBtn.addEventListener("click", copyOutput);
clearBtn.addEventListener("click", clearAll);


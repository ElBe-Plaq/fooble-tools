import {
    MAX_ROMAN_VALUE,
    fromRoman,
    isValidRoman,
    normalizeRoman,
    toRoman,
} from "./roman-utils.js";

const decimalInput = document.getElementById("decimal-input");
const romanInput = document.getElementById("roman-input");
const statusEl = document.getElementById("status");
const copyNumberBtn = document.getElementById("copy-number");
const copyRomanBtn = document.getElementById("copy-roman");
const clearBtn = document.getElementById("clear-btn");

let isSyncing = false;

function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.className = "status";
    if (type) statusEl.classList.add(type);
}

function setValue(input, value) {
    isSyncing = true;
    input.value = value;
    isSyncing = false;
}

function handleDecimalInput() {
    if (isSyncing) return;

    const raw = decimalInput.value.trim();
    if (!raw) {
        setValue(romanInput, "");
        setStatus("Enter a value to begin...");
        return;
    }

    const number = Number(raw);
    if (!Number.isInteger(number)) {
        setValue(romanInput, "");
        setStatus("Numbers must be whole integers!", "error");
        return;
    }

    if (number < 1 || number > MAX_ROMAN_VALUE) {
        setValue(romanInput, "");
        setStatus(`Use a number between 1 and ${MAX_ROMAN_VALUE}!`, "error");
        return;
    }

    const roman = toRoman(number);
    setValue(romanInput, roman || "");
    setStatus(`Converted ${number} to ${roman}.`, "success");
}

function handleRomanInput() {
    if (isSyncing) return;

    const normalized = normalizeRoman(romanInput.value.trim());
    if (!normalized) {
        setValue(decimalInput, "");
        setStatus("Enter a value to begin...");
        return;
    }

    if (romanInput.value !== normalized) {
        setValue(romanInput, normalized);
    }

    if (!isValidRoman(normalized)) {
        setValue(decimalInput, "");
        setStatus("Enter a valid Roman numeral!", "error");
        return;
    }

    const number = fromRoman(normalized);
    if (!number) {
        setValue(decimalInput, "");
        setStatus("Enter a valid Roman numeral!", "error");
        return;
    }

    setValue(decimalInput, number);
    setStatus(`Converted ${normalized} to ${number}.`, "success");
}

async function copyValue(value, label) {
    if (!value) {
        setStatus(`Nothing to copy for ${label}!`, "error");
        return;
    }

    try {
        await navigator.clipboard.writeText(String(value));
        setStatus(`${label} copied to clipboard!`, "success");
    } catch (error) {
        const textarea = document.createElement("textarea");
        textarea.value = String(value);
        textarea.setAttribute("readonly", "");
        textarea.style.position = "absolute";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();

        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);

        if (copied) {
            setStatus(`${label} copied to clipboard!`, "success");
        } else {
            setStatus(`Unable to copy ${label}!`, "error");
        }
    }
}

function clearAll() {
    setValue(decimalInput, "");
    setValue(romanInput, "");
    setStatus("Enter a value to begin...");
}

decimalInput.addEventListener("input", handleDecimalInput);
romanInput.addEventListener("input", handleRomanInput);

copyNumberBtn.addEventListener("click", () => {
    copyValue(decimalInput.value.trim(), "Number");
});

copyRomanBtn.addEventListener("click", () => {
    copyValue(romanInput.value.trim(), "Roman numeral");
});

clearBtn.addEventListener("click", clearAll);

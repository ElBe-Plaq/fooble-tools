export const MAX_ROMAN_VALUE = 3999;

const ROMAN_MAP = [
    {value: 1000, symbol: "M"},
    {value: 900, symbol: "CM"},
    {value: 500, symbol: "D"},
    {value: 400, symbol: "CD"},
    {value: 100, symbol: "C"},
    {value: 90, symbol: "XC"},
    {value: 50, symbol: "L"},
    {value: 40, symbol: "XL"},
    {value: 10, symbol: "X"},
    {value: 9, symbol: "IX"},
    {value: 5, symbol: "V"},
    {value: 4, symbol: "IV"},
    {value: 1, symbol: "I"},
];

const ROMAN_REGEX =
    /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;

export function normalizeRoman(value) {
    return value.toUpperCase().replace(/\s+/g, "");
}

export function isValidRoman(value) {
    if (!value) return false;
    return ROMAN_REGEX.test(value);
}

export function toRoman(number) {
    if (!Number.isInteger(number) || number < 1 || number > MAX_ROMAN_VALUE) {
        return null;
    }

    let remaining = number;
    let result = "";

    for (const entry of ROMAN_MAP) {
        while (remaining >= entry.value) {
            result += entry.symbol;
            remaining -= entry.value;
        }
    }

    return result;
}

export function fromRoman(raw) {
    const value = normalizeRoman(raw);
    if (!isValidRoman(value)) return null;

    let total = 0;
    let index = 0;

    while (index < value.length) {
        const current = value[index];
        const next = value[index + 1];
        const pair = next ? current + next : null;
        const pairValue = ROMAN_MAP.find((entry) => entry.symbol === pair);

        if (pairValue) {
            total += pairValue.value;
            index += 2;
            continue;
        }

        const singleValue = ROMAN_MAP.find((entry) => entry.symbol === current);
        if (!singleValue) return null;

        total += singleValue.value;
        index += 1;
    }

    return total;
}


const DATE_PARTS = ["year", "month", "day", "hour", "minute", "second"];

export function getTimeZoneOffset(date, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    const parts = formatter.formatToParts(date);
    const values = Object.fromEntries(
        parts
            .filter((part) => DATE_PARTS.includes(part.type))
            .map((part) => [part.type, part.value])
    );

    const asUTC = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second)
    );

    return (asUTC - date.getTime()) / 60000;
}

export function toUtcMillis({year, month, day, hour, minute}, timeZone) {
    const initialUTC = Date.UTC(year, month - 1, day, hour, minute, 0);
    const offsetMinutes = getTimeZoneOffset(new Date(initialUTC), timeZone);
    return initialUTC - offsetMinutes * 60000;
}

export function formatInTimeZone(utcMillis, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    return formatter.format(new Date(utcMillis));
}

export function formatLongInTimeZone(utcMillis, timeZone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZoneName: "short",
    });

    return formatter.format(new Date(utcMillis));
}


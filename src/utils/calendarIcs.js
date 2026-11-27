// Pure client-side RFC 5545 .ics calendar reminder generator (Zero-Login, Zero-Server, PDPA-Safe)

function escapeIcsText(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function formatUtcTimestamp(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
}

/**
 * Generates and downloads a standard .ics calendar event directly in the browser.
 * @param {{ title: string, isoDate: string, description?: string }} params
 */
export function downloadCalendarReminderIcs({ title, isoDate, description = '' }) {
  const cleanTitle = String(title || '').trim() || 'PROTECT360 Risk Coverage Review';
  const dateMatch = String(isoDate || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const now = new Date();
  const y = dateMatch ? dateMatch[1] : String(now.getFullYear());
  const m = dateMatch ? dateMatch[2] : String(now.getMonth() + 1).padStart(2, '0');
  const d = dateMatch ? dateMatch[3] : String(now.getDate()).padStart(2, '0');

  // Floating local time 09:00 - 09:30 on the chosen date so it opens cleanly in Apple/Google/Outlook Calendar
  const dtStart = `${y}${m}${d}T090000`;
  const dtEnd = `${y}${m}${d}T093000`;
  const dtStamp = formatUtcTimestamp(now);
  const uid = `protect360-${y}${m}${d}-${Date.now()}@protect360.local`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PROTECT360//Neutral Risk & Financial Coach//TH',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(cleanTitle)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(cleanTitle)}`,
    'TRIGGER:-PT30M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const icsContent = `${lines.join('\r\n')}\r\n`;
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `protect360-reminder-${y}-${m}-${d}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return link.download;
}

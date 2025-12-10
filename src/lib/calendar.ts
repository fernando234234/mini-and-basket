// Calendar Event Generator - ICS File Creation

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  url?: string;
}

// Camp dates: June 29 - July 6, 2025
const CAMP_START = new Date(2025, 5, 29, 10, 0, 0); // June 29, 2025, 10:00 AM
const CAMP_END = new Date(2025, 6, 6, 16, 0, 0);    // July 6, 2025, 4:00 PM

export function generateCalendarEvent(): CalendarEvent {
  return {
    title: "Mini & Basket Camp 2025 🏀",
    description: `Mini & Basket Camp 2025 - Una settimana di basket, mare e divertimento!\n\nCheck-in: 29 Giugno alle 10:00\nCheck-out: 6 Luglio alle 16:00\n\nCosa portare:\n- Abbigliamento sportivo\n- Costume da bagno\n- Scarpe da basket\n- Crema solare\n- Documento d'identità\n\nPer informazioni: info@miniandbasketcamp.it`,
    location: "Villaggio Residence Bahja, Via Lungomare, 87027 Paola (CS), Italia",
    startDate: CAMP_START,
    endDate: CAMP_END,
    url: "https://miniandbasketcamp.it",
  };
}

function formatDateForICS(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

export function generateICSContent(event: CalendarEvent): string {
  const uid = `camp-2025-${Date.now()}@miniandbasketcamp.it`;
  const now = formatDateForICS(new Date());
  
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mini & Basket Camp//Camp Registration//IT',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Mini & Basket Camp 2025',
    'X-WR-TIMEZONE:Europe/Rome',
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Rome',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0200',
    'TZNAME:CEST',
    'DTSTART:19700329T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0200',
    'TZOFFSETTO:+0100',
    'TZNAME:CET',
    'DTSTART:19701025T030000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Europe/Rome:${formatDateForICS(event.startDate)}`,
    `DTEND;TZID=Europe/Rome:${formatDateForICS(event.endDate)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    event.url ? `URL:${event.url}` : '',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Mini & Basket Camp inizia tra una settimana!',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    'DESCRIPTION:Mini & Basket Camp inizia domani!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  
  return lines.join('\r\n');
}

export function downloadCalendarFile(event: CalendarEvent): void {
  const icsContent = generateICSContent(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mini-basket-camp-2025.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// For adding to Google Calendar
export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const formatForGoogle = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatForGoogle(event.startDate)}/${formatForGoogle(event.endDate)}`,
    details: event.description,
    location: event.location,
    ctz: 'Europe/Rome',
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// For adding to Outlook Calendar
export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const formatForOutlook = (date: Date): string => {
    return date.toISOString();
  };
  
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: formatForOutlook(event.startDate),
    enddt: formatForOutlook(event.endDate),
    body: event.description,
    location: event.location,
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}
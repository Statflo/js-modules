import { CalendarEventConfig } from '../types';
import { getDefaultConfig } from '../util';

export default function ics(CalendarEventConfig: CalendarEventConfig): string {
    const config = getDefaultConfig(CalendarEventConfig);

    return encodeURI(
        'data:text/calendar;charset=utf8,' + [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'BEGIN:VEVENT',
            `URL:${config.url}`,
            `DTSTART:${config.start}`,
            `DTEND:${config.end}`,
            `SUMMARY:${config.title}`,
            `DESCRIPTION:${config.description}`,
            `LOCATION:${config.location}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\n')
    );
}

import { CalendarEventConfig } from '../types';
import { getDefaultConfig } from '../util';

export default function google(CalendarEventConfig: CalendarEventConfig): string {
    const config = getDefaultConfig(CalendarEventConfig);

    return encodeURI([
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        `&text=${config.title}`,
        `&dates=${config.start}`,
        `/${config.end}`,
        `&details=${config.description}`,
        `&location=${config.location}`,
        `&sprop=&sprop=name:`
    ].join(''));
}

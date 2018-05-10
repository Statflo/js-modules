import googleService from './services/google';
import icsService from './services/ics';
import {
    CalendarServices,
    CreateCalendarEvent
} from './types';

export const google = googleService;
export const ics = icsService;

export const services = {
    [CalendarServices.GOOGLE]: google,
    [CalendarServices.ICS]: ics,
    [CalendarServices.ICAL]: ics,
    [CalendarServices.APPLE]: ics,
    [CalendarServices.OUTLOOK]: ics
};

export function createCalendarEvent({ service, ...config }: CreateCalendarEvent): string {
    return services[service](config);
};

export default createCalendarEvent;

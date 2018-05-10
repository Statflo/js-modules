export enum CalendarServices {
    GOOGLE = 'google',
    ICS = 'ics',
    ICAL = 'ical',
    APPLE = 'apple',
    OUTLOOK = 'outlook',
};

export type CalendarServiceTypes =
    | CalendarServices.GOOGLE
    | CalendarServices.ICS
    | CalendarServices.ICAL
    | CalendarServices.APPLE
    | CalendarServices.OUTLOOK;

export type DateArgument = Date | string;

export interface CalendarEventConfig {
    start: DateArgument;
    end?: DateArgument;
    title?: string;
    location?: string;
    description?: string;
    url?: string;
}

export interface CreateCalendarEvent extends CalendarEventConfig {
    service: CalendarServiceTypes;
}

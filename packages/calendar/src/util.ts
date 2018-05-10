import { DateArgument, CalendarEventConfig } from './types';

const timePattern = /-|:|\.\d+/g;
const checkISODateEligibility = (date: DateArgument): string => date instanceof Date ? date.toISOString() : date;
const formatTime = (date: DateArgument): string => checkISODateEligibility(date).replace(timePattern, '');

export const getDefaultConfig = (config: CalendarEventConfig): CalendarEventConfig => ({
    title: '',
    location: '',
    description: '',
    url: '',
    ...config,
    start: config.start ? formatTime(config.start) : '',
    end: config.end ? formatTime(config.end) : '',
});

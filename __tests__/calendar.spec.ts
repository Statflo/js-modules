import createCalendarEvent, { google, ics, services } from '@statflo/calendar';
import { CalendarEventConfig, CalendarServices, CalendarServiceTypes } from '@statflo/calendar/src/types';

enum TestTopic {
    GOOGLE = 'Google Calendar',
    ICS = 'Apple Calendar and Outlook'
}

const requiredConfig: CalendarEventConfig =  {
    start: '2018-05-10T02:00:26.578Z',
};

const requiredConfigDate: CalendarEventConfig = {
    start: new Date(requiredConfig.start)
};

const fullConfig: CalendarEventConfig = {
    ...requiredConfig,
    end: '2018-05-10T02:09:08.138Z',
    title: 'Foobar',
    location: '1 Yonge St, Toronto - ON - Canada',
    description: 'Monthly potluck',
    url: 'https://www.statflo.com'
};

const fullConfigDate: CalendarEventConfig = {
    ...fullConfig,
    ...requiredConfigDate,
    end: new Date(fullConfig.end)
};


describe('@statflo/calendar', () => {

    describe('ISO string dates', () => {
        describe(TestTopic.GOOGLE, () => {
            it('should run required config', () => {
                 expect(google(requiredConfig)).toMatchSnapshot();
            });

            it('should run full config', () => {
                expect(google(fullConfig)).toMatchSnapshot();
            });
        });

        describe(TestTopic.ICS, () => {
            it('should run required config', () => {
                expect(ics(requiredConfig)).toMatchSnapshot();
            });

            it('should run full config', () => {
                expect(ics(fullConfig)).toMatchSnapshot();
            });
        });
    });

    describe('Date class', () => {
        describe(TestTopic.GOOGLE, () => {
            it('should run required config', () => {
                expect(google(requiredConfigDate)).toMatchSnapshot();
            });

            it('should run full config', () => {
                expect(google(fullConfigDate)).toMatchSnapshot();
            });
        });

        describe(TestTopic.ICS, () => {
            it('should run required config', () => {
                expect(ics(requiredConfigDate)).toMatchSnapshot();
            });

            it('should run full config', () => {
                expect(ics(fullConfigDate)).toMatchSnapshot();
            });
        });
    });

    describe('Module integration', () => {
        it('Should follow module shape', () => {
            expect(google).toBeInstanceOf(Function);
            expect(ics).toBeInstanceOf(Function);
            expect(createCalendarEvent).toBeInstanceOf(Function);

            for (let service in CalendarServices) {
                expect(services[CalendarServices[service]]).toBeInstanceOf(Function);
            }
        });

        it('Should run createCalendarEvent with all service scenarios', () => {
            for (let service in CalendarServices) {
                expect(createCalendarEvent({
                    service: CalendarServices[service] as CalendarServiceTypes,
                    start: requiredConfig.start
                })).toBe(services[CalendarServices[service]]({
                    start: requiredConfig.start
                }));
            }
        });
    });
});

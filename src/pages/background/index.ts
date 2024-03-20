import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
interface userEvent {
  time: string;
  summary: string;
  hangoutLink?: string;
  htmlLink: string;
}
chrome.runtime.onInstalled.addListener(async function () {
  await chrome.storage.sync.set({ userCalendarEvents: [] });
  await init();
});
chrome.runtime.onStartup.addListener(async function () {
  await init();
});
const init = async () => {
  chrome.identity.clearAllCachedAuthTokens(()=>{
    console.log('renoive')
  });
  await chrome.action.setBadgeBackgroundColor({ color: "#294fa7" });
  const token = await chrome.identity.getAuthToken({ interactive: true });
  console.log(token)
  await chrome.storage.sync.set({ userToken: token.token });
  const userEvents = await fetchEvents(token.token);
  updateBadge(userEvents)();

  //User chrome.alarms API to schedule badge update instead of setInterval
  await checkAlarmState();
};
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "updateBadeAlarm") {
    const storageItem = await chrome.storage.sync.get(["userCalendarEvents"]);
    let userCalendarEvents: userEvent[] = storageItem.userCalendarEvents || [];

    const updatedEvents = userCalendarEvents?.filter((event) => {
      const eventTime = new Date(event.time).getTime();
      return eventTime >= Date.now();
    });
    if (updatedEvents.length !== userCalendarEvents.length) {
      await chrome.storage.sync.set({ userCalendarEvents: updatedEvents });
      chrome.runtime.sendMessage({ action: "updateDisplayEvents" });
      userCalendarEvents = updatedEvents;
    }
    await updateBadge(userCalendarEvents)();
  }
});
const STORAGE_KEY = "alarm-enabled";

async function checkAlarmState() {
  const { alarmEnabled } = await chrome.storage.sync.get(STORAGE_KEY);
  if (alarmEnabled) {
    const alarm = await chrome.alarms.get("updateBadgeAlarm");

    if (!alarm) {
      await chrome.alarms.create("updateBadeAlarm", { periodInMinutes: 1 });
      await chrome.storage.sync.set({ STORAGE_KEY: "alarmEnabled" });
    }
  } else {
    await chrome.alarms.create("updateBadeAlarm", { periodInMinutes: 1 });
    await chrome.storage.sync.set({ STORAGE_KEY: "alarmEnabled" });
  }
}
const fetchEvents = async (token:string | undefined): Promise<userEvent[]> => {
  try {
    const storageItem = await chrome.storage.sync.get([
      "userToken",
      "userCalendarEvents",
    ]);
    // const token = storageItem.userToken;
    // const 
    let userCalendarEvents: userEvent[] = storageItem.userCalendarEvents || [];
    if (token != "") {
      const headers = new Headers({
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      });

      const queryParams = {
        headers,
        method: "GET",
      };

      const currentTime = new Date().toISOString();

      const fetchURL = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(
        currentTime
      )}`;

      const response = await fetch(fetchURL, queryParams);

      const data = await response.json();
      const items = data?.items?.filter(
        (item: { status: string; start: { dateTime: any } }) =>
          item.status !== "cancelled" && item.start && item.start.dateTime
      );
        
      const recurrenceEvents = fetchRecurrenceEvents(items);
      const currentEvents = items?.filter(
        (item: { start: { dateTime: number } }) =>
          String(item.start.dateTime) >= currentTime
      );
      console.log('events',currentEvents)
      const newEvents = extractProperties(currentEvents);
      const allEvents = recurrenceEvents.concat(newEvents);
      const areEventsEqual = (event1: userEvent, event2: userEvent) => {
        // Implement your logic here to determine if two events are equal
        // For example, compare event start time or any other unique identifier
        return event1.summary === event2.summary;
      };

      // Filter out duplicate events
      const allEventsWithoutDuplicates = allEvents?.filter(
        (event, index, self) => {
          // Check if the current event is the first occurrence in the array or not equal to any previous event
          return (
            index ===
            self.findIndex((otherEvent) => areEventsEqual(event, otherEvent))
          );
        }
      );

      userCalendarEvents = [...allEventsWithoutDuplicates];
      userCalendarEvents = userCalendarEvents?.filter((event) => {
        const eventTime = new Date(event.time).getTime();
        return eventTime >= Date.now();
      });
      console.log('userCalendarEvents:',userCalendarEvents)
      await chrome.storage.sync.set({ userCalendarEvents: userCalendarEvents });
      updateBadge(userCalendarEvents)();
      //chrome.runtime.sendMessage({ action: "displayEvents" });
    }

    return userCalendarEvents;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

const updateBadge = (userEvents: userEvent[]) => {
  return async () => {
    let minDays = Infinity;
    let minHours = Infinity;
    let minMinutes = Infinity;

    if (userEvents.length) {
      userEvents.forEach((event) => {
        const startDate = new Date(event.time).getTime();
        const diff = startDate - Date.now();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days < minDays) {
          minDays = days;
          minHours = hours;
          minMinutes = minutes;
        } else if (days === minDays && hours < minHours) {
          minHours = hours;
          minMinutes = minutes;
        } else if (
          days === minDays &&
          hours === minHours &&
          minutes < minMinutes
        ) {
          minMinutes = minutes;
        }
      });
    }
    let badgeText = "";
    if (minDays > 0) {
      badgeText = minDays.toString() + "d";
    } else if (minHours > 0) {
      badgeText = minHours.toString() + "h";
    } else {
      badgeText = minMinutes.toString() + "m";
    }
    if (badgeText === "Infinityd") {
      badgeText = "";
    }
    await chrome.action.setBadgeText({ text: badgeText });
  };
};

function extractProperties(events: any[]) {
  return events?.map((event) => {
    return {
      time: event.start.dateTime,
      summary: event.summary,
      hangoutLink: event.hangoutLink? event.hangoutLink : event.location? event.location: null,
      htmlLink: event.htmlLink
    };
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message action is to fetch events
  if (message.action === "fetchEvents") {
    // Call the function to fetch events
    //fetchEvents();
  }
});

const fetchRecurrenceEvents = (items: any): userEvent[] => {
  const currentTime = new Date();
  const filteredEvents = items?.filter(
    (event: { recurrence: string | any[]; start: { dateTime: string } }) => {
      // Check if the event has recurrence rule
      if (event.recurrence && event.recurrence.length > 0) {
        const recurrenceRule = event.recurrence[0];
        const untilMatch = recurrenceRule.match(/UNTIL=([0-9TZ]+)/); // Extract UNTIL date
        if (untilMatch) {
          const untilDateString = untilMatch[1];
          const untilYear = parseInt(untilDateString.substring(0, 4));
          const untilMonth = parseInt(untilDateString.substring(4, 6)) - 1; // Months are zero-indexed
          const untilDay = parseInt(untilDateString.substring(6, 8));
          const untilHour = parseInt(untilDateString.substring(9, 11));
          const untilMinute = parseInt(untilDateString.substring(11, 13));
          const untilSecond = parseInt(untilDateString.substring(13, 15));

          const untilDate = new Date(
            Date.UTC(
              untilYear,
              untilMonth,
              untilDay,
              untilHour,
              untilMinute,
              untilSecond
            )
          );
          //const untilDate = String(new Date(untilDateString));
          // Remove event if UNTIL date is before current time
          if (untilDate.getTime() < Date.now()) {
            return false;
          }
        }
      }
      // Include the event if it doesn't have a recurrence rule
      return true;
    }
  );

  const recurrenceEvents = filteredEvents?.map((event: any) => {
    const { recurrence, start } = event;
    if (recurrence && recurrence.length > 0) {
      const r: string = recurrence[0];
      const rule = RRule.fromString(r);
      const customRule = new RRule({
        ...rule.origOptions,
        dtstart: new Date(start.dateTime),
      });
      //const occurrences = customRule.all()
      const time = customRule.after(currentTime, true)?.toISOString();
      return {
        summary: event.summary,
        time,
        hangoutLink: event.hangoutLink? event.hangoutLink : event.location? event.location: null,
        htmlLink: event.htmlLink
      };
    }
    return null; // Return null if recurrence array is empty
  });

  return recurrenceEvents?.filter((event: any) => event !== null);
};

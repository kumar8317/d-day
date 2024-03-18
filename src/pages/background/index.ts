import { datetime, RRule, RRuleSet, rrulestr } from "rrule";
interface userEvent {
  time: string;
  summary: string;
}
chrome.runtime.onInstalled.addListener(async function () {
  await chrome.storage.sync.set({ userCalendarEvents: [] });
  await init();
});
chrome.runtime.onStartup.addListener(async function () {
  await init();
});
const init = async () => {
  await chrome.action.setBadgeBackgroundColor({ color: "#294fa7" });
  const token = await chrome.identity.getAuthToken({ interactive: true });
  //await registerWebhook(token.token? token.token:'')
  //await gcm(token.token? token.token:'');
  await chrome.storage.sync.set({ userToken: token.token });
  const userEvents = await fetchEvents();
  updateBadge(userEvents)();
  updateBadgePeriodically(userEvents);
};

const fetchEvents = async (): Promise<userEvent[]> => {
  try {
    const storageItem = await chrome.storage.sync.get([
      "userToken",
      "userCalendarEvents",
    ]);
    const token = storageItem.userToken;
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

      const newEvents = extractProperties(currentEvents);
      const allEvents = recurrenceEvents.concat(newEvents);
      const areEventsEqual = (event1: userEvent, event2: userEvent) => {
        // Implement your logic here to determine if two events are equal
        // For example, compare event start time or any other unique identifier
        return event1.summary === event2.summary;
      };
      
      // Filter out duplicate events
      const allEventsWithoutDuplicates = allEvents?.filter((event, index, self) => {
        // Check if the current event is the first occurrence in the array or not equal to any previous event
        return index === self.findIndex(otherEvent => areEventsEqual(event, otherEvent));
      });

      userCalendarEvents = [...allEventsWithoutDuplicates];
      userCalendarEvents = userCalendarEvents?.filter((event) => {
        const eventTime = new Date(event.time).getTime();
        return eventTime >= Date.now();
      });
      await chrome.storage.sync.set({ userCalendarEvents: userCalendarEvents });
      updateBadge(userCalendarEvents)();
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
      //remove this event

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

    if (minDays <= 0 && minHours <= 0 && minMinutes <= 0) {
      const updatedEvents = userEvents?.filter((event) => {
        const eventTime = new Date(event.time).getTime();
        return eventTime >= Date.now();
      });
      if (updatedEvents.length !== userEvents.length) {
        await chrome.storage.sync.set({ userCalendarEvents: updatedEvents });
        userEvents = updatedEvents;
      }
    }

    chrome.action.setBadgeText({ text: badgeText });
  };
};

const updateBadgePeriodically = async (userEvents: userEvent[]) => {
  setInterval(updateBadge(userEvents), 60000);
};

function extractProperties(events: any[]) {
  return events.map((event) => {
    return {
      time: event.start.dateTime,
      summary: event.summary,
    };
  });
}

// const registerWebhook = async (token: string) => {
//   if (token !== "") {
//     const watchUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/watch`;
//     const headers = new Headers({
//       Authorization: "Bearer " + token,
//       "Content-Type": "application/json",
//     });
//     const storageItem = await chrome.storage.sync.get(["channelId"]);
//     const channel = storageItem.channelId;
//     let channelId = "";
//     // if(channel){
//     //   channelId = channel;
//     // }else{
//     //   channelId = crypto.randomUUID();
//     //   await chrome.storage.sync.set({ channelId: channelId });
//     // }
//     channelId = crypto.randomUUID();
//     // Generate a unique channel ID
//     const requestBody = {
//       id: channelId,
//       type: "web_hook",
//       address:
//         "https://515b-2405-201-601f-60bc-d3bc-69b5-6113-5cbf.ngrok-free.app", // Your backend address
//       params: {
//         ttl: "604800", // Time-to-live in seconds (default is 7 days)
//       },
//     };

//     try {
//       const response = await fetch(watchUrl, {
//         method: "POST",
//         headers,
//         body: JSON.stringify(requestBody),
//       });
//       const data = await response.json();
//       // if (response.ok) {
//       //   console.log('Watch API call successful');
//       // } else {
//       //   console.error('Failed to call Watch API:', response.statusText);
//       // }
//     } catch (error) {
//       console.error("Error calling Watch API:", error);
//     }
//   }
// };

// const gcm = async (token: string) => {
//   await registerGCM(token);
// };

// const registerGCM = (token: string) => {
//   return new Promise((resolve, reject) => {
//     chrome.gcm.register(, async (registration_id) => {
//       console.log("registrationId", registration_id);

//       //send to backend
//       const url =
//         "https://515b-2405-201-601f-60bc-d3bc-69b5-6113-5cbf.ngrok-free.app/register";
//       const body = {
//         token,
//         registration_id,
//       };
//       try {
//         const response = await fetch(url, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(body),
//         });
//         const data = await response.json();
//         resolve(data);
//       } catch (error) {
//         //console.log(error)
//         //reject(error)
//       }
//     });
//   });
// };

// chrome.gcm.onMessage.addListener(async function (message) {
//   console.log("message", message);
//   fetchEvents();
// });

// interface FetchEventsOptions {
//   timeMin: string;
//   orderBy?: string;
// }

// const fetchCalendarEvents = async (
//   options: FetchEventsOptions
// ): Promise<any> => {
//   try {
//     const storageItem = await chrome.storage.sync.get([
//       "userToken",
//       "userCalendarEvents",
//     ]);
//     const token = storageItem.userToken;

//     if (!token) {
//       throw new Error("User token not found.");
//     }
//     const baseURL =
//       "https://www.googleapis.com/calendar/v3/calendars/primary/events";
//     const fetchURL =
//       `${baseURL}?timeMin=${encodeURIComponent(options.timeMin)}` +
//       (options.orderBy
//         ? `&orderBy=${encodeURIComponent(options.orderBy)}`
//         : "");

//     const headers = new Headers({
//       Authorization: "Bearer " + token,
//       "Content-Type": "application/json",
//     });

//     const config: RequestInit = {
//       method: "GET",
//       headers: Object.fromEntries(headers.entries()), // Extract headers as object
//     };

//     //const fetchURL = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(options.timeMin)}`;

//     const response = await fetch(fetchURL, config);
//     const data = await response.json();

//     return data;
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     throw error;
//   }
// };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Check if the message action is to fetch events
  if (message.action === "fetchEvents") {
    // Call the function to fetch events
    fetchEvents();
  }
});

const fetchRecurrenceEvents = (items: any): userEvent[] => {
  const currentTime = new Date();
  const filteredEvents = items?.filter(
    (event: { recurrence: string | any[]; start: { dateTime: string } }) => {
      // Check if the event has recurrence rule
      if (event.recurrence && event.recurrence.length > 0) {
        const recurrenceRule = event.recurrence[0];
        console.log("rrrr", recurrenceRule);
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

  const recurrenceEvents = filteredEvents.map((event: any) => {
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
      };
    }
    return null; // Return null if recurrence array is empty
  });

  return recurrenceEvents?.filter((event: any) => event !== null);
};

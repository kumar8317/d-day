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
  await chrome.storage.sync.set({ userToken: token.token });
  const userEvents = await fetchEvents();
  updateBadge(userEvents)()
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
      const items = data?.items.filter(
        (item: { status: string; start: { dateTime: any } }) =>
          item.status !== "cancelled" && item.start && item.start.dateTime
      );
      const currentEvents = items.filter(
        (item: { start: { dateTime: number } }) =>
          String(item.start.dateTime) >= currentTime
      );

      const newEvents = extractProperties(currentEvents);

      const filteredNewEvents = newEvents.filter(
        (newEvent) =>
          !userCalendarEvents.some(
            (existingEvent) => existingEvent.time === newEvent.time
          )
      );
      userCalendarEvents = [...userCalendarEvents, ...filteredNewEvents];
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

    if(minDays <= 0 && minHours <= 0 && minMinutes <= 0){
      const updatedEvents = userEvents.filter((event) => {
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

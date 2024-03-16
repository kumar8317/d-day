import { useState, useEffect } from "react";

interface Event {
  time: string;
  summary: string;
}

export default function Popup(): JSX.Element {
  const [events, setUserEvents] = useState<Event[]>([]);

  const fetchUserEvents = async () => {
    const storageItem = await chrome.storage.sync.get(["userCalendarEvents"]);
    const userCalendarEvents = storageItem.userCalendarEvents;
    console.log("user", userCalendarEvents);
    userCalendarEvents.sort((a: Event, b: Event) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });
    setUserEvents(userCalendarEvents);

    let minDays = Infinity;
    let minHours = Infinity;
    let minMinutes = Infinity;
    userCalendarEvents.forEach((event: Event) => {
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

    if (minDays > 0) {
      chrome.action.setBadgeText({ text: minDays.toString()+'d' });
    } else if (minHours > 0) {
      chrome.action.setBadgeText({ text: minHours.toString() + "h" });
    } else {
      chrome.action.setBadgeText({ text: minMinutes.toString() + "m" });
    }
  };
  useEffect(() => {
    fetchUserEvents();
  }, []);

  function calculateCountdown(startDate: Date) {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  }

  return (
    <div className="p-2">
      <h1 className="text-center"> Calendar Events </h1>
      {events.length ? (
        <div className="w-[200px]">
          {events.map((event, index) => {
            const startDate = new Date(event.time);
            const countdown = calculateCountdown(startDate);
            return (
              <div key={index} className="mb-2.5 p-[5px] rounded-[5px]">
                <div className="text-[#3366cc]">{event.summary}</div>
                <div className="text-[#cc6633]">{countdown}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <h1> No Events</h1>
        </>
      )}
    </div>
  );
}

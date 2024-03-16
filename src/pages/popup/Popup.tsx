import React, { useEffect } from "react";
import { useState } from "react";
import logo from "@assets/img/logo.svg";

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

  function getRemainingTime(datetime: string): {
    days: number;
    hours: number;
    minutes: number;
  } {
    const targetDate = new Date(datetime);
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const differenceMs = targetDate.getTime() - currentDate.getTime();

    // Calculate days, hours, and minutes
    const days = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  }

  function calculateCountdown(startDate: Date) {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  }

  // useEffect(() => {
  //   if (minEventTime !== Infinity) {
  //     console.log(minEventTime)
  //     chrome.action.setBadgeText({ text: minEventTime.toString() });
  //   } else {
  //     chrome.action.setBadgeText({ text: "NO" });
  //   }
  // }, [minEventTime]);

  return (
    <div className="p-2">
      {events.length ? (
        <div className="w-[200px]">
          {events.map((event, index) => {
            const startDate = new Date(event.time);
            const countdown = calculateCountdown(startDate);

            const days = parseInt(countdown.split(" ")[0]);
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

{
  /* <div className="fixed top-0 left-0 right-0 bottom-0 text-center bg-gray-600 overflow-y-auto">
<header className="flex flex-col items-center justify-center text-white">
  <h1>D-Day</h1>
</header>
<main className="p-3">
  <div className="max-h-[70vh] overflow-y-auto">
    {events.length ? (
      <div className="border-b-[1px] border-blue-900 mt-2">
        {events.map((event) => {
          const remTime = getRemainingTime(event.time);

          return (
            <div className="">
              <div className="mb-2">
                <span className="font-bold text-lg">{event.name}</span>
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <span className="text-blue-500">
                    {remTime.days} days
                  </span>
                </div>
                <div className="mr-4">
                  <span className="text-green-500">
                    {remTime.hours} hours
                  </span>
                </div>
                <div>
                  <span className="text-purple-500">
                    {remTime.minutes} minutes
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <></>
    )}
  </div>

  <div>
    <input
      className="w-full inline-block border rounded box-border 
    shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] 
    mx-auto my-[13px] px-[9px] py-1.5 border-solid border-[#ccc]
    text-center text-[#21625c] font-semibold w-fit border-[#eaeaea]"
      type="text"
      placeholder="Enter event name"
      onChange={(e) => setEventName(e.target.value)}
      value={eventName}
    />
    <input
      type="datetime-local"
      id="start"
      className="w-full inline-block border 
    rounded box-border
     shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] 
     mx-auto  px-[9px] border-solid border-[#ccc]"
      value={eventTime}
      onChange={(e) => setEventTime(e.target.value)}
    />
    <button
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold mt-2 py-1 px-4 rounded"
      onClick={() => handleSave()}
    >
      Save
    </button>
  </div>
</main>
</div> */
}

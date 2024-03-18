import { useState, useEffect } from "react";

interface Event {
  time: string;
  summary: string;
}

export default function Popup(): JSX.Element {
  const [events, setUserEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchUserEvents = async () => {
    
    const storageItem = await chrome.storage.sync.get(["userCalendarEvents"]);
    const userCalendarEvents = storageItem.userCalendarEvents;
    userCalendarEvents.sort((a: Event, b: Event) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB;
    });
    setUserEvents(userCalendarEvents);
    
    // let minDays = Infinity;
    // let minHours = Infinity;
    // let minMinutes = Infinity;
    // userCalendarEvents.forEach((event: Event) => {
    //   const startDate = new Date(event.time).getTime();
    //   const diff = startDate - Date.now();
    //   const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    //   const hours = Math.floor(
    //     (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    //   );
    //   const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
    //   if (days < minDays) {
    //     minDays = days;
    //     minHours = hours;
    //     minMinutes = minutes;
    //   } else if (days === minDays && hours < minHours) {
    //     minHours = hours;
    //     minMinutes = minutes;
    //   } else if (
    //     days === minDays &&
    //     hours === minHours &&
    //     minutes < minMinutes
    //   ) {
    //     minMinutes = minutes;
    //   }
    // });
  
    // let badgeText = '';
    // if (minDays > 0 && minDays !== Infinity) {
    //   badgeText = minDays.toString() + "d";
    // } else if (minHours > 0 && minHours !== Infinity) {
    //   badgeText = minHours.toString() + "h";
    // } else if (minMinutes > 0  && minMinutes !== Infinity) {
    //   badgeText = minMinutes.toString() + "m";
    // } else {
    //   badgeText = '';
    // }
  
    // chrome.action.setBadgeText({ text: badgeText });
    
  };
  
  useEffect(() => {
    fetchUserEvents();
  }, [events]);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.action === "updateDisplayEvents") {
        // Trigger fetching events when "displayEvents" message is received
        fetchUserEvents();
      }
    };

    // Add event listener for messages
    chrome.runtime.onMessage.addListener(handleMessage);

    // Cleanup the event listener
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  });

  function calculateCountdown(startDate: Date) {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m`;
  }
  const handleRefresh = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ action: "fetchEvents" });
    setLoading(false);
  };
  return (
    <div className="p-2 w-[200px] bg-bgPrimary">
      {events.length ? (
        <div className="">
          <h1 className="text-center text-persianOrange text-xl"> Calendar Events </h1>
          {events.map((event, index) => {
            const startDate = new Date(event.time);
            const countdown = calculateCountdown(startDate);
            return (
              <div key={index} className="mb-2.5 p-[5px] rounded-[5px]">
                <div className="text-aquaMarine">{event.summary}</div>
                <div className="text-persianOrange text-lg">{countdown}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <h1 className="text-center text-persianOrange"> No Calendar Events</h1>
        </>
      )}
      <button
          className="bg-persianOrange text-white px-3 py-1 rounded-md my-2 mx-auto block"
          onClick={handleRefresh}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
    </div>
  );
}

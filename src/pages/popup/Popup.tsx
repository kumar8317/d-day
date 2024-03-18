import { useState, useEffect } from "react";

interface Event {
  time: string;
  summary: string;
  hangoutLink?: string;
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

  const calculateCountdown = (startDate: Date) => {
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
  const checkImminentEvent = (startDate: Date) => {
    const now = new Date();
    const diff = startDate.getTime() - now.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    return minutes <= 5;
  }

  const hanldeJoinNow = (event: Event) => {
    if (event.hangoutLink) {
      window.open(event.hangoutLink);
    }
  }
  return (
    <div className="p-2 w-[200px] bg-bgPrimary">
      {events.length ? (
        <div className="">
          <h1 className="text-center text-persianOrange text-xl">
            {" "}
            Calendar Events{" "}
          </h1>
          {events.map((event, index) => {
            const startDate = new Date(event.time);
            const countdown = calculateCountdown(startDate);
            const isEventImminent = checkImminentEvent(startDate);
            return (
              <div key={index} className="mb-2.5 p-[5px] rounded-[5px] flex items-center">
                <div>
                  <div className="text-aquaMarine">{event.summary}</div>
                  <div className="text-persianOrange text-lg">{countdown}</div>
                </div>
               
                {isEventImminent && (
                  <button className="hover:text-red-500 text-aquaMarine px-2" onClick={()=>hanldeJoinNow(event)}>
                    <span className="">Join Now</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <>
          <h1 className="text-center text-persianOrange">
            {" "}
            No Calendar Events
          </h1>
        </>
      )}
      <button
        className="bg-persianOrange text-bgPrimary px-3 py-1 rounded-md my-2 mx-auto block"
        onClick={handleRefresh}
      >
        {loading ? "Refreshing..." : "Refresh"}
      </button>
    </div>
  );
}

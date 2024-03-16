import React from "react";
import { useState } from "react";
import logo from "@assets/img/logo.svg";

interface Event {
  name: string;
  time: string;
}

export default function Popup(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventName, setEventName] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");

  const handleSave = () => {
    const newEvent = {
      name: eventName,
      time: eventTime,
    };

    setEvents([...events, newEvent]);
    console.log(events);
    setEventName("");
    setEventTime("");
  };

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

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 text-center bg-gray-600 overflow-y-auto">
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
    </div>
  );
}

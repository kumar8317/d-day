chrome.runtime.onInstalled.addListener(async function(){
    await init();
})
chrome.runtime.onStartup.addListener(async function(){
    await init();
    //chrome.runtime.sendMessage({action: 'startUp'})
})
const init = async() => {
    console.log("Judgement Day extension installed");
    await chrome.action.setBadgeBackgroundColor({color: "#294fa7"});
   // await chrome.storage.sync.set({"userCalendarEvents":[]})
    const token  = await chrome.identity.getAuthToken({ 'interactive': true });

   console.log('token',token)

   await chrome.storage.sync.set({"userToken":token.token});
   await fetchEvents();
}

const fetchEvents = async() => {
    try {
        const storageItem = await chrome.storage.sync.get(['userToken']);
        const token  = storageItem.userToken;

        if(token!=''){
            const headers = new Headers({
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            });
    
            const queryParams = { 
                headers,
                'method': 'GET'
            };
    
            const currentTime = new Date().toISOString();

            const fetchURL = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(currentTime)}`;
    
            const response = await fetch(fetchURL, queryParams);
            
            const data = await response.json();
            console.log('data',data)
            const items = data?.items.filter((item: { status: string; start: { dateTime: any; }; }) =>
                item.status !== 'cancelled' && item.start && item.start.dateTime
            );
             console.log(';data',items)
    
            // // Filter events that have not yet occurred
             const itemsf = items.filter((item: { start: { dateTime: number; }; }) => String(item.start.dateTime) >= currentTime);
    
            const userEvents  = extractProperties(itemsf)
            // // Save filtered events to chrome storage
            await chrome.storage.sync.set({"userCalendarEvents": userEvents});
            await updateBadge(userEvents);
        }
    } catch (error) {
        console.error('Error fetching events:', error); 
    }
}
interface userEvent {
    time: string;
    summary: string;
  }
const updateBadge = async (userEvents: userEvent[]) => {
    console.log('called inside')
    let minDays = Infinity;
    let minHours = Infinity;
    let minMinutes = Infinity;
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

    let badgeText = "";
    if (minDays > 0) {
      badgeText = minDays.toString() + "d";
    } else if (minHours > 0) {
      badgeText = minHours.toString() + "h";
    } else {
      badgeText = minMinutes.toString() + "m";
    }

    chrome.action.setBadgeText({ text: badgeText });
}

function extractProperties(events: any[]) {
    return events.map(event => {
        return {
            time: event.start.dateTime,
            summary: event.summary
        };
    });
}
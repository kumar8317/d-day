console.log('background script loaded');
chrome.runtime.onInstalled.addListener(async function(){
    await init();
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
        }
    } catch (error) {
        console.error('Error fetching events:', error); 
    }
}

function extractProperties(events: any[]) {
    return events.map(event => {
        return {
            time: event.start.dateTime,
            summary: event.summary
        };
    });
}
self.addEventListener('push', async function(event) {
  console.log('Received a push message', event);

  let permission = Notification.permission;
  const body = event.data?.text();

  if(permission !== 'denied' && permission !== 'granted')
    permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    event.waitUntil(
      self.registration.showNotification('Habit', {
        body
      })
    );
  }
});
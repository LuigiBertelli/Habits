import { Outlet } from 'react-router-dom'
import { api } from './lib/axios'

import './styles/global.css'
import { setCookie } from './utils/cookies';

if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('serviceWorker.js')
    .then(async(serviceWorker) => {
      let subscription = await serviceWorker.pushManager.getSubscription();

      if(!subscription) {
        const publicKeyRes = await api.get('notifications/public_key');

        subscription = await serviceWorker.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: publicKeyRes.data.publicKey
        });
      }

      const userNotificationsSubRes = await api.post('notifications/subscribe', {
          subscription
        })
          .catch(err => console.log(err));

      if(userNotificationsSubRes && 'notification_id' in userNotificationsSubRes.data)
        setCookie('notifications_id', userNotificationsSubRes.data['notification_id'], 60);
      
    })
}

export function App() {
  return (
    <div className="App w-screen h-screen flex justify-center items-center">
      <Outlet />
    </div>
  )
}

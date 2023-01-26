import { Outlet } from 'react-router-dom'

import './styles/global.css'

export function App() {
  return (
    <div className="App w-screen h-screen flex justify-center items-center">
      <Outlet />
    </div>
  )
}

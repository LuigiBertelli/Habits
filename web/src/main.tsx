import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter , Routes, Route} from 'react-router-dom'

import { App } from './App'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Signin } from './pages/Signin'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="signin" element={<Signin/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

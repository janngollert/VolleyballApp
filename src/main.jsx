import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import { Login } from './Components/Login.jsx'
import { SignUp } from './Components/SignUp.jsx'
import { Home } from './Components/Home.jsx'
import { CreateTeam } from './Components/CreateTeam.jsx'
import { Schedule } from './Components/Schedule.jsx'
import { TeamChat } from './Components/TeamChat.jsx'
import { MatchDocumentation } from './Components/MatchDocumentation.jsx'


const Router = createBrowserRouter([{
  path: "/",
  element: <Login />
},
{
  path: "/signup",
  element:<SignUp />
},
{
  path: "/home",
  element: <Home />
},
{
  path:"/createTeam",
  element: <CreateTeam />
},
{
  path:"/schedule",
  element: <Schedule />
}
,
{
  path: "/chat",
  element: <TeamChat />
},
{
  path:"/match",
  element: <MatchDocumentation /> 
}]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={Router}/>
    
  </StrictMode>,
)

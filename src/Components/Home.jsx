import {Header} from "./Header.jsx"
import {DashBoard} from "./DashBoard.jsx"
import {Footer} from "./Footer.jsx"

import {useState, useEffect} from "react"

export const Home = () =>{
    const [userData, setUserData] = useState({})
    const [teamData, setTeamData] = useState({})
    useEffect(() => {
        fetch("http://localhost:8080/homeUserData", {credentials: "include"}).then((res) => res.json()).then((d) => setUserData(d)).catch((err) => console.log(err))
        fetch("http://localhost:8080/homeTeamData", {credentials: "include"}).then((res) => res.json(),).then((d) => setTeamData(d)).catch(err => console.log(err))
    }, [])
    return(

        <div>
           <Header  />
           <DashBoard userData = {userData} teamData={teamData}/>
           <Footer/>
        </div>
    )
}
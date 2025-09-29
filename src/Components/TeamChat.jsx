import { useEffect, useState } from "react"
import "./style/TeamChat.css"

export const TeamChat = () => {
    const [userData, setUserData] = useState({})
    const [teamData, setTeamData] = useState({})
    const [teamChatData, setTeamChatData] = useState([])
    const [sendValue, setSendValue] = useState("")
    
    useEffect(() => {
        fetch("http://localhost:8080/homeUserData", {credentials: "include"}).then((res) => res.json()).then((d) => setUserData(d)).catch((err) => console.log(err))
        fetch("http://localhost:8080/homeTeamData", {credentials: "include"}).then((res) => res.json()).then((d) => setTeamData(d)).catch(err => console.log(err))

        setInterval(() => fetch("http://localhost:8080/teamChatData", {credentials: "include"}).then((res) => res.json()).then((d) => setTeamChatData(d)).catch(err => console.log(err)), 3000)
    }, [])

    const handleSubmit = (e) => {

        e.preventDefault()
    fetch("http://localhost:8080/teamChatData", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sendValue }),
    })
    .then(() =>
            fetch("http://localhost:8080/teamChatData", { credentials: "include" })
    )
    .then((res) => res.json())
    .then((d) => setTeamChatData(d))
    .catch((err) => console.log(err));
        setSendValue("")

    }
    return (<div className="teamchat-container">
         <header>
        <h1>{teamData.teamName}</h1>
      </header>
      <main>
        {teamChatData && teamChatData.length !== 0 ? (
          teamChatData.map((val, i) => (
            <div
              key={i}
              className={`message ${
                userData.username === val.sender ? "sent" : "received"
              }`}
            >
              <h2>{val.sender}</h2>
              <p>{val.text}</p>
            </div>
          ))
        ) : (
          <h2>No messages yet</h2>
        )}
      </main>
      <footer>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={sendValue}
            onChange={(e) => setSendValue(e.target.value)}
            placeholder="Type a message..."
          />
          <input type="submit" value="Send" />
        </form>
      </footer>
    </div>)
}
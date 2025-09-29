import { useState } from "react"
import "./style/SignUp.css"

export const SignUp = ({props}) => {
const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [teamKey, setTeamKey] = useState("")

    const handleSubmit = (e) =>{
        e.preventDefault()
        fetch("http://localhost:8080/signUpData", {
            method: "POST",
             credentials: "include",
             headers: {
                "Content-Type": "application/json",
             },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username,
                teamKey: teamKey
            })
        }).then(res => res.text()).then(text => {
            if(text != ""){
            window.location.href = text
        }
    })
    }
    const Redirect = () => {
        window.location.href = "/"
    }
     return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="text" placeholder="username" value={username}  onChange={(e) => setUsername(e.target.value)}/>
                <input type="text" placeholder="Team-Key" value={teamKey}  onChange={(e) => setTeamKey(e.target.value)}/>
                <input type="submit" value="Sign Up" /> 
            </form>
            <div>
                <p>Don't have a Team-Account yet: create yours <a href="/createTeam">here</a></p>
            </div>
            <div className="auth-form">
                <button onClick={Redirect}>Log In</button>
            </div>
        </div>
     )
}
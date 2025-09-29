 import { useState } from "react"
 import "./style/AuthForm.css"

 export const Login = ({props}) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) =>{
        e.preventDefault()
        fetch("http://localhost:8080/loginData", {
            method: "POST",
             credentials: "include",
        headers: {
             "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            })
        }).then(res => res.text()).then(text => {
            if(text != ""){
            window.location.href = text
        }
    })
    }
    const Redirect = () => {
        window.location.href = "/signup"
    }
     return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <input type="submit" value="Log in" /> 
            </form>
            <div className="auth-form">
                <button onClick={Redirect}>Sign Up</button>
            </div>
        </div>
     )
}
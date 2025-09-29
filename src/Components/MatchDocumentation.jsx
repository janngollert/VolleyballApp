import { useState, useEffect } from "react"
export const MatchDocumentation = () => {

    const [matchData, setMatchData] = useState(null)
    const [startMatchDocumentationButtonIsClicked, setStartMatchDocumentationButtonIsClicked] = useState(false) 
    const [teamData, setTeamData] = useState({})
    const [yourTeam, setYourTeam] = useState({
        name: "",
        playingWithLibero: false,
        outside1: "",
        outside2: "",
        setter: "",
        opposite:"",
        middle1:"",
        middle2:"",
        libero:"",
        
        numberOfBenchPlayers: 0,
        benchPlayers: [],
    })
    const [team2, setTeam2] = useState({
        name: "",
        playingWithLibero: false,
        outside1: "",
        outside2: "",
        setter: "",
        opposite:"",
        middle1:"",
        middle2:"",
        libero:"",
        numberOfBenchPlayers: 0,
        benchPlayers: [],
    })
    const[numberOfSets, setNumberOfSets] = useState(3)
    

    const positions = ["Opposite", "Middle1", "Outside1", "Setter", "Middle2", "Outside2"]
    const positionsLibero = ["Opposite", "Middle1", "Outside1", "Setter", "Libero", "Outside2", "Middle2"]

    useEffect(() => {
        setInterval(() => fetch("http://localhost:8080/matchData", {
            credentials: "include"
        }).then((res) => res.json()).then((data) => setMatchData(data)).catch(err => console.log(err)), 3000)


       fetch("http://localhost:8080/homeTeamData", {credentials: "include"}).then((res) => res.json(),).then((d) => setTeamData(d)).then(() => setYourTeam((prev) => {
        return{
            name: teamData.teamName,
            ...prev,
        }
       })).catch(err => console.log(err))
     
    }, [])





    const increaseScore = (e, team) => {
        
        const newMatchData = matchData
        newMatchData.team.score += 1
        setMatchData((prev) => {
            return{
                ...prev,
                team: {
                    ...prev.team,
                    score: prev.team.score + 1,
                },
            }
        })
        fetch("http://localhost:8080/matchData", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(newMatchData),
        }).then(() => {
            fetch("http://localhost:8080/matchData", {
                method: "GET",
                credentials: "include",
        }).then(res => res.json()).then( data => setMatchData(data)).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }

    const decreaseScore = (e, team) => {
        
        const newMatchData = matchData
        newMatchData.team.score -= 1
        setMatchData((prev) => {
            return{
                ...prev,
                team: {
                    ...prev.team,
                    score: prev.team.score - 1,
                },
            }
        })
        fetch("http://localhost:8080/matchData", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },
            body: JSON.stringify(newMatchData),
        }).then(() => {
            fetch("http://localhost:8080/matchData", {
                method: "GET",
                credentials: "include",
        }).then(res => res.json()).then( data => setMatchData(data)).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }

    const handleChange = (e, val, setTeam) => {

        switch (val){
            case "Opposite":
                setTeam((prev) => {
                    return{
                        ...prev,
                    opposite: e.target.value,
                    
                    }
                })
                break;
            case "Middle1":
                setTeam((prev) => {
                    return{
                        ...prev,
                    middle1: e.target.value,
                    
                    }                })
                break;
            case "Middle2":
                setTeam((prev) => {
                    return{
                        ...prev,
                    middle2: e.target.value,
                    
                    }
                })
                break;

            case "Outside1":
                setTeam((prev) => {
                    return{
                        ...prev,
                    outside1: e.target.value,
                    
                    }
                })
                break;
            case "Outside2":
                setTeam((prev) => {
                    return{
                        ...prev,
                    outside2: e.target.value,
                    
                    }
                })
                break;
            case "Setter":
                setTeam((prev) => {
                    return{
                        ...prev,
                    setter: e.target.value,
                    
                    }
                })
                break;
            case "Libero":
                setTeam((prev) => {
                    return{
                        ...prev,
                    libero: e.target.value,
                    
                    }
                })
                break;
        }
    }

    const handleSubmit = (e) => {

        e.preventDefault()



        fetch("http://localhost:8080/matchData", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                team1: yourTeam,
                team2: team2,
                numberOfSets: numberOfSets,
            })
        })
    }

    return (
        <>

        <header>
        <h1>Match Documentation</h1>
        </header>

        <main>
        { !matchData  ? <div>
            <h2>No current Match</h2>
            <div>
                <button onClick={() => setStartMatchDocumentationButtonIsClicked(!startMatchDocumentationButtonIsClicked)}>{startMatchDocumentationButtonIsClicked ? "Stop Match Documentation" : "Start Match Documentation"}</button>
                {startMatchDocumentationButtonIsClicked && <div> 
                        <form onSubmit={handleSubmit}>
                            <div>
                            <h2>{teamData.teamName}</h2>
                            <label htmlFor="li">Playing with Libero?</label>
                            <input type = "checkbox" onChange={() => setYourTeam(prev =>{
                               return {
                                ...prev,
                                    playingWithLibero: !prev.playingWithLibero,
                                
                            }
                            })} id="li"/>
                            <div>
                            {
                                yourTeam.playingWithLibero ? positionsLibero.map((val, index) => {
                                    return(
                                        <div key={index}>
                                            <p>{val}</p>
                                            <input type="text" placeholder={val} onChange={(e) => handleChange(e, val, setTeam2)}/>
                                            </div>
                                    )
                                }) : positions.map((val, index) => {
                                    return(
                                        <div key={index}>
                                            <p>{val}</p>
                                            <input type="text" placeholder={val} onChange={(e) => handleChange(e, val, setTeam2)}/>
                                            </div>
                                    )
                                }) 
                            } 
                            <label htmlFor="nOfbenchPlayers">Number of Bench Players</label>
                            <input type="number" placeholder="0" id="nOfbenchPlayers" value={yourTeam.numberOfBenchPlayers} onChange={ e => setYourTeam((prev) => {
                                return{
                                    ...prev,
                                    numberOfBenchPlayers: e.target.value,
                                    
                                }
                            })}/>
                                <div>
                                    <h2>Bench Players</h2>
                                    {
                                        [...Array(yourTeam.numberOfBenchPlayers)].map((_, i) => {
                                            <div key={i}>
                                                <input type="text" placeholder={"Bench Player Nr. " + i} value={yourTeam.benchPlayers[i]} onChange={e => {
                                                    setYourTeam((prev) => {
                                                      let bPlayers = prev.benchPlayers
                                                        bPlayers[i] = e.target.value
                                                        return{
                                                            ...prev,
                                                            benchPlayers: bPlayers,
                                                            
                                                        }
                                                    })
                                                }}/>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                            </div>
                            <div>
                            <input type="text" placeholder="Team 2" value={team2.name} onChange={(e) => setTeam2((prev) =>{
                                return{
                                ...prev,
                                name: e.target.value,
                                
                                }
                                }           )}/>
                            <label htmlFor="li">Playing with Libero?</label>
                            <input type = "checkbox" onChange={() => setTeam2(prev =>{
                               return {
                                ...prev,
                                    playingWithLibero: !prev.playingWithLibero,
                            }
                            })} id="li"/>
                            <div>
                            {
                                team2.playingWithLibero ? positionsLibero.map((val, index) => {
                                    return(
                                        <div key={index}>
                                            <p>{val}</p>
                                            <input type="text" placeholder={val} onChange={(e) => handleChange(e, val, setTeam2)}/>
                                            </div>
                                    )
                                }) : positions.map((val, index) => {
                                    return(
                                        <div key={index}>
                                            <p>{val}</p>
                                            <input type="text" placeholder={val} onChange={(e) => handleChange(e, val, setTeam2)}/>
                                            </div>
                                    )
                                }) 
                            } 
                            <label htmlFor="nOfbenchPlayers">Number of Bench Players</label>
                            <input type="number" placeholder="0" id="nOfbenchPlayers" value={team2.numberOfBenchPlayers} onChange={e => setTeam2((prev) => {
                                return{
                                    ...prev,
                                    numberOfBenchPlayers: e.target.value,
                                    
                                }
                            })}/>
                                <div>
                                    <h2>Bench Players</h2>
                                    {
                                        [...Array(team2.numberOfBenchPlayers)].map((_, i) => {
                                            <div key={i}>
                                                <input type="text" placeholder={"Bench Player Nr. " + i} value={team2.benchPlayers[i]} onChange={e => {
                                                    setTeam2((prev) => {
                                                      let bPlayers = prev.benchPlayers
                                                        bPlayers[i] = e.target.value
                                                        return{
                                                            ...prev,
                                                            benchPlayers: bPlayers,
                                                           
                                                        }
                                                    })
                                                }}/>
                                            </div>
                                        })
                                    }
                                </div>
                            
                            </div>
                            
                            </div>
                            <p>Number of Sets:</p>
                           <input type="number" value={numberOfSets} onChange={(e) => setNumberOfSets(e.target.value)} placeholder="3"/>

                           <input type="submit" onSubmit={handleSubmit}/> 
                        </form>
                    </div>}
            </div>
        </div> : <div>
            <div>
                <h2>{matchData.team1.name}</h2>
                <div>
                    <h2>{matchData.team1.score}</h2>
                    <input type="button" value="+" onClick={(e) => increaseScore(e, matchData.team1)}/>
                    <input type="button" value="-" onClick={(e) => decreaseScore(e, matchData.team1)}/>
                    <div>
                        <h4>{matchData.team1.wonSets}</h4>
                    </div>
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                }}>
                    {matchData.team1.positioning.map((val, index) => {
                        let X
                        let Y
                        switch(index + 1){
                            case 1:
                                X = "3"; Y = "2"; break;
                            case 2:
                                X = "3"; Y = "1"; break;
                            case 3:
                                X = "2"; Y = "1"; break;
                            case 4:
                                X = "1"; Y = "1"; break;
                            case 5:
                                X = "1"; Y = "2"; break;
                            default:
                                X = "2"; Y = "2"; break;
}
                        return (
                                <div style={{
                                    gridColumn: X,
                                    gridRow: Y,
                                    placeItems: "center",
                                }}>
                                <h2>{val.name}</h2>
                                <p>{val.position.type}</p>
                                </div>
                        )
                    })}
                </div>
            </div>
            <div>
                <h2>{matchData.team2.name}</h2>

                <div>
                    <h2>{matchData.team2.score}</h2>
                    <input type="button" value="+" onClick={(e) => increaseScore(e, matchData.team2)}/>
                    <input type="button" value="-" onClick={(e) => decreaseScore(e, matchData.team2)}/>
                    <div>
                        <h4>{matchData.team2.wonSets}</h4>
                    </div>
                </div>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gridTemplateRows: "1fr 1fr",
                }}>
                    {matchData.team2.positioning.map((val, index) => {
                        let X
                        let Y
                        switch(index + 1){
                                case 1:
                                X = "3"; Y = "2"; break;
                                case 2:
                                    X = "3"; Y = "1"; break;
                                case 3:
                                    X = "2"; Y = "1"; break;
                                case 4:
                                    X = "1"; Y = "1"; break;
                                case 5:
                                    X = "1"; Y = "2"; break;
                                default:
                                    X = "2"; Y = "2"; break;
}
                        return (
                                <div style={{
                                    gridColumn: X,
                                    gridRow: Y,
                                    placeItems: "center",
                                }}>
                                <h2>{val.name}</h2>
                                <p>{val.position.type}</p>
                                </div>
                        )
                    })}
                </div>
            </div>
            </div>}
        </main>

        <footer>

        </footer>

        </>
    )
}
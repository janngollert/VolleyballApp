import { useState, useEffect } from "react"
import "./style/MatchDocumentation.css"
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
        isCurrentlyServing: false,
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
        isCurrentlyServing: false,
    })
    const[numberOfSets, setNumberOfSets] = useState(3)
    const [showWonSetScore, setShowWonSetScore] = useState(false)
    const [showLostSetScore, setShowLostSetScore] = useState(false)
    

    const positions = ["Opposite", "Middle1", "Outside1", "Setter", "Middle2", "Outside2"]
    const positionsLibero = ["Opposite", "Middle1", "Outside1", "Setter", "Libero", "Outside2", "Middle2"]

    useEffect(() => {
        const interval = setInterval(() => {
            fetch("http://localhost:8080/matchData", {
                credentials: "include"
            }).then((res) => res.json()).then((data) => setMatchData(data)).catch(err => console.log(err))
        }, 3000)


       fetch("http://localhost:8080/homeTeamData", {credentials: "include"})
           .then((res) => res.json())
           .then((d) => {
               setTeamData(d)
               setYourTeam((prev) => {
                   return{
                       name: d.teamName,
                       ...prev,
                   }
               })
           })
           .catch(err => console.log(err))
     
        return () => clearInterval(interval)
    }, [])





    const increaseScore = (e, team) => {
        
        const newMatchData = {...matchData}
        const teamKey = team.name === matchData.team1.name ? 'team1' : 'team2'
        newMatchData[teamKey] = {...newMatchData[teamKey], score: newMatchData[teamKey].score + 1}
        
        setMatchData(newMatchData)
        
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
        
        const newMatchData = {...matchData}
        const teamKey = team.name === matchData.team1.name ? 'team1' : 'team2'
        newMatchData[teamKey] = {...newMatchData[teamKey], score: Math.max(0, newMatchData[teamKey].score - 1)}
        
        setMatchData(newMatchData)
        
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

        <header className="md-header">
        <h1>Match Documentation</h1>
        </header>
        
        <div>
        <main className="md-main">
        { !matchData  ? <div>
            <h2 className="md-no-match-title">No current Match</h2>
            <div>
                <button className="md-button" onClick={() => setStartMatchDocumentationButtonIsClicked(!startMatchDocumentationButtonIsClicked)}>{startMatchDocumentationButtonIsClicked ? "Stop Match Documentation" : "Start Match Documentation"}</button>
                {startMatchDocumentationButtonIsClicked && <div> 
                        <form className="md-form" onSubmit={handleSubmit}>
                            <div className="md-form-section">
                            <h2 className="md-form-title">{teamData.teamName}</h2>
                            <label className="md-label" htmlFor="li">Playing with Libero?</label>
                            <input className="md-input-checkbox" type = "checkbox" onChange={() => setYourTeam(prev =>{
                               return {
                                ...prev,
                                    playingWithLibero: !prev.playingWithLibero,
                                
                            }
                            })} id="li"/>
                            <div>
                            {
                                yourTeam.playingWithLibero ? positionsLibero.map((val, index) => {
                                    return(
                                        <div className="md-position-container" key={index}>
                                            <p className="md-position-label">{val}</p>
                                            <input className="md-input-text" type="text" placeholder={val} onChange={(e) => handleChange(e, val, setYourTeam)}/>
                                            </div>
                                    )
                                }) : positions.map((val, index) => {
                                    return(
                                        <div className="md-position-container" key={index}>
                                            <p className="md-position-label">{val}</p>
                                            <input className="md-input-text" type="text" placeholder={val} onChange={(e) => handleChange(e, val, setYourTeam)}/>
                                            </div>
                                    )
                                }) 
                            } 
                            <label className="md-label" htmlFor="nOfbenchPlayers">Number of Bench Players</label>
                            <input className="md-input-number" type="number" placeholder="0" id="nOfbenchPlayers" value={yourTeam.numberOfBenchPlayers} onChange={ e => setYourTeam((prev) => {
                                if(e.target.value < 0){
                                    return{
                                        ...prev,
                                        numberOfBenchPlayers: 0,
                                    }
                                }
                                return{
                                    ...prev,
                                    numberOfBenchPlayers: parseInt(e.target.value) || 0,
                                    
                                }
                            })}/>
                                <div>
                                    <h2 className="md-bench-title">Bench Players</h2>
                                    {
                                        [...Array(yourTeam.numberOfBenchPlayers)].map((_, i) => {
                                            return (
                                            <div key={i}>
                                                <input className="md-input-text" type="text" placeholder={"Bench Player Nr. " + i} value={yourTeam.benchPlayers[i] || ""} onChange={e => {
                                                    setYourTeam((prev) => {
                                                      let bPlayers = [...prev.benchPlayers]
                                                        bPlayers[i] = e.target.value
                                                        return{
                                                            ...prev,
                                                            benchPlayers: bPlayers,
                                                            
                                                        }
                                                    })
                                                }}/>
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            </div>
                            <div className="md-form-section">
                            <input className="md-input-text" type="text" placeholder="Team 2" value={team2.name} onChange={(e) => setTeam2((prev) =>{
                                return{
                                ...prev,
                                name: e.target.value,
                                
                                }
                                }           )}/>
                            <label className="md-label" htmlFor="li">Playing with Libero?</label>
                            <input className="md-input-checkbox" type = "checkbox" onChange={() => setTeam2(prev =>{
                               return {
                                ...prev,
                                    playingWithLibero: !prev.playingWithLibero,
                            }
                            })} id="li"/>
                            <div>
                            {
                                team2.playingWithLibero ? positionsLibero.map((val, index) => {
                                    return(
                                        <div className="md-position-container" key={index}>
                                            <p className="md-position-label">{val}</p>
                                            <input className="md-input-text" type="text" placeholder={val} onChange={(e) => handleChange(e, val, setTeam2)}/>
                                            </div>
                                    )
                                }) : positions.map((val, index) => {
                                    return(
                                        <div className="md-position-container" key={index}>
                                            <p className="md-position-label">{val}</p>
                                            <input className="md-input-text" type="text" placeholder={val} onChange={(e) => handleChange(e, val, setTeam2)}/>
                                            </div>
                                    )
                                }) 
                            } 
                            <label className="md-label" htmlFor="nOfbenchPlayers">Number of Bench Players</label>
                            <input className="md-input-number" type="number" placeholder="0" id="nOfbenchPlayers" value={team2.numberOfBenchPlayers} onChange={e => setTeam2((prev) => {
                                if(e.target.value < 0){
                                    return{
                                        ...prev,
                                        numberOfBenchPlayers: 0,
                                    }
                                }
                                return{
                                    ...prev,
                                    numberOfBenchPlayers: parseInt(e.target.value) || 0,
                                    
                                }
                            })}/>
                                <div>
                                    <h2 className="md-bench-title">Bench Players</h2>
                                    {
                                        [...Array(team2.numberOfBenchPlayers)].map((_, i) => {
                                            return (
                                            <div key={i}>
                                                <input className="md-input-text" type="text" placeholder={"Bench Player Nr. " + i} value={team2.benchPlayers[i] || ""} onChange={e => {
                                                    setTeam2((prev) => {
                                                      let bPlayers = [...prev.benchPlayers]
                                                        bPlayers[i] = e.target.value
                                                        return{
                                                            ...prev,
                                                            benchPlayers: bPlayers,
                                                           
                                                        }
                                                    })
                                                }}/>
                                            </div>
                                            )
                                        })
                                    }
                                </div>
                            
                            </div>
                            
                            </div>
                            <p className="md-position-label">Number of Sets:</p>
                           <input className="md-input-number" type="number" value={numberOfSets} onChange={(e) => setNumberOfSets(parseInt(e.target.value) || 3)} placeholder="3"/>
                           <div>
                            <p className="md-position-label">Who has the Starting Serve?</p>
                            <input className="md-input-radio" type="radio" name="serve" value="team1" onChange={(e) => setYourTeam((prev) => {
                                return{
                                    ...prev,
                                    isCurrentlyServing: !prev.isCurrentlyServing,
                                }
                                })}/>
                            <label className="md-label" htmlFor="team1">Team 1</label>
                            <input className="md-input-radio" type="radio" name="serve" value="team2" onChange={(e) => setTeam2((prev) => {
                                return{
                                    ...prev,
                                    isCurrentlyServing: !prev.isCurrentlyServing,
                                }
                                })}/>
                            <label className="md-label" htmlFor="team2">Team 2</label>
                           </div>
                           <div>
                           <input className="md-input-submit" type="submit" onSubmit={handleSubmit} value="Start Match"/> 
                           </div>

                        </form>
                    </div>}
            </div>
        </div> : 
        
        <div>
        { !matchData.wonStatus ?
        
        <div className="md-volleyball-court">
            <div className="md-team-court md-team-court-1">
                <h2 className="md-team-name">{matchData.team1.name}</h2>
                <div className="md-score-display">
                    <h2 className="md-score-number">{matchData.team1.score}</h2>
                    <input type="button" className="md-score-btn md-score-btn-plus" value="+" onClick={(e) => increaseScore(e, matchData.team1)}/>
                    <input type="button" className="md-score-btn md-score-btn-minus" value="-" onClick={(e) => decreaseScore(e, matchData.team1)}/>
                    <div className="md-sets-won-container">
                        <h4 className="md-sets-won">{matchData.team1.wonSets}</h4>
                    </div>
                </div>
                <div className="md-player-positioning-grid" style={{
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
                                <div key={index} className="md-player-position" style={{
                                    gridColumn: X,
                                    gridRow: Y,
                                    placeItems: "center",
                                }}>
                                <h2 className="md-player-name">{val.name}</h2>
                                <p className="md-player-position-type">{val.position.type}</p>
                                </div>
                        )
                    })}
                </div>
            </div>
            <div className="md-team-court md-team-court-2">
                <h2 className="md-team-name">{matchData.team2.name}</h2>

                <div className="md-score-display">
                    <h2 className="md-score-number">{matchData.team2.score}</h2>
                    <input type="button" className="md-score-btn md-score-btn-plus" value="+" onClick={(e) => increaseScore(e, matchData.team2)}/>
                    <input type="button" className="md-score-btn md-score-btn-minus" value="-" onClick={(e) => decreaseScore(e, matchData.team2)}/>
                    <div className="md-sets-won-container">
                        <h4 className="md-sets-won">{matchData.team2.wonSets}</h4>
                    </div>
                </div>
                <div className="md-player-positioning-grid" style={{
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
                                <div key={index} className="md-player-position" style={{
                                    gridColumn: X,
                                    gridRow: Y,
                                    placeItems: "center",
                                }}>
                                <h2 className="md-player-name">{val.name}</h2>
                                <p className="md-player-position-type">{val.position.type}</p>
                                </div>
                        )
                    })}
                </div>
            </div>
            </div>
     : <div>
        <h2>Congratulations {matchData.wonStatus.winningTeam.name}</h2>
        <h3>Loser: {matchData.wonStatus.losingTeam.name}</h3>
        <h3 >Set Score: <span onMouseEnter={() => setShowWonSetScore(true)} onMouseLeave={() => setShowWonSetScore(false)}>{matchData.wonStatus.wonSets}</span> - <span onMouseEnter={() => setShowLostSetScore(true)} onMouseLeave={() => setShowLostSetScore(false)}>{matchData.wonStatus.lostSets}</span></h3>
        {showWonSetScore && <div>
            {matchData.wonStatus.winningTeam.sets.map((val, index) => {
                return (
                    <div key={index}>
                        <h3>Set {index + 1}</h3>
                        <h4>Team 1: {val.team1Score}</h4>
                        <h4>Team 2: {val.team2Score}</h4>
                    </div>
                )
            })}
        </div>}
        {showLostSetScore && <div>
            {matchData.wonStatus.losingTeam.sets.map((val, index) => {
                return (
                    <div key={index}>
                        <h3>Set {index + 1}</h3>
                        <h4>Team 1: {val.team1Score}</h4>
                        <h4>Team 2: {val.team2Score}</h4>
                    </div>
                )
            })}
        </div>}
    </div>}
    </div>
    }
    </main>
    </div>
        </>
    )
}
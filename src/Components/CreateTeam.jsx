import { useState } from "react";
import "./style/CreateTeam.css";

export const CreateTeam = () => {
  const [teamName, setTeamName] = useState("");
  const [teamKey, setTeamKey] = useState("");
  const [password, setPassword] = useState(""); // if your team needs a password

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:8080/createTeam", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamName,
        teamKey,
        players: [],
        // maybe also: password
      }),
      credentials: "include",
    })
      .then((res) => res.text())
      .then((redirect) => {
        window.location.href = redirect; // backend sends "/signup"
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="create-team-container">
      <form className="create-team-form" onSubmit={handleSubmit}>
        <h2>Create a Team</h2>

        <input
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Team Key"
          value={teamKey}
          onChange={(e) => setTeamKey(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Team Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" value="Create Team" />
      </form>
    </div>
  );
};

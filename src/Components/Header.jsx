import "./style/Header.css";

export const Header = () => {
  return (
    <div className="header">
      <img src="samplesrc.png" alt="Team Logo" />
      <div className="nav-links">
        <a href="/schedule">Schedule</a>
        <a href="/match">Match</a>
        <a href="/chat">Chat</a>
        <a href="/profile">Profile</a>
      </div>
    </div>
  );
};

import "./style/Dashboard.css"

export const DashBoard = ({ userData, teamData }) => {
  return (
    <div className="dashboard">
      <div className="welcome-section">
        <h2>Welcome back, {userData.username}</h2>
        <div className="next-training">
          {teamData && teamData.nextTraining ?  (
            <h3>Next Training: {teamData.nextTraining.date} {teamData.nextTraining.time} {teamData.nextTraining.time} {teamData.nextTraining.description}</h3>
          ) : (
            <a href="/schedule">Set up your training plan!</a>
          )}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-tile">
          <img src="/public/images/schedule.png" alt="Schedule Icon" />
          <a href="/schedule">View Full Schedule</a>
        </div>
        <div className="dashboard-tile">
          <img src="/public/images/volleyball.png" alt="Match Icon" />
          <a href="/match">Start Match Documentation</a>
        </div>
        <div className="dashboard-tile">
          <img src="/public/images/messenger.png" alt="Chat Icon" />
          <a href="/chat">Enter Team Chat</a>
        </div>
      </div>
    </div>
  );
};
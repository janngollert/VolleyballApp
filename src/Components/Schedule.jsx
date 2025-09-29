import { useState, useEffect } from "react";
import "./style/Schedule.css";

export const Schedule = () => {
  // ------------------------------
  // STATE VARIABLES
  // ------------------------------

  // Trainings array from backend
  const [trainings, setTrainings] = useState([]);

  // Toggle the "Add Training" form
  const [buttonIsClicked, setButtonIsClicked] = useState(false);

  // Input states for creating a new training
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  // In/Out selection for a user
  const [inOrOut, setInOrOut] = useState("");
  const [index, setIndex] = useState(0);

  // User info fetched from backend
  const [userData, setUserData] = useState({});

  // Which training cards currently have the comment form open
  const [commentClicked, setCommentClicked] = useState([]);

  // State for writing a comment
  const [comment, setComment] = useState("");

  // Hover states for showing player lists
  const [inHovered, setInHovered] = useState(false);
  const [outHovered, setOutHovered] = useState(false);
  const [showIn, setShowIn] = useState(false);
  const [showOut, setShowOut] = useState(false);


  // ------------------------------
  // INITIAL DATA FETCH
  // ------------------------------
  useEffect(() => {
    // Fetch trainings from backend
    fetch("http://localhost:8080/scheduleData", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setTrainings(data);

        // Initialize arrays with same length as trainings
        setCommentClicked(new Array(data.length).fill(false));
      })
      .catch((err) => console.log(err));

    // Fetch current user data
    fetch("http://localhost:8080/homeUserData", { credentials: "include" })
      .then((res) => res.json())
      .then((d) => setUserData(d))
      .catch((err) => console.log(err));
  }, []);


  // ------------------------------
  // HOVER EFFECTS FOR PLAYER LISTS
  // ------------------------------
  useEffect(() => {
    let timeOut;

    if (!inHovered) {
      timeOut = setTimeout(() => setShowIn(false), 500);
    } else {
      setShowIn(true);
    }

    return () => clearTimeout(timeOut);
  }, [inHovered]);

  useEffect(() => {
    let timeOut;

    if (!outHovered) {
      timeOut = setTimeout(() => setShowOut(false), 500);
    } else {
      setShowOut(true);
    }

    return () => clearTimeout(timeOut);
  }, [outHovered]);


  // ------------------------------
  // FUNCTIONS
  // ------------------------------

  // Submit new training to backend
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTrainingObj = {
      date,
      time,
      location,
      description,
      playersIn: [],
      playersOut: [],
    };

    const safeTrainings = Array.isArray(trainings) ? trainings : [];
    const updatedTrainings = [...safeTrainings, newTrainingObj];

    setTrainings(updatedTrainings);
    setCommentClicked((prev) => [...prev, false]);

    fetch("http://localhost:8080/scheduleData", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTrainings),
    }).catch((err) => console.log(err));

    // Reset form
    setDate("");
    setDescription("");
    setLocation("");
    setTime("");
    setButtonIsClicked(false);
  };

  // Handle in/out radio buttons
  const handleRadio = (e) => {
    const value = e.target.value;
    const idx = parseInt(e.target.getAttribute("a-key"));

    setInOrOut(value);
    setIndex(idx);

    fetch("http://localhost:8080/inOrOutData", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inOrOut: value, index: idx }),
    })
      .then(() =>
        fetch("http://localhost:8080/scheduleData", { credentials: "include" })
          .then((res) => res.json())
          .then((data) => setTrainings(data))
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  };

  // Handle comment submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const sentComment = comment;

    fetch("http://localhost:8080/handleTrainingComment", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commenter: userData.username,
        text: sentComment,
        index: e.target.getAttribute("a-key"),
      }),
    }).catch((err) => console.log(err));

    setComment("");

    // Update local state with new comment
    setTrainings((prev) => {
      const idx = parseInt(e.target.getAttribute("a-key"));
      const updated = [...prev];
      const training = { ...updated[idx] };

      training.comments = training.comments
        ? [...training.comments, { commenter: userData.username, text: sentComment }]
        : [{ commenter: userData.username, text: sentComment }];

      updated[idx] = training;
      return updated;
    });
  };


  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="schedule-container">
      
      {/* HEADER */}
      <div className="schedule-header">
        <h1>Training Schedule</h1>
        <div className="schedule-actions">
          <button className="btn" onClick={() => setButtonIsClicked(!buttonIsClicked)}>
            {buttonIsClicked ? "Close Form" : "Add Training"}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="schedule-main">

        {/* TRAINING LIST */}
        <div className="training-list">
          {!trainings || trainings.length === 0 ? (
            <div className="empty-state">
              <p>Set up your training plan to get started ✨</p>
            </div>
          ) : (
            trainings.map((training, index) => (
              <div className="training-card" key={index}>
                
                {/* Training Info */}
                <h2>{training.date}</h2>
                <div className="training-meta">
                  <span className="time">🕒 {training.time}</span>
                  <span className="location">📍 {training.location}</span>
                </div>
                <p className="helper">Focus: {training.description}</p>

                {/* In / Out Form */}
                <div>
                  <form className="In-or-Out">
                    <label htmlFor="yes">In</label>
                    <input
                      type="radio"
                      id="yes"
                      value="In"
                      name={`inorout-${index}`}
                      onChange={handleRadio}
                      a-key={index}
                      checked={
                        Array.isArray(training.playersIn) &&
                        training.playersIn.some((p) => p.email === userData.email)
                      }
                    />
                    <h3
                      onMouseEnter={() => setInHovered(true)}
                      onMouseLeave={() => setInHovered(false)}
                    >
                      {training.playersIn?.length || 0}
                    </h3>

                    {/* Show player list on hover */}
                    <div>
                      {showIn &&
                        training.playersIn.map((player, idx) => (
                          <div key={idx}>
                            <h2>{player.username}</h2>
                          </div>
                        ))}
                    </div>

                    <label htmlFor="no">Out</label>
                    <input
                      type="radio"
                      id="no"
                      value="Out"
                      name={`inorout-${index}`}
                      onChange={handleRadio}
                      a-key={index}
                      checked={
                        Array.isArray(training.playersOut) &&
                        training.playersOut.some((p) => p.email === userData.email)
                      }
                    />
                    <h3
                      onMouseEnter={() => setOutHovered(true)}
                      onMouseLeave={() => setOutHovered(false)}
                    >
                      {training.playersOut?.length || 0}
                    </h3>

                    {/* Show player list on hover */}
                    <div>
                      {showOut &&
                        training.playersOut.map((player, idx) => (
                          <div key={idx}>
                            <h2>{player.username}</h2>
                          </div>
                        ))}
                    </div>
                  </form>
                </div>

                {/* Comment Section */}
                <div>
                  <button
                    onClick={() =>
                      setCommentClicked((prev) => {
                        const newCom = [...prev];
                        newCom[index] = !newCom[index];
                        return newCom;
                      })
                    }
                  >
                    {commentClicked[index] ? "Stop Commenting" : "Comment"}
                  </button>

                  {commentClicked[index] && (
                    <div>
                      <form onSubmit={handleCommentSubmit} a-key={index}>
                        <h2>Write Comment</h2>
                        <input
                          type="text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <input type="submit" value="Comment" />
                      </form>
                    </div>
                  )}
                </div>

                {/* Display Comments */}
                <div>
                  <h3>Comments</h3>
                  {!training.comments || training.comments.length === 0 ? (
                    <p>No comments yet</p>
                  ) : (
                    training.comments.map((comment, idx) => (
                      <div key={idx}>
                        <h2>{comment.commenter}</h2>
                        <p>{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))
          )}

          <h2 className="helper">No more trainings scheduled</h2>
        </div>

        {/* Add Training Form */}
        {buttonIsClicked && (
          <aside className="schedule-panel">
            <form onSubmit={handleSubmit} className="schedule-form">
              <h2>Add Training</h2>

              <input
                type="date"
                placeholder="Date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
              />

              <input
                type="text"
                placeholder="Time"
                onChange={(e) => setTime(e.target.value)}
                value={time}
              />

              <input
                type="text"
                placeholder="Location"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              />

              <input
                type="text"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              />

              <input type="submit" value="Add Training" className="btn submit" />
            </form>
          </aside>
        )}
      </div>
    </div>
  );
};
package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"slices"

	uuid "github.com/satori/go.uuid"
)

type User struct {
	Email    string   `json:"email"`
	Password string   `json:"password"`
	Username string   `json:"username"`
	TeamKey  string   `json:"teamKey"`
	Position Position `json:"position"`
	Stats    []Stat   `json:"stats"`
}
type Team struct {
	TeamKey      string       `json:"teamKey"`
	TeamName     string       `json:"teamName"`
	Players      []User       `json:"players"`
	NextTraining Training     `json:"nextTraining"`
	TeamChat     []TextBubble `json:"teamChat"`
	PastMatches  []Match      `json:"pastMatches"`
}

type Training struct {
	Date        string    `json:"date"`
	Time        string    `json:"time"`
	Location    string    `json:"location"`
	Description string    `json:"description"`
	PlayersIn   []User    `json:"playersIn"`
	PlayersOut  []User    `json:"playersOut"`
	Comments    []Comment `json:"comments"`
}

type Comment struct {
	Commenter string `json:"commenter"`
	Text      string `json:"text"`
	Index     int    `json:"index"`
}

type TextBubble struct {
	Sender string `json:"sender"`
	Text   string `json:"text"`
}

type InOrOutContainer struct {
	InOrOut string `json:"inOrOut"`
	Index   int    `json:"index"`
}

type Position struct {
	Type              string `json:"type"`
	AreTwoOnField     bool
	ImportanceOfStats map[Stat]string
}

type Stat struct {
	name  string
	level int
}

type PlayingTeam struct {
	Name                 string   `json:"name"`
	PlayingWithLibero    bool     `json:"playingWithLibero"`
	Outside1             string   `json:"outside1"`
	Outside2             string   `json:"outside2"`
	Setter               string   `json:"setter"`
	Opposite             string   `json:"opposite"`
	Middle1              string   `json:"middle1"`
	Middle2              string   `json:"middle2"`
	Libero               string   `json:"libero"`
	NumberOfBenchPlayers int32    `json:"numberOfBenchPlayers"`
	BenchPlayers         []string `json:"benchPlayers"`
	Score                int      `json:"score"`
	WonSets              int      `json:"wonSets"`
	Positioning          []Player `json:"position"`
}
type Player struct {
	Name     string   `json:"name"`
	Position Position `json:"position"`
}
type Match struct {
	Team1        PlayingTeam `json:"team1"`
	Team2        PlayingTeam `json:"team2"`
	NumberOfSets int         `json:"numberOfSets"`
	WonStatus    WonStatus   `json:"wonStatus"`
	Sets         []Set       `json:"sets"`
}
type Set struct {
	Team1Score int `json:"team1Score"`
	Team2Score int `json:"team2Score"`
}
type WonStatus struct {
	WinningTeam PlayingTeam `json:"winningTeam"`
	LosingTeam  PlayingTeam `json:"losingTeam"`
	WonSets     int         `json:"wonSets"`
	LostSets    int         `json:"lostSets"`
}

func (t Team) appendPlayer(player User) {
	t.Players = append(t.Players, player)
}

func (t Training) appendPlayer(player User, inOrOut string) Training {
	if inOrOut == "In" {
		for _, val := range t.PlayersIn {
			if val.Email == player.Email {
				return t
			}
		}
		for i, val := range t.PlayersOut {
			if val.Email == player.Email {
				t.PlayersOut = slices.Delete(t.PlayersOut, i, i+1)
			}
		}
		t.PlayersIn = append(t.PlayersIn, player)
	} else if inOrOut == "Out" {
		for _, val := range t.PlayersOut {
			if val.Email == player.Email {
				return t
			}
		}
		for i, val := range t.PlayersIn {
			if val.Email == player.Email {
				t.PlayersIn = slices.Delete(t.PlayersIn, i, i+1)
			}
		}
		t.PlayersOut = append(t.PlayersOut, player)
	}
	return t
}

var sessionDB = make(map[string]string)
var userDB = make(map[string]User)
var teamDB = make(map[string]Team)
var trainingDB = make(map[string][]Training)
var CurrentMatchDB = make(map[string]Match)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../index.html")
	})
	http.HandleFunc("/homeUserData", withCORS(homeUserData))
	http.HandleFunc("/homeTeamData", withCORS(homeTeamData))
	http.HandleFunc("/loginData", withCORS(loginData))
	http.HandleFunc("/signUpData", withCORS(signUpData))
	http.HandleFunc("/createTeam", withCORS(createTeamData))
	http.HandleFunc("/scheduleData", withCORS(scheduleData))
	http.HandleFunc("/teamChatData", withCORS(teamChatData))
	http.HandleFunc("/inOrOutData", withCORS(inOrOutData))
	http.HandleFunc("/handleTrainingComment", withCORS(handleTrainingComment))
	http.HandleFunc("/matchData", withCORS(matchData))
	http.ListenAndServe(":8080", nil)
}

func matchData(rw http.ResponseWriter, req *http.Request) {

	_, team, _ := getData(rw, req)
	switch req.Method {

	case http.MethodPut:
		var NewMatch Match

		err := json.NewDecoder(req.Body).Decode(&NewMatch)
		if err != nil {
			http.Error(rw, "DecodingError", http.StatusInternalServerError)
		}
		if NewMatch.Team1.Score >= 25 && NewMatch.Team1.Score-NewMatch.Team2.Score >= 2 {
			NewMatch.Team1.WonSets = NewMatch.Team1.WonSets + 1
			NewMatch.Sets = append(NewMatch.Sets, Set{
				Team1Score: NewMatch.Team1.Score,
				Team2Score: NewMatch.Team2.Score,
			})
			NewMatch.Team1.Score = 0
			NewMatch.Team2.Score = 0
		} else if NewMatch.Team2.Score >= 25 && NewMatch.Team2.Score-NewMatch.Team1.Score >= 2 {
			NewMatch.Team2.WonSets = NewMatch.Team2.WonSets + 1
			NewMatch.Sets = append(NewMatch.Sets, Set{
				Team1Score: NewMatch.Team1.Score,
				Team2Score: NewMatch.Team2.Score,
			})
			NewMatch.Team1.Score = 0
			NewMatch.Team2.Score = 0
		}
		if NewMatch.Team1.WonSets >= 3 || NewMatch.Team2.WonSets >= 3 {
			switch {
			case NewMatch.Team1.WonSets >= 3:
				NewMatch.WonStatus.WinningTeam = NewMatch.Team1
				NewMatch.WonStatus.LosingTeam = NewMatch.Team2
				NewMatch.WonStatus.WonSets = NewMatch.Team1.WonSets
				NewMatch.WonStatus.LostSets = NewMatch.Team2.WonSets
			case NewMatch.Team2.WonSets >= 3:
				NewMatch.WonStatus.WinningTeam = NewMatch.Team2
				NewMatch.WonStatus.LosingTeam = NewMatch.Team1
				NewMatch.WonStatus.WonSets = NewMatch.Team2.WonSets
				NewMatch.WonStatus.LostSets = NewMatch.Team1.WonSets
			}

		}
		CurrentMatchDB[team.TeamKey] = NewMatch
	case http.MethodPost:

		var NewMatch Match

		err := json.NewDecoder(req.Body).Decode(&NewMatch)
		if err != nil {
			http.Error(rw, "DecodingError", http.StatusInternalServerError)
		}

		CurrentMatchDB[team.TeamKey] = NewMatch

	case http.MethodGet:
		currentMatch, ok := CurrentMatchDB[team.TeamKey]
		if !ok {
			http.Error(rw, "No current Match", http.StatusInternalServerError)
		}

		err := json.NewEncoder(rw).Encode(currentMatch)
		if err != nil {
			http.Error(rw, "Encoding Error", http.StatusInternalServerError)
		}
	}
}
func handleTrainingComment(rw http.ResponseWriter, req *http.Request) {

	switch req.Method {
	case http.MethodPost:

		user, _, trainings := getData(rw, req)

		var comment Comment

		err := json.NewDecoder(req.Body).Decode(&comment)

		if err != nil {
			http.Error(rw, "Decoding in handleTrainingComment wrent wrong", http.StatusInternalServerError)
		}

		currentTraining := trainings[comment.Index]

		currentTraining.Comments = append(currentTraining.Comments, comment)

		trainings[comment.Index] = currentTraining
		trainingDB[user.TeamKey] = trainings
	default:
		http.Error(rw, "Wrong Method", http.StatusMethodNotAllowed)
		return
	}
}

func inOrOutData(rw http.ResponseWriter, req *http.Request) {

	if req.Method != http.MethodPost {
		http.Error(rw, "Wrong Method Used", http.StatusBadRequest)
		return
	}
	user, team, trainings := getData(rw, req)

	var inOrOutContainer InOrOutContainer

	err := json.NewDecoder(req.Body).Decode(&inOrOutContainer)

	if err != nil {
		http.Error(rw, "Decoding went wrong", http.StatusInternalServerError)
	}
	currentTraining := trainings[inOrOutContainer.Index]

	currentTraining = currentTraining.appendPlayer(user, inOrOutContainer.InOrOut)

	trainings[inOrOutContainer.Index] = currentTraining
	trainingDB[team.TeamKey] = trainings
}
func teamChatData(rw http.ResponseWriter, req *http.Request) {
	user, team, _ := getData(rw, req)

	switch req.Method {
	case http.MethodGet:
		rw.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(rw).Encode(team.TeamChat); err != nil {
			http.Error(rw, "Something went wrong, Please try again", 400)
		}
	case http.MethodPost:
		var bubble TextBubble
		if err := json.NewDecoder(req.Body).Decode(&bubble); err != nil {
			log.Println("Decode error:", err)
			http.Error(rw, "Bad request", http.StatusBadRequest)
			return
		}

		// overwrite sender with logged-in user
		bubble.Sender = user.Username

		team.TeamChat = append(team.TeamChat, bubble)
		teamDB[team.TeamKey] = team

	default:
		http.Error(rw, "Wrong Method", http.StatusMethodNotAllowed)
		return
	}
}

func scheduleData(rw http.ResponseWriter, req *http.Request) {
	user, team, trainings := getData(rw, req)

	if trainings == nil {
		trainingDB[user.TeamKey] = []Training{}
		trainings = trainingDB[user.TeamKey]
	}

	switch req.Method {
	case http.MethodGet:
		if err := json.NewEncoder(rw).Encode(trainings); err != nil {
			http.Error(rw, "Encoding went wrong", 400)
		}
	case http.MethodPost:
		var newSchedule []Training
		if err := json.NewDecoder(req.Body).Decode(&newSchedule); err != nil {
			http.Error(rw, "Decoding went wrong", 400)
			return
		}

		trainingDB[user.TeamKey] = newSchedule
		team.NextTraining = newSchedule[len(newSchedule)-1]
		teamDB[user.TeamKey] = team
	default:
		http.Error(rw, "Wrong Method", http.StatusMethodNotAllowed)
		return
	}
}

func signUpData(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		log.Print("404 Not Found")
		return
	}
	var u User
	err := json.NewDecoder(req.Body).Decode(&u)
	if err != nil {
		io.WriteString(rw, "/signup")
		log.Print("invalid email/password")
		return
	}
	if userDB[u.Email].Password != "" {
		io.WriteString(rw, "/signup")
		log.Print("Existing account under this Email")
		return
	}
	uid := uuid.NewV4()
	sessionDB[uid.String()] = u.Email
	userDB[u.Email] = u
	teamDB[u.TeamKey].appendPlayer(u)
	http.SetCookie(rw, &http.Cookie{
		Name:   "session",
		Value:  uid.String(),
		MaxAge: 80000,
	})
	io.WriteString(rw, "/home")
}
func loginData(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		io.WriteString(rw, "404 Not Found")
		return
	}
	if isAlreadyLoggedIn(req) {
		io.WriteString(rw, "/home")
		return
	}
	var u User
	err := json.NewDecoder(req.Body).Decode(&u)
	if err != nil {
		io.WriteString(rw, "/")
		log.Print("email and password dont match")
		return
	}
	if userDB[u.Email].Password == "" {
		io.WriteString(rw, "/signup")
		log.Print("Not Signed Up yet!")
		return
	}
	uid := uuid.NewV4()
	sessionDB[uid.String()] = u.Email
	if userDB[u.Email].Password == u.Password {
		http.SetCookie(rw, &http.Cookie{
			Name:   "session",
			Value:  uid.String(),
			MaxAge: 80000,
		})
		io.WriteString(rw, "/home")
	}

}
func homeUserData(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(rw, "Not Found", 404)
		return
	}

	user, _, _ := getData(rw, req)

	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(user); err != nil {
		http.Error(rw, "Something went wrong", http.StatusInternalServerError)
	}
}

func homeTeamData(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(rw, "Not Found", 404)
		return
	}

	_, team, _ := getData(rw, req)

	rw.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(rw).Encode(team); err != nil {
		http.Error(rw, "Something went wrong", http.StatusNotFound)
	}
}

func createTeamData(rw http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(rw, "Wrong Method", http.StatusMethodNotAllowed)
		return
	}

	var t Team

	err := json.NewDecoder(req.Body).Decode(&t)
	if err != nil {
		http.Error(rw, "Something went Wrong", 400)
	}
	teamDB[t.TeamKey] = t
	io.WriteString(rw, "/signup")

}

func isAlreadyLoggedIn(req *http.Request) bool {
	c, err := req.Cookie("session")
	if err != nil {
		return false
	}
	if sessionDB[c.Value] == "" {
		return false
	}
	return true
}

func withCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func getData(rw http.ResponseWriter, req *http.Request) (user User, team Team, trainings []Training) {
	c, err := req.Cookie("session")

	if err != nil {
		http.Error(rw, "Session not found. Please login again", http.StatusForbidden)
		return
	}
	user, ok := userDB[sessionDB[c.Value]]

	if !ok {
		http.Error(rw, "Not found in DB 1", http.StatusInternalServerError)
	}
	team, ok = teamDB[user.TeamKey]
	if !ok {
		http.Error(rw, "Not found in DB", http.StatusInternalServerError)
	}
	trainings, ok = trainingDB[team.TeamKey]
	if !ok {
		log.Print("Trainings not found in DB")
	}

	return user, team, trainings
}

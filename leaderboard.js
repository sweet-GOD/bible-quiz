// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA6plJAx72JCoDiHCZ8P7Kt93qgCFGUF8o",
    authDomain: "bible-quiz-67ddc.firebaseapp.com",
    databaseURL: "https://bible-quiz-67ddc-default-rtdb.firebaseio.com",
    projectId: "bible-quiz-67ddc",
    storageBucket: "bible-quiz-67ddc.appspot.com",
    messagingSenderId: "315169329092",
    appId: "1:315169329092:web:9a6a1b30985ddfe19e9e91"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = firebase.database();

const leaderboardElement = document.getElementById("leaderboard");

function updateLeaderboard() {
    const leaderboardRef = database.ref("leaderboard");
    leaderboardRef.orderByChild("score").limitToLast(10).once("value", (snapshot) => {
        const leaderboardData = [];
        snapshot.forEach((childSnapshot) => {
            const entry = childSnapshot.val();
            leaderboardData.push(entry);
        });

        // Generate HTML for the leaderboard
        let leaderboardHTML = "<h2>Leaderboard</h2><ul>";
        for (const entry of leaderboardData) {
            leaderboardHTML += `<li>${entry.name}: ${entry.score}</li>`;
        }
        leaderboardHTML += "</ul>";

        leaderboardElement.innerHTML = leaderboardHTML;
    });
}

// Call the updateLeaderboard function to display the leaderboard when the page loads
updateLeaderboard();

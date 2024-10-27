// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdYqEKabIlm02vRfVOuBJYJF0PKCpavkQ",
    authDomain: "sportsday-c7a16.firebaseapp.com",
    databaseURL: "https://sportsday-c7a16-default-rtdb.firebaseio.com",
    projectId: "sportsday-c7a16",
    storageBucket: "sportsday-c7a16.appspot.com",
    messagingSenderId: "894609801143",
    appId: "1:894609801143:web:d8cb620c60a278c0c07232",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Firebase Initialized Successfully");

// References to database paths
const participantRef = ref(db, 'ParticipantList');
const houseRef = ref(db, 'HouseList');

// Function to update the leaderboard
function updateLeaderboard(snapshot) {
    const students = snapshot.val();
    console.log("Received data from Firebase:", students);

    const studentList = document.getElementById('student-list');
    if (!studentList || !students) return;

    studentList.innerHTML = ''; // Clear previous entries

    // Sort students by points in descending order and display them
    const sortedStudents = Object.entries(students).sort(([, pointsA], [, pointsB]) => pointsB - pointsA);
    sortedStudents.forEach(([studentId, points]) => {
        const studentRow = `<tr>
                                <td>${studentId}</td>
                                <td>${points}</td>
                            </tr>`;
        studentList.innerHTML += studentRow; // Append new row to table
    });
    console.log("Participant table updated and sorted by points.");
}

// Listen for changes to the ParticipantList in Firebase
onValue(participantRef, updateLeaderboard);

// Function to update the countdown timer
function updateClock() {
    const endDate = "30 November 2024 8:00 AM";
    const end = new Date(endDate);
    const now = new Date();
    const d = (end - now) / 1000; // Difference in seconds

    // Update each flip-card with the current time values
    const days = Math.floor(d / 3600 / 24);
    const hours = Math.floor((d / 3600) % 24);
    const minutes = Math.floor((d / 60) % 60);
    const seconds = Math.floor(d % 60);

    const cards = document.querySelectorAll('.flip-card');
    cards[0].querySelector('.top-flip').textContent = days;
    cards[1].querySelector('.top-flip').textContent = hours;
    cards[2].querySelector('.top-flip').textContent = minutes;
    cards[3].querySelector('.top-flip').textContent = seconds;
}

// Call updateClock every second
setInterval(updateClock, 1000);
updateClock(); // Initial call to set the time on load

// Function to update house points
function updateHousePoints(snapshot) {
    const data = snapshot.val();
    if (data) {
        document.getElementById('redBox').textContent = data.R;
        document.getElementById('blueBox').textContent = data.B;
        document.getElementById('greenBox').textContent = data.G;
        document.getElementById('yellowBox').textContent = data.Y;
        console.log("House points updated:", data);
    }
}

// Listen for changes to the HouseList in Firebase
onValue(houseRef, updateHousePoints);

// Optional: Observe the student list for DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        console.log('DOM modified:', mutation);
    });
});
observer.observe(document.body, { childList: true, subtree: true });

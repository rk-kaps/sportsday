
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue ,get,child} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyAdYqEKabIlm02vRfVOuBJYJF0PKCpavkQ",
    authDomain: "sportsday-c7a16.firebaseapp.com",
    databaseURL: "https://sportsday-c7a16-default-rtdb.firebaseio.com",
    projectId: "sportsday-c7a16",
    storageBucket: "sportsday-c7a16.appspot.com",
    messagingSenderId: "894609801143",
    appId: "1:894609801143:web:d8cb620c60a278c0c07232",
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Firebase Initialized Successfully");


const participantRef = ref(db, 'ParticipantList');
//ref(db, `Classes/${selectedClass}/EVENTS/${selectedEvent}/PARTICIPANTS`)
const houseRef = ref(db, 'HouseList');


function updateLeaderboard(snapshot) {
    const students = snapshot.val();
    console.log("Received data from Firebase:", students);

    const studentList = document.getElementById('student-list');
    if (!studentList || !students) return;

    studentList.innerHTML = ''; 

    
    const sortedStudents = Object.entries(students).sort(([, pointsA], [, pointsB]) => pointsB - pointsA);
    sortedStudents.slice(0, 3).forEach(([studentId, points]) => {
        const studentRow = `<tr>
                                <td>${studentId}</td>
                                <td>${points}</td>
                            </tr>`;
        studentList.innerHTML += studentRow; 
    });
    console.log("Participant table updated and sorted by points.");
}
function updateEvents() {
    const classSelect = document.getElementById('class');
    const selectedClass = classSelect.value;
    const eventSelect = document.getElementById('event');

   
    eventSelect.innerHTML = '';

   
    const dbRef = ref(db);
    console.log("selected class");
    get(child(dbRef, 'Classes/' + selectedClass + '/EVENTS')).then((snapshot) => {
        if (snapshot.exists()) {
            const events = snapshot.val();
            Object.keys(events).forEach(event => {
                const option = document.createElement('option');
                option.value = event;
                option.textContent = event;
                eventSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No events available';
            eventSelect.appendChild(option);
        }
    }).catch((error) => {
        console.error('Error fetching events:', error);
    });
}
document.getElementById('eventForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const selectedClass = document.getElementById('class').value;
    const selectedEvent = document.getElementById('event').value;
    onValue(ref(db, `Classes/${selectedClass}/EVENTS/${selectedEvent}/PARTICIPANTS`), updateLeaderboard);
});

function updateClock() {
    const endDate = "30 November 2024 8:00 AM";
    const end = new Date(endDate);
    const now = new Date();

    const d = (end - now) / 1000;
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


setInterval(updateClock, 1000);
updateClock(); 

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


onValue(houseRef, updateHousePoints);

window.updateEvents = updateEvents;

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        console.log('DOM modified:', mutation);
    });
});
observer.observe(document.body, { childList: true, subtree: true });

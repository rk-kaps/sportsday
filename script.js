import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAdYqEKabIlm02vRfVOuBJYJF0PKCpavkQ",
    authDomain: "sportsday-c7a16.firebaseapp.com",
    databaseURL: "https://sportsday-c7a16-default-rtdb.firebaseio.com",
    projectId: "sportsday-c7a16",
    storageBucket: "sportsday-c7a16.appspot.com",
    messagingSenderId: "894609801143",
    appId: "1:894609801143:web:d8cb620c60a278c0c07232",
};

// Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
console.log("Firebase Initialized Successfully");

const dbRef = ref(db, 'students'); 
onValue(dbRef, (snapshot) => {
    console.log("Received data from Firebase");
    const students = snapshot.val();
    console.log(students);

    if (!students) {
        console.error("No student data found.");
        return;
    }

    const studentList = document.getElementById('student-list');
    if (studentList) {
        studentList.innerHTML = ''; 

        const sortedStudents = Object.entries(students).sort(([, pointsA], [, pointsB]) => pointsB - pointsA);

       
        sortedStudents.forEach(([studentId, points]) => {
            const studentRow = `<tr>
                                    <td>${studentId}</td>
                                    <td>${points}</td>
                                </tr>`;
            studentList.innerHTML += studentRow; 
        });
        console.log("Student table updated and sorted by points.");
    }

//clockstuff
const cards = document.querySelectorAll('.flip-card');
function updateClock() {
    const endDate = "30 November 2024 8:00 AM";

    

    const end = new Date(endDate);
    const now = new Date();
    const d = (end - now)/1000;
   
    cards[0].querySelector('.top').textContent = Math.floor(d/3600/24);
    cards[1].querySelector('.top').textContent = Math.floor(d/3600)%24;
    cards[2].querySelector('.top').textContent = Math.floor(d/60)%60;
    cards[3].querySelector('.top').textContent =Math.floor(d)%60;
   
}
    
setInterval(updateClock, 1000);


updateClock();
    
});

// MutationObserver 
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log('DOM modified:', mutation);
    });
});


observer.observe(document.body, { childList: true, subtree: true });

// Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdYqEKabIlm02vRfVOuBJYJF0PKCpavkQ",
    authDomain: "sportsday-c7a16.firebaseapp.com",
    databaseURL: "https://sportsday-c7a16-default-rtdb.firebaseio.com",
    projectId: "sportsday-c7a16",
    storageBucket: "sportsday-c7a16.appspot.com",
    messagingSenderId: "894609801143",
    appId: "1:894609801143:web:d8cb620c60a278c0c07232",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase Initialized Successfully");

const dbRef = ref(db, 'students');

// Fetch and render student data
onValue(dbRef, (snapshot) => {
    const students = snapshot.val();
    console.log("Received data from Firebase:", students);

    // Get the tbody element
    const studentList = document.getElementById('student-list');
    
    // Clear the existing table rows
    studentList.innerHTML = ''; 

    // Check if there's valid student data
    if (students) {
        // Loop through each student and add a table row
        Object.keys(students).forEach(studentId => {
            const points = students[studentId];

            // Create a new row
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const pointsCell = document.createElement('td');

            // Set the cell content
            nameCell.textContent = studentId;
            pointsCell.textContent = `${points} points`;

            // Append the cells to the row
            row.appendChild(nameCell);
            row.appendChild(pointsCell);

            // Append the row to the table
            studentList.appendChild(row);
        });
    } else {
        // Handle case where there are no students
        studentList.innerHTML = '<tr><td colspan="2">No student data available</td></tr>';
    }
});

// MutationObserver to watch for DOM changes
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        console.log('DOM modified:', mutation);
        // You can run additional code when DOM changes are detected
    });
});

// Observe the student list for any changes
observer.observe(document.body, { childList: true, subtree: true });

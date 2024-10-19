     // Get elements from the DOM
const userIcon = document.getElementById('userIcon'); // The user icon that triggers the login popup
const loginModal = document.getElementById('loginModal'); // The login modal itself
const signupModal = document.getElementById('signupModal'); // The signup modal
const closeModalBtns = document.querySelectorAll('.close-btn'); // Close buttons within modals
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const messageArea = document.getElementById('message');
const signupMessageArea = document.getElementById('signupMessage');

// Function to toggle password visibility
function togglePasswordVisibility(inputField, toggleIcon) {
    toggleIcon.addEventListener('click', () => {
        const type = inputField.getAttribute('type') === 'password' ? 'text' : 'password';
        inputField.setAttribute('type', type);
        toggleIcon.textContent = type === 'password' ? '👁️' : '🙈'; // Change icon based on visibility
    });
}

// Get password input fields and their toggle icons
const loginPasswordField = document.getElementById('password');
const signupPasswordField = document.getElementById('signupPassword');
const toggleLoginPasswordIcon = document.getElementById('toggleLoginPassword');
const toggleSignupPasswordIcon = document.getElementById('toggleSignupPassword');

// Initialize toggle password visibility
togglePasswordVisibility(loginPasswordField, toggleLoginPasswordIcon);
togglePasswordVisibility(signupPasswordField, toggleSignupPasswordIcon);

// Sample users for demo purposes
const usersDatabase = []; // This would typically be fetched from a server

// Function to open the login modal
function openLoginModal() {
    loginModal.style.display = 'block'; // Display the login modal
    signupModal.style.display = 'none'; // Hide the signup modal
}

// Function to open the signup modal
function openSignupModal() {
    signupModal.style.display = 'block'; // Display the signup modal
    loginModal.style.display = 'none'; // Hide the login modal
}

// Function to close modals
function closeModals() {
    loginModal.style.display = 'none'; // Hide the login modal
    signupModal.style.display = 'none'; // Hide the signup modal
}

// Event listeners for opening modals
userIcon.addEventListener('click', openLoginModal);
document.getElementById('openSignup').addEventListener('click', (e) => {
    e.preventDefault();
    openSignupModal(); // Open signup modal
});
document.getElementById('openLogin').addEventListener('click', (e) => {
    e.preventDefault();
    openLoginModal(); // Open login modal
});

// Close the modals when the close button (X) is clicked
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

// Close the modal if the user clicks anywhere outside of the modal content
window.addEventListener('click', function(event) {
    if (event.target === loginModal || event.target === signupModal) {
        closeModals();
    }
});

let isLoggedIn = false; // Track login state
let currentUserEmail = ''; // Store current user's email

// Handle signup
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const existingUser = usersDatabase.find(u => u.email === email);

    if (existingUser) {
        signupMessageArea.textContent = "Email already exists. Please login.";
        setTimeout(() => signupMessageArea.textContent = '', 3000);
    } else {
        usersDatabase.push({ name, email, password });
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        signupMessageArea.textContent = "Signup successful! You can now log in.";
        setTimeout(closeModals, 3000);
    }
});

// Handle login
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginID').value;
    const password = document.getElementById('password').value;

    const existingUser = usersDatabase.find(u => u.email === email);

    if (existingUser && existingUser.password === password) {
        isLoggedIn = true; // Set login state to true
        currentUserEmail = email; // Store the logged-in user's email

        // Show a welcome back message and hide the login form
        welcomeMessageArea.textContent = `Welcome back! Which of our exclusive deals would you like to get today?`;
        closeLoginModal(); // Optionally close the login modal

        // Update user icon
        userIcon.textContent = "👤"; // Change icon to a profile icon
    } else {
        messageArea.textContent = "Email doesn't exist or incorrect password. Please sign up.";
        setTimeout(() => messageArea.textContent = '', 3000);
    }
});

// Function to handle user icon click
userIcon.addEventListener('click', () => {
    if (isLoggedIn) {
        // Show user profile or logout option
        alert(`Logged in as ${currentUserEmail}`);
        // You could also open a modal with user options here
    } else {
        openLoginModal(); // Show login modal if not logged in
    }
});

// Auto-fill login form if credentials exist in local storage
window.addEventListener('load', () => {
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');

    if (savedEmail) {
        document.getElementById('loginID').value = savedEmail;
    }
    if (savedPassword) {
        document.getElementById('password').value = savedPassword;
    }
});
// Function to open the profile modal
function openProfileModal() {
    document.getElementById('userEmailDisplay').textContent = currentUserEmail; // Display current user email
    document.getElementById('profileModal').style.display = 'block'; // Show modal
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    isLoggedIn = false; // Reset login state
    currentUserEmail = ''; // Clear user email
    userIcon.textContent = "👥"; // Change icon back to user icon
    closeProfileModal(); // Close profile modal
});

// Event listener for user icon click
userIcon.addEventListener('click', () => {
    if (isLoggedIn) {
        openProfileModal(); // Show profile modal if logged in
    } else {
        openLoginModal(); // Show login modal if not logged in
    }
});



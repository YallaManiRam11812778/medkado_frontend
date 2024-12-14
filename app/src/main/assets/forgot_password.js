// Function to check server status
function checkServerStatus() {
    const pingUrl = "http://192.168.0.121:8003/api/method/ping";
    return fetch(pingUrl)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Server is down");
            }
        })
        .then((data) => {
            if (data && data.message === "pong") {
                console.log("Server is reachable.");
                return true; // Server is up
            } else {
                showToast("Server is down.");
                return false; // Server is down
            }
        })
        .catch((error) => {
            console.error("Error checking server status:", error);
            showToast("Server is down.");
            return false; // Server is down
        });
}
window.addEventListener("load", checkServerStatus);

// Forgot password logic
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value.trim();
    const phoneDigits = document.getElementById('phoneDigits').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const emailError = document.getElementById('emailError');
    const phoneDigitsError = document.getElementById('phoneDigitsError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const successMessage = document.getElementById('successMessage');
    const changePasswordSection = document.getElementById('changePasswordSection');

    let valid = true;

    // Validate Email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.style.display = 'block';
        valid = false;
    } else {
        emailError.style.display = 'none';
    }

    // Validate Last 4 Digits of Phone Number
    if (!phoneDigits || phoneDigits.length !== 4 || !/^\d{4}$/.test(phoneDigits)) {
        phoneDigitsError.style.display = 'block';
        valid = false;
    } else {
        phoneDigitsError.style.display = 'none';
    }

    // If email and phone are valid, hit the backend for verification
    if (valid) {
        const apiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.forgot_pwd";

        // Send data in POST body to avoid encoding
        const requestData = {
            email: email,
            phoneDigits: phoneDigits,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
        };

        // Make API request with POST method
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Send as JSON
            },
            body: JSON.stringify(requestData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("response ========== ,",data)
            if (data.status === 'success') {
                // If backend validation is successful, show the change password section
                changePasswordSection.classList.remove('hidden');
            } else {
                // If validation fails, show error message
                alert('The email and phone number do not match our records.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    }

    // Validate New Password
    if (newPassword && newPassword.length < 6) {
        passwordError.style.display = 'block';
        valid = false;
    } else {
        passwordError.style.display = 'none';
    }

    // Validate Confirm Password
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        confirmPasswordError.style.display = 'block';
        valid = false;
    } else {
        confirmPasswordError.style.display = 'none';
    }
});

// Function to navigate back to login
function goBack() {
    window.location.href = 'login-page.html';
}

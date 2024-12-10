// forgot-password.js
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value.trim();
    const phoneDigits = document.getElementById('phoneDigits').value.trim();
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');

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

    // Show Change Password Section if Email and Phone Digits are valid
    if (valid && changePasswordSection.classList.contains('hidden')) {
        changePasswordSection.classList.remove('hidden');
        return;
    }

    // Validate New Password
    if (newPassword && newPassword.value.length < 6) {
        passwordError.style.display = 'block';
        valid = false;
    } else {
        passwordError.style.display = 'none';
    }

    // Validate Confirm Password
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
        confirmPasswordError.style.display = 'block';
        valid = false;
    } else {
        confirmPasswordError.style.display = 'none';
    }

    // If all fields are valid, show success message
    if (valid) {
        successMessage.style.display = 'block';
        alert('Your password has been successfully updated!');
        window.location.href = 'login.html';
    }
});

// Function to navigate back to login
function goBack() {
    window.location.href = 'login-page.html';
}

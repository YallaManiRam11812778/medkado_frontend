document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const mobileDigits = document.getElementById('mobileDigits').value.trim();
    const birthDate = document.getElementById('birthDate').value.trim();
    const mobileError = document.getElementById('mobileError');
    const birthDateError = document.getElementById('birthDateError');
    const errorMessage = document.getElementById('error-message');

    let valid = true;

    // Validate Mobile Digits
    if (mobileDigits.length !== 4 || !/^\d{4}$/.test(mobileDigits)) {
        mobileError.style.display = 'block';
        valid = false;
    } else {
        mobileError.style.display = 'none';
    }

    // Validate Birth Date
    if (!birthDate) {
        birthDateError.style.display = 'block';
        valid = false;
    } else {
        birthDateError.style.display = 'none';
    }

    // Display final error message if not valid
    if (!valid) {
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
        alert('Password reset link sent to your registered email!');
        window.location.href = 'login.html';
    }
});

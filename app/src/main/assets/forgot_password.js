// Function to show a toaster message
function showToast(message, type = "success") {
    const toaster = document.createElement("div");
    toaster.className = `toaster ${type}`;
    toaster.textContent = message;

    // Append the toaster to the body
    document.body.appendChild(toaster);

    // Remove the toaster after 3 seconds
    setTimeout(() => {
        toaster.remove();
    }, 3000);
}

// Forgot password logic
document.getElementById('forgotPasswordForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value.trim();
    const phoneDigits = document.getElementById('phoneDigits').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const emailError = document.getElementById('emailError');
    const phoneDigitsError = document.getElementById('phoneDigitsError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
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

    // If all validations pass, proceed to call the API
    if (valid) {
        const apiUrl = "http://172.104.207.190:8009/api/method/medkado.medkado.doctype.medkado_user.medkado_user.forgot_pwd";
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
                console.log("Response:", data);

                if (data.message && data.message.success) {
                    // If backend validation is successful, show the change password section
                    changePasswordSection.classList.remove('hidden');
                    showToast("Your password has been successfully updated!");

                    // Redirect after 5 seconds
                    setTimeout(() => {
                        window.location.href = 'login-page.html'; // Redirect to login page
                    }, 1000);
                } else {
                    const errorMessage = data.message.message || "The email and phone number do not match our records.";
                    showToast(errorMessage, "error");
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                showToast("An error occurred. Please try again later.", "error");
            });
    }
});

// Restrict phoneDigits input to numeric values
document.getElementById('phoneDigits').addEventListener('input', function (event) {
    this.value = this.value.replace(/[^0-9]/g, ''); // Allow only numeric characters
});

// Function to navigate back to login
function goBack() {
    window.location.href = 'login-page.html'; // Redirect back to login page
}

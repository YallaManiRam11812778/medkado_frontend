document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Basic validation
    if (!username || !password) {
        // Show error messages for missing fields
        document.getElementById("username-error").style.display = username ? "none" : "block";
        document.getElementById("password-error").style.display = password ? "none" : "block";
        return; // Exit if validation fails
    } else {
        // Hide any previous error messages if inputs are valid
        document.getElementById("username-error").style.display = "none";
        document.getElementById("password-error").style.display = "none";
    }

    // Show loader
    const loader = document.querySelector(".loader");
    loader.style.display = "inline-block";

    // Prepare API parameters
    const apiUrl = "http://192.168.1.228:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.login_medkado";
    const params = new URLSearchParams({
        email: username,
        password: password
    });

    // Make API request
    fetch(`${apiUrl}?${params}`, {
        method: 'GET', // Change to 'POST' if necessary
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then(response => {
        if (response.ok) { // Check for status code 200
            return response.json();
        } else {
            throw new Error("Failed to authenticate"); // Handle non-200 responses
        }
    })
    .then(data => {
        loader.style.display = "none"; // Hide loader
        // Check if the response indicates success
        if (data.message.success) {
            // Ensure authToken is available
            const authToken = data.message && data.message.message ? data.message.message : null;
            if (authToken) {
                // Check if Android interface is available, then send data to save
                if (window.Android && window.Android.saveUserDetails) {
                    window.Android.saveUserDetails(JSON.stringify(authToken));
                    window.location.href = "file:///android_asset/home-page.html";
                } else {
                    console.error("Android interface not available.");
                }
            } else {
                console.error("Authorization token is missing from the response.");
            }
        } else {
            // Handle cases where success is false
            console.log(" login failed ======= ", data.message.message);
            alert("Login failed: " + data.message);
        }
    })
    .catch(error => {
        console.error('There was a problem with the login:', error);
        loader.style.display = "none"; // Hide loader on error
        // Optionally, display an error message to the user
        alert("Login failed. Please check your credentials and try again.");
    });
});

// Toggle password visibility
document.getElementById("toggle-password").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const toggleButton = document.getElementById("toggle-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleButton.textContent = "Hide";
    } else {
        passwordInput.type = "password";
        toggleButton.textContent = "Show";
    }
});
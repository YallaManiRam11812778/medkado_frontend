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
    const apiUrl = "http://192.168.0.112:8003/api/method/login";
    const params = new URLSearchParams({
        usr: username,
        pwd: password
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
        console.log("Redirecting to home_page...");
        window.location.href = "file:///android_asset/home_page.html"; // Redirect
        console.log("Redirected to home_page.html"); // Check if this line executes
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
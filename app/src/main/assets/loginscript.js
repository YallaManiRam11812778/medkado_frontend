// Function to check server status
function checkServerStatus() {
  const pingUrl = "http://192.168.0.112:8003/api/method/ping";

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

// Check server status when the page loads
window.addEventListener("load", checkServerStatus);

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent form submission

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Basic validation
    if (!username || !password) {
      // Show error messages for missing fields
      document.getElementById("username-error").style.display = username
        ? "none"
        : "block";
      document.getElementById("password-error").style.display = password
        ? "none"
        : "block";
      showToast("Please enter both username and password.");
      return; // Exit if validation fails
    } else {
      // Hide any previous error messages if inputs are valid
      document.getElementById("username-error").style.display = "none";
      document.getElementById("password-error").style.display = "none";
    }

    // Check server status before proceeding with login
    const isServerUp = await checkServerStatus();
    if (!isServerUp) {
      return; // Exit if server is down
    }

    // Show loader
    const loader = document.querySelector(".loader");
    loader.style.display = "inline-block";

    // Prepare API parameters
    const apiUrl =
      "http://192.168.0.112:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.login_medkado";
    const params = new URLSearchParams({
      email: username,
      password: password,
    });

    // Make API request
    fetch(`${apiUrl}?${params}`, {
      method: "GET", // Change to 'POST' if necessary
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        loader.style.display = "none"; // Hide loader
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to authenticate");
        }
      })
      .then((data) => {
        // Check if the response indicates success
        if (data.message && data.message.success) {
          const authToken = data.message.message || null;

          if (authToken) {
            if (window.Android && window.Android.saveUserDetails) {
              const authTokenString = JSON.stringify(authToken);
              console.log(
                " ============  authtoken ",
                authTokenString,
                typeof authTokenString
              );
              window.Android.saveApiResponse(authTokenString);
              showToast("Login Successful!");
              setTimeout(() => {
                window.location.href = "file:///android_asset/subscription-page.html";
              }, 1000); // Redirect after showing toast
            } else {
              console.error("Android interface not available.");
            }
          } else {
            console.error("Authorization token is missing from the response.");
            showToast("Authorization failed. Try again.");
          }
        } else {
          console.log("Login failed:", data.message.message);
          showToast(
            "Login failed: " + (data.message.message || "Invalid credentials.")
          );
        }
      })
      .catch((error) => {
        console.error("There was a problem with the login:", error);
        loader.style.display = "none";
        showToast("Login failed. Please check your credentials and try again.");
      });
  });

// Toggle password visibility
document
  .getElementById("toggle-password")
  .addEventListener("click", function () {
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

// Toast function
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Toast duration: 3 seconds
}

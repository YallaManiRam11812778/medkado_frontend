// Function to check server status
function checkServerStatus() {
  const pingUrl = "http://192.168.1.228:8003/api/method/ping";

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

// Ensure handleApiResponse is defined before it's called
function handleApiResponse(responseString) {
  try {
      console.log("responseString =============== ",responseString)
      // Convert the string response to a valid JSON object
      const response = JSON.parse(responseString.replace(/\'/g, "\"")); // Replace single quotes with double quotes
      console.log("Received API Response: ", response);

      if (response.success) {
          const message = JSON.parse(response.message); // Parse the nested message JSON
          console.log("Authorization token: ", message.Authorization);
      } else {
          console.log("API Response was not successful.");
      }
  } catch (error) {
      console.error("Error parsing API response: ", error);
  }
}


// Check server status when the page loads
window.addEventListener("load", checkServerStatus);

// Add event listener to the explore button
document.getElementById("exploreButton").addEventListener("click", async function (event) {
  event.preventDefault();

   // Check if the Android interface is available
   if (window.Android && window.Android.getApiResponse) {
    try {
      // Call the getApiResponse function from Kotlin
      window.Android.getApiResponse();
    } catch (error) {
      console.error("Error in getting API response:", error);
    }
  }

  const isServerUp = await checkServerStatus();
  console.log(" ==================  isServerUp:", isServerUp);

  // Hide the toast message after a timeout
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000000);

  if (!isServerUp) {
    return; // Exit if the server is down
  }

  // If the server is up, trigger further logic
});
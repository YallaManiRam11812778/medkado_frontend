// Function to check server status and get API response if server is up
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

        // Check if the Android interface is available
        if (window.Android && window.Android.getApiResponse) {
          try {
            // Call the getApiResponse function from Kotlin
            const headers_with_tokens = String(window.Android.getApiResponse());
            if (headers_with_tokens.includes("Authorization")) {
              const cleanedHeaders = headers_with_tokens.replace(/\\'/g, '"');
              const jsonified_headers = JSON.parse(cleanedHeaders);
              return jsonified_headers; // Return parsed headers if "Authorization" is found
            } else {
              // Redirect to login page if "Authorization" is not found
              window.location.href = "file:///android_asset/login-page.html";
              return false;
            }
          } catch (error) {
            console.error("Error in getting API response:", error);
            return null;
          }
        }
      } else {
        throw new Error("Server is down");
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

// Function to check server status and get API response if server is up
async function checkServerStatus() {
  const pingUrl = "http://192.168.0.112:8003/api/method/ping";

  try {
    const response = await fetch(pingUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.message === "pong") {
        console.log("Server is reachable.");

        // Check if the Android interface is available
        if (window.Android && window.Android.getApiResponse) {
          const headers_with_tokens = String(window.Android.getApiResponse());
          if (headers_with_tokens.includes("Authorization")) {
            const cleanedHeaders = headers_with_tokens.replace(/\\'/g, '"');
            const jsonified_headers = JSON.parse(cleanedHeaders);
            return jsonified_headers; // Return parsed headers with token
          } else {
            // Redirect to login page if "Authorization" is not found
            window.location.href = "file:///android_asset/login-page.html";
            return false;
          }
        }
      }
    }
    throw new Error("Server is down");
  } catch (error) {
    console.error("Error checking server status:", error);
    showToast("Server is down.");
    return false;
  }
}

// Add event listener to the explore button
document.getElementById("exploreButton").addEventListener("click", async function (event) {
  event.preventDefault();

  // Check server status and get headers
  const headers = await checkServerStatus();
  console.log("Header ==========  ",headers)
  // Hide the toast message after a timeout
  // setTimeout(() => {
  //   toast.classList.remove("show");
  // }, 3000);

  if (!headers) {
    // Exit if the server is down or headers are not available
    return;
  } else {
    // Use headers to make a request
    try {
      const exploreUrl = "http://192.168.0.112:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_home_page.explore_plans";
      const exploreResponse = await fetch(exploreUrl, {
        method: "GET",
        headers: headers, // Pass headers directly
      });
      
      const exploreData = await exploreResponse.json();
      console.log("Explore plans response:", exploreData);
      
      // Handle explore data response here
    } catch (error) {
      console.error("Error fetching explore plans:", error);
    }
  }
});

// Function to check server status and get API response if server is up
async function checkServerStatus() {
  const pingUrl = "http://192.168.0.112:8003/api/method/ping";

  try {
    const response = await fetch(pingUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.message === "pong") {

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

// Event listener for the explore button
document.getElementById("exploreButton").addEventListener("click", async function (event) {
  event.preventDefault();

  // Check server status and get headers
  const headers = await checkServerStatus();

  if (!headers) {
    // Exit if the server is down or headers are not available
    return;
  } else {
    // Use headers to make a request
    try {
      const exploreUrl = "http://192.168.0.112:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_home_page.explore_plans";
      const exploreResponse = await fetch(exploreUrl, {
        method: "GET",
        headers: headers
      });
      // Check if the response status is 401
    if (exploreResponse.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = "file:///android_asset/login-page.html";
      return; // Stop further execution
  }
      const exploreData = await exploreResponse.json();
      if (exploreData.message.success) {
        const data_explored = exploreData.message.message
        // Store the explore data in sessionStorage to access it on subscription.html
        sessionStorage.setItem('explorePlans', JSON.stringify(data_explored));
        window.location.href = "file:///android_asset/subscription-page.html";
      } else { return false
      }
      // Redirect to subscription.html after storing the data
    } catch (error) {
      console.error("Error fetching explore plans:", error);
    }
  }
});



// Get the button and card elements
const flipButton = document.getElementById("flipButton");
const debitCard = document.getElementById("debitCard");

// Add a click event listener to the button
flipButton.addEventListener("click", function() {
  // Toggle the card flip
  debitCard.classList.toggle("flipped");
});


// URL of the backend API (replace with your actual endpoint)
const apiUrl = "http://your-backend-url/api/get-card-details";

// Get the elements to update
const cardNumberElem = document.querySelector(".card-number");
const cardExpiryElem = document.querySelector(".card-expiry");
const cardPurchaseDateElem = document.querySelector(".card-purchase-date");
const termsElem = document.querySelector(".terms");
const websiteLinkElem = document.querySelector(".website-link");

// Fetch data from the backend and update the card content
async function fetchCardDetails() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch card details");
    }
    const cardData = await response.json();

    // Update the card details dynamically
    cardNumberElem.textContent = cardData.card_number;
    cardExpiryElem.textContent = `Validity: ${cardData.expiry_date}`;
    cardPurchaseDateElem.textContent = `Date of Purchase: ${cardData.purchase_date}`;
  } catch (error) {
    console.error("Error fetching card details:", error);
  }
}

// Function to check server status and get API response if server is up
async function checkServerStatus() {
  const pingUrl = "http://192.168.0.121:8003/api/method/ping";

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
  console.log(" headers ========  ",headers)
  if (!headers) {
    // Exit if the server is down or headers are not available
    return;
  } else {
    // Use headers to make a request
    try {
      const exploreUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_home_page.explore_plans";
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

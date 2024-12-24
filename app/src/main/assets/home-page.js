// Get the button and card elements
const flipButton = document.getElementById("flipButton");
const debitCard = document.getElementById("debitCard");

// Add a click event listener to the button
flipButton.addEventListener("click", function () {
  // Toggle the card flip
  debitCard.classList.toggle("flipped");
});

// Get the elements to update
const cardNumberElem = document.querySelector(".card-number");
const cardExpiryElem = document.querySelector(".card-expiry");
const cardPurchaseDateElem = document.querySelector(".card-purchase-date");
const termsElem = document.querySelector(".terms");
const websiteLinkElem = document.querySelector(".website-link");

// Fetch data from the backend and update the card content
async function dashboard_data_fun(headers) {
  try {
    const dashboard_data = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_home_page.dashboard_data";
    const dashboard_data_response = await fetch(dashboard_data, {
      method: "GET",
      headers: headers
    });
    if (!dashboard_data_response.ok) {
      throw new Error("Failed to fetch card details");
    }
    if (dashboard_data_response.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = "file:///android_asset/login-page.html";
      return; // Stop further execution
    }
    const cardData = await dashboard_data_response.json();
    if (cardData.message.success) {
      const data_explored = cardData.message.message;
      return data_explored;
    }
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

// Call the required functions when the page loads
document.addEventListener("DOMContentLoaded", async function () {
  const headers = await checkServerStatus();

  if (headers) {
    // Fetch card details if headers are available
    const response_dashboard = await dashboard_data_fun(headers);
    if (response_dashboard) {
      // Dynamically update card details with response data
      if (response_dashboard.doe) {
        cardExpiryElem.textContent = response_dashboard.doe; // Update MM/YY
      }
      const withdrawalAmountElement = document.getElementById("withdrawal-amount");
      if (withdrawalAmountElement) {
        withdrawalAmountElement.textContent = response_dashboard.withdrawal;
        }
      const cardNumber_ref = document.getElementById("cardNumber");
      if (cardNumber_ref) {
        cardNumber_ref.textContent = response_dashboard.card_number;
        }
      if (response_dashboard.dop) {
        cardPurchaseDateElem.textContent = `Date of Purchase: ${response_dashboard.dop}`; // Update date of purchase
      }

      if (response_dashboard.available_coupons) {
        const dynamicCouponCountElem = document.getElementById("dynamicCouponCount");
        dynamicCouponCountElem.textContent = response_dashboard.available_coupons; // Update coupon count
      }
    } else {
      console.error("Response data is missing.");
    }
  } else {
    console.error("Unable to fetch card details. Headers are missing.");
  }
});

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
        const data_explored = exploreData.message.message;
        // Store the explore data in sessionStorage to access it on subscription.html
        sessionStorage.setItem("explorePlans", JSON.stringify(data_explored));
        window.location.href = "file:///android_asset/subscription-page.html";
      } else {
        return false;
      }
      // Redirect to subscription.html after storing the data
    } catch (error) {
      console.error("Error fetching explore plans:", error);
    }
  }
});

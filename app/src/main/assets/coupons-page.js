// Define the API endpoint for the coupons
const couponsApiUrl = "http://192.168.0.112:8003/api/method/medkado.medkado.doctype.available_coupons_items.available_coupons_items.coupons_page";

// Function to check server status and retrieve headers if the server is up
async function checkServerStatus() {
  const pingUrl = "http://192.168.0.112:8003/api/method/ping";

  try {
    const response = await fetch(pingUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data.message === "pong") {
        
        // Get API response headers with tokens if available
        if (window.Android && window.Android.getApiResponse) {
          const headersWithTokens = String(window.Android.getApiResponse());
          if (headersWithTokens.includes("Authorization")) {
            const cleanedHeaders = headersWithTokens.replace(/\\'/g, '"');
            return JSON.parse(cleanedHeaders);
          } else {
            console.warn("No authorization token found. Redirecting to login.");
            window.location.href = "file:///android_asset/login-page.html";
            return null;
          }
        }
      }
    }
    throw new Error("Server is down");
  } catch (error) {
    console.error("Error checking server status:", error);
    if (typeof showToast === 'function') showToast("Server is down."); // Display toast if showToast is defined
    return null;
  }
}

// Function to fetch coupon data with provided headers
async function fetchCouponData(headers) {
  try {
    const response = await fetch(couponsApiUrl, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 401) {
      console.warn("Unauthorized. Redirecting to login.");
      window.location.href = "file:///android_asset/login-page.html";
      return;
    }

    const couponData = await response.json();
    if (couponData.message.success) {
      const coupons = couponData.message.message;
      displayCouponData(coupons);
    } else {
      console.error("Failed to fetch coupon data.");
    }
  } catch (error) {
    console.error("Error fetching coupon data:", error);
  }
}

// Function to dynamically display coupon data
function displayCouponData(coupons) {
  const couponSection = document.querySelector(".coupon-section");
  couponSection.innerHTML = ''; // Clear previous coupons

  // Calculate the sum of available_number_of_coupons
  const totalCouponsLeft = coupons.reduce((sum, coupon) => sum + coupon.available_number_of_coupons, 0);

  // Update the total count in the specified span element
  const couponCountSpan = document.querySelector('.container .header .coupon-count span');
  if (couponCountSpan) {
    couponCountSpan.textContent = `x ${totalCouponsLeft} free coupons`;
  }

  // Create individual coupon elements and append them to the coupon section
  coupons.forEach(coupon => {
    const couponCard = document.createElement("div");
    couponCard.classList.add("coupon-card");

    const couponTitle = document.createElement("h2");
    couponTitle.classList.add("coupon-title");
    couponTitle.textContent = coupon.category;
    couponCard.appendChild(couponTitle);

    const couponCount = document.createElement("p");
    couponCount.classList.add("coupon-details");
    couponCount.textContent = `x ${coupon.available_number_of_coupons} free coupons`;
    couponCard.appendChild(couponCount);

    const checkAvailabilityBtn = document.createElement("button");
    checkAvailabilityBtn.classList.add("check-availability-btn");
    checkAvailabilityBtn.textContent = "Check availability";
    checkAvailabilityBtn.setAttribute("data-category", coupon.category);
    checkAvailabilityBtn.setAttribute("data-coupons", coupon.available_number_of_coupons);
    couponCard.appendChild(checkAvailabilityBtn);

    couponSection.appendChild(couponCard);
  });
}

// Event listener to load coupon data on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function () {
  console.log('DOM fully loaded');

  const headers = await checkServerStatus();
  if (headers) {
    fetchCouponData(headers); // Call the API if headers are retrieved
  }
});

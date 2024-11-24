// Define the API endpoint for the coupons
const redeemApiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.available_coupons_items.available_coupons_items.coupons_page";
const redeemCouponApiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_hospitals.medkado_hospitals.redeem_coupon";

// Function to check server status and retrieve headers if the server is up
async function checkServerStatus() {
  const pingUrl = "http://192.168.0.121:8003/api/method/ping";

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
    return null;
  }
}

// Function to fetch coupon data with provided headers
async function fetchCouponData(headers) {
  try {
    const response = await fetch(redeemApiUrl, {
      method: "GET",
      headers: headers
    });

    if (response.status === 401) {
      console.warn("Unauthorized. Redirecting to login.");
      window.location.href = "file:///android_asset/login-page.html";
      return;
    }

    const couponData = await response.json();
    if (couponData.message.success) {
      const coupons = couponData.message.message.map(coupon => ({
        category: coupon.category,
        available_number_of_coupons: coupon.available_number_of_coupons
      }));
      displayCouponData(coupons);
    } else {
      console.log(" Eror is =============== ",couponData)
      console.error("Failed to fetch coupon data.");
    }
  } catch (error) {
    console.error("Error fetching coupon data:", error);
  }
}

// Function to dynamically display coupon data in Redeem page
function displayCouponData(coupons) {
  const couponSection = document.querySelector(".coupon-section");
  couponSection.innerHTML = ''; // Clear previous coupons

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

    const redeemButton = document.createElement("button");
    redeemButton.classList.add("redeem-btn");
    redeemButton.textContent = "Redeem Now";
    redeemButton.setAttribute("data-category", coupon.category);
    redeemButton.setAttribute("data-coupons", coupon.available_number_of_coupons);
    redeemButton.onclick = openPopup;
    couponCard.appendChild(redeemButton);
    couponSection.appendChild(couponCard);
  });
}

// Function to open the popup for redeeming the coupon
function openPopup(event) {
  const popup = document.getElementById("popupContainer");
  popup.style.display = "block";

  // Save selected category and available coupons in the popup
  const selectedCategory = event.target.getAttribute("data-category");
  const availableCoupons = event.target.getAttribute("data-coupons");

  // Get the input fields by their IDs
  const categoryInput = document.getElementById("categoryInput");
  const couponsInput = document.getElementById("couponsInput");

  // Ensure the inputs exist before trying to set their values
  if (categoryInput && couponsInput) {
    categoryInput.value = selectedCategory;
    couponsInput.value = availableCoupons;
  } else {
    console.error("Category or Coupons input field is missing in the popup.");
  }
}

// Function to close the popup
function closePopup() {
  const popup = document.getElementById("popupContainer");
  popup.style.display = "none";
}

async function submitForm() {
  const category = document.getElementById("categoryInput").value;
  const hospitalCode = document.getElementById("inputField").value;

  if (!hospitalCode) {
    alert("Please enter the hospital code.");
    return;
  }

  const headers = await checkServerStatus();
  if (!headers) {
    return;
  }

  const queryParams = new URLSearchParams({
    category: category,
    hospital_code: hospitalCode,
  });

  try {
    const redeemcoupon_response = await fetch(`${redeemCouponApiUrl}?${queryParams}`, {
      method: "GET",
      headers: headers
    });
    if (redeemcoupon_response.status === 401) {
      // Redirect to login page if unauthorized
      window.location.href = "file:///android_asset/login-page.html";
      return; // Stop further execution
  }
    const redeem_status_data = await redeemcoupon_response.json();
    if (redeem_status_data.message.success) {
      console.log("Coupon redeemed successfully:", redeem_status_data.message.message);
      showToast(redeem_status_data.message.message)
      closePopup();
      window.location.href = "file:///android_asset/Redeem-page.html";
    } else {
      closePopup();
      console.log("redeem_status_data.message.message",redeem_status_data.message.message)
      showToast(redeem_status_data.message.message)
      console.error("Error redeeming coupon:", redeem_status_data.message.message);
    }
  } catch (error) {
    console.error("Error during redeem:", error);
  }
}

// Event listener to load coupon data on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async function () {
  console.log('Redeem page loaded');
  const headers = await checkServerStatus();
  if (headers) {
    fetchCouponData(headers);
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

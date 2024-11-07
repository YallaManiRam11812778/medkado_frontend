function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to update page content based on URL parameters
function loadDynamicContent() {
    const category = getQueryParam('category') || 'Diagnostics';
    const coupons = getQueryParam('coupons') || '0';
    const expiry = getQueryParam('expiry') || 'No expiration set';

    // Update the header title and coupon info
    document.getElementById('category-title').textContent = category;
    document.getElementById('coupon-info').textContent = `x${coupons} coupons expire in ${expiry}`;
}

// Function to go back to the previous page
function redirectToPage() {
    window.history.back();
}

// Load dynamic content when the page loads
window.onload = loadDynamicContent;



// Fetch hospital data from the backend and render it
async function fetchHospitals() {
    try {
        const response = await fetch("http://127.0.0.1:8000/hospitals");
        const hospitals = await response.json();

        const hospitalList = document.getElementById("hospital-list");
        hospitalList.innerHTML = ""; // Clear any existing content

        // Check if there are hospitals in the response
        if (hospitals.length === 0) {
            // Display "No records found" if there is no data
            const noRecordsMessage = document.createElement("p");
            noRecordsMessage.textContent = "No records found";
            noRecordsMessage.classList.add("no-records-message");
            hospitalList.appendChild(noRecordsMessage);
        } else {
            hospitals.forEach(hospital => {
                const hospitalCard = document.createElement("div");
                hospitalCard.classList.add("hospital-card");

                hospitalCard.innerHTML = `
                    <img src="${hospital.logo_url}" alt="${hospital.name} logo">
                    <div class="hospital-info">
                        <h3>${hospital.name}</h3>
                        <p>${hospital.reports}</p>
                        <p class="mrp">MRP ${hospital.mrp} <span class="discount">Get ${hospital.discount}</span></p>
                    </div>
                    <div class="price">${hospital.price}</div>
                `;

                hospitalList.appendChild(hospitalCard);
            });
        }
    } catch (error) {
        console.error("Error fetching hospitals:", error);
    }
}

// Call the function to fetch and render hospitals
fetchHospitals();


function redirectToPage() {
        window.location.href = "coupons-page.html"; // Replace with your desired HTML page
    }
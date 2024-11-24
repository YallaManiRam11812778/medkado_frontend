// Function to fetch district options from the backend
async function fetchDistricts() {
    try {
        const response = await fetch('http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.locations_dropdown', { method: "GET" });
        const data = await response.json();
        if (data.message && data.message.message) {
            const districts = data.message.message;
            // Store the explore data in sessionStorage to access it on subscription.html
            sessionStorage.setItem('locations_dropdown', JSON.stringify(districts));
            const districtSelect = document.getElementById('country');

            // Clear existing options but retain the placeholder
            districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';

            // Add options to the select element dynamically
            districts.forEach(district => {
                const option = document.createElement('option');
                option.value = district.name; // Set option value to district name
                option.textContent = district.name; // Display district name
                districtSelect.appendChild(option);
            });
        } else {
            console.error('No districts available or invalid response format');
            return false;
        }
    } catch (error) {
        console.error('Error fetching district options:', error);
    }
}

// Function to fetch data for the selected district
async function fetchHospitalDataForDistrict(selectedDistrict, headers) {
    try {
        const mapsPageUrl = selectedDistrict
    ? `http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_available_districts.medkado_available_districts.maps_page?location=${encodeURIComponent(selectedDistrict)}`
    : `http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_available_districts.medkado_available_districts.maps_page`;

            const mapsPageResponse = await fetch(mapsPageUrl, {
            method: "GET",
            headers: headers,
        });

        if (mapsPageResponse.status === 401) {
            // Redirect to login page if unauthorized
            window.location.href = "file:///android_asset/login-page.html";
            return;
        }

        const exploreData = await mapsPageResponse.json();
        if (exploreData && exploreData.message && Array.isArray(exploreData.message.message)) {
            const dataExplored = exploreData.message.message;

            const hospitalListContainer = document.getElementById('hospitalList');
            if (!hospitalListContainer) {
                console.error("Hospital list container not found in the DOM");
                return;
            }

            hospitalListContainer.innerHTML = ''; // Clear the container before adding new items

            dataExplored.forEach(hospital => {
                const hospitalCard = document.createElement('div');
                hospitalCard.classList.add('hospital-card');

                // Create hospital card with dynamic data
                hospitalCard.innerHTML = `
                    <h2 class="hospital-name">${hospital.hospital_name}</h2>
                    <a class="view-location-btn" href="${hospital.location}" target="_blank">View location</a>
                    <div class="coupons-list">
                        ${hospital.category.map(category => `<p class="category-item">&#10003 ${category}</p>`).join('')}
                    </div>
                `;

                hospitalListContainer.appendChild(hospitalCard);
            });
        } else {
            console.error("Invalid response structure or empty data:", exploreData);
        }
    } catch (error) {
        console.error("Error fetching Maps:", error);
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
document.addEventListener('DOMContentLoaded', async () => {
    // Check server status and get headers
    const headers = await checkServerStatus();
    if (!headers) {
        // Exit if the server is down or headers are not available
        return;
    }

    // Fetch districts and attach event listener to dropdown
    await fetchDistricts();

    // Call the fetchHospitalDataForDistrict function with 'null' to hit the endpoint by default
    await fetchHospitalDataForDistrict(null, headers);  // Pass 'null' directly here

    // Remove event listener or modify it as needed for other interactions, since it's not needed to trigger the API by default.
    const districtSelect = document.getElementById('country');
    if (districtSelect) {
        districtSelect.addEventListener('change', async () => {
            const selectedDistrict = districtSelect.value;
            // Fetch and display hospital data for the selected district
            await fetchHospitalDataForDistrict(selectedDistrict, headers);
        });
    } else {
        console.error("Dropdown element #country not found in the DOM");
    }

    // Trigger fetching hospitals when location icon is clicked
    const locationIcon = document.querySelector('.location-icon');
    if (locationIcon) {
        locationIcon.addEventListener('click', async () => {
            const selectedDistrict = districtSelect ? districtSelect.value : null;
            await fetchHospitalDataForDistrict(selectedDistrict, headers);
        });
    } else {
        console.error("Location icon not found in the DOM");
    }
});

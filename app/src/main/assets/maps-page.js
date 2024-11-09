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

document.addEventListener('DOMContentLoaded', async () => {
    // Check server status and get headers
    const headers = await checkServerStatus();
    if (!headers) {
        // Exit if the server is down or headers are not available
        return;
    }

    try {
        const maps_page_Url = "http://192.168.0.112:8003/api/method/medkado.medkado.doctype.medkado_available_districts.medkado_available_districts.maps_page";
        const maps_page_Url_Response = await fetch(maps_page_Url, {
            method: "GET",
            headers: headers
        });

        // Check if the response status is 401 (Unauthorized)
        if (maps_page_Url_Response.status === 401) {
            // Redirect to login page if unauthorized
            window.location.href = "file:///android_asset/login-page.html";
            return; // Stop further execution
        }

        const exploreData = await maps_page_Url_Response.json();
        console.log("Received exploreData: ", exploreData); // Log the response data

        // Check if the message exists and is in the correct format
        if (exploreData && exploreData.message && Array.isArray(exploreData.message.message)) {
            const data_explored = exploreData.message.message;

            // Dynamically create the hospital list
            const hospitalListContainer = document.getElementById('hospitalList');
            hospitalListContainer.innerHTML = ''; // Clear the container before adding new items

            data_explored.forEach(hospital => {
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
});

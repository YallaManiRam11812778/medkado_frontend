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
                } else {
                    console.error("Android interface not available.");
                    showToast("Android interface not available.");
                    return false;
                }
            } else {
                throw new Error("Unexpected server response.");
            }
        } else {
            throw new Error(`Server responded with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error checking server status:", error);
        showToast("Server is down.");
        return false;
    }
}

async function fetchPlanDetails(headers) {
    const planApiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.family_members.family_members.my_family_members"; // Replace with actual API endpoint

    try {
        const response = await fetch(planApiUrl, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.message && result.message.success) {
            const plan = result.message.plan; // Adjust field names based on your API response
            renderPlanDetails(result.message.plan,result.message.date_of_purchase,result.message.validity);
            fillDetails(result.message.message);
        } else {
            throw new Error("Failed to fetch plan details.");
        }
    } catch (error) {
        console.error("Error fetching plan details:", error);
        showToast("Failed to load plan details. Please try again.");
    }
}

function renderPlanDetails(plan,date_of_purchase,validity) {
    if (!plan) {
        console.error("No plan details available.");
        showToast("No plan details found.");
        return;
    }

    // Dynamically update the plan details in the DOM
    const planName = document.getElementById("plan-name");
    const planDuration = document.getElementById("plan-duration");
    const planStart = document.getElementById("plan-start");

    // Update text content based on the plan data
    planName.textContent = plan || "N/A";
    planDuration.textContent = date_of_purchase || "N/A";
    planStart.textContent = validity || "N/A";
}


function fillDetails(profiles) {
    const profileList = document.getElementById("profile-list");
    profileList.innerHTML = ""; // Clear existing content

    if (profiles && profiles.length > 0) {
        profiles.forEach((profile) => {
            const listItem = document.createElement("li");
            listItem.className = "profile-item";

            // Create card content
            listItem.innerHTML = `
                <i class="ri-user-3-fill"></i>
                <div class="name">${profile.name1}</div>
                <div class="details">Age: ${profile.age}</div>
                <div class="gender">Gender: ${profile.gender}</div>
            `;

            profileList.appendChild(listItem);
        });
    } else {
        profileList.innerHTML = `<li class="error">No profiles found.</li>`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const headers = await checkServerStatus();
    if (!headers) return;

    // Fetch plan details
    await fetchPlanDetails(headers);

    // Fetch family profiles
    await fetchProfiles(headers);
});

function showToast(message) {
    console.log("Toast message:", message);
}

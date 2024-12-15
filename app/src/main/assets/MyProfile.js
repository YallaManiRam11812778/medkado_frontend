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

// Function to fetch data from the backend
async function fetchProfiles(headers) {
    const apiUrl =
        "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.family_members.family_members.my_family_members";

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.message && result.message.success) {
            const profiles = result.message.message; // Adjust field names based on your API response
            console.log("profiles =========== ",profiles)
            const my_plan = result.message.plan
            console.log(" my plan  ========= ",my_plan)
            fillDetails(profiles); // Pass data to the UI render function
        } else {
            throw new Error("Some Error Occured while fetching Family member details.");
        }
    } catch (error) {
        console.error("Error fetching profiles:", error);
        showToast("Failed to load profiles. Please try again.");
    }
}

function fillDetails(profiles) {
    const profileList = document.getElementById("profile-list");
    profileList.innerHTML = ""; // Clear existing content

    if (profiles && profiles.length > 0) {
        profiles.forEach((profile) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${profile.name1}, Age: ${profile.age}, Gender: ${profile.gender}`;
            profileList.appendChild(listItem);
        });
    } else {
        profileList.innerHTML = `<li class="error">No profiles found.</li>`;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Check server status and get headers
    const headers = await checkServerStatus();
    if (!headers) {
        // Exit if the server is down or headers are not available
        return;
    }

    // Fetch and display profiles
    await fetchProfiles(headers);
});

function showToast(message) {
    // Display a toast message (add your implementation or use a library)
    console.log("Toast message:", message);
}

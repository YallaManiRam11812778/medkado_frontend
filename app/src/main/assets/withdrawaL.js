// Function to navigate back to account page
function goBack() {
    window.location.href = "account-page.html";
}

async function checkServerStatus() {
    const pingUrl = "http://192.168.0.121:8003/api/method/ping";

    try {
        const response = await fetch(pingUrl);
        if (response.ok) {
            const data = await response.json();
            if (data && data.message === "pong") {
                if (window.Android && window.Android.getApiResponse) {
                    const headers_with_tokens = String(window.Android.getApiResponse());
                    if (headers_with_tokens.includes("Authorization")) {
                        const cleanedHeaders = headers_with_tokens.replace(/\\'/g, '"');
                        const jsonified_headers = JSON.parse(cleanedHeaders);
                        return jsonified_headers;
                    } else {
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
async function withdrawal_requesting(headers) {
    const apiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.done_payment_for_user";
    const paymentsList = document.getElementById("payments-list");
    const withdrawAmountElement = document.getElementById("withdraw-amount");
    // Clear previous entries before rendering new ones
    paymentsList.innerHTML = "";

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result," =================== ");
        // Ensure result.message and result.message.success exist
        if (!result.message || !result.message.success) {
            paymentsList.innerHTML = "<p>Sorry for the inconvenience. Error near our server.</p>";
            return;
        }

        if (result.message && result.message.withdraw_amount) {
            // Update the withdraw amount dynamically
            withdrawAmountElement.textContent = `₹ ${result.message.withdraw_amount}`;
        } else {
            withdrawAmountElement.textContent = "₹ 0"; // Default value if withdraw_amount is missing
        }
        // Check if message array contains entries
        if (Array.isArray(result.message.message) && result.message.message.length > 0) {
            // Dynamically render cards
            result.message.message.forEach((payment) => {
                const card = document.createElement("div");
                card.classList.add("payment-card");

                card.innerHTML = `
                    <h4>Amount: ₹${payment.amount}</h4>
                    <p>Created At: ${new Date(payment.creation).toLocaleString()}</p>
                    <p>Status: <span class="status">${payment.status}</span></p>
                    <p><a href="${payment.url}" class="url" target="_blank">Payment Link</a></p>
                    <p>Expires At: ${new Date(payment.url_expiry).toLocaleString()}</p>
                `;

                paymentsList.appendChild(card);
            });
        } else {
            paymentsList.innerHTML = "<p>No Withdrawals Done yet.</p>";
        }
    } catch (error) {
        console.error("Error fetching payment details:", error);
        showToast && showToast("Failed to load payment details. Please try again."); // Ensure showToast exists
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const headers = await checkServerStatus();
    if (!headers) return;

    await withdrawal_requesting(headers);
});

function goBack() {
    window.location.href = "account-page.html";
}

function showToast(message) {
    console.log("Toast message:", message);
}

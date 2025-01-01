// Function to navigate back to account page
function goBack() {
    window.location.href = "account-page.html";
}

async function checkServerStatus() {
    const pingUrl = "http://172.104.207.190:8009/api/method/ping";

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
    const apiUrl = "http://172.104.207.190:8009/api/method/medkado.medkado.doctype.medkado_user.medkado_user.done_payment_for_user";
    const paymentsList = document.getElementById("payments-list");
    const withdrawAmountElement = document.getElementById("withdraw-amount");
    const withdrawButton = document.querySelector(".withdraw-button");

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
        console.log(result, " =================== ");

        if (!result.message || !result.message.success) {
            paymentsList.innerHTML = "<p>Sorry for the inconvenience. Error near our server.</p>";
            return;
        }

        if (result.message && result.message.withdraw_amount) {
            const withdrawAmount = result.message.withdraw_amount;

            // Update the withdraw amount dynamically
            withdrawAmountElement.textContent = `₹ ${withdrawAmount}`;

            // Disable the withdraw button if the amount is zero
            if (withdrawAmount === 0) {
                withdrawButton.disabled = true;
                withdrawButton.classList.add("disabled");
            } else {
                withdrawButton.disabled = false;
                withdrawButton.classList.remove("disabled");
            }
        } else {
            withdrawAmountElement.textContent = "₹ 0";
            withdrawButton.disabled = true;
            withdrawButton.classList.add("disabled");
        }

        if (Array.isArray(result.message.message) && result.message.message.length > 0) {
            result.message.message.forEach((payment) => {
                const card = document.createElement("div");
                card.classList.add("payment-card");

                card.innerHTML = `
                    <h4>Amount: ₹${payment.amount}</h4>
                    <p>Created At: ${new Date(payment.requested_time).toLocaleString()}</p>
                    <p>Status: <span class="status">${payment.status}</span></p>
                    ${
                        payment.status !== "Requested"
                            ? `<p>Paid At: ${new Date(payment.paid_time).toLocaleString()}</p>`
                            : ""
                    }
                `;

                paymentsList.appendChild(card);
            });
        } else {
            paymentsList.innerHTML = "<p>No Withdrawals Done yet.</p>";
        }
    } catch (error) {
        console.error("Error fetching payment details:", error);
        showToast && showToast("Failed to load payment details. Please try again.");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const headers = await checkServerStatus();
    if (!headers) return;

    await withdrawal_requesting(headers);
});

function showToast(message) {
    console.log("Toast message:", message);
}

async function handleWithdraw() {
    const apiUrl = "http://172.104.207.190:8009/api/method/medkado.medkado.doctype.medkado_user.medkado_user.withdrawal_requesting";

    try {
        const headers = await checkServerStatus();
        if (!headers) return;

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: headers,
        });

        const result = await response.json();
        if (response.ok && result.message.success) {
            document.getElementById("withdraw-amount").textContent = "₹ 0";
            showToast("Withdrawal successful!");
            window.location.href = "withdrawalpage.html";
        } else {
            throw new Error(result.message.message || "Withdrawal failed");
        }
    } catch (error) {
        console.error("Error during withdrawal:", error);
        showToast("Withdrawal failed. Please try again.");
    }
}

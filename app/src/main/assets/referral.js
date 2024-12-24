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

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = 'account-page.html'; // Replace with your target page URL
});


document.addEventListener('DOMContentLoaded', async () => {
    const referralCodeElement = document.getElementById('referralCode');
    const copyButton = document.getElementById('copyButton');
    const referralCardsContainer = document.getElementById('referralCardsContainer');

    const user = "current_user@example.com"; // Replace with actual user identifier (e.g., from session)

    try {
        const headers = await checkServerStatus();
        if (!headers) return;
        // Fetch referral data from backend
        const response = await fetch(`http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.referred_people`, {
            method: "GET",
            headers: headers});
        const data = await response.json();

        if (data.message) {
            // Update referral code
            const referralCode = data.message.referral_code;
            referralCodeElement.textContent = referralCode;
            copyButton.disabled = false;

            // Copy functionality
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(referralCode).then(() => {
                    alert('Referral code copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy referral code:', err);
                });
            });

            // Populate referred user cards
            referralCardsContainer.innerHTML = ''; // Clear loading text
            if (data.message.referred_users.length === 0) {
                const noReferredMessage = document.createElement('p');
                noReferredMessage.textContent = 'No referred people till now';
                referralCardsContainer.appendChild(noReferredMessage);
            } else {
                data.message.referred_users.forEach(user => {
                    const card = document.createElement('div');
                    card.className = 'referral-card';
            
                    card.innerHTML = `
                        <p>${user}</p>
                    `;
            
                    referralCardsContainer.appendChild(card);
                });
            }
            
        }
    } catch (error) {
        console.error('Error fetching referral data:', error);
        referralCardsContainer.innerHTML = '<p>Error loading referred users.</p>';
    }
});

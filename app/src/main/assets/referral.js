document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = 'account-page.html'; // Replace with your target page URL
});


document.addEventListener('DOMContentLoaded', async () => {
    const referralCodeElement = document.getElementById('referralCode');
    const copyButton = document.getElementById('copyButton');
    const referralCardsContainer = document.getElementById('referralCardsContainer');

    const user = "current_user@example.com"; // Replace with actual user identifier (e.g., from session)

    try {
        // Fetch referral data from backend
        const response = await fetch(`/api/method/app.api.get_referral_data?user=${user}`);
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
            data.message.referred_users.forEach(user => {
                const card = document.createElement('div');
                card.className = 'referral-card';

                card.innerHTML = `
                    <h3>${user.full_name}</h3>
                    <p>${user.email}</p>
                `;

                referralCardsContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error fetching referral data:', error);
        referralCardsContainer.innerHTML = '<p>Error loading referred users.</p>';
    }
});

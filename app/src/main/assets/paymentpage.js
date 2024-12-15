document.addEventListener("DOMContentLoaded", () => {
    const payments = [
        { date: "20 Jan, 2024 11:23:10", amount: "+ ₹ 50.00", type: "positive" },
        { date: "20 Jan, 2024 11:23:10", amount: "- ₹ 2,375.00", type: "negative" },
        { date: "20 Jan, 2024 11:23:10", amount: "+ ₹ 50.00", type: "positive" },
        { date: "20 Jan, 2024 11:23:10", amount: "+ ₹ 50.00", type: "positive" },
        { date: "20 Jan, 2024 11:23:10", amount: "+ ₹ 50.00", type: "positive" }
    ];

    const paymentsList = document.getElementById("payments-list");

    // Dynamically create payment items
    payments.forEach(payment => {
        const paymentItem = document.createElement("div");
        paymentItem.classList.add("payment-item");

        paymentItem.innerHTML = `
            <div class="payment-date">
                <img src="https://cdn-icons-png.flaticon.com/512/3106/3106773.png" alt="calendar" width="16" height="16">
                ${payment.date}
            </div>
            <div class="payment-amount ${payment.type}">${payment.amount}</div>
        `;

        paymentsList.appendChild(paymentItem);
    });
});

// Back Button Functionality
function goBack() {
    window.history.back("account-page.html");
}

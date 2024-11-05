document.getElementById("subscription-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting by default

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;

    // Perform form validation
    if (!name || !age || !gender) {
        alert("Please fill out all fields.");
        return;
    }

    // Proceed to the payment page (You can add your payment processing code here)
    alert("Proceeding to payment...");
});

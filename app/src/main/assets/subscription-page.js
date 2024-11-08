// Get the container element
const plansContainer = document.getElementById("plans-container");

// Retrieve the stored explorePlans data from sessionStorage
const explorePlans = JSON.parse(sessionStorage.getItem('explorePlans'));

// Check if explorePlans has data
if (explorePlans && Array.isArray(explorePlans)) {
    // Loop through each plan and create an HTML element for it
    explorePlans.forEach(plan => {
        // Create the main container for each plan (using plan-card class)
        const planCard = document.createElement("div");
        planCard.classList.add("plan-card");

        // Add the plan type
        const planType = document.createElement("h3");
        planType.classList.add("plan-name");
        planType.textContent = `Plan Type : ${plan.plan_type}`;
        planCard.appendChild(planType);

        // Add the cost (money) of the plan
        const planMoney = document.createElement("p");
        planMoney.classList.add("plan-money");
        planMoney.textContent = `Cost : ₹${parseFloat(plan.money).toFixed(2)}`;
        planCard.appendChild(planMoney);

        // Add the count of persons
        const personCount = document.createElement("p");
        personCount.classList.add("plan-price"); // Reusing plan-price class for styling
        personCount.textContent = `Number of Persons : ${plan.count_of_persons}`;
        planCard.appendChild(personCount);

        // Create and add the plan details list
        const detailsList = document.createElement("ul");
        detailsList.classList.add("plan-benefits");

        // Loop through each detail in plan_details
        plan.plan_details.forEach(detail => {
            const detailItem = document.createElement("li");

            // Set the text for category and coupons (like "Eye Checkup (x2)")
            detailItem.textContent = `${detail.category} (${detail.coupons})`;

            // Add price if it’s greater than 0
            if (detail.price > 0) {
                detailItem.textContent += ` - $${detail.price.toFixed(2)}`;
            }

            detailsList.appendChild(detailItem);
        });
        planCard.appendChild(detailsList);

        // Create and add the "Get This Plan" button
        const getPlanBtn = document.createElement("button");
        getPlanBtn.classList.add("get-this-btn");
        getPlanBtn.textContent = "Get This Plan";
        planCard.appendChild(getPlanBtn);

        // Append the planCard to the main container
        plansContainer.appendChild(planCard);
    });
} else {
    // Display a message if no plans are available
    const noPlansMessage = document.createElement("p");
    noPlansMessage.textContent = "No plans available.";
    plansContainer.appendChild(noPlansMessage);
}

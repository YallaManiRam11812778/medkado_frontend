// Get the container element
const plansContainer = document.getElementById("plans-container");

// Retrieve the stored explorePlans data from sessionStorage
const explorePlans = JSON.parse(sessionStorage.getItem('explorePlans'));

// Check if explorePlans has data
if (explorePlans && Array.isArray(explorePlans)) {
    explorePlans.forEach(plan => {
        const planCard = document.createElement("div");
        planCard.classList.add("plan-card");

        const planType = document.createElement("h3");
        planType.classList.add("plan-name");
        planType.textContent = `Plan Type : ${plan.plan_type}`;
        planCard.appendChild(planType);

        const planMoney = document.createElement("p");
        planMoney.classList.add("plan-money");
        planMoney.textContent = `Cost : ₹${parseFloat(plan.money).toFixed(2)}`;
        planCard.appendChild(planMoney);

        const personCount = document.createElement("p");
        personCount.classList.add("plan-price");
        personCount.textContent = `Number of Persons : ${plan.count_of_persons}`;
        planCard.appendChild(personCount);

        const detailsList = document.createElement("ul");
        detailsList.classList.add("plan-benefits");

        plan.plan_details.forEach(detail => {
            const detailItem = document.createElement("li");
            detailItem.textContent = `${detail.category} (${detail.coupons})`;
            if (detail.price > 0) {
                detailItem.textContent += ` - $${detail.price.toFixed(2)}`;
            }
            detailsList.appendChild(detailItem);
        });
        planCard.appendChild(detailsList);

        const getPlanBtn = document.createElement("button");
        getPlanBtn.classList.add("get-this-btn");
        getPlanBtn.textContent = "Get This Plan";

        // Add click event to the button
        getPlanBtn.addEventListener("click", () => {
            // Save the count_of_persons and plan_type to sessionStorage
            sessionStorage.setItem("selectedPlan", JSON.stringify({
                plan_type: plan.plan_type,
                count_of_persons: plan.count_of_persons,
            }));

            // Navigate to the subscription form page
            window.location.href = "subscription-form-single-person.html";
        });

        planCard.appendChild(getPlanBtn);
        plansContainer.appendChild(planCard);
    });
} else {
    const noPlansMessage = document.createElement("p");
    noPlansMessage.textContent = "No plans available.";
    plansContainer.appendChild(noPlansMessage);
}

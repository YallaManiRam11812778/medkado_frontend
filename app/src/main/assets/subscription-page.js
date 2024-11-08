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

//
//
//
//document.addEventListener("DOMContentLoaded", function() {
//    const plansContainer = document.getElementById("plans-container");
//    const explorePlans = JSON.parse(sessionStorage.getItem("explorePlans"));
//    console.log("explorePlans  =========== ",explorePlans)
//    if (explorePlans && explorePlans.length) {
//      explorePlans.forEach(plan => {
//        const planDiv = document.createElement("div");
//        planDiv.classList.add("plan-item");
//
//        // Customize with plan details
//        planDiv.innerHTML = `
//          <h3>${plan.planName}</h3>
//          <p>${plan.description}</p>
//          <p>Price: ${plan.price}</p>
//          <button class="select-plan-btn">Select Plan</button>
//        `;
//
//        // Append the plan element to the container
//        plansContainer.appendChild(planDiv);
//      });
//    } else {
//      plansContainer.innerHTML = "<p>No plans available at the moment.</p>";
//    }
//  });
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the selected plan details from sessionStorage
    const selectedPlan = JSON.parse(sessionStorage.getItem("selectedPlan"));

    // Get the form container
    const formContainer = document.getElementById("subscription-form");

    if (selectedPlan) {
        const { count_of_persons, plan_type } = selectedPlan;

        // Update the page title dynamically based on the plan
        const pageTitle = document.querySelector(".page-title");
        pageTitle.textContent = `Subscription for ${plan_type}`;

        // Generate fields for each person
        for (let i = 1; i <= count_of_persons; i++) {
            // Section title
            const sectionTitle = document.createElement("h4");
            sectionTitle.textContent = `Person ${i}`;

            // Name field
            const nameLabel = document.createElement("label");
            nameLabel.setAttribute("for", `name-${i}`);
            nameLabel.textContent = "Name";
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.id = `name-${i}`;
            nameInput.name = `name-${i}`;
            nameInput.placeholder = `Enter name of person ${i}`;
            nameInput.required = true;

            // Age field
            const ageLabel = document.createElement("label");
            ageLabel.setAttribute("for", `age-${i}`);
            ageLabel.textContent = "Age";
            const ageInput = document.createElement("input");
            ageInput.type = "number";
            ageInput.id = `age-${i}`;
            ageInput.name = `age-${i}`;
            ageInput.placeholder = `Enter age of person ${i}`;
            ageInput.required = true;

            // Gender field
            const genderLabel = document.createElement("label");
            genderLabel.setAttribute("for", `gender-${i}`);
            genderLabel.textContent = "Gender";
            const genderSelect = document.createElement("select");
            genderSelect.id = `gender-${i}`;
            genderSelect.name = `gender-${i}`;
            genderSelect.required = true;
            genderSelect.innerHTML = `
                <option value="" disabled selected>Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            `;

            // Append fields to form
            formContainer.appendChild(sectionTitle);
            formContainer.appendChild(nameLabel);
            formContainer.appendChild(nameInput);
            formContainer.appendChild(ageLabel);
            formContainer.appendChild(ageInput);
            formContainer.appendChild(genderLabel);
            formContainer.appendChild(genderSelect);
        }

        // Add a submit button
        const submitButton = document.createElement("button");
        submitButton.type = "button"; // Change to button to handle custom logic
        submitButton.classList.add("submit-button");
        submitButton.textContent = "Proceed to Payment";
        formContainer.appendChild(submitButton);

        // Add event listener to submit button
        submitButton.addEventListener("click", async () => {
            const formData = collectFormData(count_of_persons); // Collect data
            const headers = await checkServerStatus(); // Ensure headers are retrieved
            if (headers) {
                await proceedToPayment(headers, formData); // Call the API
            }
        });
    } else {
        alert("No plan selected. Please go back to the previous page.");
        window.location.href = "subscription-page.html";
    }
});

// Function to collect form data as list of dictionaries
function collectFormData(count) {
    const formDataList = [];
    for (let i = 1; i <= count; i++) {
        const name = document.getElementById(`name-${i}`).value;
        const age = document.getElementById(`age-${i}`).value;
        const gender = document.getElementById(`gender-${i}`).value;

        if (name && age && gender) {
            formDataList.push({
                name1: name,
                age: age,
                gender: gender
            });
        } else {
            alert(`Please fill out all fields for Person ${i}`);
            return [];
        }
    }
    return formDataList;
}

async function proceedToPayment(headers, formDataList) {
    const apiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.available_coupons_items.available_coupons_items.adding_family_details";

    try {
        // Ensure the payload is structured to match the server expectation
        const payload = {
            "family_details": formDataList // Use the key expected by the server
        };
        console.log("headers ====" ,headers)
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...headers // Include other headers like Authorization
            },
            body: JSON.stringify(payload) // Pass structured data
        });

        if (response.status === 401) {
            console.warn("Unauthorized. Redirecting to login.");
            window.location.href = "file:///android_asset/login-page.html";
            return;
        }

        const apiResponse = await response.json();
        if (apiResponse.message.success) {
            console.log(" Done +++++");
            // window.location.href = "file:///android_asset/.html";
            // Redirect or perform actions after successful submission
        } else {
            console.error("Failed to submit payment data:", apiResponse.message);
        }
    } catch (error) {
        console.error("Error submitting payment data:", error);
    }
}

// Mock function to simulate server status check
async function checkServerStatus() {
    const pingUrl = "http://192.168.0.121:8003/api/method/ping";
  
    try {
      const response = await fetch(pingUrl);
      if (response.ok) {
        const data = await response.json();
        if (data && data.message === "pong") {
          
          // Get API response headers with tokens if available
          if (window.Android && window.Android.getApiResponse) {
            const headersWithTokens = String(window.Android.getApiResponse());
            if (headersWithTokens.includes("Authorization")) {
              const cleanedHeaders = headersWithTokens.replace(/\\'/g, '"');
              return JSON.parse(cleanedHeaders);
            } else {
              console.warn("No authorization token found. Redirecting to login.");
              window.location.href = "file:///android_asset/login-page.html";
              return null;
            }
          }
        }
      }
      throw new Error("Server is down");
    } catch (error) {
      console.error("Error checking server status:", error);
      if (typeof showToast === 'function') showToast("Server is down."); // Display toast if showToast is defined
      return null;
    }
  }
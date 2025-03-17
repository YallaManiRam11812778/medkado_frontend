document.addEventListener("DOMContentLoaded", () => {
    const selectedPlan = JSON.parse(sessionStorage.getItem("selectedPlan"));
    const formContainer = document.getElementById("subscription-form");

    if (selectedPlan) {
        const { count_of_persons, plan_type } = selectedPlan;

        const pageTitle = document.querySelector(".page-title");
        pageTitle.textContent = `Subscription for ${plan_type}`;

        for (let i = 1; i <= count_of_persons; i++) {
            const sectionTitle = document.createElement("h4");
            sectionTitle.textContent = `Person ${i}`;

            const nameLabel = document.createElement("label");
            nameLabel.setAttribute("for", `name-${i}`);
            nameLabel.textContent = "Name";
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.id = `name-${i}`;
            nameInput.name = `name-${i}`;
            nameInput.placeholder = `Enter name of person ${i}`;
            nameInput.required = true;

            const ageLabel = document.createElement("label");
            ageLabel.setAttribute("for", `age-${i}`);
            ageLabel.textContent = "Age";
            const ageInput = document.createElement("input");
            ageInput.type = "number";
            ageInput.id = `age-${i}`;
            ageInput.name = `age-${i}`;
            ageInput.placeholder = `Enter age of person ${i}`;
            ageInput.required = true;

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

            formContainer.appendChild(sectionTitle);
            formContainer.appendChild(nameLabel);
            formContainer.appendChild(nameInput);
            formContainer.appendChild(ageLabel);
            formContainer.appendChild(ageInput);
            formContainer.appendChild(genderLabel);
            formContainer.appendChild(genderSelect);

            [nameInput, ageInput, genderSelect].forEach((input) => {
                input.addEventListener("input", validateForm);
            });
        }

        const submitButton = document.createElement("button");
        submitButton.type = "button";
        submitButton.classList.add("submit-button");
        submitButton.textContent = "Proceed to Payment";
        submitButton.disabled = true;

        formContainer.appendChild(submitButton);

        submitButton.addEventListener("click", async () => {
            // Add loader beside button text
            submitButton.innerHTML = "Proceeding... <span class='loader'></span>";
            submitButton.disabled = true; // Disable the button during operation

            try {
                const formData = collectFormData(count_of_persons);
                const headers = await checkServerStatus();
                if (headers) {
                    await proceedToPayment(headers, formData);
                }
            } catch (error) {
                console.error("Error during payment:", error);
                alert("An error occurred. Please try again.");
            } finally {
                // Restore button state
                submitButton.innerHTML = "Proceed to Payment";
                submitButton.disabled = false;
            }
        });
    } else {
        alert("No plan selected. Please go back to the previous page.");
        window.location.href = "subscription-page.html";
    }

    function validateForm() {
        const inputs = formContainer.querySelectorAll("input, select");
        const allFilled = Array.from(inputs).every((input) => input.value.trim() !== "");
        const submitButton = document.querySelector(".submit-button");
        submitButton.disabled = !allFilled;
    }

    function collectFormData(count) {
        const formDataList = [];

        for (let i = 1; i <= count; i++) {
            const nameInput = document.getElementById(`name-${i}`);
            const ageInput = document.getElementById(`age-${i}`);
            const genderSelect = document.getElementById(`gender-${i}`);

            const name = nameInput.value.trim();
            const age = ageInput.value.trim();
            const gender = genderSelect.value;

            formDataList.push({
                name: name,
                age: age,
                gender: gender,
            });
        }

        return formDataList;
    }

    async function proceedToPayment(headers, formDataList) {
        const apiUrl = "http://192.168.0.121:8003/api/method/medkado.medkado.doctype.available_coupons_items.available_coupons_items.adding_family_details";

        try {
            const payload = {
                family_details: formDataList,
            };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 401) {
                console.warn("Unauthorized. Redirecting to login.");
                window.location.href = "file:///android_asset/login-page.html";
                return;
            }

            const apiResponse = await response.json();
            console.log(apiResponse, " =========== ");
            if (apiResponse.message) {
                alert("Payment link has been generated and sent to the registered email and mobile number.");
                window.location.href = "file:///android_asset/payment-success-page.html";
            } else {
                console.error("Failed to submit payment data:", apiResponse.message);
            }
        } catch (error) {
            console.error("Error submitting payment data:", error);
        }
    }

    async function checkServerStatus() {
        const pingUrl = "http://192.168.0.121:8003/api/method/ping";

        try {
            const response = await fetch(pingUrl);
            if (response.ok) {
                const data = await response.json();
                if (data && data.message === "pong") {
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
            return null;
        }
    }
});

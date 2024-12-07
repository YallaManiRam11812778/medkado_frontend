// Function to fetch district options from the backend
async function fetchDistricts() {
  try {
    const response = await fetch('http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.locations_dropdown', { method: "GET" });
    const data = await response.json();
    if (data.message && data.message.message) {
      const districts = data.message.message;
      console.log(JSON.stringify(districts), "$*************");

      // Store the explore data in sessionStorage to access it on subscription.html
      sessionStorage.setItem('locations_dropdown', JSON.stringify(districts));
      const districtSelect = document.getElementById('country');

      // Clear existing options but retain the placeholder
      districtSelect.innerHTML = '<option value="" disabled selected>Select District</option>';

      // Add options to the select element dynamically
      districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district.name; // Set option value to district name
        option.textContent = district.name; // Display district name
        districtSelect.appendChild(option);
      });
    } else {
      console.error('No districts available or invalid response format');
      return false;
    }
  } catch (error) {
    console.error('Error fetching district options:', error);
  }
}y7

function validateEmail(email) {
  if (email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|email)\.com$/;
    const generalPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailPattern.test(email)) {
      return true
    } else if (generalPattern.test(email)) {
      showToast("Valid email format, but not an approved domain.");
      return false
    } else {
      showToast("Invalid email format.");
      return false
    }
  }
}

document.getElementById('Signup-form').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission
  console.log('Submitting signup form...');

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const mobileNumber = document.getElementById('mobile_num').value;
  const referralCode = document.getElementById('referral').value;
  const district = document.getElementById('country').value;
  console.log("email === ", email, "pass", password, "mobile_num", mobileNumber, "refe", referralCode, "distr", district);

  if (!email) {
    showToast('Email is required');
    alert('Email is required');
    return;
  }
  if (validateEmail(email)) {console.log("Valid Email")} else {return;}
  if (!password) {
    showToast('Password is required');
    alert('Password is required');
    return;
  }
  if (mobileNumber.length !== 10) {
    showToast('Mobile number must be 10 digits');
    alert('Mobile number must be 10 digits');
    return;
  }
  if (!district) {
    showToast('Please select a district');
    alert('Please select a district');
    return;
  }
  try {
    const response = await fetch(
      `http://192.168.0.121:8003/api/method/medkado.medkado.doctype.medkado_user.medkado_user.sign_up?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&mobile_no=${encodeURIComponent(mobileNumber)}&referral_code=${encodeURIComponent(referralCode)}&district=${encodeURIComponent(district)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await response.json();
    console.log('Response data:', data.message.message);
    if (response.ok) {
      if (data.message && data.message.success){
        const authToken = data.message.message || null;
          if (authToken) {
            if (window.Android && window.Android.saveUserDetails) {
              const authTokenString = JSON.stringify(authToken);
              window.Android.saveApiResponse(authTokenString);
              showToast("SignUp Successful!");
              setTimeout(() => {
                window.location.href = "file:///android_asset/home-page.html";
              }, 1000); // Redirect after showing toast
            }
          }
      } else {
        showToast(`Signup failed: ${data.message.message}`);
      }
    }
  } catch (error) {
    console.error('Error during signup:', error);
    showToast('Signup request failed');
  }
});

// Function to toggle password visibility
document.getElementById('toggle-password').addEventListener('click', () => {
  const passwordField = document.getElementById('password');
  const toggleButton = document.getElementById('toggle-password');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    toggleButton.textContent = 'Hide';
  } else {
    passwordField.type = 'password';
    toggleButton.textContent = 'Show';
  }
});

// Function to limit mobile number length
document.getElementById('mobile_num').addEventListener('input', function () {
  const maxLength = 10;
  if (this.value.length > maxLength) {
    this.value = this.value.slice(0, maxLength);
  }
});

// Fetch districts on page load
window.addEventListener('load', fetchDistricts);

// Toast function
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Toast duration: 3 seconds
}

// Mock backend data
const backendData = [
  { name: "Shaik Sajid", age: 23, gender: "Male", person: 1 },
  { name: "Shaik Sajid", age: 23, gender: "Male", person: 2 },
  { name: "Shaik Sajid", age: 23, gender: "Male", person: 3 },
];

// Function to render profiles
function renderProfiles(data) {
  const profileList = document.getElementById("profile-list");
  profileList.innerHTML = ""; // Clear the list

  data.forEach((profile) => {
    const listItem = document.createElement("li");
    listItem.className = "profile-item";

    listItem.innerHTML = `
      <i class="icon">👤</i>
      <div class="details">
        <span class="name">${profile.name}</span>
        <span class="subtext">${profile.gender}, ${profile.age}</span>
        <span class="subtext">Person ${profile.person}</span>
      </div>
    `;

    profileList.appendChild(listItem);
  });
}

// Initialize app
function init() {
  renderProfiles(backendData); // Load mock data
}

// Call initialization
document.addEventListener("DOMContentLoaded", init);

const APIURL = "https://api.github.com/users/";

// Create a new profile section with all details
// Username
// Image
// Twitter username
// Location
const createUserInfoHTML = (userData) => {
  return `
    <div class="user-info row">
    <div class="col-md-4 user-img-container">
        <img src="${userData.avatar_url}" class="img-fluid rounded-circle">
    </div>
    <div class="col-md-8">
        <h2 class="h4">${userData.name}</h2>
        <p class="mb-0">${userData.bio}</p>
        <p class="text-muted">
        <i class="fa-solid fa-location-dot"></i> Location: ${userData.location}
</p>
        <p>Twitter : <a href="https://twitter.com/${userData.twitter_username}" target="_blank">@${userData.twitter_username}</a></p>
    </div>
</div>
    `;
};

// Create Repository
const createRepoHTML = (repo) => {
  const topics = repo.topics
    ? `<div class="repo-topics">${repo.topics
        .map((topic) => `<div class="repo-topic">${topic}</div>`)
        .join("")}</div>`
    : "";
  return `
          <div class="col-md-6 mb-4">
              <div class="repo-card p-3 border rounded">
                  <h2 class="h6 repo-title"><a href="${repo.html_url}" target="_blank"> ${repo.name}</a></h2>
                  <p class="mb-2">${repo.description}</p>
                  ${topics}
              </div>
          </div>
      `;
};

// Get Data of Specific User
const getUserData = async () => {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value;

  if (username.trim() === "") {
    alert("Please enter a GitHub username.");
    return;
  }

  try {
    const response = await fetch(APIURL + username);
    const userData = await response.json();

    document.getElementById("user-info-container").innerHTML =
      createUserInfoHTML(userData);

    getRepositories(username);
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Error fetching user data. Please check the username and try again.");
  }
};

const getRepositories = async (username) => {
  try {
    const response = await fetch(`${APIURL}${username}/repos`);
    const reposData = await response.json();

    document.getElementById("repo-list-container").innerHTML = reposData
      .map(createRepoHTML)
      .join("");
  } catch (error) {
    console.error("Error fetching repositories data:", error);
    alert("Error fetching repositories data. Please try again.");
  }
};

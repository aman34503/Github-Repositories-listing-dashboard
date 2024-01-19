const API_BASE_URL = "https://api.github.com";

const toggleTheme = () => {
  const body = document.body;
  body.classList.toggle("dark-theme");
};

const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", toggleTheme);

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data. Please try again.");
  }
};

const createUserInfoHTML = (userData) => {
  const imgContainer = document.getElementById("img-container");
  imgContainer.src = userData.avatar_url;

  const userName = document.getElementById("user-name");
  const userBio = document.getElementById("user-bio");
  const userLocation = document.getElementById("user-location");
  const userTwitter = document.getElementById("user-twitter");

  userName.textContent = userData.name || "No name available";
  userBio.textContent = userData.bio || "No bio available";
  userLocation.textContent = userData.location || "Not specified";
  userTwitter.innerHTML = userData.twitter_username
    ? `Twitter: <a href="https://twitter.com/${userData.twitter_username}" target="_blank">@${userData.twitter_username}</a>`
    : "Twitter: Not specified";
};

const createRepoHTML = (reposData) => {
  const repoListContainer = document.getElementById("repo-list-container");
  repoListContainer.innerHTML = ""; // Clear previous repo data

  reposData.forEach((repo) => {
    const repoContainer = document.createElement("div");
    repoContainer.classList.add("repo-card");

    const repoTitle = document.createElement("h2");
    repoTitle.classList.add("repo-title");
    const repoTitleLink = document.createElement("a");
    repoTitleLink.href = repo.html_url;
    repoTitleLink.target = "_blank";
    repoTitleLink.textContent = repo.name;
    repoTitle.appendChild(repoTitleLink);

    const description = document.createElement("p");
    description.textContent = repo.description || "No description available";

    const topicsListContainer = document.createElement("div");
    topicsListContainer.classList.add("repo-topics");

    if (repo.topics && repo.topics.length > 0) {
      repo.topics.forEach((topic) => {
        const topicElement = document.createElement("div");
        topicElement.classList.add("repo-topic");
        topicElement.textContent = topic;
        topicsListContainer.appendChild(topicElement);
      });
    }

    repoContainer.appendChild(repoTitle);
    repoContainer.appendChild(description);
    repoContainer.appendChild(topicsListContainer);

    repoListContainer.appendChild(repoContainer);
  });
};

const createPaginationNumbers = (totalPages, currentPage) => {
  const paginationContainer = document.getElementById("pagination-numbers");
  paginationContainer.innerHTML = ""; // Clear previous pagination

  const paginationFragment = document.createDocumentFragment();

  for (let i = 1; i <= totalPages; i++) {
    const paginationNumber = document.createElement("div");
    paginationNumber.classList.add("pagination-number");
    paginationNumber.textContent = i;

    if (i === currentPage) {
      paginationNumber.classList.add("current-page");
    }

    paginationNumber.addEventListener("click", () => loadPage(i));

    paginationFragment.appendChild(paginationNumber);
  }

  paginationContainer.appendChild(paginationFragment);
};

const getUserData = async () => {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value;

  if (username.trim() === "") {
    alert("Please enter a GitHub username.");
    return;
  }

  try {
    const userData = await fetchData(`${API_BASE_URL}/users/${username}`);
    createUserInfoHTML(userData);
    getRepositories(username);
  } catch (error) {
    alert(error.message);
  }
};

const getRepositories = async (username, page = 1) => {
  try {
    const perPage = 6; // Number of repositories per page
    const reposData = await fetchData(`${API_BASE_URL}/users/${username}/repos?page=${page}&per_page=${perPage}`);
    createRepoHTML(reposData);

    // Get total repositories count to calculate total pages for pagination
    const totalReposCount = await fetchData(`${API_BASE_URL}/users/${username}`);
    const totalPages = Math.ceil(totalReposCount.public_repos / perPage);

    createPaginationNumbers(totalPages, page);
  } catch (error) {
    alert(error.message);
  }
};

// Add pagination functionality
const loadPage = async (pageNumber) => {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value;

  if (username.trim() === "") {
    alert("Please enter a GitHub username.");
    return;
  }

  try {
    const userData = await fetchData(`${API_BASE_URL}/users/${username}`);
    createUserInfoHTML(userData);
    getRepositories(username, pageNumber);
  } catch (error) {
    alert(error.message);
  }
};

// Initial load with page 1
loadPage(1);

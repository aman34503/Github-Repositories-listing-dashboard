const API_BASE_URL = "https://api.github.com";
const perPage = 6;

const toggleTheme = () => {
  document.body.classList.toggle("dark-theme");
};

const paginationContainer = document.getElementById("pagination-numbers");
const loaderModal = document.getElementById("loaderModal");

const showLoader = () => {
  loaderModal.classList.add("show");
};

const hideLoader = () => {
  loaderModal.classList.remove("show");
};

const themeToggleBtn = document.getElementById("theme-toggle");
themeToggleBtn.addEventListener("click", toggleTheme);

const fetchData = async (url) => {
  try {
    showLoader();
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data. Please try again.");
  } finally {
    setTimeout(() => {
      hideLoader();
    }, 10000);
  }
};

const createUserInfoHTML = (userData) => {
  document.getElementById("img-container").src = userData.avatar_url;
  document.getElementById("user-githublink").textContent = userData.html_url || "Not available";
  console.log(userData);
  document.getElementById("user-name").textContent =
    userData.name || "No name available";
  document.getElementById("user-bio").textContent =
    userData.bio || "No bio available";
  document.getElementById("user-location").textContent =
    userData.location || "Not specified";

  const userTwitter = document.getElementById("user-twitter");
  userTwitter.innerHTML = userData.twitter_username
    ? `Twitter: <a href="https://twitter.com/${userData.twitter_username}" target="_blank">@${userData.twitter_username}</a>`
    : "Twitter: Not specified";
};

const createRepoHTML = (reposData) => {
  const repoListContainer = document.getElementById("repo-list-container");
  repoListContainer.innerHTML = ""; // Clear previous repo data

  reposData.forEach((repo) => {
    const repoContainer = document.createElement("div");
    repoContainer.className = "repo-card";

    const repoTitle = document.createElement("h2");
    repoTitle.className = "repo-title";
    const repoTitleLink = document.createElement("a");
    repoTitleLink.href = repo.html_url;
    repoTitleLink.target = "_blank";
    repoTitleLink.textContent = repo.name;
    repoTitle.appendChild(repoTitleLink);

    const description = document.createElement("p");
    description.textContent = repo.description || "No description available";

    const topicsListContainer = document.createElement("div");
    topicsListContainer.className = "repo-topics";

    if (repo.topics && repo.topics.length > 0) {
      repo.topics.forEach((topic) => {
        const topicElement = document.createElement("div");
        topicElement.className = "repo-topic";
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
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const paginationNumber = document.createElement("div");
    paginationNumber.className = "pagination-number";
    paginationNumber.textContent = i;
    paginationNumber.addEventListener("click", () => handlePagination(i));

    if (i === currentPage) {
      paginationNumber.classList.add("current-page");
    }

    paginationContainer.appendChild(paginationNumber);
  }
};

const createButton = (text, clickHandler, classList) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", clickHandler);
  button.classList.add(text)
  return button;
};

const handleNextPage = async () => {
  const currentPage = parseInt(document.querySelector(".current-page").textContent);
  handlePagination(currentPage + 1);
};

const handlePreviousPage = async () => {
  const currentPage = parseInt(document.querySelector(".current-page").textContent);
  handlePagination(currentPage - 1);
};

const updatePaginationButtons = (currentPage, totalPages) => {
  const paginationContainer = document.getElementById("pagination-numbers");
  const nextButton = createButton("Next", handleNextPage);
  const previousButton = createButton("Previous", handlePreviousPage);

  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  paginationContainer.appendChild(previousButton);

  if (totalPages > 1) {
    paginationContainer.appendChild(nextButton);
  }
};

const handlePagination = async (pageNumber) => {
  const usernameInput = document.getElementById("usernameInput");
  const username = usernameInput.value.trim();

  if (!username) {
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
    // Get user details, including the total number of public repositories
    const userData = await fetchData(`${API_BASE_URL}/users/${username}`);
    createUserInfoHTML(userData);

    const totalReposCount = userData.public_repos;

    const reposData = await fetchData(
      `${API_BASE_URL}/users/${username}/repos?page=${page}&per_page=${perPage}`
    );
    createRepoHTML(reposData);

    const totalPages = Math.ceil(totalReposCount / perPage);

    createPaginationNumbers(totalPages, page);
    updatePaginationButtons(page, totalPages);
  } catch (error) {
    alert(error.message);
  }
};
// Initial load with page 1
handlePagination(1);
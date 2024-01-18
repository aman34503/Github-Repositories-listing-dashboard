const APIURL = "https://api.github.com/users/";

//Create a new profile section with all details
// Username
//Image
//Twitter username
//location
const createUserInfoHTML = (userData) => {
    return `
        <div>
            <img src="${userData.avatar_url}">
        </div>
        <div>
            <h2>${userData.name}</h2>
            <p>@${userData.twitter_username}</p>
            <p>${userData.bio}<br>Location: ${userData.location}</p>
            <a href="https://twitter.com/${userData.twitter_username}" target="_blank">Twitter</a>
        </div>
    `;
}
//Create Repository 
const createRepoHTML = (repo) => {
    const topics = repo.topics ? `<p>Topics: ${repo.topics.join(', ')}</p>` : '';
    return `
        <div>
            <h4>${repo.name}</h4>
            <p>${repo.description}</p>
            ${topics}
            <a href="${repo.html_url}" target="_blank">View Repository</a>
        </div>
    `;
}

//Get Data of Specific User
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

        document.getElementById("user-info-container").innerHTML = createUserInfoHTML(userData);

        getRepositories(username);
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data. Please check the username and try again.");
    }
}

const getRepositories = async (username) => {
    try {
        const response = await fetch(`${APIURL}${username}/repos`);
        const reposData = await response.json();

        document.getElementById("repo-list-container").innerHTML = reposData.map(createRepoHTML).join('');
    } catch (error) {
        console.error("Error fetching repositories data:", error);
        alert("Error fetching repositories data. Please try again.");
    }
}
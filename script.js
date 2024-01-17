document.addEventListener("DOMContentLoaded", function () {
    const username = 'aman34503';
    const token = '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';

    const userDetails = document.getElementById('userDetails');
    const repoList = document.getElementById('repoList');

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const apiUrl = (endpoint) => `https://api.github.com${endpoint}`;

    const fetchData = async (url) => {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return response.json();
    };

    const fetchUserDetails = async () => {
        const userApiUrl = apiUrl(`/users/${username}`);
        return fetchData(userApiUrl);
    };

    const fetchUserRepositories = async () => {
        const repoApiUrl = apiUrl(`/users/${username}/repos`);
        return fetchData(repoApiUrl);
    };

    const renderUserDetails = (user) => {
        const userItem = document.createElement('li');
        userItem.className = 'detailItem';

        const profilePhoto = document.createElement('img');
        profilePhoto.src = user.avatar_url;
        profilePhoto.alt = 'Profile Photo';
        profilePhoto.width = 50;
        userItem.appendChild(profilePhoto);

        const nameElement = document.createElement('span');
        nameElement.textContent = user.name || username;
        userItem.appendChild(nameElement);

        if (user.bio) {
            const bioElement = document.createElement('p');
            bioElement.textContent = user.bio;
            userItem.appendChild(bioElement);
        }

        if (user.twitter_username) {
            const twitterLink = document.createElement('a');
            twitterLink.href = `https://twitter.com/${user.twitter_username}`;
            twitterLink.textContent = `Twitter: @${user.twitter_username}`;
            userItem.appendChild(twitterLink);
        }

        if (user.location) {
            const locationElement = document.createElement('p');
            locationElement.textContent = `Location: ${user.location}`;
            userItem.appendChild(locationElement);
        }

        const githubLink = document.createElement('a');
        githubLink.href = user.html_url;
        githubLink.textContent = `GitHub: ${user.login}`;
        userItem.appendChild(githubLink);

        userDetails.appendChild(userItem);
    };

    const renderUserRepositories = (repos) => {
        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.className = 'repoItem';

            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.textContent = repo.name;

            repoItem.appendChild(repoLink);
            repoList.appendChild(repoItem);
        });
    };

    const handleError = (error, message) => {
        console.error(message, error);
    };

    const init = async () => {
        try {
            const user = await fetchUserDetails();
            renderUserDetails(user);

            const repos = await fetchUserRepositories();
            renderUserRepositories(repos);
        } catch (error) {
            handleError(error, 'Error during initialization:');
        }
    };

    init();
});

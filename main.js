document.addEventListener("DOMContentLoaded", function () {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");
    const resultsContainer = document.getElementById("results");
    const repositoriesContainer = document.getElementById("repositories");
  
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value;
  
      if (searchTerm) {
        searchGitHubUsers(searchTerm)
          .then((users) => {
            displayUsers(users);
          })
          .catch((error) => {
            console.error("Error searching for users: ", error);
          });
      }
    });
  
    function searchGitHubUsers(query) {
      const url = `https://api.github.com/search/users?q=${query}`;
      return fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((data) => data.items);
    }
  
    function displayUsers(users) {
      resultsContainer.innerHTML = "";
      repositoriesContainer.innerHTML = "";
  
      users.forEach((user) => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");
        userCard.innerHTML = `
          <img src="${user.avatar_url}" alt="${user.login}" />
          <h2>${user.login}</h2>
          <a href="${user.html_url}" target="_blank">Profile</a>
        `;
  
        userCard.addEventListener("click", function () {
          getRepositories(user.login);
        });
  
        resultsContainer.appendChild(userCard);
      });
    }
  
    function getRepositories(username) {
      const url = `https://api.github.com/users/${username}/repos`;
      fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((response) => response.json())
        .then((repos) => displayRepositories(repos))
        .catch((error) => {
          console.error("Error fetching repositories: ", error);
        });
    }
  
    function displayRepositories(repositories) {
      repositoriesContainer.innerHTML = "";
      const repoList = document.createElement("ul");
  
      repositories.forEach((repo) => {
        const repoItem = document.createElement("li");
        repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        repoList.appendChild(repoItem);
      });
  
      repositoriesContainer.appendChild(repoList);
    }
  });
  
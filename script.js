const baseURL = "https://api.github.com/users/";

function fetchRepositories() {
    const username = document.getElementById("usernameInput").value;
    const repositoriesContainer = document.getElementById("repositories");
    const loader = document.getElementById("loader");
    const pagination = document.getElementById("pagination");

    repositoriesContainer.innerHTML = "";
    loader.style.display = "block";
    pagination.innerHTML = "";

    fetch(`${baseURL}${username}/repos`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(repositories => {
            loader.style.display = "none";
            if (Array.isArray(repositories)) {
                displayRepositories(repositories.slice(0,10));
                createPagination(repositories.length);
                console.log(repositories.length)
            } else {
                repositoriesContainer.innerHTML = `<p style="color: red;">Error: User not found or no repositories available.</p>`;
            }
        })
        .catch(error => {
            loader.style.display = "none";
            repositoriesContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
}

function displayRepositories(repositories) {
    const repositoriesContainer = document.getElementById("repositories");


    repositories.forEach(repository => {
       

        const repositoryDiv = document.createElement("div");
        repositoryDiv.className = "col";
        repositoryDiv.innerHTML = `
        <div class="card text-bg-dark mb-3" style="max-width: 18rem;">
            <div class="card-header">${repository.name}</div> 
            <div class="card-body"> 
                <p class="card-text">${repository.description}</p> 
            </div>
        </div>`;
        repositoriesContainer.appendChild(repositoryDiv); 

    });
}

function createPagination(totalRepositories) {
    const paginationContainer = document.getElementById("pagination");
    const repositoriesPerPage = 10;
    const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.addEventListener("click", () => fetchPage(i));
        paginationContainer.appendChild(button);
        console.log(totalPages)
    }
}


function fetchPage(pageNumber) {
    const username = document.getElementById("usernameInput").value;
    const repositoriesContainer = document.getElementById("repositories");
    const loader = document.getElementById("loader");

    repositoriesContainer.innerHTML = "";
    loader.style.display = "block";

    fetch(`${baseURL}${username}/repos?per_page=10&page=${pageNumber}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(repositories => {
            loader.style.display = "none";
            displayRepositories(repositories);
        })
        .catch(error => {
            loader.style.display = "none";
            repositoriesContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
}

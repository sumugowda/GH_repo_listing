const baseURL = "https://api.github.com/users/";

function fetchUserInformation(username) {
    return fetch(`${baseURL}${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            throw new Error(`Error fetching user information: ${error.message}`);
        });
}

function fetchRepositories() {
    const username = document.getElementById("usernameInput").value;
    const repositoriesContainer = document.getElementById("repositories");
    const loader = document.getElementById("loader");
    const pagination = document.getElementById("pagination");

    repositoriesContainer.innerHTML = "";
    loader.style.display = "block";
    pagination.innerHTML = "";

    fetchUserInformation(username)
    .then(userInfo => {
        displayUserInfo(userInfo);

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
                displayRepositories(repositories.slice(0,10),userInfo.public_repos,1);
                createPagination(userInfo.public_repos);
                console.log(repositories)
            } else {
                repositoriesContainer.innerHTML = `<p style="color: red;">Error: User not found or no repositories available.</p>`;
            }
        })
        .catch(error => {
            loader.style.display = "none";
            repositoriesContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
})
.catch(error => {
    loader.style.display = "none";
    repositoriesContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
});
} 

function displayUserInfo(userInfo) {
    console.log(userInfo)
    const userContainer = document.getElementById("user");
    userContainer.innerHTML = `<div class="container d-flex justify-content-center shadow w-75">
            <div class="dppart p-2 m-2">
            <img src="${userInfo.avatar_url}" class="img-thumbnail border border-info-subtle rounded-circle border-2" alt=""> 
        </div>
        <div class="biopart p-2 align-self-center ">
            <div class="name "> <h3> ${userInfo.name} </h3> </div>
            <div class="bio "> ${userInfo.bio} </div>
            <div class="location "> ${userInfo.location} </div>
            <div class="twtr "> ${userInfo.twitter_username} </div>
            <div class="ghlink "> <a class="link-light" href="${userInfo.html_url}">Github Profile</a>  </div>
        </div>
    </div>`;
}

function displayRepositories(repositories,tp,k) {
    const repositoriesContainer = document.getElementById("repositories");
    const repositorycount = document.createElement("div");
    repositorycount.className = "container w-100";
        repositorycount.innerHTML = `
        <div class="container  d-flex justify-content-end ">
            <small>Showing repositories ${repositories.length+((k-1)*10)} of ${tp} </small>
        </div>`;
        repositoriesContainer.appendChild(repositorycount); 


    repositories.forEach(repository => {
       

        const repositoryDiv = document.createElement("div");
        repositoryDiv.className = "col";
        repositoryDiv.innerHTML = `
        <div class="card text-bg-dark mb-3 shadow" style="max-width: 18rem;">
            <div class="card-header">${repository.name}</div> 
            <div class="card-body"> 
                <p class="card-text">${repository.description}</p> 
            </div>
        </div>`
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
        button.addEventListener("click", () => fetchPage(i,totalRepositories));
        paginationContainer.appendChild(button);
    }

}



function fetchPage(pageNumber,j) {
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
            displayRepositories(repositories,j,pageNumber);
        })
        .catch(error => {
            loader.style.display = "none";
            repositoriesContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
}

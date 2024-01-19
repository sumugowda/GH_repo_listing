const baseURL = "https://api.github.com/users/";

function fetchUserInformation(username) {
    return fetch(`${baseURL}${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`OOPS! Internal error ocured`);
            }
            return response.json();
        })
        .catch(error => {
            throw new Error(`Not found please the username and try again`);
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
            <div class="bio "> <i class="fa-solid fa-address-card"></i> ${userInfo.bio} </div>
            <div class="location "><i class="fa-solid fa-location-dot"></i> ${userInfo.location} </div>
            <div class="twtr "><i class="fa-brands fa-twitter"></i>  ${userInfo.twitter_username} </div>
            <div class="ghlink "><i class="fa-brands fa-github"></i> <a class="link-light" href="${userInfo.html_url}">Github Profile</a>  </div>
        </div>
    </div>`;
}

function displayRepositories(repositories, tp, k) {
    const repositoriesContainer = document.getElementById("repositories");
    const repositorycount = document.createElement("div");
    repositorycount.className = "container  my-2 w-100";
    repositorycount.innerHTML = `
            <small class="d-flex justify-content-end ">Showing repositories ${repositories.length + ((k - 1) * 10)} of ${tp} </small>
            <h3 class="d-flex justify-content-start">Here's the list of repositories</h3>`;
            
    repositoriesContainer.appendChild(repositorycount);

    repositories.forEach(repository => {
        let c = ''
        if(repository.fork == true){
             c = "(Cloned Repo)"
        }
        const repositoryDiv = document.createElement("div");
        repositoryDiv.className = "col";
        repositoryDiv.innerHTML = `
        <div class="card text-bg-dark mb-3 shadow" style="max-width: 18rem;">
            <div class="card-header "> <h5> ${repository.name} </h5> <small class="d-flex justify-content-end">${c}</small></div> 
            <div class="card-body"> 
                <p class="card-text">${repository.description}</p>
                <div class="languages" id="languages-${repository.name}"></div>
                </div>
        </div>`;
        repositoriesContainer.appendChild(repositoryDiv);
        console.log(repository)

        fetchLanguages(repository.name,repository.owner.login);
    });
}

function fetchLanguages(repoName,username) {
    const languagesContainer = document.getElementById(`languages-${repoName}`);

    fetch(`https://api.github.com/repos/${username}/${repoName}/languages`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(languages => {
            // Display each language as a separate tag
            Object.keys(languages).forEach(language => {
                const languageTag = document.createElement("span");
                languageTag.className = "badge bg-primary  me-2";
                languageTag.innerText = language;
                languagesContainer.appendChild(languageTag);
            });
        })
        .catch(error => {
            languagesContainer.innerText = `Error fetching languages: ${error.message}`;
        });
}



function createPagination(totalRepositories) {
    const paginationContainer = document.getElementById("pagination");
    const repositoriesPerPage = 10;
    const totalPages = Math.ceil(totalRepositories / repositoriesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.className='btn btn-outline-light';
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

let input = document.getElementById("f-inp");

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("f-btn").click();
  }
});

let getUserUrl = "https://api-blog-m2.herokuapp.com/user/";
let getPostsUrl = "https://api-blog-m2.herokuapp.com/post?page=";
let newPostUrl = "https://api-blog-m2.herokuapp.com/post";
let deletePostUrl = "https://api-blog-m2.herokuapp.com/post/";

class User {
    constructor(name, email, profileImg) {
        this.name = name;
        this.email = email;
        this.profileImg = profileImg;
    }
}

let localUser = null;
let currentLoadedPage = 0;
let postText = document.getElementById("post-text");

if(localStorage.getItem("token") === null || localStorage.getItem("userId") === null) {
    localStorage.clear();
    window.location.href = "login.html";
} else {
    document.getElementById("logout").addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "login.html";
    });
    
    let _headers = new Headers();
    _headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
    fetch(getUserUrl + localStorage.getItem("userId"), {
        method: "GET",
        headers: _headers
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.status + " - " + response.statusText);
    }).then((json) => {
        localUser = new User(json["username"], json["email"], json["avatarUrl"]);
        document.getElementById("profile-img").src = localUser.profileImg;
        document.querySelector("h1").innerText = localUser.name;
    }).catch((error) => {
        alert(json["message"]);
    })
    
    getPosts(1);
}

function getPosts(page) {
    currentLoadedPage = page;
    let _headers = new Headers();
    _headers.append("Authorization", "Bearer " + localStorage.getItem("token"))
    fetch(getPostsUrl + page, {
        method: "GET",
        headers: _headers
    }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.status + " - " + response.statusText);
    }).then((json) => {
        if(currentLoadedPage <= parseInt(json["lastPage"])) {
            addToMainGrid(json)
        }
    }).catch(error => {
        alert(error);
    })
}

function addToMainGrid(json) {
    const main = document.querySelector("main");
    for(let i = 0; i < json["data"].length; i++) {
        const postElement = document.createElement("div");
        const owner = json["data"][i]["owner"]
        postElement.classList.add("post");
        let date = json["data"][i]["createdAt"].split("-").reverse().join("/");
        postElement.innerHTML = `
            <img src="${owner["avatarUrl"]}">
            <div class="content">
                <h2>${owner["username"]}</h2>
                <p>${json["data"][i]["post"]}</p>
            </div>`;
        if(owner["id"] === localStorage.getItem("userId")) {
            let options = document.createElement("div");
            options.classList.add("options");

            let edit = document.createElement("a");
            edit.classList.add("edit");
            edit.innerText = "Editar"

            let erase = document.createElement("a");
            erase.classList.add("erase");
            erase.innerText = "Apagar"
            erase.addEventListener("click", (event) => {
                let _headers = new Headers();
                _headers.append("Authorization", "Bearer " + localStorage.getItem("token"))
                fetch(deletePostUrl + json["data"][i]["id"], {
                    method: "DELETE",
                    headers: _headers
                }).then((response) => {
                    if(response.ok) {
                        location.reload();
                    } else {
                        throw new Error(response.status + " - " + response.statusText);
                    }
                }).then((json) => {
                }).catch((error) => {
                    alert(error)
                })
            })

            let dateElem = document.createElement("a");
            dateElem.classList.add("date");
            dateElem.innerText = date;

            options.appendChild(edit);
            options.appendChild(erase);
            options.appendChild(dateElem);

            postElement.appendChild(options);
        } else {
            postElement.innerHTML += `
                <div class="options">
                    <a class="date">${date}</a>
                </div>`;
        }
        
        main.appendChild(postElement);
    }
    
    document.querySelector("main").addEventListener('scroll', (event) => {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop === element.clientHeight)
            getPosts(currentLoadedPage++);
    })
}

let postButton = document.getElementById("post-submit")
postButton.addEventListener("click", (event) => {
    event.preventDefault();
    postButton.style.pointerEvents = "none";
    let postContent = postText.value;
    console.log(postContent);
    let _headers = new Headers();
    _headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
    _headers.append("Content-Type", "application/json");
    fetch(newPostUrl, {
        method: "POST",
        headers: _headers,
        body: JSON.stringify({
            "content": postContent
        })
    }).then((response) => {
        if(response.ok) {
            return response.json();
        }
        throw new Error(response.status + " - " + response.statusText);
    }).then((json) => {
        location.reload(true);
    }).catch((error) => {
        alert(error);
    })
})
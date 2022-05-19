let loginUrl = "https://api-blog-m2.herokuapp.com/user/login";
let registerUrl = "https://api-blog-m2.herokuapp.com/user/register";
let getUserUrl = "https://api-blog-m2.herokuapp.com/user/";
let getPostsUrl = "https://api-blog-m2.herokuapp.com/post?page=";

let loginBtn = document.getElementById("enter");
let registerBtn = document.getElementById("register");
let postText = document.getElementById("post-text");

class User {
    constructor(name, email, profileImg) {
        this.name = name;
        this.email = email;
        this.profileImg = profileImg;
    }
}

let localUser = null;
let currentLoadedPage = 0;
if(loginBtn != undefined) {
    if(localStorage.getItem("email") != null) {
        document.getElementById("email").value = localStorage.getItem("email");
    }
    document.getElementById("register").addEventListener("click", function() {
        localStorage.clear();
        window.location.href = "register.html";
    });
    loginBtn.addEventListener("click", event => {
        event.preventDefault();
        let _headers = new Headers();
        _headers.append("Content-Type", "application/json");

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        fetch(loginUrl, {
            method: "POST",
            headers: _headers,
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }).then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.status + " - " + response.statusText);
        }).then((json) => {
            localStorage.setItem("token", json["token"]);
            localStorage.setItem("userId", json["userId"]);
            window.location.href = "index.html";
        }).catch((error) => {
            alert(error);
        });
    });
}

if(registerBtn != undefined) {
    registerBtn.addEventListener("click", event => {
        event.preventDefault();
        let _headers = new Headers();
        _headers.append("Content-Type", "application/json");

        let username = document.getElementById("name").value.split(" ")[0];
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        fetch(registerUrl, {
            method: "POST",
            headers: _headers,
            body: JSON.stringify({
                "username": username,
                "email": email,
                "avatarUrl": "https://github.com/phmc99.png",
                "password": password
            })
        }).then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error(response.status + " - " + response.statusText);
        }).then((json) => {
            alert("Usuário cadastrado com sucesso!");
            localStorage.setItem("email", json["email"]);
            window.location.href = "login.html";
        }).catch((error) => {
            alert(error);
        });
    });
}

if(postText != undefined) {
    if(localStorage.getItem("token") === null || localStorage.getItem("userId") === null) {
        localStorage.clear();
        window.location.href = "login.html";
    }

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
        alert(error);
    });

    const body = document.querySelector("body");

    body.addEventListener('scroll', function(event)
    {
        var element = event.target;
        if (element.scrollHeight - element.scrollTop <= element.clientHeight)
        {
            console.log('scrolled');
        }
    });
    getPosts(1)
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
    })
}

function addToMainGrid(json) {
    const main = document.querySelector("main");
    console.log(json);
    for(let i = 0; i < json["data"].length; i++) {
        const postElement = document.createElement("div");
        const owner = json["data"][i]["owner"]
        postElement.classList.add("post");
        postElement.innerHTML = `
            <img src="${owner["avatarUrl"]}">
            <div class="content">
                <h2>${owner["username"]}</h2>
                <p>${json["data"][i]["post"]}</p>
            </div>
            <div class="options">
                <a class="edit">Editar</a>
                <a class="erase">Apagar</a>
                <a class="date">13/05/2022</a>
            </div>`;
        main.appendChild(postElement);
    }
}
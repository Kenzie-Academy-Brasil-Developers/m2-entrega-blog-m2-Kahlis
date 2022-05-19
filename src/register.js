let registerUrl = "https://api-blog-m2.herokuapp.com/user/register";
let registerBtn = document.getElementById("register");

document.getElementById("login").addEventListener("click", function() {
    localStorage.clear();
    window.location.href = "login.html";
});
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
let loginUrl = "https://api-blog-m2.herokuapp.com/user/login";
let loginBtn = document.getElementById("enter");

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
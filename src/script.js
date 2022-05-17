let loginUrl = "https://api-blog-m2.herokuapp.com/user/login";

let loginBtn = document.getElementById("enter");
console.log(loginBtn);
if(loginBtn != undefined) {
    loginBtn.addEventListener("click", event => {
        event.preventDefault();
        let _headers = new Headers();
        _headers.append("Content-Type", "application/json");

        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        fetch(loginUrl, {
            method: "POST",
            headers: _headers,
            body: {
                "email": "pedro.costa@kenzie.com.br",
                "password": "123"
            }
        }).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
        });
    });
}
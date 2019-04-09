async function createUser() {

    var name = document.getElementById("viewName").value;
    var mail = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch('/users/admin/create', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        // 'x-auth': auth
        },
        body: JSON.stringify({email: mail, password: pass, name: name})
    });
    const content = await rawResponse.json()


    if(rawResponse.status == 200)
    {
        console.log(`Created user ${content.username} at email ${content.password}`);
    }

};
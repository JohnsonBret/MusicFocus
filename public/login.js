async function login() {

    var mail = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
        
    const rawResponse = await fetch('/users/login', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: mail, password: pass})
    });
    const content = await rawResponse.json()

    //Dashboard is authenticating now so we need to wait to get our auth token
    //before we allow a redirect to dashboard - this is NOT currently happening
    console.log(content, rawResponse.headers.get('x-auth'));
    sessionStorage.xauth = rawResponse.headers.get('x-auth');
    
    if(rawResponse.status == 200)
    {
        console.log("response status 200");
        window.location = '/dashboard';
    }
    else
    {
        window.location = '/login';
    }



};
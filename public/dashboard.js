async function getUserDashboard() {

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch('/dashboard/auth', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': auth
        }
    });
    
    if(rawResponse.status == 401)
    {
      console.log("response status 401");
      window.location = '/login';
      return;
    }
    else
    {
        console.log("Successful GET from /dashboard/auth");
    }

    const content = await rawResponse;

    var main = document.getElementById("dashboardMain");
    main.style.display = "flex";

    console.log(`Main style display ${main.style.display}`);
    console.log(content, rawResponse.headers.get('x-auth'));

};
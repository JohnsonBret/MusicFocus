const getClientList = async () => {

    console.log("Getting client List");

    var name = document.getElementById("viewName").value;
    var mail = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch('/users', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': auth
        },
        // body: JSON.stringify({email: mail, password: pass, name: name})
    });
    const content = await rawResponse.json()


    if(rawResponse.status == 200)
    {
        console.log(content);
        populateClientSelect(content);
    }
};

const populateClientSelect = (clients) =>{
    const select = document.getElementById("clientList");

    clients.users.map((user)=>{
        const opt = document.createElement("option");
        opt.innerHTML = user.name;
        opt.value = user._id;
        select.appendChild(opt);
    });
}



getClientList();
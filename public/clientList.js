const getClientList = async () => {

    console.log("Getting client List");

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch('/users', {
        method: 'GET',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': auth
        },
    });
    const content = await rawResponse.json()


    if(rawResponse.status == 200)
    {
        console.log(content);
        populateClientSelect(content);
    }
};

const populateClientSelect = (clients) =>{
    const select = document.getElementsByClassName("clientList");

    for(let i = 0; i < select.length; i++)
    {
        clients.users.map((user)=>{
            const opt = document.createElement("option");
            opt.innerHTML = user.name;
            opt.value = user._id;
            select[i].appendChild(opt);
        });
    }
    
}



window.onload = getClientList();
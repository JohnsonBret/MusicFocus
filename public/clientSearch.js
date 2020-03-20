const getSearchClientList = async () => {

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
        populateClientSearch(content);
        
    }
};

const populateClientSearch = (clients) =>{
    const list = document.getElementById("clientSearchList");

    clients.users.map((user)=>{
        const listItem = document.createElement("li");
        listItem.innerHTML = user.name;
        listItem.value = user._id;
        listItem.style.display = "none";
        list.appendChild(listItem);
    });

    addListEvents(list);
}

const addListEvents = (list)=>{
    
    let clientList = list;
    const searchInput = document.getElementById("all");

    searchInput.addEventListener("focus", ()=>{
        console.log("focus");
        
        for(let i = 0; i < clientList.childNodes.length; i++)
        {
            clientList.childNodes[i].style.display = "block";
        }
    });

}


    




window.onload = getSearchClientList();
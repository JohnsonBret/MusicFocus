window.onload = async ()=>{

    let select = document.getElementById("updateOrderList");
    select.addEventListener("change", async (event)=>{
        let selectValue = event.target.value;
        console.log(`Event Target Value ${event.target.value}`);
        fetchDesiredOrders(selectValue);
    });
}

const fetchDesiredOrders = async (value) =>{
    console.log("Getting client List");

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch(`/orders/${value}`, {
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
        
    }
}

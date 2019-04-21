window.onload = async ()=>{

    let select = document.getElementById("updateOrderList");

    select.addEventListener("change", async (event)=>{
        let selectValue = event.target.value;
        console.log(`Event Target Value ${event.target.value}`);
        fetchDesiredOrders(selectValue);
    });

    let refreshButton = document.getElementById("updateOrdersButton");

    refreshButton.addEventListener("click", (event)=>{
        let selectValue = select.value;
        fetchDesiredOrders(selectValue);
    });

    fetchDesiredOrders(select.value);
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
        // console.log(content);
        clearOrdersList();
        listSelectedOrders(content);
    }
}

const updateOrderShipStatus = async (id, value) =>{
    console.log("Getting client List");

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch(`/orders/shipped/${id}/${value}`, {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': auth
        },
    });
    // const content = await rawResponse.json()

    if(rawResponse.status == 200)
    {
        console.log(rawResponse);
        clearOrdersList();
    }
}

const updateCancelStatus = async (id, value) =>{
    console.log(`Cancel order Id ${id}`);

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch(`/orders/cancel/${id}/${value}`, {
        method: 'PATCH',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-auth': auth
        },
    });
    // const content = await rawResponse.json()

    if(rawResponse.status == 200)
    {
        console.log(rawResponse);
        clearOrdersList();
    }
}

const listSelectedOrders = async (orders)=>{

    const ordersRoot = document.getElementById("updateOrdersRoot");

    await orders.map((current)=>{
        let orderCardDiv = document.createElement("div");
        let name = document.createElement("h3");
        let product = document.createElement("h3");
        let orderId = document.createElement("p");
        let shippingStatus = document.createElement("p");
        let activeStatus = document.createElement("p");
        let orderDate = document.createElement("p");

        let shippingAddressDetails = document.createElement("details");
        let shippingSummary = document.createElement("summary");
        shippingSummary.innerHTML = "Shipping Address";
        let addressDiv = document.createElement("div");

        let addressStreet = document.createElement("p");
        addressStreet.innerHTML = current.shippingAddress.addressStreet;
        let addressCity = document.createElement("p");
        addressCity.innerHTML = current.shippingAddress.addressCity;
        let addressZip = document.createElement("p");
        addressZip.innerHTML = current.shippingAddress.addressZip;
        let addressState = document.createElement("p");
        addressState.innerHTML = current.shippingAddress.addressState;
        let addressCountry = document.createElement("p");
        addressCountry.innerHTML = current.shippingAddress.addressCountry;

        addressDiv.classList.add("blueBG");
        addressDiv.classList.add("shippingAddress");

        shippingAddressDetails.appendChild(shippingSummary);
        addressDiv.appendChild(addressStreet);
        addressDiv.appendChild(addressCity);
        addressDiv.appendChild(addressZip);
        addressDiv.appendChild(addressState);
        addressDiv.appendChild(addressCountry);
        shippingAddressDetails.appendChild(addressDiv);

        


        name.innerHTML = `Customer Name: ${current.customerName}`;
        product.innerHTML = `Item: ${current.productName}`;
        orderId.innerHTML = `Order ID: ${current._id}`;
        shippingStatus.innerHTML = `Shipped: ${current.shippingStatus}`;
        activeStatus.innerHTML = `Canceled: ${current.orderCancelStatus}`;
        orderDate.innerHTML = `Ordered At: ${DateTime.fromISO(current.created)
            .setZone('America/Los_Angeles')
            .toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}`;
        
        orderCardDiv.appendChild(name);
        orderCardDiv.appendChild(product);
        orderCardDiv.appendChild(orderId);
        orderCardDiv.appendChild(shippingStatus);
        orderCardDiv.appendChild(activeStatus);
        orderCardDiv.appendChild(orderDate);
        orderCardDiv.appendChild(shippingAddressDetails);

        orderCardDiv.classList.add("orderCard");
        if(current.shippingStatus === true)
        {
            orderCardDiv.classList.add("shippedBG");
            createUnShippedButton(orderCardDiv);
        }
        else if(current.orderCancelStatus === true)
        {
            orderCardDiv.classList.add("canceledBG");
            createReActivateButton(orderCardDiv);
        }
        else{
            createShippedButton(orderCardDiv);
            createdCancelButton(orderCardDiv);
        }

        ordersRoot.appendChild(orderCardDiv);
    });
}

const createShippedButton = (orderCardDiv) =>{

    let shippedButton = document.createElement("button");
    let shippingConfirmDiv = createShippedConfirmDiv(orderCardDiv, shippedButton);

        shippedButton.innerHTML = "Shipped";
        shippedButton.addEventListener("click", (event)=>{
            console.log("Update shipping status");
            hideButton(shippedButton);
            shippingConfirmDiv.style.display = "block";
        });

        shippedButton.classList.add("buttonStd");
        shippedButton.classList.add("whiteText");
        shippedButton.classList.add("greenBG");
        orderCardDiv.appendChild(shippedButton);
}

const createShippedConfirmDiv = (orderCardDiv,  shippedButton)=>{
    let shippingConfirmDiv = document.createElement("div");

    let confirmShipButton = document.createElement("button");
    confirmShipButton.innerHTML = "Confirm";
    confirmShipButton.addEventListener("click", (event)=>{
        console.log("Confirm Ship Update Database");
        let idText = event.target.parentNode.parentNode.childNodes[2].innerHTML;
        let idArry = idText.split(": ");
        updateOrderShipStatus(idArry[1], true);
        
    });

    confirmShipButton.classList.add("buttonStd");
    confirmShipButton.classList.add("whiteText");
    confirmShipButton.classList.add("greenBG");

    let backShipButton = document.createElement("button");
    backShipButton.innerHTML = "Back";
    backShipButton.addEventListener("click", ()=>{
        shippingConfirmDiv.style.display = "none";
        shippedButton.style.display = "inline-block";
    });

    backShipButton.classList.add("buttonStd");
    backShipButton.classList.add("whiteText");
    backShipButton.classList.add("orangeBG");

    let shippingConfirmPrompt = document.createElement("p");
    shippingConfirmPrompt.innerHTML = "Mark this order Shipped?";

    shippingConfirmDiv.appendChild(shippingConfirmPrompt);
    shippingConfirmDiv.appendChild(confirmShipButton);
    shippingConfirmDiv.appendChild(backShipButton);
    shippingConfirmDiv.style.display = "none";
    orderCardDiv.appendChild(shippingConfirmDiv);

    return shippingConfirmDiv;
}

const createdCancelButton = (orderCardDiv)=>{
    let cancelButton = document.createElement("button");
    let cancelConfirmDiv = createCancelConfirmDiv(orderCardDiv, cancelButton);
        cancelButton.innerHTML = "Cancel";
        cancelButton.addEventListener("click", (event)=>{
            console.log("Update cancel status");
            hideButton(cancelButton);
            cancelConfirmDiv.style.display = "block";
        });

        cancelButton.classList.add("buttonStd");
        cancelButton.classList.add("whiteText");
        cancelButton.classList.add("orangeBG");
        orderCardDiv.appendChild(cancelButton);
}

const createCancelConfirmDiv = (orderCardDiv,  cancelButton)=>{
    let cancelConfirmDiv = document.createElement("div");

    let confirmCancelButton = document.createElement("button");
    confirmCancelButton.innerHTML = "Confirm";
    confirmCancelButton.addEventListener("click", (event)=>{
        console.log("Cancel Order Update Database");
        let idText = event.target.parentNode.parentNode.childNodes[2].innerHTML;
        let idArry = idText.split(": ");
        updateCancelStatus(idArry[1], true);
    });

    confirmCancelButton.classList.add("buttonStd");
    confirmCancelButton.classList.add("whiteText");
    confirmCancelButton.classList.add("blueBG");

    let backCancelButton = document.createElement("button");
    backCancelButton.innerHTML = "Back";
    backCancelButton.addEventListener("click", ()=>{
        cancelConfirmDiv.style.display = "none";
        cancelButton.style.display = "inline-block";
    });

    backCancelButton.classList.add("buttonStd");
    backCancelButton.classList.add("whiteText");
    backCancelButton.classList.add("blackBG");

    let cancelConfirmPrompt = document.createElement("p");
    cancelConfirmPrompt.innerHTML = "Cancel this order?";

    cancelConfirmDiv.appendChild(cancelConfirmPrompt);

    cancelConfirmDiv.appendChild(confirmCancelButton);
    cancelConfirmDiv.appendChild(backCancelButton);
    cancelConfirmDiv.style.display = "none";
    orderCardDiv.appendChild(cancelConfirmDiv);

    return cancelConfirmDiv;
}

const createUnShippedButton = (orderCardDiv) =>{

    let unShippedButton = document.createElement("button");
    let shippingConfirmDiv = createUnShippedConfirmDiv(orderCardDiv, unShippedButton);

        unShippedButton.innerHTML = "Not Shipped";
        unShippedButton.addEventListener("click", (event)=>{
            console.log("Update shipping status");
            hideButton(unShippedButton);
            shippingConfirmDiv.style.display = "block";
        });

        unShippedButton.classList.add("buttonStd");
        unShippedButton.classList.add("whiteText");
        unShippedButton.classList.add("blackBG");
        orderCardDiv.appendChild(unShippedButton);
}

const createUnShippedConfirmDiv = (orderCardDiv,  unShippedButton)=>{
    let unShippingConfirmDiv = document.createElement("div");

    let confirmUnShipButton = document.createElement("button");
    confirmUnShipButton.innerHTML = "Confirm";
    confirmUnShipButton.addEventListener("click", (event)=>{
        console.log("Confirm Ship Update Database");
        let idText = event.target.parentNode.parentNode.childNodes[2].innerHTML;
        let idArry = idText.split(": ");
        updateOrderShipStatus(idArry[1], false);
        
    });

    confirmUnShipButton.classList.add("buttonStd");
    confirmUnShipButton.classList.add("whiteText");
    confirmUnShipButton.classList.add("blueBG");

    let backShipButton = document.createElement("button");
    backShipButton.innerHTML = "Back";
    backShipButton.addEventListener("click", ()=>{
        unShippingConfirmDiv.style.display = "none";
        unShippedButton.style.display = "inline-block";
    });

    backShipButton.classList.add("buttonStd");
    backShipButton.classList.add("whiteText");
    backShipButton.classList.add("orangeBG");

    let unShippingConfirmPrompt = document.createElement("p");
    unShippingConfirmPrompt.innerHTML = "Reset the order to Not Shipped?";

    unShippingConfirmDiv.appendChild(unShippingConfirmPrompt);
    unShippingConfirmDiv.appendChild(confirmUnShipButton);
    unShippingConfirmDiv.appendChild(backShipButton);
    unShippingConfirmDiv.style.display = "none";
    orderCardDiv.appendChild(unShippingConfirmDiv);

    return unShippingConfirmDiv;
}

const createReActivateButton = (orderCardDiv) =>{

    let ReActivateButton = document.createElement("button");
    let ReActivateConfirmDiv = createReActivateConfirmDiv(orderCardDiv, ReActivateButton);

    ReActivateButton.innerHTML = "ReActivate";
    ReActivateButton.addEventListener("click", (event)=>{
            console.log("Update shipping status");
            hideButton(ReActivateButton);
            ReActivateConfirmDiv.style.display = "block";
        });

        ReActivateButton.classList.add("buttonStd");
        ReActivateButton.classList.add("whiteText");
        ReActivateButton.classList.add("blackBG");
        orderCardDiv.appendChild(ReActivateButton);
}

const createReActivateConfirmDiv = (orderCardDiv,  ReActivateButton)=>{
    let ReActivateConfirmDiv = document.createElement("div");

    let confirmReActivateButton = document.createElement("button");
    confirmReActivateButton.innerHTML = "Confirm";
    confirmReActivateButton.addEventListener("click", (event)=>{
        console.log("Confirm Ship Update Database");
        let idText = event.target.parentNode.parentNode.childNodes[2].innerHTML;
        let idArry = idText.split(": ");
        updateCancelStatus(idArry[1], false);
        
    });

    confirmReActivateButton.classList.add("buttonStd");
    confirmReActivateButton.classList.add("whiteText");
    confirmReActivateButton.classList.add("blueBG");

    let backReActivateButton = document.createElement("button");
    backReActivateButton.innerHTML = "Back";
    backReActivateButton.addEventListener("click", ()=>{
        ReActivateConfirmDiv.style.display = "none";
        ReActivateButton.style.display = "inline-block";
    });

    backReActivateButton.classList.add("buttonStd");
    backReActivateButton.classList.add("whiteText");
    backReActivateButton.classList.add("orangeBG");

    let ReActivateConfirmPrompt = document.createElement("p");
    ReActivateConfirmPrompt.innerHTML = "Set the order back to Active (Un-Cancel)?";

    ReActivateConfirmDiv.appendChild(ReActivateConfirmPrompt);
    ReActivateConfirmDiv.appendChild(confirmReActivateButton);
    ReActivateConfirmDiv.appendChild(backReActivateButton);
    ReActivateConfirmDiv.style.display = "none";
    orderCardDiv.appendChild(ReActivateConfirmDiv);

    return ReActivateConfirmDiv;
}


const hideButton = (button) =>{
    button.style.display = "none";
}

const showButton = (button) =>{
    button.style.display = "inline-block";
}

const clearOrdersList = ()=>{

    var updateOrdersRoot = document.getElementById("updateOrdersRoot");
        
    while (updateOrdersRoot.childNodes.length > 0) {
        updateOrdersRoot.removeChild(updateOrdersRoot.firstChild);
    }

}

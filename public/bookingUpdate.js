const getClientBookings = async (clientId) => {

    console.log("Getting client Bookings");

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch(`/bookings/${clientId}`, {
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
        clearBookingsList();
        listClientBookings(content);
    }
};

const listClientBookings = (bookings) => {


    bookings.clientBookings.map((current) =>{
        var fromUTCTime = DateTime.fromISO(current.from);
        var fromLATime = fromUTCTime.setZone('America/Los_Angeles');
        var displayFromTime = fromLATime.toLocaleString(DateTime.TIME_SIMPLE);

        var toUTCTime = DateTime.fromISO(current.to);
        var toLATime = toUTCTime.setZone('America/Los_Angeles');
        var displayToTime = toLATime.toLocaleString(DateTime.TIME_SIMPLE);

        var timeDisplayStr = `${displayFromTime} - ${displayToTime}`;

        var div = document.createElement("div");
        var bookeeP = document.createElement("p");
        var dateP = document.createElement("p");
        var timeP = document.createElement("p");
        var deleteButton = document.createElement("button");
        // add booking id
       

        bookeeP.innerHTML = current.bookeeName;
        dateP.innerHTML = fromLATime.toLocaleString(DateTime.DATE_HUGE);
        timeP.innerHTML = timeDisplayStr;
        deleteButton.innerHTML = "Delete";

        deleteButton.classList.add("button");
        deleteButton.classList.add("blueBtn");

        div.classList.add("blackBG");
        div.classList.add("bookingCard");
        div.style.minWidth = "300px";

        div.appendChild(bookeeP);
        div.appendChild(dateP);
        div.appendChild(timeP);
        div.appendChild(deleteButton);

        deleteButton.addEventListener("click", (event) => {
            console.log(`Delete Booking ${current.bookeeName} Date: ${fromLATime} OBJ id: ${current._id}`);
            hideDeleteButton(event.target);

            var confirmButton = document.createElement("button");
            confirmButton.innerHTML = "Confirm";
            confirmButton.classList.add("orangeBtn");
            confirmButton.classList.add("button");
            confirmButton.addEventListener("click", (event)=>{
                deleteBooking(current._id);
                event.target.parentNode.removeChild(event.target.parentNode.lastChild);
                event.target.parentNode.removeChild(event.target.parentNode.lastChild);
                showLoadingImage(event.target.parentNode);
            });

            var backButton = document.createElement("button");
            backButton.innerHTML = "Back";
            backButton.classList.add("blueBtn");
            backButton.classList.add("button");
            backButton.addEventListener("click", (evt)=>{
                showDeleteButton(deleteButton);
                event.target.parentNode.removeChild(event.target.parentNode.lastChild);
                event.target.parentNode.removeChild(event.target.parentNode.lastChild);

            });

            event.target.parentNode.appendChild(confirmButton);
            event.target.parentNode.appendChild(backButton);


        });

        var bookingUpdateRoot = document.getElementById("updateBookingsRoot");
        bookingUpdateRoot.appendChild(div);

        return current;
    });
}

const hideDeleteButton = (button) =>{
    button.style.display = "none";
}

const showDeleteButton = (button) =>{
    button.style.display = "block";
}

const showLoadingImage = (node)=>{
    var loadingImg = document.createElement("img");
    loadingImg.src = "/loading_blue.svg";
    loadingImg.style.width = "75px";
    node.appendChild(loadingImg);
}

const deleteBooking = async (id) => {
    console.log("Getting client Bookings");

    var auth = sessionStorage.getItem("xauth");
        
    const rawResponse = await fetch(`/bookings/delete/${id}`, {
        method: 'DELETE',
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

const clearBookingsList = ()=>{

    var bookingUpdateRoot = document.getElementById("updateBookingsRoot");

        while (bookingUpdateRoot.childNodes.length > 0) {
            bookingUpdateRoot.removeChild(bookingUpdateRoot.lastChild);
        }
}

let updateBookingClientList = document.getElementById("updateBookingClientList");


updateBookingClientList.addEventListener("change", function(event) {
    var bookeeId = event.target.value;

    console.log(`Bookee ID ${bookeeId}`);
    getClientBookings(bookeeId);
});


let updateBookingRefreshBtn = document.getElementById("updateBookingButton");


updateBookingRefreshBtn.addEventListener("click", function(event) {
    let updateBookingClientList = document.getElementById("updateBookingClientList");
    var bookeeId = updateBookingClientList[updateBookingClientList.selectedIndex].value;

    console.log(`Bookee ID ${bookeeId}`);
    getClientBookings(bookeeId);
});
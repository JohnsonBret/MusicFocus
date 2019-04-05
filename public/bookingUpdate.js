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
        populateClientSelect(content);
    }
};

let updateBookingClientList = document.getElementById("updateBookingClientList");


updateBookingClientList.addEventListener("change", function(event) {
    var bookeeId = event.target.value;

    console.log(`Bookee ID ${bookeeId}`);
    getClientBookings(bookeeId);
});
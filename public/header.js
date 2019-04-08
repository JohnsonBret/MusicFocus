let hamburger = document.getElementById("hamburger");
let isShowing = false;

hamburger.addEventListener("click", (event)=>{
    let mobileLinks = document.getElementById("mobileLinks");
    
    if(isShowing == false)
    {
        mobileLinks.style.display = "flex";
        isShowing = true;
    }
    else{
        mobileLinks.style.display = "none";
        isShowing = false;
    }
});
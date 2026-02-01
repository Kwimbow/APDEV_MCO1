/* JS file that contains the shared ui of each navigation button */  

let btn = document.querySelector("#btn")
let sideNav = document.querySelector("#side-bar")
let navItem = document.querySelector("#nav-item")
let mainContent = document.querySelector("#main-content")
let home = document.querySelector("#home-btn")
let bookmark = document.querySelector("#bookmarks-btn")

var modal = document.getElementById('register-popup');
var modal2 = document.getElementById('login-popup');

// Toggle Side Navigation
btn.onclick = function() {
    // Minimize the side navigation white box
    sideNav.classList.toggle("minimize");
    // Minimize/Hide the side navigation buttons
    navItem.classList.toggle("minimize");
    // Animate the menu button
    btn.classList.toggle("clicked");
    // Expand the main content area
    mainContent.classList.toggle("expand");
}

// Highlight Active Page
if (window.location.href.indexOf("index.html") > -1) {
    home.classList.add("active");
} else if (window.location.href.indexOf("bookmarks.html") > -1) {
    bookmark.classList.add("active");
}

// Close Log In, Register on Outside Click
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
    if (event.target == modal2) {
        modal2.style.display = "none";
    }
}

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



function showPopup(id) {
    document.getElementById(id).style.display = "block";
}

function hidePopup(id) {
    document.getElementById(id).style.display = "none";
}

function setupPopups(){
  // Open buttons
    document.getElementById("reg")?.addEventListener("click", () => {
        showPopup("register-popup");
    });

    document.getElementById("log")?.addEventListener("click", () => {
        showPopup("login-popup");
    });

    // Click outside to close
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    });
}

function setupLogout(){
    const logoutBtn = document.getElementById("settings-logged-in");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        logout();
        updateUserUI();
    });
}

function setupLoginForm(){
    const loginForm = document.querySelector("#login-popup form");

    if (!loginForm) return;

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = loginForm.querySelector('input[name="uname"]').value;
        const password = loginForm.querySelector('input[name="psw"]').value;

        if (login(username, password)) {
            hidePopup("login-popup");
            updateUserUI();
        } else {
            alert("Try admin / 1234");
        }
    });
}

function updateUserUI() {
    const user = getCurrentUser();
    const postBtn = document.getElementById("create-post-login");
    const miniProfile = document.getElementById("mini-profile");
    const regLoginGroup = document.getElementById("reg-login-group");

    if (!postBtn || !miniProfile || !regLoginGroup) return;

    if (user !== null) {
        postBtn.style.display = "block";
        miniProfile.style.display = "block";
        regLoginGroup.style.display = "none";
    } else {
        postBtn.style.display = "none";
        miniProfile.style.display = "none";
        regLoginGroup.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setupPopups();
    setupLoginForm();
    setupLogout();
    updateUserUI();
});
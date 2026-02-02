/* JS file that contains the shared ui of each navigation button 
   such as the header bar, the side navigation bar, the user's profile, and etc. */  

let btn = document.querySelector("#btn");
let sideNav = document.querySelector("#side-bar");
let navItem = document.querySelector("#nav-item");
let mainContent = document.querySelector("#main-content");
let home = document.querySelector("#home-btn");
let bookmark = document.querySelector("#bookmarks-btn");

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
    if (id === "register-popup"){
        clearLoginRegister("register-popup");
    } if (id === "login-popup"){
        clearLoginRegister("login-popup");
    }
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
                hidePopup(modal.id);
            }
        });
    });
}

function setupLogout(){
    const logoutBtn = document.getElementById("settings-logged-in");//<-- change this to log out when actual button is made

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        logoutAndRedirect();
    });
}

function setupLoginForm(){
    const loginForm = document.querySelector("#login-popup form");
    var rememberMe = document.querySelector("#remember-3weeks");

    if (!loginForm) return;

    let log_user = document.getElementById('log-user-info');
        let log_pw = document.getElementById('log-pw-info');
        let log_empty_user = document.getElementById('log-empty-user');
        let log_empty_pw = document.getElementById('log-empty-pw');
        let log_unmatch_user_pw = document.getElementById('log-unmatch-user-pw');

        log_user.addEventListener('focus', () => {
            log_user.classList.remove('wrong');
            log_pw.classList.remove('wrong');
            log_empty_user.classList.remove('invalid');
            log_empty_pw.classList.remove('invalid');
            log_unmatch_user_pw.classList.remove('invalid');
        });

        log_pw.addEventListener('focus', () => {
            log_user.classList.remove('wrong');
            log_pw.classList.remove('wrong');
            log_empty_user.classList.remove('invalid');
            log_empty_pw.classList.remove('invalid');
            log_unmatch_user_pw.classList.remove('invalid');
        });

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let username = loginForm.querySelector('input[name="uname"]').value;
        let password = loginForm.querySelector('input[name="psw"]').value;
        let successful = false;

        username = username.trim();
        password = password.trim();

        if(username === "" || password === ""){
            if(username === ""){
                errorShake(log_user, log_empty_user);
                log_user.classList.add('wrong');
                log_empty_user.classList.add('invalid');
                log_unmatch_user_pw.classList.remove('invalid');
            } if(password === ""){
                errorShake(log_pw, log_empty_pw);
                log_pw.classList.add('wrong');
                log_empty_pw.classList.add('invalid');
                log_unmatch_user_pw.classList.remove('invalid');
            }
        }else{
            if(rememberMe.checked){
                successful = rememberMe3Weeks(username, password);
            } else{
                successful = login(username, password);
            }

            if (successful) {
                hidePopup("login-popup");
                updateUserUI();
            } else {
                errorShake(log_user, log_pw, log_unmatch_user_pw);
                log_user.classList.add('wrong');
                log_pw.classList.add('wrong');
                log_unmatch_user_pw.classList.add('invalid');
                log_empty_pw.classList.remove('invalid');
            }
        }

        
    });
}

function setupRegisterForm(){
    const registerForm = document.querySelector("#register-popup form");

    if (!registerForm) return;

    let reg_user = document.getElementById('reg-user-info');
        let reg_pw = document.getElementById('reg-pw-info');
        let reg_repw = document.getElementById('reg-repw-info');
        let reg_empty_user = document.getElementById('reg-empty-user');
        let reg_taken_user = document.getElementById('reg-taken-user');
        let reg_empty_pw = document.getElementById('reg-empty-pw');
        let reg_unmatch_pw = document.getElementById('reg-unmatch-pw');

        reg_user.addEventListener('focus', () => {
            reg_user.classList.remove('wrong');
            reg_empty_user.classList.remove('invalid');
            reg_taken_user.classList.remove('invalid');
            reg_pw.classList.remove('wrong');
            reg_repw.classList.remove('wrong');
            reg_empty_pw.classList.remove('invalid');
            reg_unmatch_pw.classList.remove('invalid');
        });

        reg_pw.addEventListener('focus', () => {
            reg_pw.classList.remove('wrong');
            reg_repw.classList.remove('wrong');
            reg_empty_pw.classList.remove('invalid');
            reg_unmatch_pw.classList.remove('invalid');
        });

        reg_repw.addEventListener('focus', () => {
            reg_pw.classList.remove('wrong');
            reg_repw.classList.remove('wrong');
            reg_empty_pw.classList.remove('invalid');
            reg_unmatch_pw.classList.remove('invalid');
        });

    registerForm.addEventListener("submit", (e) =>{
        e.preventDefault();

        let username = registerForm.querySelector('input[name="uname"]').value;
        let password = registerForm.querySelector('input[name="psw"]').value;
        let repassword = registerForm.querySelector('input[name="repsw"]').value;

        username = username.trim();
        password = password.trim();   
        repassword = repassword.trim();
        
        const result = register(username, password, repassword);

        if(username === "" || password === "" || repassword === ""){
            if(username === ""){
                errorShake(reg_user, reg_empty_user);
                reg_user.classList.add('wrong');
                reg_empty_user.classList.add('invalid');
                reg_taken_user.classList.remove('invalid');
            }if(password === "" || repassword === ""){
                reg_empty_pw.classList.add('invalid');
                if(password === ""){
                    errorShake(reg_pw, reg_empty_pw);
                    reg_pw.classList.add('wrong');
                }if(repassword === ""){
                    errorShake(reg_repw, reg_empty_pw);
                    reg_repw.classList.add('wrong');
                }
                reg_unmatch_pw.classList.remove('invalid');
            }
        }else{
            if(result === true){
                hidePopup("register-popup");
                successfullyRegMsg();
            } else if(result === null){
                //show red on both password and display message: passwords do not match
                errorShake(reg_pw, reg_repw, reg_unmatch_pw);
                reg_pw.classList.add('wrong');
                reg_repw.classList.add('wrong');
                reg_unmatch_pw.classList.add('invalid');
                reg_empty_pw.classList.remove('invalid');
            } else if(result === false){
                //display username is taken
                errorShake(reg_user, reg_taken_user);
                reg_user.classList.add('wrong');
                reg_taken_user.classList.add('invalid');
                reg_empty_user.classList.remove('invalid');
            }
        }
    });
}

function errorShake(...elements) {
    elements.forEach(el => {
        el.classList.remove('error-shake');
        void el.offsetWidth;
        el.classList.add('error-shake');
    });
}

function successfullyRegMsg(){
    const msg = document.getElementById("reg-success");
    msg.classList.add("show");
    setTimeout(() => {
        msg.classList.remove("show");
    }, 3000);
}

function clearLoginRegister(formId){
    let input = document.querySelector(`#${formId} form`);

    if (!input) return;

    input.querySelectorAll("input").forEach(data => {
        data.value = "";
        data.classList.remove("wrong");
    });
    input.querySelectorAll(".invalid").forEach(msg => {
        msg.classList.remove("invalid");
    });
}

function logoutAndRedirect(){
    logout();
    updateUserUI();
    window.location.href = "index.html";
}

function showBookmarksBar(){
    if(getCurrentUser() !== null){
        document.getElementById("bookmarks-bar").style.display = "block";
    }else{
        document.getElementById("bookmarks-bar").style.display = "none";
    }
}

function protectBookmarksPage(){
    if (window.location.href.includes("bookmarks.html")) {
        if (getCurrentUser() === null) {
            window.location.href = "index.html";
        }
    }
}

function updateUserUI() {
    const user = getCurrentUser();
    const postBtn = document.getElementById("create-post-login");
    const miniProfile = document.getElementById("mini-profile");
    const regLoginGroup = document.getElementById("reg-login-group");

    if (!postBtn || !miniProfile || !regLoginGroup) return;

    showBookmarksBar();

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
    setupRegisterForm();
    setupLogout();
    updateUserUI();
    showBookmarksBar();
    protectBookmarksPage();
});
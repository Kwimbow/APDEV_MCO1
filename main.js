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

/* This function controls the display of the side navigation buttons,
when btn(menu button) is clicked, it minimizes the side bar, the navigation buttons,
the btn(menu button) movement to sabay with the side bar's minimization, and expands
the main page for a wider view */
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

/* Brute forced active navigation button to indicate which page the user is in */
if (window.location.href.indexOf("index.html") > -1) {
    home.classList.add("active");
} else if (window.location.href.indexOf("bookmarks.html") > -1) {
    bookmark.classList.add("active");
}

/* This function shows the pop-up of the register and login "page", 
it also locks the body's content so that it cannot be scrolled */
function showPopup(id) {
    document.getElementById(id).style.display = "block";
    document.body.classList.add("modal-open");
}

/* This function hides the pop-up of the register and login "page", 
it also unlocks the body's content so that it can be scrolled/accessible when
this "page" closes */
function hidePopup(id) {
    document.getElementById(id).style.display = "none";
    document.body.classList.remove("modal-open");

    if (id === "register-popup"){
        clearLoginRegister("register-popup");
    } if (id === "login-popup"){
        clearLoginRegister("login-popup");
    }
    if (id === "create-post-popup"){
        clearLoginRegister("login-popup");
    }
}

/* This function handles the register and login button on the upper right corner,
when "register" button is clicked, open/show register pop-up ui,
when "login" button is clicked, open/show login pop-up ui.
Also handles the background clicks, so if user clicks pop-up background,
the pop-up of either register or login should be hidden */
function setupPopups(){
    document.getElementById("reg")?.addEventListener("click", () => {
        showPopup("register-popup");
    });
    document.getElementById("log")?.addEventListener("click", () => {
        showPopup("login-popup");
    });
    document.getElementById("create-post-btn")?.addEventListener("click", () => {
        showPopup("create-post-popup");
    });

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                hidePopup(modal.id);
            }
        });
    });
}

/* This function handles the logging out of the user,
TO BE EDITED ONCE THE SETTINGS POPOUT IS MADE */
function setupLogout(){
    const logoutBtn = document.getElementById("settings-logged-in");//<-- change this to log out when actual button is made

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        logoutAndRedirect();
    });
}

/* This function handles the data inputted in the log in pop-up,
currently handles "errors" and shows animations (shaky red + error msg) when it comes into 
contact with "errors". Handles "error" msgs to show one at a time.

 Known "Errors" are: Empty username field, Empty password field, and when
                   Account inputted is not in "server" (non-registered account)*/
function setupLoginForm(){
    const loginForm = document.querySelector("#login-popup form");
    var rememberMe = document.querySelector("#remember-3weeks");

    if (!loginForm) return;

    let log_user = document.getElementById('log-user-info');
    let log_pw = document.getElementById('log-pw-info');
    let log_empty_user = document.getElementById('log-empty-user');
    let log_empty_pw = document.getElementById('log-empty-pw');
    let log_unmatch_user_pw = document.getElementById('log-unmatch-user-pw');

    //if username input field is clicked, remove the "errors"
    log_user.addEventListener('focus', () => {
        log_user.classList.remove('wrong');
        log_pw.classList.remove('wrong');
        log_empty_user.classList.remove('invalid');
        log_empty_pw.classList.remove('invalid');
        log_unmatch_user_pw.classList.remove('invalid');
    });

    //if password input field is clicked, remove the "errors"
    log_pw.addEventListener('focus', () => {
        log_user.classList.remove('wrong');
        log_pw.classList.remove('wrong');
        log_empty_user.classList.remove('invalid');
        log_empty_pw.classList.remove('invalid');
        log_unmatch_user_pw.classList.remove('invalid');
    });

    //when user submits log in details
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        //get the inputted values
        let username = loginForm.querySelector('input[name="uname"]').value;
        let password = loginForm.querySelector('input[name="psw"]').value;
        let successful;

        //trim the inputted values to prevent leading & trailing spaces
        username = username.trim();
        password = password.trim();

        //if any input is empty show its specific "error" animations + msges
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
        //if there are no empty inputs
        }else{
            //verify if remember me button is toggled
            if(rememberMe.checked){
                successful = rememberMe3Weeks(username, password);
            //otherwise, only log the user in for that session, close website -> account logged out
            } else{
                successful = login(username, password);
            }

            //if successfully logged in, update user's UI
            if (successful) {
                hidePopup("login-popup");
                updateUserUI();
            //otherwise, not successfully logged in because of wrong credentials or account not registered
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

/* This function handles the data inputted in the register pop-up,
currently handles "errors" and shows animations (shaky red + error msg) when it comes into 
contact with "errors". Handles "error" msgs to show one at a time.

 Known "Errors" are: Empty username field, Empty password/re-enter password field,
                   Password and Re-entered Password don't match, and Taken username

What currently isn't handled yet is the minimum password length. */
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

    //if username input is clicked, remove all "errors"
    reg_user.addEventListener('focus', () => {
        reg_user.classList.remove('wrong');
        reg_empty_user.classList.remove('invalid');
        reg_taken_user.classList.remove('invalid');
        reg_pw.classList.remove('wrong');
        reg_repw.classList.remove('wrong');
        reg_empty_pw.classList.remove('invalid');
        reg_unmatch_pw.classList.remove('invalid');
    });

    //if password / re-enter pw input is clicked, remove all "errors" except taken username
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

    //when user submits register details
    registerForm.addEventListener("submit", (e) =>{
        e.preventDefault();

        let username = registerForm.querySelector('input[name="uname"]').value;
        let password = registerForm.querySelector('input[name="psw"]').value;
        let repassword = registerForm.querySelector('input[name="repsw"]').value;

        //trim all to prevent leading/trailing white spaces
        username = username.trim();
        password = password.trim();   
        repassword = repassword.trim();
        
        //call the register function from auth.js to verify the inputs
        const result = register(username, password, repassword);

        //if any input field is empty show its animations and "error" msges
        if(username === "" || password === "" || repassword === ""){
            if(username === ""){
                errorShake(reg_user, reg_empty_user);
                reg_user.classList.add('wrong');
                reg_empty_user.classList.add('invalid');
                reg_taken_user.classList.remove('invalid');

            //if either passwords has empty fields, show pw cannot be empty
            }if(password === "" || repassword === ""){
                reg_empty_pw.classList.add('invalid');
                //show their respective "errors"
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
            //registers the user's account, allowing them to log in manually, show successful msg
            if(result === true){
                hidePopup("register-popup");
                successfullyRegMsg();

            //function returns null if passwords dont match
            } else if(result === null){
                //show red on both password and display message: passwords do not match
                errorShake(reg_pw, reg_repw, reg_unmatch_pw);
                reg_pw.classList.add('wrong');
                reg_repw.classList.add('wrong');
                reg_unmatch_pw.classList.add('invalid');
                reg_empty_pw.classList.remove('invalid');

            //function returns false if the username has beed taken by another account
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

/* This function "redoes" the error shaking everytime the user clicks log-in or register
submit button */
function errorShake(...elements) {
    elements.forEach(el => {
        el.classList.remove('error-shake');
        void el.offsetWidth;
        el.classList.add('error-shake');
    });
}

/* This function displays a slide up message "successfully registered" for 3 seconds */
function successfullyRegMsg(){
    const msg = document.getElementById("reg-success");
    msg.classList.add("show");
    setTimeout(() => {
        msg.classList.remove("show");
    }, 3000);
}

/* This function clears the log in / register input form so that when the user
clicks out, their data that is in the input fields do not save when button is clicked again */
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

/* This function redirects the user back to the home page whenever they log out,
just in case the user logs out of a page that is inaccessible to visitors / non-logged in users */
function logoutAndRedirect(){
    logout();
    updateUserUI();
    window.location.href = "index.html";
}

/* This function unhides the bookmarks navigation button if the user is logged in.
NOTE: If you want to make more navigation bar buttons, duplicate this function, rename
      what is required to be renamed and add to updateUserUI() */
function showBookmarksBar(){
    if(getCurrentUser() !== null){
        document.getElementById("bookmarks-bar").style.display = "block";
    }else{
        document.getElementById("bookmarks-bar").style.display = "none";
    }
}

/* This function prohibits visitors from accessing the bookmarks page, even if they
change the link name to bookmarks.html */
function protectBookmarksPage(){
    if (window.location.href.includes("bookmarks.html")) {
        if (getCurrentUser() === null) {
            window.location.href = "index.html";
        }
    }
}

/* This function dynamically updates the user view as soon as they log in */
function updateUserUI() {
    const user = getCurrentUser();
    const postBtn = document.getElementById("create-post-login");
    const miniProfile = document.getElementById("mini-profile");
    const regLoginGroup = document.getElementById("reg-login-group");

    if (!postBtn || !miniProfile || !regLoginGroup) return;

    //add more views here (profile, settings, create post pop-up, and many more)
    showBookmarksBar();

    //end of views

    //when logged in, displays the create post button, mini profile button (upper right corner), 
    // and hides the register/login button
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

//calls the functions
document.addEventListener("DOMContentLoaded", () => {
    setupPopups();
    setupLoginForm();
    setupRegisterForm();
    setupLogout();
    updateUserUI();
    protectBookmarksPage();
});
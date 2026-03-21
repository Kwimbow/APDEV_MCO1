/* JS file that contains the shared ui of each navigation button 
   such as the header bar, the side navigation bar, the user's profile, and etc. */  

let btn = document.querySelector("#btn");
let sideNav = document.querySelector("#side-bar");
let navItem = document.querySelector("#nav-item");
let mainContent = document.querySelector("#main-content");

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

const navButtons = document.querySelectorAll('.side-nav-buttons');
const homeBtn = document.getElementById('home-btn');
const bookmarksBtn = document.getElementById('bookmarks-bar');

function resetNavActive() {
    navButtons.forEach(btn => btn.classList.remove('active'));
}

if (window.location.pathname.split('/').pop() === 'index.html') {
    homeBtn.classList.add('active');
} else if (window.location.pathname.split('/').pop() === 'bookmarks.html') {
    bookmarksBtn.classList.add('active');
}

const filters = document.querySelectorAll('.filter-input');
filters.forEach(filter => {
    filter.addEventListener('change', () => {
        resetNavActive();
    });
});

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
        clearCreatePost("create-post-popup");
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
        setupCreatePostForm();
        lightUpCreateButton();
    });

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                hidePopup(modal.id);
            }
        });
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
                loadPostsList();
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

/* This function displays a slide up message "successfully deleted post" for 3 seconds */
function successfullyDelPostMsg(){
    const msg = document.getElementById("del-post-success");
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

function lightUpCreateButton(){
    const createBtn = document.getElementById("create-post-submit");
    let title = document.getElementById("title");
    let content = document.getElementById("content");
    let tag = document.querySelector('input[name="tag"]:checked');

    if(title.value.trim() === "" || content.value.trim() === "" || tag === null){
        createBtn.classList.remove("active");
        createBtn.disabled = true;
    } else {
        createBtn.classList.add("active");
        createBtn.disabled = false;
    }
}

function setupCreatePostForm(){
    const title = document.getElementById("title");
    const content = document.getElementById("content");
    const tags = document.querySelectorAll('input[name="tag"]');

    if (!title || !content || !tags) return;

    title.addEventListener("input", lightUpCreateButton);
    content.addEventListener("input", lightUpCreateButton);

    tags.forEach(tag => {
        tag.addEventListener("change", lightUpCreateButton);
    });
}

function clearCreatePost(formId){
    let input = document.querySelector(`#${formId} form`);

    if (!input) return;

    let title = input.querySelector("#title");
    let content = input.querySelector("#content");
    let tags = input.querySelectorAll('input[name="tag"]');

    if (!title || !content || !tags) return;

    title.value = "";
    content.value = "";
    tags.forEach(tag => {
        tag.checked = false;
    });

    lightUpCreateButton();
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

        const profileBtn = document.getElementById('profile-clickable');

        if (profileBtn) 
          profileBtn.onclick = () => {                  // omg i used an arrow function i feel so cool
            location.href = `user.html?id=${user._id}`; 
          };

        loadMiniProfilePfp(user._id);

    } else {
        postBtn.style.display = "none";
        miniProfile.style.display = "none";
        regLoginGroup.style.display = "block";
    }
}

/* This function displays the drop down menu for posts*/
function setupPostOptions() {
    const user = getCurrentUser();
    if (!user) return;

    const btn = document.getElementById("post-settings-btn");
    const menu = document.querySelector(".post-options-menu");
    const postUsernameEl = document.getElementById("full-post-username"); // use this
    const currentPostID = document.getElementById("full-post-view")?.dataset.postId;
    if (!btn || !menu || !postUsernameEl) return;

    const postUser = postUsernameEl.textContent.trim();
    if (user.username !== postUser) {
        btn.style.display = "none";
        return;
    }

    btn.style.display = "block";

    btn.addEventListener("click", () => {
        const isOpen = menu.classList.contains("open");
        menu.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", !isOpen);
        menu.setAttribute("aria-hidden", isOpen);
    });

    document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-hidden", "true");
        }
    });

    //make delete and edit button work
    const deleteBtn = document.getElementById("delete-post");
    const editBtn = document.getElementById("edit-post");

    if(deleteBtn && currentPostID){
        deleteBtn.addEventListener("click", () => {
            const posts = JSON.parse(localStorage.getItem("posts") || "[]");
            const updatedPosts = posts.filter(p => p.postID !== currentPostID);
            localStorage.setItem("posts", JSON.stringify(updatedPosts));
            const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
            delete allComments[currentPostID];
            localStorage.setItem("comments", JSON.stringify(allComments));
            successfullyDelPostMsg();
            setTimeout(() => {
                window.location.replace("index.html");
            }, 4000);
            
        });
    }

    if(editBtn && currentPostID) {
        editBtn.addEventListener("click", () => {
            const posts = JSON.parse(localStorage.getItem("posts") || "[]");
            const postToEdit = posts.find(p => p.postID === currentPostID);
            if (!postToEdit) return;

            const oldPopup = document.getElementById("create-post-popup");
            if (oldPopup) oldPopup.remove();

            const editPopup = document.createElement("div");
            editPopup.innerHTML =
                "<div id='create-post-popup' class='modal'>" +
                    "<form id='createpost_form' class='create-post-modal'>" +
                        "<div class='xcontainer'>" +
                            "<span onclick='hidePopup(\"create-post-popup\")' class='close'>&times;</span>" +
                        "</div>" +
                        "<div>" +
                            "<h2 id='create-title'>Edit Post</h2><hr><br>" +
                            "<div class='tag_holder'>" +
                                "<label class='tag_header' for='tag'>Tag:</label>" +
                                "<input class='tag_input' type='radio' id='guides' name='tag' value='guides'>" +
                                "<label class='tag_label' for='guides'>Guides</label>" +
                                "<input class='tag_input' type='radio' id='discussion' name='tag' value='discussion'>" +
                                "<label class='tag_label' for='discussion'>Discussion</label>" +
                                "<input class='tag_input' type='radio' id='showcase' name='tag' value='showcase'>" +
                                "<label class='tag_label' for='showcase'>Showcase</label>" +
                                "<input class='tag_input' type='radio' id='joke' name='tag' value='joke'>" +
                                "<label class='tag_label' for='joke'>Jokes</label>" +
                                "<input class='tag_input' type='radio' id='misc' name='tag' value='misc'>" +
                                "<label class='tag_label' for='misc'>Miscellaneous</label>" +
                            "</div>" +
                            "<div>" +
                                "<input class='title_inpt' type='text' id='title' name='title' placeholder='Enter post title...' required>" +
                            "</div>" +
                            "<div>" +
                                "<textarea class='post_content' id='content' name='post-content' placeholder='Enter post content...' required></textarea>" +
                            "</div>" +
                            "<div>" +
                                "<input class='submit_btn' type='submit' id='create-post-submit' value='Save Changes'>" +
                            "</div>" +
                        "</div>" +
                    "</form>" +
                "</div>";

            document.body.appendChild(editPopup);

            // Opens popup similar to create post, but for editing the post
            const modalEl = document.getElementById("create-post-popup");
            modalEl.style.display = "block";
            document.body.classList.add("modal-open");

            // Keep old values in the textboxes
            const titleInput = modalEl.querySelector("#title");
            const contentInput = modalEl.querySelector("#content");
            if (titleInput) titleInput.value = postToEdit.title;
            if (contentInput) contentInput.value = postToEdit.content;

            //Set the tags
            const tags = ["guides", "discussion", "showcase", "joke", "misc"];
            tags.forEach(tag => {
                const radio = modalEl.querySelector(`#${tag}`);
                if (radio) radio.checked = (postToEdit.tag === tag);
            });

            setupCreatePostForm();
            lightUpCreateButton();

            // saving the post data
            const form = modalEl.querySelector("#createpost_form");
            form.addEventListener("submit", (e) => {
                e.preventDefault();

                // Check old data
                const newTitle = titleInput.value.trim();
                const newContent = contentInput.value.trim();
                const selectedTagEl = modalEl.querySelector("input[name='tag']:checked");
                const newTag = selectedTagEl ? selectedTagEl.value : postToEdit.tag;

                let wasEdited = false;

                //if there was anything changed, set the post to "Edited on..." rather than "Posted on..."
                if (newTitle !== postToEdit.title || newContent !== postToEdit.content || newTag !== postToEdit.tag) {
                    wasEdited = true;
                    //this makes sure that posts that were edited previously wouldnt be set as "posted on" if nothing was changed and it was initially edited alr
                    postToEdit.edited = wasEdited;
                }

                // Update post
                postToEdit.title = newTitle;
                postToEdit.content = newContent;
                postToEdit.tag = newTag;

                // Update date
                if (wasEdited) {
                    const now = new Date();
                    const formattedDate = now.toISOString();
                    postToEdit.date = formattedDate; 
                }

                //save post
                const index = posts.findIndex(p => p.postID === currentPostID);
                if(index !== -1) posts[index] = postToEdit;
                localStorage.setItem("posts", JSON.stringify(posts));

                //close modal
                hidePopup("create-post-popup");
                viewFullPost(postToEdit);
            });

            // click outside to close
            modalEl.addEventListener("click", (e) => {
                if (e.target === modalEl) hidePopup("create-post-popup");
            });
        });
    }
}

/* This function displays the drop down menu for the main settings*/
function setupGeneralOptions() {
    const btn = document.getElementById("settings-visitor");
    const menu = document.querySelector(".general-options-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
        const isOpen = menu.classList.contains("open");
        menu.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", !isOpen);
        menu.setAttribute("aria-hidden", isOpen);
    });

    document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-hidden", "true");
        }
    });

    //make delete and edit button work
    const darkModebtn = document.getElementById("dark-mode");

    if (darkModebtn) {
        darkModebtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
        });
    }
}

/* This function displays the drop down menu for the user settings*/
function setupUserOptions() {
    const btn = document.getElementById("settings-logged-in");
    const menu = document.querySelector(".user-options-menu");
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
        const isOpen = menu.classList.contains("open");
        menu.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", !isOpen);
        menu.setAttribute("aria-hidden", isOpen);
    });

    document.addEventListener("click", (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("open");
            btn.setAttribute("aria-expanded", "false");
            menu.setAttribute("aria-hidden", "true");
        }
    });

    const darkModebtn = document.getElementById("dark-mode2");
    const logoutBtn = document.getElementById("logout-btn");

    if (darkModebtn) {
        darkModebtn.addEventListener("click", () => {
            document.body.classList.toggle("darkmode");
            localStorage.setItem("darkMode", document.body.classList.contains("darkmode"));
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            logoutAndRedirect();
        });
    }
}

function searchPostsByKeyword(keyword) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const lowerKeyword = keyword.toLowerCase();

    return posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(lowerKeyword);
        const contentMatch = post.content.toLowerCase().includes(lowerKeyword);
        const tagMatch = post.tag.toLowerCase().includes(lowerKeyword);
        return titleMatch || contentMatch || tagMatch;
    });
}
/*
function setupSearchFunctionality() {
    const searchForm = document.getElementById("search-for");
    const searchInput = document.getElementById("search-bar");

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = searchInput.value.trim();
        if (keyword === "") window.location.href = "index.html";
        if (keyword) {
            const results = searchPostsByKeyword(keyword);
            displaySearchResults(results, keyword);
        }
    });
}

function displaySearchResults(results, keyword) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `<h2 id="search-results-title">Search Results for "<span id="search-results-keyword">${keyword}</span>"</h2>`;

    if (results.length === 0) {
        mainContent.innerHTML += "<p id='search-no-posts'>No posts found.. *higurashi noises*</p>";
        return;
    }

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");

    results.forEach(result => {
        const i = posts.findIndex(p => p.postID === result.postID);

        const viewButton = document.createElement("button");
        viewButton.className = "view-post-button";

        const newPost = document.createElement("div");
        const postFlexTop = document.createElement("div")
        const postFlexBottom = document.createElement("div")
        const flexArea = document.createElement("div")
        const leftArea = document.createElement("div");
        const rightArea = document.createElement("div");
        rightArea.id = "post-right-area";
        leftArea.id = "post-left-area";
        postFlexTop.id = "post-flex-top";
        flexArea.id = "post-flex-display";
        postFlexBottom.id = "post-flex-bottom";

        const userPfp = new Image();
        userPfp.src = 'images/freddyt_logo.png';
        userPfp.id = "user-pfp"

        const upvoteBtn = document.createElement("button");
        const downvoteBtn = document.createElement("button");
        upvoteBtn.id = "upvote-btn";
        downvoteBtn.id = "downvote-btn";
        upvoteBtn.innerHTML = "<i class='bx bx-upvote'></i>";
        downvoteBtn.innerHTML = "<i class='bx bx-downvote'></i>";

        let voteCount = document.createElement("p");
        voteCount.id = "vote-count";
        voteCount.textContent = posts[i].votes;

        const postTag = document.createElement("p");
        postTag.id = "post-tag";
        if (result.tag === "discussion") postTag.classList.add('green-tag');
        else if (result.tag === "guides") postTag.classList.add('red-tag');
        else if (result.tag === "showcase") postTag.classList.add('purple-tag');
        else if (result.tag === "joke") postTag.classList.add('blue-tag');
        else if (result.tag === "misc") postTag.classList.add('orange-tag');
        postTag.textContent = result.tag;

        const postTitle = document.createElement("p");
        postTitle.id = "post-title";
        postTitle.textContent = result.title;

        const postContent = document.createElement("p");
        postContent.id = "post-content";
        postContent.textContent = result.content;

        const postDate = document.createElement("p");
        postDate.id = "post-date";
        postDate.textContent = result.date.split("T")[0];

        leftArea.append(userPfp, upvoteBtn, voteCount, downvoteBtn);
        newPost.append(leftArea);
        postFlexTop.append(postTag, postTitle, postDate);
        postFlexBottom.append(postContent);
        rightArea.append(postFlexTop, postFlexBottom);
        flexArea.append(rightArea);
        newPost.append(flexArea);

        newPost.id = "post-display";
        viewButton.append(newPost);
        mainContent.appendChild(viewButton);

        upvoteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            posts[i].votes += 1;
            voteCount.textContent = posts[i].votes;
            localStorage.setItem("posts", JSON.stringify(posts));
        });

        downvoteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            posts[i].votes -= 1;
            voteCount.textContent = posts[i].votes;
            localStorage.setItem("posts", JSON.stringify(posts));
        });

        viewButton.onclick = () => viewFullPost(posts[i]);
    });
}
*/


// fetches the current user's pfp from the DB and updates the mini-profile icon 

async function loadMiniProfilePfp(userId) {

    const res = await fetch(`/api/user/${userId}`);
    if (!res.ok) 
      return;

    const data = await res.json();
    if (!data.pfp) 
      return;

    const icon = document.getElementById('profile-icon');
    if (!icon) 
      return;
  
    const img = document.createElement('img');
    img.src = data.pfp;
    img.id = 'profile-icon';
    icon.replaceWith(img);
}


//calls the functions
document.addEventListener("DOMContentLoaded", () => {
    setupPopups();
    setupLoginForm();
    setupRegisterForm();
    updateUserUI();
    protectBookmarksPage();
    setupPostOptions();
    setupCommentOptions();
    setupGeneralOptions();
    setupUserOptions();
});

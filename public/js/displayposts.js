/* FOR DISPLAYING POSTS */

async function load_posts() {

    const res = await fetch('api/posts');
    const posts = await res.json();

    const container = document.getElementById("main-content");

    console.log(posts)
    
    posts.slice().reverse().forEach((post) => {

        if (post.votes === undefined) post.votes = 0;

        const viewButton = document.createElement("button");
        viewButton.className = "view-post-button";

        let postTime = (post.createdAt).toString();
        const timeString = postTime.split("T")
        let dateString = timeString[0]

        viewButton.onclick = () => viewFullPost(post);

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
        voteCount.appendChild(document.createTextNode(post.votes));

        const postTag = document.createElement("p");
        postTag.id = "post-tag";
        if (post.tag === "discussion"){
            postTag.classList.add('green-tag');
        }
        else if (post.tag === "guides"){
            postTag.classList.add('red-tag');
        }
        else if (post.tag === "showcase"){
            postTag.classList.add('purple-tag');
        }
        else if (post.tag === "joke"){
            postTag.classList.add('blue-tag');
        }
        else if (post.tag === "misc"){
            postTag.classList.add('orange-tag');
        }
        postTag.appendChild(document.createTextNode(post.tag));

        const postContent = document.createElement("p");
        postContent.id = "post-content";
        postContent.appendChild(document.createTextNode(post.content));

        const postTitle = document.createElement("p");
        postTitle.id = "post-title";
        postTitle.appendChild(document.createTextNode(post.title));
        
        const postDate = document.createElement("p");
        postDate.id = "post-date"
        postDate.appendChild(document.createTextNode(dateString));

        leftArea.append(userPfp);
        leftArea.append(upvoteBtn);
        leftArea.append(voteCount);
        leftArea.append(downvoteBtn);
        newPost.append(leftArea);
        
        postFlexTop.append(postTag);
        postFlexTop.append(postTitle);
        postFlexTop.append(postDate);
        postFlexBottom.append(postContent);
        rightArea.append(postFlexTop);
        rightArea.append(postFlexBottom);
        flexArea.append(rightArea);
        newPost.append(flexArea);

        newPost.id="post-display";
        viewButton.append(newPost);

        container.appendChild(viewButton);
    })

	console.log(res);

}

async function load_searched_posts(posts){
    
    const container = document.getElementById("main-content");

    container.innerHTML = "";

    posts.slice().reverse().forEach((post) => {

        if (post.votes === undefined) post.votes = 0;

        const viewButton = document.createElement("button");
        viewButton.className = "view-post-button";

        let postTime = (post.createdAt).toString();
        const timeString = postTime.split("T")
        let dateString = timeString[0]

        viewButton.onclick = () => viewFullPost(post);

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
        voteCount.appendChild(document.createTextNode(post.votes));

        const postTag = document.createElement("p");
        postTag.id = "post-tag";
        if (post.tag === "discussion"){
            postTag.classList.add('green-tag');
        }
        else if (post.tag === "guides"){
            postTag.classList.add('red-tag');
        }
        else if (post.tag === "showcase"){
            postTag.classList.add('purple-tag');
        }
        else if (post.tag === "joke"){
            postTag.classList.add('blue-tag');
        }
        else if (post.tag === "misc"){
            postTag.classList.add('orange-tag');
        }
        postTag.appendChild(document.createTextNode(post.tag));

        const postContent = document.createElement("p");
        postContent.id = "post-content";
        postContent.appendChild(document.createTextNode(post.content));

        const postTitle = document.createElement("p");
        postTitle.id = "post-title";
        postTitle.appendChild(document.createTextNode(post.title));
        
        const postDate = document.createElement("p");
        postDate.id = "post-date"
        postDate.appendChild(document.createTextNode(dateString));

        leftArea.append(userPfp);
        leftArea.append(upvoteBtn);
        leftArea.append(voteCount);
        leftArea.append(downvoteBtn);
        newPost.append(leftArea);
        
        postFlexTop.append(postTag);
        postFlexTop.append(postTitle);
        postFlexTop.append(postDate);
        postFlexBottom.append(postContent);
        rightArea.append(postFlexTop);
        rightArea.append(postFlexBottom);
        flexArea.append(rightArea);
        newPost.append(flexArea);

        newPost.id="post-display";
        viewButton.append(newPost);

        container.appendChild(viewButton);
    })

}


//when clicking a post, you entire full screen mode, home shi is gone, now its full of the post shi
function viewFullPost(post) {

    console.log(post)
  
    if(!post) return;
    setCurrentPost(post);
    const mainContent = document.getElementById("main-content");
    const userNow = getCurrentUser();
    
    resetNavActive(); //Reset active state of nav buttons when viewing a post
    
    const postDate = new Date(post.createdAt);
    const formattedPostDate = postDate.toLocaleDateString() + " " + postDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const fullPostView = document.createElement("div");
    fullPostView.id = "full-post-view";
    fullPostView.dataset.postId = post.postID;
    
    fullPostView.innerHTML = `
        <div id="full-view-wrapper">
            <div id="full-post-header">
                <button id="back-to-posts-btn" class="back-button"><i class='bx bx-arrow-back' id="back-arrow-btn"></i></button>
                <button id="post-settings-btn" class="post-options" style="display: none;" aria-haspopup="true" aria-expanded="false"><i class='bx bx-dots-vertical-rounded' id="post-settings-icon"></i></button>
                    <div class="post-options-menu" role="menu" aria-hidden="true">
                        <button class="post-options-menu-item" id="delete-post">Delete Post</button>
                        <button class="post-options-menu-item" id="edit-post">Edit Post</button>
                    </div>
            </div>
            <div id="full-post-wrapper">
                <div id="full-post-container">
                    <div id="full-post-left">
                        <img id="full-post-pfp" src="images/freddyt_logo.png">
                        <p id="full-post-username"></p>
                        <p id="full-post-date"></p>
                        <div id="full-vote-area">
                            <input type="checkbox" id="upv-checkbox">
                            <label for="upv-checkbox">
                                <i class='bx bx-upvote' id="full-upvote-btn"></i>
                            </label>
                            <p id="full-vote-count"></p>
                            <input type="checkbox" id="downv-checkbox">
                            <label for="downv-checkbox">
                                <i class='bx bx-downvote' id="full-downvote-btn"></i>
                            </label>
                        </div>
                        <div id="bookmarkBTN">
                            <input type="checkbox" id="bookmark-checkbox">
                            <label for="bookmark-checkbox">
                                <i class='bx bx-bookmark' id="full-bookmark-btn"></i>
                            </label>
                        </div>
                    </div>
                    <div id="full-post-right">
                        <div id="full-post-top">
                            <p id="full-post-tag"></p>
                            <h2 id="full-post-title"></h2>
                        </div>
                        <p id="full-post-content"></p>
                    </div>
                </div>
                <div id="full-comment-section">
                    <h3>Comments</h3>
                    <div id="full-comment-input-area" style="display: none;">
                        <textarea id="full-comment-input" placeholder="Join the conversation"></textarea>
                        <button id="full-submit-comment-btn" onclick="create_comment()">Comment</button>
                    </div>
                    <div id="full-comments-display-area"></div>
                </div>
            </div>
        </div>
        <div id="del-post-success">
            <span id="del-post-success-msg">Post successfully deleted! Redirecting...</span>
        </div>
    `;
    
    mainContent.innerHTML = "";
    mainContent.appendChild(fullPostView);

    const backBtn = document.getElementById("back-to-posts-btn"); 
    backBtn.addEventListener("click", () => { 
        homeBtn.classList.add("active"); 
    });
    
    const postTag = document.createElement("p");

    postTag.id = "full-post-tag";
    if (post.tag === "discussion") postTag.classList.add('green-tag');
    else if (post.tag === "guides") postTag.classList.add('red-tag');
    else if (post.tag === "showcase") postTag.classList.add('purple-tag');
    else if (post.tag === "joke") postTag.classList.add('blue-tag');
    else if (post.tag === "misc") postTag.classList.add('orange-tag');
    postTag.appendChild(document.createTextNode(post.tag));

    // Populate the post data
    document.getElementById("full-post-title").textContent = post.title;
    document.getElementById("full-post-content").textContent = post.content;
    document.getElementById("full-post-username").textContent = post.author.username;
    //This sets the posts' left side to be marked as edited or posted
    const fullPostDate = document.getElementById("full-post-date");
    fullPostDate.textContent = post.edited 
        ? `Edited on ${formattedPostDate}` 
        : `Posted on ${formattedPostDate}`;
        
    document.getElementById("full-post-tag").appendChild(postTag);

    const fullVoteCount = document.getElementById("full-vote-count");
    fullVoteCount.textContent = post.votes;

    const upvCheckbox = document.getElementById("upv-checkbox");
    const downvCheckbox = document.getElementById("downv-checkbox");
    const bookmarkCheckbox = document.getElementById("bookmark-checkbox");
    const upvoteIcon = document.getElementById("full-upvote-btn");
    const downvoteIcon = document.getElementById("full-downvote-btn");
    const bookmarkIcon = document.getElementById("full-bookmark-btn");
    const bookmarkContainer = document.getElementById("bookmarkBTN");

    if(userNow){
        bookmarkContainer.style.display = "block";
    }else{
        bookmarkContainer.style.display = "none";
    }

    upvCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        if (userNow !== null){
            if(upvCheckbox.checked){
                upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");
                upvoteIcon.style.color = "#df4b4b";

                if(downvCheckbox.checked){
                    downvCheckbox.checked = false;
                    downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
                    downvoteIcon.style.color = "";
                    post.votes += 2;
                }else{
                    post.votes += 1;
                }
            }else{
                upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
                upvoteIcon.style.color = "";
                post.votes -= 1;
            }
            fullVoteCount.textContent = post.votes;
            updatePostInStorage(post);
        } else{
            showPopup("login-popup");
        }
    });

    downvCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        if(userNow !== null){
            if(downvCheckbox.checked){
                downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");
                downvoteIcon.style.color = "#0004ff"; 

                if(upvCheckbox.checked){
                    upvCheckbox.checked = false;
                    upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
                    upvoteIcon.style.color = "";
                    post.votes -= 2;
                }else{
                    post.votes -= 1;
                }
            }else{
                downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
                downvoteIcon.style.color = "";
                post.votes += 1;
            }
            fullVoteCount.textContent = post.votes;
            updatePostInStorage(post);
        } else{
            showPopup("login-popup");
        }
    });

    bookmarkCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        if(userNow !== null){
            if(bookmarkCheckbox.checked){
                bookmarkIcon.classList.replace("bx-bookmark", "bxs-bookmark");
                bookmarkIcon.style.color = "#3600a2"; 

                //update to user bookmarks array by appending the post!!!
            }else{
                bookmarkIcon.classList.replace("bxs-bookmark", "bx-bookmark");
                bookmarkIcon.style.color = "";

                //update to user bookmarks by removing the post from the user's bookmarks array!!!
            }

            //update users bookmark list!!!
        } else{
            showPopup("login-popup");
        }
    });
    

    //show/hide comment input area based on login status
    //comments display is always visible
    const commentInputArea = document.getElementById("full-comment-input-area");
    commentInputArea.style.display = userNow ? "block" : "none";
    


    //display comments
    displayFullComments(post.postID);
    
    //back button functionality
    document.getElementById("back-to-posts-btn").onclick = function() {
        loadPostsList(currentFilter, currentTag);
    };
        
    function updatePostInStorage(updatedPost) { // ------------------------------------------------------------------------------------
        const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        const index = allPosts.findIndex(p => p.postID === updatedPost.postID);
        if (index !== -1) {
            allPosts[index] = updatedPost;
            localStorage.setItem("posts", JSON.stringify(allPosts));
        }
    }
    
    //submit button for comment // -----------------------------------------------------------------------------
    document.getElementById("full-submit-comment-btn").onclick = function() {
        submitComment(post.postID, null);
    };
}


function setCurrentPost(post) {
    sessionStorage.setItem("post", JSON.stringify(post));
}




//creating a comment 
function submitComment(postID, parentCommentID){  // --------------------------------------------------------------------
    const currentUser = getCurrentUser();
    if (!currentUser) return showPopup("login-popup");

    let commentInput;
    if(parentCommentID){
        commentInput = document.getElementById(`reply-input-${parentCommentID}`);
        const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
        const parentComment = (allComments[postID] || []).find(c => c.commentID === parentCommentID);
        if(!parentComment || parentComment.deleted){
            return;
        }
    }else {
        commentInput = document.getElementById("full-comment-input");
    }

    if(!commentInput) return;

    const commentText = commentInput.value.trim();
    if(!commentText) {
        return;
    }

    const newCommentID = crypto.randomUUID();
    const comment = {
        commentID: newCommentID,
        user: currentUser,
        text: commentText,
        date: new Date().toISOString(),
        parent_id: parentCommentID || null,
        votes: 0,
        edited: false
    };

    let allComments = JSON.parse(localStorage.getItem("comments") || "{}");
    if(!allComments[postID]) allComments[postID] = [];
    allComments[postID].push(comment);
    localStorage.setItem("comments", JSON.stringify(allComments));

    commentInput.value = "";
    displayFullComments(postID);
}

//like loadpostlist() but for comments
function displayFullComments(postID) { // --------------------------------------------------------
    const commentsArea = document.getElementById("full-comments-display-area");
    if(!commentsArea) return;

    commentsArea.innerHTML = "";

    const allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    const postComments = allComments[postID] || [];

    if (postComments.length === 0){
        commentsArea.innerHTML = '<h3 align="center" style="color: #999; font-family: \'Reddit Sans\'">Be the first to comment</h3>';
        return;
    }

    const topLevelComments = postComments.filter(c => !c.parent_id);

    topLevelComments.forEach(comment => {
        renderCommentThread(commentsArea, comment, postComments, postID, comment.commentID); 
    });

    setupCommentOptions();
}

//creates a single comment and its replies are shown recursively -----------------------------------------------
function renderCommentThread(container, comment, allComments, postID, commentIndex){
    const isDeleted = comment.deleted === true;
    const isEdited = comment.edited === true;

    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    if (isDeleted) commentItem.classList.add("deleted");
    if (isEdited) commentItem.classList.add("edited");

    const commentDate = new Date(comment.date);
    const formattedDate = commentDate.toLocaleDateString() + " " + commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const user = getCurrentUser();
    const isLoggedIn = user !== null;

    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    const post = posts.find(p => p.postID == postID);

    const currUser = isLoggedIn && (comment.user.username === user.username || post.user.username === user.username);
    const editComUser = isLoggedIn && (comment.user.username === user.username); //only author can edit

    const upvDownv = !isDeleted //this is the container for the upvote, count, downvote in the comments
        ? `<div class="upvote-downvote-comm">
               <input type="checkbox" id="upv-${comment.commentID}" class="comment-checkbox">
               <label for="upv-${comment.commentID}">
                   <i class='bx bx-upvote comment-vote-btns' id="upvote-${comment.commentID}"></i>
               </label>
               <p id="votes-${comment.commentID}">${comment.votes || 0}</p>
               <input type="checkbox" id="downv-${comment.commentID}" class="comment-checkbox">
               <label for="downv-${comment.commentID}">
                   <i class='bx bx-downvote comment-vote-btns' id="downvote-${comment.commentID}"></i>
               </label>
           </div>`
        : '';

    const popUpHTML = editComUser //if user is poster of comment, they can edit or delete, else if theyre owner of post, can only delete
        ? `<div class="comment-options-menu" role="menu" aria-hidden="true">
               <button class="comment-options-menu-item delete-comment" data-comment-id="${comment.commentID}" data-post-id="${postID}">Delete Comment</button>
               <button class="comment-options-menu-item edit-comment" data-comment-id="${comment.commentID}" data-post-id="${postID}">Edit Comment</button>
           </div>`
        : `<div class="comment-options-menu" role="menu" aria-hidden="true">
               <button class="comment-options-menu-item delete-comment" data-comment-id="${comment.commentID}" data-post-id="${postID}">Delete Comment</button>
           </div>`;

    const commentSettingsHTML = currUser && !isDeleted //shows comment options > pop up options
        ? `<div class="comment-options-wrapper">
               <button class="comment-options comments-settings-btn" data-comment-id="${commentIndex}" data-post-id="${postID}" data-comment-user="${comment.user.username}">
                   <i class='bx bx-dots-horizontal-rounded' id="comment-settings-icon"></i>
               </button>
               ${popUpHTML}
           </div>`
        : '';

    const replyHTML = isLoggedIn && !isDeleted //reply button, options and the reply box
        ? `<div class="comment-actions">
               <button class="reply-button" onclick="toggleReplyInput('${comment.commentID}')">Reply</button>
               ${commentSettingsHTML}
           </div>
           <div id="reply-input-container-${comment.commentID}" class="reply-input-container" style="display: none; margin-top: 10px;">
               <textarea id="reply-input-${comment.commentID}" class="reply-input"></textarea>
               <button onclick="submitComment('${postID}', '${comment.commentID}')" class="submit-reply-btn">Reply</button>
               <button onclick="toggleReplyInput('${comment.commentID}')" class="cancel-reply-btn">Cancel</button>
           </div>`
        : '';

    const commentText = isDeleted ? "[deleted]" : comment.text;
    const usernameText = isDeleted ? `<span class="deleted-text">[deleted]</span>` : comment.user.username;
    const editedFlag = isEdited ? `<span class="edited-comment">(edited)</span>` : "";

    const actionsHTML = !isDeleted //show the comment vote stuff, reply,and options as long as its not deleted
    ? `<div class="comment-actions-container">
           ${upvDownv}
           ${replyHTML}
       </div>`
    : '';

    commentItem.innerHTML = 
        `<div class="comment-content">
            <div class="comment-header">
                <span class="comment-username">${usernameText}</span>
                <span class="comment-date">${formattedDate} ${editedFlag}</span>
            </div>
            <div class="comment-text">${commentText}</div>
            ${actionsHTML}
            <div id="replies-${commentIndex}" class="replies-container"></div>
        </div>`;

    container.appendChild(commentItem);

    const upvCheckbox = commentItem.querySelector(`#upv-${comment.commentID}`);
    const downvCheckbox = commentItem.querySelector(`#downv-${comment.commentID}`);
    const voteDisplay = commentItem.querySelector(`#votes-${comment.commentID}`);
    const upvoteIcon = commentItem.querySelector(`#upvote-${comment.commentID}`);
    const downvoteIcon = commentItem.querySelector(`#downvote-${comment.commentID}`);

    if (upvCheckbox && downvCheckbox){ //actions for upvote down vote
        upvCheckbox.addEventListener("change", (e) => { 
            e.stopPropagation(); 
            if(user !== null){ 
                if(upvCheckbox.checked){ 
                    upvoteIcon.classList.replace("bx-upvote", "bxs-upvote"); 
                    upvoteIcon.style.color = "#df4b4b"; 
                    if(downvCheckbox.checked){ 
                        downvCheckbox.checked = false; 
                        downvoteIcon.classList.replace("bxs-downvote", "bx-downvote"); 
                        downvoteIcon.style.color = ""; comment.votes += 2; 
                    }else{ comment.votes += 1; 

                    } 
                }else{ 
                    upvoteIcon.classList.replace("bxs-upvote", "bx-upvote"); 
                    upvoteIcon.style.color = ""; 
                    comment.votes -= 1; 
                } 
                voteDisplay.textContent = comment.votes; 
                saveCommentVotes(postID, comment.commentID, comment.votes); 
            }else{ 
                showPopup("login-popup"); 
            } 
        }); 
        
        downvCheckbox.addEventListener("change", (e) => { 
            e.stopPropagation(); 
            if(user !== null){ 
                if (downvCheckbox.checked){ 
                    downvoteIcon.classList.replace("bx-downvote", "bxs-downvote"); 
                    downvoteIcon.style.color = "#0004ff"; 
                    if(upvCheckbox.checked){ 
                        upvCheckbox.checked = false; 
                        upvoteIcon.classList.replace("bxs-upvote", "bx-upvote"); 
                        upvoteIcon.style.color = ""; 
                        comment.votes -= 2; 
                    }else{ 
                        comment.votes -= 1; 
                    } 
                }else{ 
                    downvoteIcon.classList.replace("bxs-downvote", "bx-downvote"); 
                    downvoteIcon.style.color = ""; 
                    comment.votes += 1; 
                } 
                voteDisplay.textContent = comment.votes; 
                saveCommentVotes(postID, comment.commentID, comment.votes); 
            }else{ 
                showPopup("login-popup"); 
            } 
        }); 
    }

    // Render replies recursively
    const replies = allComments.filter(c => c.parent_id === comment.commentID);
    if (replies.length > 0) {
        const repliesContainer = commentItem.querySelector(`#replies-${comment.commentID}`);
        replies.forEach(reply => {
            renderCommentThread(repliesContainer, reply, allComments, postID, reply.commentID);
        });
    }
}

//updates comment vote count -------------------------------------------------------
function saveCommentVotes(postID, commentID, votes) {
    const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
    const comment = allComments[postID].find(c => c.commentID === commentID);
    if(comment){
        comment.votes = votes;
        localStorage.setItem("comments", JSON.stringify(allComments));
    }
}

//comment option popups and their actions -------------------------------------------------
function setupCommentOptions() {
    const buttons = document.querySelectorAll(".comments-settings-btn");

    buttons.forEach(btn => {
        const menu = btn.nextElementSibling;
        if (!menu) return;

        const isOwner = btn.dataset.commentUser === getCurrentUser()?.username;
        const editBtn = menu.querySelector(".edit-comment");
        if (editBtn) editBtn.style.display = isOwner ? "block" : "none";

        btn.onclick = (e) => {
            e.stopPropagation();
            const isOpen = menu.classList.contains("open");
            document.querySelectorAll(".comment-options-menu").forEach(m => m.classList.remove("open"));

            menu.classList.toggle("open", !isOpen);
            btn.setAttribute("aria-expanded", !isOpen);
            menu.setAttribute("aria-hidden", isOpen);
        };

        const deleteBtn = menu.querySelector(".delete-comment");
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                const postID = deleteBtn.dataset.postId;
                const commentID = deleteBtn.dataset.commentId;
                deleteCommentById(postID, commentID);
            };
        }

        if (editBtn) {
            editBtn.onclick = () => {
                const postID = editBtn.dataset.postId;
                const commentID = editBtn.dataset.commentId;
                const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
                const postComments = allComments[postID] || [];
                const comment = postComments.find(c => c.commentID === commentID);
                if (!comment) return;

                const commentItem = document.querySelector(`.comment-item [data-comment-id='${commentID}']`)?.closest(".comment-item");
                if (!commentItem) return;

                //take off reply textboxes when ur abt to edit a comment
                document.querySelectorAll('.reply-input-container').forEach(container => {
                    container.style.display = "none";
                });
                document.querySelectorAll('.reply-button, .comments-settings-btn').forEach(b => {
                    b.style.display = "none";
                });
                document.querySelectorAll('.upvote-downvote-comm').forEach(b => {
                    b.style.display = "none";
                });

                const commentTextDiv = commentItem.querySelector(".comment-text");

                const textarea = document.createElement("textarea");
                textarea.className = "comment-edit-textarea";
                textarea.value = comment.text;

                commentTextDiv.replaceWith(textarea);
                textarea.focus();

                const buttonContainer = document.createElement("div");
                buttonContainer.className = "comment-edit-buttons";
                buttonContainer.innerHTML = `
                    <button class="comment-edit-submit-btn">Submit</button>
                    <button class="comment-edit-cancel-btn">Cancel</button>
                `;
                textarea.after(buttonContainer);

                const submitBtn = buttonContainer.querySelector(".comment-edit-submit-btn");
                const cancelBtn = buttonContainer.querySelector(".comment-edit-cancel-btn");

                // Submit changes
                submitBtn.onclick = () => {
                    const newText = textarea.value.trim();
                    if(!newText){
                        return;
                    }
                    comment.text = newText;
                    comment.date = new Date().toISOString();
                    comment.edited = true;
                    allComments[postID] = postComments;
                    localStorage.setItem("comments", JSON.stringify(allComments));
                    document.querySelectorAll('.reply-button, .comments-settings-btn').forEach(b => {
                        b.style.display = "inline-block";
                    });
                    document.querySelectorAll('.upvote-downvote-comm').forEach(b => {
                        b.style.display = "flex";
                    });
                    displayFullComments(postID);
                };

                // Cancel editing
                cancelBtn.onclick = () => {
                    textarea.replaceWith(commentTextDiv); // restore original div
                    buttonContainer.remove();
                    document.querySelectorAll('.reply-button, .comments-settings-btn').forEach(b => {
                        b.style.display = "inline-block";
                    });
                    document.querySelectorAll('.upvote-downvote-comm').forEach(b => {
                    b.style.display = "flex";
                });
                };
            };
        }
    });
    document.addEventListener("click", () => {
        document.querySelectorAll(".comment-options-menu").forEach(menu => {
            menu.classList.remove("open");
        });
        document.querySelectorAll(".comments-settings-btn").forEach(btn => {
            btn.setAttribute("aria-expanded", "false");
        });
    });
}

//makes a comment "delete" ---------------------------------------------------------------
function deleteCommentById(postID, commentID) {
    const allComments = JSON.parse(localStorage.getItem("comments") || "{}");
    if (!allComments[postID]) return;

    const comment = allComments[postID].find(c => c.commentID === commentID);
    if (!comment) return;

    comment.text = "[deleted]";
    comment.deleted = true;

    localStorage.setItem("comments", JSON.stringify(allComments));
    displayFullComments(postID);
}

//text box input showing and hiding ----------------------------------------------------------
function toggleReplyInput(commentID){
    const user = getCurrentUser();
    if (!user) return showPopup("login-popup");
    const inputContainer = document.getElementById(`reply-input-container-${commentID}`);
    if(inputContainer){
        inputContainer.style.display = inputContainer.style.display === "none" ? "block" : "none";
        if(inputContainer.style.display === "block"){
            document.getElementById(`reply-input-${commentID}`).focus();
        }
    }
}

/*
// Tag filters (discussion, guide, joke,...) -----------------------------------------------------------
document.querySelectorAll('input[name="tag-filter"]').forEach(radio => {
    radio.addEventListener("change", function() {
        if (!this.checked) return;

        currentTag = this.value.replace("filter-", "");
        if (currentTag === "all") currentTag = "all";

        loadPostsList(currentFilter, currentTag);
    });
});

// Sort filters (most popular, by date, ...) ----------------------------------------------------------
document.querySelectorAll('input[name="post-filter"]').forEach(radio => {
    radio.addEventListener("change", function() {
        if (!this.checked) return;

        currentFilter = this.value;

        loadPostsList(currentFilter, currentTag);
    });
});
*/
// Initial load
currentTag = "all";
currentFilter = "none";
load_posts()

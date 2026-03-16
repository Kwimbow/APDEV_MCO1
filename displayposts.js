/* FOR DISPLAYING POSTS */
let currentFilter = "none";
let currentTag = "all";

const posts = JSON.parse(localStorage.getItem('posts') || '[]');

function loadPostsList(filter = "none", tag = "all") {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";

    const storedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.length = 0;
    posts.push(...storedPosts);

    posts.forEach(post => {
        if (post.votes === undefined) post.votes = 0;
    });

    let displayPostsList = posts;
    if (tag !== "all") {
        displayPostsList = posts.filter(post => post.tag === tag);
    }

    if (displayPostsList.length === 0) {
        mainContent.innerHTML = tag !== "all"
            ? `<h3 align="center" style="color: #999; font-family: 'Reddit Sans'; font-size: 50px;">No ${tag} posts yet..</h3>`
            : '<h3 align="center" style="color: #999; font-family: \'Reddit Sans\'; font-size: 50px;">Nothing yet.. Start a discussion!</h3>';
        return;
    }

    if (filter === "filter-controversial") {
        displayPostsList.sort((a, b) => a.votes - b.votes);
    } else if (filter === "filter-popular") {
        const allComments = JSON.parse(localStorage.getItem('comments') || '{}');
        displayPostsList.sort((a, b) => {
            const aComments = allComments[a.postID] ? allComments[a.postID].length : 0;
            const bComments = allComments[b.postID] ? allComments[b.postID].length : 0;
            const aScore = a.votes + aComments;
            const bScore = b.votes + bComments;
            return bScore - aScore;
        });
    } else if (filter === "filter-oldest") {
        displayPostsList.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
        displayPostsList.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    for (let i = 0; i < displayPostsList.length; i++) {
        displayPosts(displayPostsList, i);
    }
}

function displayPosts(posts, i){
    const viewButton = document.createElement("button");
        viewButton.className = "view-post-button";

        let postTime = (posts[i].date).toString();
        const timeString = postTime.split("T")
        let dateString = timeString[0]

        viewButton.onclick = () => viewFullPost(posts[i]);

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

        const upvCheckbox = document.createElement("input");
        upvCheckbox.type = "checkbox";
        upvCheckbox.className = "upv-checkbox";
        upvCheckbox.id = "upv-check-" + i;

        const downvCheckbox = document.createElement("input");
        downvCheckbox.type = "checkbox";
        downvCheckbox.className = "downv-checkbox";
        downvCheckbox.id = "downv-check-" + i;

        const upvoteLabel = document.createElement("label");
        const downvoteLabel = document.createElement("label");
        upvoteLabel.setAttribute("for", upvCheckbox.id);
        downvoteLabel.setAttribute("for", downvCheckbox.id);

        const upvoteIcon = document.createElement("i");
        const downvoteIcon = document.createElement("i");

        upvoteIcon.className = "bx bx-upvote";
        downvoteIcon.className = "bx bx-downvote";
        upvoteIcon.id = "upvote-btn";
        downvoteIcon.id = "downvote-btn";

        upvoteLabel.appendChild(upvoteIcon);
        downvoteLabel.appendChild(downvoteIcon);

        upvoteLabel.addEventListener("click", (e) => e.stopPropagation());
        downvoteLabel.addEventListener("click", (e) => e.stopPropagation());
        upvCheckbox.addEventListener("click", (e) => e.stopPropagation());
        downvCheckbox.addEventListener("click", (e) => e.stopPropagation());

        let voteCount = document.createElement("p");
        voteCount.id = "vote-count";
        voteCount.appendChild(document.createTextNode(posts[i].votes));

        const postTag = document.createElement("p");
        postTag.id = "post-tag";
        if (posts[i].tag === "discussion"){
            postTag.classList.add('green-tag');
        }
        else if (posts[i].tag === "guides"){
            postTag.classList.add('red-tag');
        }
        else if (posts[i].tag === "showcase"){
            postTag.classList.add('purple-tag');
        }
        else if (posts[i].tag === "joke"){
            postTag.classList.add('blue-tag');
        }
        else if (posts[i].tag === "misc"){
            postTag.classList.add('orange-tag');
        }
        postTag.appendChild(document.createTextNode(posts[i].tag));

        const postContent = document.createElement("p");
        postContent.id = "post-content";
        postContent.appendChild(document.createTextNode(posts[i].content));

        const postTitle = document.createElement("p");
        postTitle.id = "post-title";
        postTitle.appendChild(document.createTextNode(posts[i].title));
        
        const postDate = document.createElement("p");
        postDate.id = "post-date"
        postDate.appendChild(document.createTextNode(dateString));

        leftArea.append(userPfp);
        leftArea.append(upvCheckbox);
        leftArea.append(upvoteLabel);
        leftArea.append(voteCount);
        leftArea.append(downvCheckbox);
        leftArea.append(downvoteLabel);
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

        mainContent.appendChild(viewButton);

        upvCheckbox.addEventListener("change", (event) => {
            event.stopPropagation();
            if(upvCheckbox.checked){
                upvoteIcon.classList.replace("bx-upvote","bxs-upvote");
                upvoteIcon.style.color = "#df4b4b";

                if(downvCheckbox.checked){
                    downvCheckbox.checked = false;
                    downvoteIcon.classList.replace("bxs-downvote","bx-downvote");
                    downvoteIcon.style.color = ""; 
                    posts[i].votes += 2;
                }else{
                    posts[i].votes += 1;
                }
            }else{
                upvoteIcon.classList.replace("bxs-upvote","bx-upvote");
                upvoteIcon.style.color = ""; 
                posts[i].votes -= 1;
            }
            voteCount.textContent = posts[i].votes;
            localStorage.setItem("posts", JSON.stringify(posts));
        });

        downvCheckbox.addEventListener("change", (event) => {
            event.stopPropagation();
            if(downvCheckbox.checked){
                downvoteIcon.classList.replace("bx-downvote","bxs-downvote");
                downvoteIcon.style.color = "#0004ff"; 

                if(upvCheckbox.checked){
                    upvCheckbox.checked = false;
                    upvoteIcon.classList.replace("bxs-upvote","bx-upvote");
                    upvoteIcon.style.color = "";   
                    posts[i].votes -= 2;
                }else{
                    posts[i].votes -= 1;
                }
            }else{
                downvoteIcon.classList.replace("bxs-downvote","bx-downvote");
                downvoteIcon.style.color = "";
                posts[i].votes += 1;
            }
            voteCount.textContent = posts[i].votes;
            localStorage.setItem("posts", JSON.stringify(posts));
        });
}

function viewFullPost(post) {
    if(!post) return;
    const mainContent = document.getElementById("main-content");
    
    resetNavActive(); //Reset active state of nav buttons when viewing a post
    
    const postDate = new Date(post.date);
    const formattedPostDate = postDate.toLocaleDateString() + " " + postDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const fullPostView = document.createElement("div");
    fullPostView.id = "full-post-view";
    
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
                        <button id="full-submit-comment-btn">Comment</button>
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
    document.getElementById("full-post-username").textContent = post.user.username;
    document.getElementById("full-post-date").textContent = "Posted on " + formattedPostDate;
    document.getElementById("full-post-tag").appendChild(postTag);

    const fullVoteCount = document.getElementById("full-vote-count");
    fullVoteCount.textContent = post.votes;

    const upvCheckbox = document.getElementById("upv-checkbox");
    const downvCheckbox = document.getElementById("downv-checkbox");
    const upvoteIcon = document.getElementById("full-upvote-btn");
    const downvoteIcon = document.getElementById("full-downvote-btn");

    upvCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        if(upvCheckbox.checked){
            upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");

            if(downvCheckbox.checked){
                downvCheckbox.checked = false;
                downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
                post.votes += 2;
            }else{
                post.votes += 1;
            }
        }else{
            upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
            post.votes -= 1;
        }
        fullVoteCount.textContent = post.votes;
        updatePostInStorage(post);
    });

    downvCheckbox.addEventListener("change", (e) => {
        e.stopPropagation();
        if(downvCheckbox.checked){
            downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");

            if(upvCheckbox.checked){
                upvCheckbox.checked = false;
                upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
                post.votes -= 2;
            }else{
                post.votes -= 1;
            }
        }else{
            downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
            post.votes += 1;
        }
        fullVoteCount.textContent = post.votes;
        updatePostInStorage(post);
    });
    
    const postIndex = findPostIndex(post.postID);
    setupPostOptions(postIndex);

    // Show/hide comment input area based on login status
    // Comments display is always visible
    const commentInputArea = document.getElementById("full-comment-input-area");
    const user = getCurrentUser();
    commentInputArea.style.display = user ? "block" : "none";
    
    // Display comments
    displayFullComments(post.postID);
    
    // Back button functionality
    document.getElementById("back-to-posts-btn").onclick = function() {
    loadPostsList(currentFilter, currentTag);
    };

    function findPostIndex(postID) {
        const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        return allPosts.findIndex(p => p.postID === postID);
    }
        
    function updatePostInStorage(updatedPost) {
        const allPosts = JSON.parse(localStorage.getItem("posts") || "[]");
        const index = allPosts.findIndex(p => p.postID === updatedPost.postID);
        if (index !== -1) {
            allPosts[index] = updatedPost;
            localStorage.setItem("posts", JSON.stringify(allPosts));
        }
    }
    
    // Comment submit button
    document.getElementById("full-submit-comment-btn").onclick = function() {
        submitComment(post.postID, null); // null = top-level comment, no parent
    };
}

function submitComment(postID, parentCommentIndex) {
    let commentInput, commentsArea;
    
    if (parentCommentIndex !== null) {
        commentInput = document.getElementById(`reply-input-${parentCommentIndex}`);
        commentsArea = document.getElementById(`replies-${parentCommentIndex}`);
    } else {
        commentInput = document.getElementById("full-comment-input");
    }
    
    const commentText = commentInput.value.trim();
    
    if (commentText === "") {
        alert("Please write a comment");
        return;
    }
    
    const currentUser = getCurrentUser();
    
    const comment = {
        user: currentUser,
        text: commentText,
        date: new Date().toISOString(),
        parent_id: parentCommentIndex // null for top-level, index for nested
    };
    
    let allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    
    if (!allComments[postID]) {
        allComments[postID] = [];
    }
    
    allComments[postID].push(comment);
    localStorage.setItem('comments', JSON.stringify(allComments));
    
    commentInput.value = "";
    displayFullComments(postID);
}

function displayFullComments(postID) {
    const commentsArea = document.getElementById("full-comments-display-area");
    if (!commentsArea) return;
    
    commentsArea.innerHTML = "";
    
    const allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    const postComments = allComments[postID] || [];
    
    if (postComments.length === 0) {
        commentsArea.innerHTML = '<h3 align="center" style="color: #999; font-family: \'Reddit Sans\'">Be the first to comment</h3>';
        return;
    }
    
    const topLevelComments = postComments
        .map((comment, index) => ({ ...comment, index }))
        .filter(c => !c.parent_id && c.parent_id !== 0);
    
    topLevelComments.forEach((comment) => {
        renderCommentThread(commentsArea, comment, postComments, postID, comment.index);
    });
}

function renderCommentThread(container, comment, allComments, postID, commentIndex) {
    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    
    const commentDate = new Date(comment.date);
    const formattedDate = commentDate.toLocaleDateString() + " " + commentDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const user = getCurrentUser();
    const isLoggedIn = user !== null;
    const replyButtonHTML = isLoggedIn 
        ? `<button class="reply-button" onclick="toggleReplyInput(${commentIndex})">Reply</button>
           <div id="reply-input-container-${commentIndex}" class="reply-input-container" style="display: none; margin-top: 10px;">
               <textarea id="reply-input-${commentIndex}" class="reply-input"></textarea>
               <button onclick="submitComment('${postID}', ${commentIndex})" class="submit-reply-btn">Reply</button>
               <button onclick="toggleReplyInput(${commentIndex})" class="cancel-reply-btn">Cancel</button>
           </div>`
        : '';
    
    commentItem.innerHTML = `
        <link rel="stylesheet" type="text/css" href="index.css">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-username">${comment.user.username}</span>
                <span class="comment-date">${formattedDate}</span>
            </div>
            <div class="comment-text">${comment.text}</div>
            ${replyButtonHTML}
            <div id="replies-${commentIndex}" class="replies-container"></div>
        </div>
    `;
    
    container.appendChild(commentItem);
    
    const replies = allComments
        .map((c, i) => ({ ...c, index: i }))
        .filter(c => c.parent_id === commentIndex);
    
    if (replies.length > 0) {
        const repliesContainer = commentItem.querySelector(`#replies-${commentIndex}`);
        replies.forEach(reply => {
            renderCommentThread(repliesContainer, reply, allComments, postID, reply.index);
        });
    }
}

function toggleReplyInput(commentIndex) {
    const inputContainer = document.getElementById(`reply-input-container-${commentIndex}`);
    if (inputContainer) {
        inputContainer.style.display = inputContainer.style.display === "none" ? "block" : "none";
        if (inputContainer.style.display === "block") {
            document.getElementById(`reply-input-${commentIndex}`).focus();
        }
    }
}

// Tag filters
document.querySelectorAll('input[name="tag-filter"]').forEach(radio => {
    radio.addEventListener("change", function() {
        if (!this.checked) return;

        currentTag = this.value.replace("filter-", "");
        if (currentTag === "all") currentTag = "all";

        loadPostsList(currentFilter, currentTag);
    });
});

// Sort filters
document.querySelectorAll('input[name="post-filter"]').forEach(radio => {
    radio.addEventListener("change", function() {
        if (!this.checked) return;

        currentFilter = this.value;

        loadPostsList(currentFilter, currentTag);
    });
});

// Initial load
currentTag = "all";
currentFilter = "none";
loadPostsList(currentFilter, currentTag);
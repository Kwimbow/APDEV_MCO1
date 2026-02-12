/* FOR DISPLAYING POSTS */

const posts = JSON.parse(localStorage.getItem('posts') || '[]');
let currentPostIndex = -1;

function loadPostsList() {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";
    
    for(let i = 0 ; i< posts.length ; i++){
        const viewButton = document.createElement("button");
        viewButton.className = "view-post-button"

        let postTime = (posts[i].date).toString();
        const timeString = postTime.split("T")
        let dateString = timeString[0]

        viewButton.onclick = function(){
            viewFullPost(i);
        }

        const newPost = document.createElement("div");
        const postFlexTop = document.createElement("div")
        const postFlexBottom = document.createElement("div")
        const flexArea = document.createElement("div")
        postFlexTop.id = "post-flex-top";
        flexArea.id = "post-flex-display";
        postFlexBottom.id = "post-flex-bottom";

        const newContent = document.createElement("p");
        
        const userPfp = new Image();
        userPfp.src = 'images/freddyt_logo.png';
        userPfp.id = "user-pfp"


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

        newPost.append(userPfp);
        postFlexTop.append(postTag);
        postFlexTop.append(postTitle);
        postFlexTop.append(postDate);
        postFlexBottom.append(postContent);
        flexArea.append(postFlexTop);
        flexArea.append(postFlexBottom);
        newPost.append(flexArea);

        newPost.id="post-display";
        viewButton.append(newPost);

        mainContent.appendChild(viewButton);

        console.log(posts[i].tag);
        console.log(posts[i].title);
        console.log(posts[i].content);
        console.log(posts[i].date);
        console.log(posts[i].user);
    }
}

function viewFullPost(postIndex) {
    currentPostIndex = postIndex;
    const mainContent = document.getElementById("main-content");
    
    const post = posts[postIndex];
    
    // Format date/time same as comments
    const postDate = new Date(post.date);
    const formattedPostDate = postDate.toLocaleDateString() + " " + postDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const fullPostView = document.createElement("div");
    fullPostView.id = "full-post-view";
    
    fullPostView.innerHTML = `
        <button id="back-to-posts-btn" class="back-button"><i class='bx bx-arrow-back' id="back-arrow-btn"></i></button>
        
        <div id="full-post-wrapper">
            <div id="full-post-container">
                <div id="full-post-left">
                    <img id="full-post-pfp" src="images/freddyt_logo.png">
                    <p id="full-post-username"></p>
                    <p id="full-post-date"></p>
                </div>
                <div id="full-post-right">
                    <h2 id="full-post-title"></h2>
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
    `;
    
    mainContent.innerHTML = "";
    mainContent.appendChild(fullPostView);
    
    // Populate the post data
    document.getElementById("full-post-title").textContent = post.title;
    document.getElementById("full-post-content").textContent = post.content;
    document.getElementById("full-post-username").textContent = post.user.username;
    document.getElementById("full-post-date").textContent = "Posted on " + formattedPostDate;
    
    // Show/hide comment input area based on login status
    // Comments display is always visible
    const commentInputArea = document.getElementById("full-comment-input-area");
    const user = getCurrentUser();
    if (user !== null) {
        commentInputArea.style.display = "block";
    } else {
        commentInputArea.style.display = "none";
    }
    
    // Display comments
    displayFullComments(postIndex);
    
    // Back button functionality
    document.getElementById("back-to-posts-btn").onclick = function() {
        loadPostsList();
    };
    
    // Comment submit button
    document.getElementById("full-submit-comment-btn").onclick = function() {
        submitComment(postIndex, null); // null = top-level comment, no parent
    };
}

function submitComment(postIndex, parentCommentIndex) {
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
    
    if (currentUser === null) {
        alert("Please log in to comment");
        return;
    }
    
    const comment = {
        user: currentUser,
        text: commentText,
        date: new Date().toISOString(),
        parent_id: parentCommentIndex // null for top-level, index for nested
    };
    
    let allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    
    if (!allComments[postIndex]) {
        allComments[postIndex] = [];
    }
    
    allComments[postIndex].push(comment);
    localStorage.setItem('comments', JSON.stringify(allComments));
    
    commentInput.value = "";
    displayFullComments(postIndex);
}

function displayFullComments(postIndex) {
    const commentsArea = document.getElementById("full-comments-display-area");
    if (!commentsArea) return;
    
    commentsArea.innerHTML = "";
    
    const allComments = JSON.parse(localStorage.getItem('comments') || '{}');
    const postComments = allComments[postIndex] || [];
    
    if (postComments.length === 0) {
        commentsArea.innerHTML = '<h3 align=\"center\" style="color: #999; font-family: \'Reddit Sans\'">Be the first to comment</h3>';
        return;
    }
    
    // Only display top-level comments (parent_id is null or undefined)
    const topLevelComments = postComments
        .map((comment, index) => ({ ...comment, index }))
        .filter(c => !c.parent_id && c.parent_id !== 0);
    
    topLevelComments.forEach((comment, idx) => {
        renderCommentThread(commentsArea, comment, postComments, postIndex, comment.index);
    });
}

function renderCommentThread(container, comment, allComments, postIndex, commentIndex) {
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
               <button onclick="submitComment(${postIndex}, ${commentIndex})" class="submit-reply-btn">Reply</button>
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
    
    // Render nested replies
    const replies = allComments
        .map((c, i) => ({ ...c, index: i }))
        .filter(c => c.parent_id === commentIndex);
    
    if (replies.length > 0) {
        const repliesContainer = commentItem.querySelector(`#replies-${commentIndex}`);
        replies.forEach(reply => {
            renderCommentThread(repliesContainer, reply, allComments, postIndex, reply.index);
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

// Initial load
loadPostsList();

/* FOR DISPLAYING POSTS */

/*
async function toggleUpvote(){

}

async function toggleDownvote(){

}
*/

async function save_upvote(postID){
    const user = getCurrentUser();
    if (!user) return;

    console.log("saving upvote for ", postID);

    const res = await fetch('/api/voting/save_upvote', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ userID: user._id, postID: postID })
    });
}

async function save_downvote(postID){
    const user = getCurrentUser();
    if (!user) return;

    console.log("saving downvote for ", postID);

    const res = await fetch('/api/voting/save_downvote', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ userID: user._id, postID: postID })
    });
}

async function save_comment_upvote(commentID){
	console.log("saving upvote for ", commentID);
 	user = getCurrentUser();

  	console.log(user._id);

	const res = await fetch('/api/voting/save_comment_upvote', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ userID: user._id, commentID: commentID })
	});

	if (res.success) {
        const voteDisplay = document.getElementById(`votes-${commentID}`);
        if (voteDisplay) voteDisplay.textContent = result.score;
    }
}

async function save_comment_downvote(commentID){
	console.log("saving downvote");
 	user = getCurrentUser();

  	console.log(user._id);

	const res = await fetch('/api/voting/save_comment_downvote', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ userID: user._id, commentID: commentID })
	});

	if (res.success) {
        const voteDisplay = document.getElementById(`votes-${commentID}`);
        if (voteDisplay) voteDisplay.textContent = result.score;
    }

}

async function handlePostVote(postID, type, voteDisplay, upvoteBtn, downvoteBtn, userID) {
    let current = parseInt(voteDisplay.textContent) || 0;
    let userVote = parseInt(voteDisplay.dataset.uservote || "0");
    const upIcon = upvoteBtn.querySelector("i");
    const downIcon = downvoteBtn.querySelector("i");

    if(type === 'upvote'){
        if(userVote === 1){ // undo upvote
            current -= 1;
            userVote = 0;
            upIcon.classList.replace("bxs-upvote", "bx-upvote");
            upIcon.style.color = "";
        }else if (userVote === -1){ // switch downvote to upvote
            current += 2;
            userVote = 1;
            upIcon.classList.replace("bx-upvote", "bxs-upvote");
            upIcon.style.color = "#df4b4b";
            downIcon.classList.replace("bxs-downvote", "bx-downvote");
			downIcon.style.color = "";
        }else { // normal upvote
            current += 1;
            userVote = 1;
            upIcon.classList.replace("bx-upvote", "bxs-upvote");
            upIcon.style.color = "#df4b4b";
        }
        save_upvote(postID);
    }

    if(type === 'downvote'){
        if(userVote === -1){ // undo downvote
            current += 1;
            userVote = 0;
            downIcon.classList.replace("bxs-downvote", "bx-downvote");
            downIcon.style.color = "";
        }else if (userVote === 1){ // switch upvote to downvote
            current -= 2;
            userVote = -1;
            downIcon.classList.replace("bx-downvote", "bxs-downvote");
            downIcon.style.color = "#6668ec";
            upIcon.classList.replace("bxs-upvote", "bx-upvote");
			upIcon.style.color = "";
        }else{ // normal downvote
            current -= 1;
            userVote = -1;
            downIcon.classList.replace("bx-downvote", "bxs-downvote");
            downIcon.style.color = "#6668ec";
        }
        save_downvote(postID);
    }
    voteDisplay.textContent = current;
    voteDisplay.dataset.uservote = userVote;

    return {
        upvoted: userVote === 1,
        downvoted: userVote === -1
    };
}

function setupVoteButtons(post, voteCountEl, upvoteBtn, downvoteBtn, userId) {
    let userVote = 0;
    if (userId) {
        if (post.upvotedBy?.includes(userId)) userVote = 1;
        else if (post.downvotedBy?.includes(userId)) userVote = -1;
    }

    voteCountEl.textContent = post.score || 0;
    voteCountEl.dataset.uservote = userVote;

    if (userVote === 1) {
        upvoteBtn.classList.replace("bx-upvote", "bxs-upvote");
        upvoteBtn.style.color = "#df4b4b";
    } else if (userVote === -1) {
        downvoteBtn.classList.replace("bx-downvote", "bxs-downvote");
        downvoteBtn.style.color = "#6668ec";
    }

   upvoteBtn.addEventListener("click", async (e) => {
		e.stopPropagation();
		if (!userId) return showPopup("login-popup");
		const result = await handlePostVote(post._id, 'upvote', voteCountEl, upvoteBtn, downvoteBtn, userId);
		post.score = parseInt(voteCountEl.textContent);
	});

	downvoteBtn.addEventListener("click", async (e) => {
		e.stopPropagation();
		if (!userId) return showPopup("login-popup");
		const result = await handlePostVote(post._id, 'downvote', voteCountEl, upvoteBtn, downvoteBtn, userId);
		post.score = parseInt(voteCountEl.textContent);
	});
}

async function load_posts() {
	user = getCurrentUser();
	const url = user ? `api/posts?userId=${user._id}` : 'api/posts';
	const res = await fetch(url);
	const posts = await res.json();

	const container = document.getElementById("main-content");
	container.innerHTML = "";
	console.log(posts)

	posts.slice().reverse().forEach((post) => {
		let userVote = 0;
		if (user) {
			if (post.upvotedBy?.includes(user._id)) {
				userVote = 1;
			} else if (post.downvotedBy?.includes(user._id)) {
				userVote = -1;
			}
		}

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
		
    // propane photo 
		const userPfp = new Image();
		userPfp.src = post.author.pfp || 'images/freddyt_logo.png';
		userPfp.id = "user-pfp";
		userPfp.style.cursor = 'pointer';
		userPfp.onclick = (e) => { 
      e.stopPropagation(); 
      location.href = `user.html?id=${post.author._id}`; 
    };

		const upvoteBtn = document.createElement("button");
		const downvoteBtn = document.createElement("button");
		upvoteBtn.id = "upvote-btn";
		downvoteBtn.id = "downvote-btn";
		upvoteBtn.innerHTML = "<i class='bx bx-upvote'></i>";
		downvoteBtn.innerHTML = "<i class='bx bx-downvote'></i>";

		let voteCount = document.createElement("p");
		voteCount.id = "vote-count";
		voteCount.textContent = post.score || 0;
		voteCount.dataset.uservote = userVote;

		if(userVote === 1){
			upvoteBtn.innerHTML = "<i class='bx bxs-upvote'></i>";
    		upvoteBtn.style.color = "#df4b4b";
		} else if(userVote === -1){
			downvoteBtn.innerHTML = "<i class='bx bxs-downvote'></i>";
    		downvoteBtn.style.color = "#6668ec";
		}

		setupVoteButtons(post, voteCount, upvoteBtn, downvoteBtn, user?._id);

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

		newPost.id=`post-${post._id}`;
		newPost.className = "post-display";
		viewButton.append(newPost);

		container.appendChild(viewButton);
	})

	console.log(res);

}


async function load_searched_posts(posts){
    
    const container = document.getElementById("main-content");

    container.innerHTML = "";

    posts.slice().reverse().forEach((post) => {
		let user = getCurrentUser();
		let userVote = 0;

		if (user) {
			if (post.upvotedBy?.includes(user._id)) {
				userVote = 1;
			} else if (post.downvotedBy?.includes(user._id)) {
				userVote = -1;
			}
		}

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
        
        // le profile pictura with default if post.author.pfp is falsey
        const userPfp = new Image();
        userPfp.src = post.author.pfp || 'images/freddyt_logo.png';
        userPfp.id = "user-pfp";
        userPfp.style.cursor = 'pointer';
        userPfp.onclick = (e) => { 
          e.stopPropagation(); 
          location.href = `user.html?id=${post.author._id}`;    // le fancy 
        };

        const upvoteBtn = document.createElement("button");
        const downvoteBtn = document.createElement("button");
        upvoteBtn.id = "upvote-btn";
        downvoteBtn.id = "downvote-btn";
        upvoteBtn.innerHTML = "<i class='bx bx-upvote'></i>";
        downvoteBtn.innerHTML = "<i class='bx bx-downvote'></i>";

        let voteCount = document.createElement("p");
        voteCount.id = "vote-count";
        voteCount.textContent = post.score || 0;
		voteCount.dataset.uservote = userVote;

		if(userVote === 1){
			upvoteBtn.innerHTML = "<i class='bx bxs-upvote'></i>";
			upvoteBtn.style.color = "#df4b4b";
		}else if(userVote === -1){
			downvoteBtn.innerHTML = "<i class='bx bxs-downvote'></i>";
			downvoteBtn.style.color = "#6668ec";
		}

		setupVoteButtons(post, voteCount, upvoteBtn, downvoteBtn, user?._id);

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

        newPost.id=`post-${post._id}`;
		newPost.className = "post-display";
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
							<input type="checkbox" id="bookmark-checkbox" onclick = "save_bookmark('${post.postID}')">
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

	// le populate
	document.getElementById("full-post-title").textContent = post.title;
	document.getElementById("full-post-content").textContent = post.content;
	document.getElementById("full-post-username").textContent = post.author.username;

  // le pfp for the post
	const fullPostPfp = document.getElementById("full-post-pfp");
	fullPostPfp.src = post.author.pfp || 'images/freddyt_logo.png';
	fullPostPfp.style.cursor = 'pointer';
	fullPostPfp.onclick = () => { 
    location.href = `user.html?id=${post.author._id}`; 
  };


	//This sets the posts' left side to be marked as edited or posted
	const fullPostDate = document.getElementById("full-post-date");
	fullPostDate.textContent = post.edited 
		? `Edited on ${formattedPostDate}` 
		: `Posted on ${formattedPostDate}`;
		
	document.getElementById("full-post-tag").appendChild(postTag);

	const fullVoteCount = document.getElementById("full-vote-count");
	fullVoteCount.textContent = post.score || 0;

	let userVote = 0;
	if (userNow) {
		if (post.upvotedBy?.includes(userNow._id)) {
			userVote = 1;
		} else if (post.downvotedBy?.includes(userNow._id)) {
			userVote = -1;
		}
	}
	fullVoteCount.dataset.uservote = userVote;

	const upvCheckbox = document.getElementById("upv-checkbox");
	const downvCheckbox = document.getElementById("downv-checkbox");
	const bookmarkCheckbox = document.getElementById("bookmark-checkbox");
	const upvoteIcon = document.getElementById("full-upvote-btn");
	const downvoteIcon = document.getElementById("full-downvote-btn");
	const bookmarkIcon = document.getElementById("full-bookmark-btn");
	const bookmarkContainer = document.getElementById("bookmarkBTN");

	if (userVote === 1) {
		upvCheckbox.checked = true;
		upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");
		upvoteIcon.style.color = "#df4b4b";
	} else if (userVote === -1) {
		downvCheckbox.checked = true;
		downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");
		downvoteIcon.style.color = "#6668ec";
	}

	if(userNow){
		bookmarkContainer.style.display = "block";
	}else{
		bookmarkContainer.style.display = "none";
	}

	setupVoteButtons(post, fullVoteCount, upvCheckbox, downvCheckbox, userNow?._id);

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
	displayFullComments(post._id);
	
	//back button functionality
	document.getElementById("back-to-posts-btn").onclick = function() {
		window.location.reload(); // --------------------------------------------------------------------for now just reloading window. lets add sorting and filtering eventually
	};
		
	
	//submit button for comment // -----------------------------------------------------------------------------
	document.getElementById("full-submit-comment-btn").onclick = function() {
		submitComment(post._id, null);
	};
}


function setCurrentPost(post) {
	sessionStorage.setItem("post", JSON.stringify(post));
}




//creating a comment 
async function submitComment(postID, parentCommentID) {
	const currentUser = getCurrentUser();
	if (!currentUser) return showPopup("login-popup");

	let commentInput = parentCommentID
		? document.getElementById(`reply-input-${parentCommentID}`)
		: document.getElementById("full-comment-input");

	if (!commentInput) return;
	const commentText = commentInput.value.trim();
	if (!commentText) return;

	const comment = {
		author: currentUser._id,
		post: postID,
		content: commentText,
		parent_id: parentCommentID || null,
	};

	await fetch('/api/comments', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ comment })
	});

	commentInput.value = "";
	displayFullComments(postID);
}

//like loadpostlist() but for comments
async function displayFullComments(postID) {
	const commentsArea = document.getElementById("full-comments-display-area");
	if (!commentsArea) return;
	commentsArea.innerHTML = "";

	const res = await fetch(`/api/comments/${postID}`);
	const postComments = await res.json();

	if (postComments.length === 0) {
		commentsArea.innerHTML = '<h3 align="center" style="color: #999;">Be the first to comment</h3>';
		return;
	}

	const topLevel = postComments.filter(c => !c.parent_id);
	topLevel.forEach(comment => {
		renderCommentThread(commentsArea, comment, postComments, postID, comment._id);
	});

	setupCommentOptions();
}

//creates a single comment and its replies are shown recursively -----------------------------------------------
function renderCommentThread(container, comment, allComments, postID, commentIndex){
    const isDeleted = comment.deleted === true;
    const isEdited = comment.edited === true;
	let userVote = 0;

    const commentItem = document.createElement("div");
    commentItem.className = "comment-item";
    if (isDeleted) commentItem.classList.add("deleted");
    if (isEdited) commentItem.classList.add("edited");

    const commentDate = new Date(comment.createdAt);
    const formattedDate = commentDate.toLocaleDateString() + " " + commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const user = getCurrentUser();
    const isLoggedIn = user !== null;
	if (user) {
		if (comment.upvotedBy?.includes(user._id)) {
			userVote = 1;
		} else if (comment.downvotedBy?.includes(user._id)) {
			userVote = -1;
		}
	}

    const currUser = isLoggedIn && comment.author && (String(comment.author._id) === String(user._id));
    const editComUser = currUser;

    const upvDownv = !isDeleted
        ? `<div class="upvote-downvote-comm">
               <input type="checkbox" id="upv-${comment._id}" class="comment-checkbox">
               <label for="upv-${comment._id}">
                   <i class='bx bx-upvote comment-vote-btns' id="upvote-${comment._id}"></i>
               </label>
               <p id="votes-${comment._id}">${comment.score || 0}</p>
               <input type="checkbox" id="downv-${comment._id}" class="comment-checkbox">
               <label for="downv-${comment._id}">
                   <i class='bx bx-downvote comment-vote-btns' id="downvote-${comment._id}"></i>
               </label>
           </div>`
        : '';

    const popUpHTML = editComUser
        ? `<div class="comment-options-menu" role="menu" aria-hidden="true">
               <button class="comment-options-menu-item delete-comment" data-comment-id="${comment._id}" data-post-id="${postID}">Delete Comment</button>
               <button class="comment-options-menu-item edit-comment" data-comment-id="${comment._id}" data-post-id="${postID}">Edit Comment</button>
           </div>`
        : `<div class="comment-options-menu" role="menu" aria-hidden="true">
               <button class="comment-options-menu-item delete-comment" data-comment-id="${comment._id}" data-post-id="${postID}">Delete Comment</button>
           </div>`;

    const commentSettingsHTML = currUser && !isDeleted
        ? `<div class="comment-options-wrapper">
               <button class="comment-options comments-settings-btn" data-comment-id="${comment._id}" data-post-id="${postID}" data-comment-user="${comment.author.username}">
                   <i class='bx bx-dots-horizontal-rounded' id="comment-settings-icon"></i>
               </button>
               ${popUpHTML}
           </div>`
        : '';

    const replyHTML = isLoggedIn && !isDeleted
        ? `<div class="comment-actions">
               <button class="reply-button" onclick="toggleReplyInput('${comment._id}')">Reply</button>
               ${commentSettingsHTML}
           </div>
           <div id="reply-input-container-${comment._id}" class="reply-input-container" style="display: none; margin-top: 10px;">
               <textarea id="reply-input-${comment._id}" class="reply-input"></textarea>
               <button onclick="submitComment('${postID}', '${comment._id}')" class="submit-reply-btn">Reply</button>
               <button onclick="toggleReplyInput('${comment._id}')" class="cancel-reply-btn">Cancel</button>
           </div>`
        : '';

    const commentText = isDeleted ? "[deleted]" : comment.content;
    const usernameText = isDeleted ? `<span class="deleted-text">[deleted]</span>` : comment.author.username;
    const editedFlag = isEdited ? `<span class="edited-comment">(edited)</span>` : "";

    const actionsHTML = !isDeleted
        ? `<div class="comment-actions-container">
               ${upvDownv}
               ${replyHTML}
           </div>`
        : '';

    //jfoiskngoiefdm
    const commentPfpSrc = comment.author && comment.author.pfp ? comment.author.pfp : 'images/freddyt_logo.png';
    const commentAuthorId = comment.author ? comment.author._id : '';

    commentItem.innerHTML = 
        `<div class="comment-content">
            <div class="comment-header">
                <img class="comment-pfp" src="${commentPfpSrc}" onclick="location.href='user.html?id=${commentAuthorId}'" style="cursor:pointer;">
                <span class="comment-username">${usernameText}</span>
                <span class="comment-date">${formattedDate} ${editedFlag}</span>
            </div>
            <div class="comment-text">${commentText}</div>
            ${actionsHTML}
            <div id="replies-${comment._id}" class="replies-container"></div>
        </div>`;

    container.appendChild(commentItem);

    const upvCheckbox = commentItem.querySelector(`#upv-${comment._id}`);
    const downvCheckbox = commentItem.querySelector(`#downv-${comment._id}`);
    const voteDisplay = commentItem.querySelector(`#votes-${comment._id}`);
    const upvoteIcon = commentItem.querySelector(`#upvote-${comment._id}`);
    const downvoteIcon = commentItem.querySelector(`#downvote-${comment._id}`);

	if(userVote === 1){
		upvCheckbox.checked = true;
		upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");
		upvoteIcon.style.color = "#df4b4b";
	}else if(userVote === -1){
		downvCheckbox.checked = true;
		downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");
		downvoteIcon.style.color = "#6668ec";
	}

    if (upvCheckbox && downvCheckbox){
        upvCheckbox.addEventListener("change", async (e) => {
            e.stopPropagation();
            if(user !== null){
				const current = parseInt(voteDisplay.textContent) || 0;
                /*if(upvCheckbox.checked){
                    upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");
                    upvoteIcon.style.color = "#df4b4b";
					voteDisplay.textContent = current + 1;
                    if(downvCheckbox.checked){
                        downvCheckbox.checked = false;
                        downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
                        downvoteIcon.style.color = "";
						voteDisplay.textContent = current - 2;
                    }
                }else{
                    upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
                    upvoteIcon.style.color = "";
					voteDisplay.textContent = current - 1;
                }*/

				if(userVote === 1){ // undo upvote
					upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
					upvoteIcon.style.color = "";
					voteDisplay.textContent = current - 1;
					userVote = 0;
					upvCheckbox.checked = false;
				}else if(userVote === -1){ // switch from downvote → upvote
					downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
					downvoteIcon.style.color = "";
					upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");
					upvoteIcon.style.color = "#df4b4b";
					voteDisplay.textContent = current + 2;
					userVote = 1;
					upvCheckbox.checked = true;
					downvCheckbox.checked = false;
				}else{ // normal upvote
					upvoteIcon.classList.replace("bx-upvote", "bxs-upvote");
					upvoteIcon.style.color = "#df4b4b";
					voteDisplay.textContent = current + 1;
					userVote = 1;
					upvCheckbox.checked = true;
				}

                //voteDisplay.textContent = comment.score;
				save_comment_upvote(comment._id);
				
            }else{
                showPopup("login-popup");
            }
        });

        downvCheckbox.addEventListener("change", async (e) => {
            e.stopPropagation();
            if(user !== null){
				const current = parseInt(voteDisplay.textContent) || 0;
                /*if(downvCheckbox.checked){
                    downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");
                    downvoteIcon.style.color = "#6668ec";
					voteDisplay.textContent = current - 1;
                    if(upvCheckbox.checked){
                        upvCheckbox.checked = false;
                        upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
                        upvoteIcon.style.color = "";
						voteDisplay.textContent = current + 2;
                    }
                }else{
                    downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
                    downvoteIcon.style.color = "";
					voteDisplay.textContent = current + 1;
                }*/

				if(userVote === -1){ // undo downvote
					downvoteIcon.classList.replace("bxs-downvote", "bx-downvote");
					downvoteIcon.style.color = "";
					voteDisplay.textContent = current + 1;
					userVote = 0;
					downvCheckbox.checked = false;
				}else if(userVote === 1){ // switch from upvote to downvote
					upvoteIcon.classList.replace("bxs-upvote", "bx-upvote");
					upvoteIcon.style.color = "";
					downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");
					downvoteIcon.style.color = "#6668ec";
					voteDisplay.textContent = current - 2;
					userVote = -1;
					downvCheckbox.checked = true;
					upvCheckbox.checked = false;
				}else{ // normal downvote
					downvoteIcon.classList.replace("bx-downvote", "bxs-downvote");
					downvoteIcon.style.color = "#6668ec";
					voteDisplay.textContent = current - 1;
					userVote = -1;
					downvCheckbox.checked = true;
				}
                //voteDisplay.textContent = comment.score;
				save_comment_downvote(comment._id);
				
                
            }else{
                showPopup("login-popup");
            }
        });
    }

    // Render replies recursively
    const replies = allComments.filter(c => String(c.parent_id) === String(comment._id));
    if (replies.length > 0) {
        const repliesContainer = commentItem.querySelector(`#replies-${comment._id}`);
        replies.forEach(reply => {
            renderCommentThread(repliesContainer, reply, allComments, postID, reply._id);
        });
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
            editBtn.onclick = async () => {
                const postID = editBtn.dataset.postId;
                const commentID = editBtn.dataset.commentId;

                // fetch comment from le mongo
                const res = await fetch(`/api/comments/single/${commentID}`);
                const comment = await res.json();
                if (!comment) return;

                const commentItem = document.querySelector(`[data-comment-id='${commentID}']`)?.closest(".comment-item");
                if (!commentItem) return;

                // hide other UI elements while editing
                document.querySelectorAll('.reply-input-container').forEach(c => c.style.display = "none");
                document.querySelectorAll('.reply-button, .comments-settings-btn').forEach(b => b.style.display = "none");
                document.querySelectorAll('.upvote-downvote-comm').forEach(b => b.style.display = "none");

                const commentTextDiv = commentItem.querySelector(".comment-text");
                const textarea = document.createElement("textarea");
                textarea.className = "comment-edit-textarea";
                textarea.value = comment.content;  // was comment.text
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

                // submit changes to le mongo
                submitBtn.onclick = async () => {
                    const newText = textarea.value.trim();
                    if (!newText) return;

                    await fetch(`/api/comments/${commentID}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: newText })
                    });

                    document.querySelectorAll('.reply-button, .comments-settings-btn').forEach(b => b.style.display = "inline-block");
                    document.querySelectorAll('.upvote-downvote-comm').forEach(b => b.style.display = "flex");
                    displayFullComments(postID);
                };

                // cancel editing
                cancelBtn.onclick = () => {
                    textarea.replaceWith(commentTextDiv);
                    buttonContainer.remove();
                    document.querySelectorAll('.reply-button, .comments-settings-btn').forEach(b => b.style.display = "inline-block");
                    document.querySelectorAll('.upvote-downvote-comm').forEach(b => b.style.display = "flex");
                };
            };
        }
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".comment-options-menu").forEach(menu => menu.classList.remove("open"));
        document.querySelectorAll(".comments-settings-btn").forEach(btn => btn.setAttribute("aria-expanded", "false"));
    });
}

//makes a comment "delete" ---------------------------------------------------------------
async function deleteCommentById(postID, commentID) {
	await fetch(`/api/comments/${commentID}`, { method: 'DELETE' });
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

// Initial load
currentTag = "all";
currentFilter = "none";
load_posts()

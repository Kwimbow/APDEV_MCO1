/*This is for editing the user profile*/

let editBtn = document.getElementById("edit-profile-btn");
let cameraBtn = document.getElementById("camera-icon");
let fileInput = document.getElementById("profile-upload");
let pfpImg = document.getElementById("pfp");
let bioEl = document.getElementById("bio");
let bioEdit = document.getElementById("bio-edit");
let cancelBtn = document.getElementById("cancel-btn");
let saveBtn = document.getElementById("save-btn");
let userNameEl = document.querySelector("#user-name h1");

const params = new URLSearchParams(window.location.search);
const currentUser = getCurrentUser();
const viewingId = params.get('id') || (currentUser ? currentUser._id : null);
const isOwnProfile = currentUser && viewingId === currentUser._id;

/* 
there has to be like a better way for storing the photo esp for social media 
apps than just like base64 like ts dont sound nice.

*/
let pendingPfpBase64 = null;
let originalPfpSrc = null;

/* Load user data from DB and populate the page */
async function loadUserProfile() {

    if (!viewingId) 
      return;

    const res = await fetch(`/api/user/${viewingId}`);

    if (!res.ok) 
      return;

    const user = await res.json();

    userNameEl.textContent = user.username;
    bioEl.textContent = user.bio || '';       

    if (user.pfp) pfpImg.src = user.pfp;

    originalPfpSrc = pfpImg.src;

    if (!isOwnProfile) {
        editBtn.style.display = 'none';
    }

  load_posts();



}

editBtn.addEventListener("click", function()
{
    cameraBtn.classList.toggle("show");
    editBtn.classList.toggle("hide");
    cancelBtn.classList.toggle("show");
    saveBtn.classList.toggle("show");

    if (bioEl.style.display !== 'none') 
    {
        bioEdit.value = bioEl.innerText;
        bioEl.style.display = 'none';
        bioEdit.style.display = 'block';
    }
});

cancelBtn.addEventListener("click", function()
{
    cameraBtn.classList.remove("show");
    editBtn.classList.remove("hide");
    cancelBtn.classList.remove("show");
    saveBtn.classList.remove("show");

    if (pendingPfpBase64) 
    {
        pfpImg.src = originalPfpSrc;
        pendingPfpBase64 = null;
        fileInput.value = "";
    }

    bioEdit.style.display = 'none';
    bioEl.style.display = 'block';
});

/* on save button: update bio AND pfp (if changed) to DB
then update header icon .. 

the the the default thing is showing before loading, the change
should prolly be here but like my brain is dying rn .. 
change this soon. 

*/
saveBtn.addEventListener("click", async function(){

    const newBio = bioEdit.value;
    bioEl.innerText = newBio;
    cameraBtn.classList.remove("show");
    editBtn.classList.remove("hide");
    cancelBtn.classList.remove("show");
    saveBtn.classList.remove("show");

    bioEdit.style.display = 'none';
    bioEl.style.display = 'block';

    await fetch(`/api/user/${viewingId}/bio`, 
    {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: newBio })
    });

    if (pendingPfpBase64) 
    {
        await fetch(`/api/user/${viewingId}/pfp`, 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pfp: pendingPfpBase64 })
        });

        originalPfpSrc = pendingPfpBase64;
        pendingPfpBase64 = null;
        fileInput.value = "";

        // refresh the top-right mini-profile icon immediately
        loadMiniProfilePfp(viewingId);
    }
});

/* 
  On file select: compress via canvas, update preview locally, 
  then buffer the base64 . there hsa to be a better way for this but like
  hiurhfisgjodxlm . initial idea is what if we make it blob to image conversion
  but also this isnt really too bad . 

*/

fileInput.addEventListener("change", function(){

    const file = fileInput.files[0];

    if (!file) 
      return;

    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    if (!allowedTypes.includes(file.type)){
        fileInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) 
    {
        const img = new Image();

        img.onload = function() 
        {
            const MAX = 256;
            const scale = Math.min(MAX / img.width, MAX / img.height, 1);
            const canvas = document.createElement('canvas');
            canvas.width  = Math.round(img.width  * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            pendingPfpBase64 = canvas.toDataURL('image/jpeg', 0.8);
            pfpImg.src = pendingPfpBase64;
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});


fileInput.addEventListener("change", function()
{
    const file = fileInput.files[0];
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    if (!allowedTypes.includes(file.type))
    {
        fileInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) 
    {
        const img = new Image();

        img.onload = function() 
        {
            const MAX = 256;
            const scale = Math.min(MAX / img.width, MAX / img.height, 1);
            const canvas = document.createElement('canvas');

            canvas.width  = Math.round(img.width  * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            pendingPfpBase64 = canvas.toDataURL('image/jpeg', 0.8);

            pfpImg.src = pendingPfpBase64;
        };

        img.src = e.target.result;

    };
    reader.readAsDataURL(file);
});


/* le funny */

async function load_posts() {

	const user = getCurrentUser();

	const url = user ? `api/posts?userId=${user._id}` : 'api/posts';
	const res = await fetch(url);
	const posts = await res.json();

	const container = document.getElementById("user-content-space");
	container.innerHTML = "";

	posts.slice().reverse().forEach((post) => {

    // KONO KILLER QUEEN 
    if (viewingId !== post.author._id) {
      return false;
    }

		let userVote = 0;
		if (user) 
    {
			if (post.upvotedBy?.includes(user._id)) 
      {
				userVote = 1;
			} else if (post.downvotedBy?.includes(user._id)) 
      {
				userVote = -1;
			}
		}

	console.log(posts)

		const viewButton = document.createElement("button");
		viewButton.className = "userprof-view-post-button";

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

		rightArea.id = "userprof-post-right-area";
		leftArea.id = "userprof-post-left-area";
		postFlexTop.id = "userprof-post-flex-top";
		flexArea.id = "userprof-post-flex-display";
		postFlexBottom.id = "userprof-post-flex-bottom";
		
    // propane photo 
		const userPfp = new Image();
		userPfp.src = post.author.pfp || 'images/freddyt_logo.png';
		userPfp.id = "userprof-user-pfp";
		userPfp.style.cursor = 'pointer';
		userPfp.onclick = (e) =>
    { 
      e.stopPropagation(); 
      location.href = `user.html?id=${post.author._id}`; 
    };

		const upvoteBtn = document.createElement("button");
		const downvoteBtn = document.createElement("button");

		upvoteBtn.id = "userprof-upvote-btn";
		downvoteBtn.id = "userprof-downvote-btn";

		upvoteBtn.innerHTML = "<i class='bx bx-upvote'></i>";
		downvoteBtn.innerHTML = "<i class='bx bx-downvote'></i>";

		let voteCount = document.createElement("p");

		voteCount.id = "userprof-vote-count";
		voteCount.textContent = post.score || 0;
		voteCount.dataset.uservote = userVote;

		if(userVote === 1)
    {
			upvoteBtn.innerHTML = "<i class='bx bxs-upvote'></i>";
    	upvoteBtn.style.color = "#df4b4b";
		} else if(userVote === -1)
    {
			downvoteBtn.innerHTML = "<i class='bx bxs-downvote'></i>";
    	downvoteBtn.style.color = "#6668ec";
		}

		// setupVoteButtons(post, voteCount, upvoteBtn, downvoteBtn, user?._id);

		const postTag = document.createElement("p");

		postTag.id = "userprof-post-tag";

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
		postContent.id = "userprof-post-content";
		postContent.appendChild(document.createTextNode(post.content));

		const postTitle = document.createElement("p");
		postTitle.id = "userprof-post-title";
		postTitle.appendChild(document.createTextNode(post.title));
		
		const postDate = document.createElement("p");
		postDate.id = "userprof-post-date"
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
		newPost.className = "userprof-post-display";
		viewButton.append(newPost);

		container.appendChild(viewButton);
	})

  console.log("KOKO DA !!! KOKO DAYO !!! HEREE OIFHEIFHOIEHIEA");
	console.log(res);

}

//calls the functions
document.addEventListener("DOMContentLoaded", () => {
  
  loadUserProfile();

});

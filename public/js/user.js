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
}

loadUserProfile();

editBtn.addEventListener("click", function(){
    cameraBtn.classList.toggle("show");
    editBtn.classList.toggle("hide");
    cancelBtn.classList.toggle("show");
    saveBtn.classList.toggle("show");

    if (bioEl.style.display !== 'none') {
        bioEdit.value = bioEl.innerText;
        bioEl.style.display = 'none';
        bioEdit.style.display = 'block';
    }
});

cancelBtn.addEventListener("click", function(){
    cameraBtn.classList.remove("show");
    editBtn.classList.remove("hide");
    cancelBtn.classList.remove("show");
    saveBtn.classList.remove("show");

    if (pendingPfpBase64) {
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

    await fetch(`/api/user/${viewingId}/bio`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio: newBio })
    });

    if (pendingPfpBase64) {
        await fetch(`/api/user/${viewingId}/pfp`, {
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
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    if (!allowedTypes.includes(file.type)){
        fileInput.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
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

/*This is for editing the user profile*/

const edit_profile = document.getElementById("edit-profile_form");

let editBtn = document.getElementById("edit-profile-btn");
let cameraBtn = document.getElementById("camera-icon");
let fileInput = document.getElementById("profile-upload");
let pfp = document.getElementById("pfp");
let bio = document.getElementById("bio");
let bioEdit = document.getElementById("bio-edit");
let cancelBtn = document.getElementById("cancel-btn");
let saveBtn = document.getElementById("save-btn");

editBtn.addEventListener("click", function(){
    cameraBtn.classList.toggle("show");
    editBtn.classList.toggle("hide");
    cancelBtn.classList.toggle("show");
    saveBtn.classList.toggle("show");

    if (bio.style.display !== 'none') {
        bioEdit.value = bio.innerText;
        bio.style.display = 'none';
        bioEdit.style.display = 'block';
    }
});


cancelBtn.addEventListener("click", function(){
    cameraBtn.classList.remove("show");
    editBtn.classList.remove("hide");
    cancelBtn.classList.remove("show");
    saveBtn.classList.remove("show");
    
    bioEdit.style.display = 'none';
    bio.style.display = 'block';
});

saveBtn.addEventListener("click", function(){
    bio.innerText = bioEdit.value;
    cameraBtn.classList.remove("show");
    editBtn.classList.remove("hide");
    cancelBtn.classList.remove("show");
    saveBtn.classList.remove("show");

    bioEdit.style.display = 'none';
    bio.style.display = 'block';
});

fileInput.addEventListener("change", function(){
    const file = fileInput.files[0];
    if(!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

    if(!allowedTypes.includes(file.type)){
        fileInput.value = "";
        return;
    }
    pfp.src = URL.createObjectURL(file);
});





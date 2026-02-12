/* FOR DISPLAYING POSTS */

const posts = JSON.parse(localStorage.getItem('posts') || '[]');


for(let i = 0 ; i< posts.length ; i++){
    const viewButton = document.createElement("button");
    viewButton.className = "view-post-button"

    let postTime = (posts[i].date).toString();
    const timeString = postTime.split("T")
    let dateString = timeString[0]


    viewButton.onclick = function(){
        const viewingTitle = document.getElementById("view-post-title");
        viewingTitle.textContent = (posts[i].title);

        const viewingContent = document.getElementById("view-post-content");
        viewingContent.textContent = (posts[i].content);

        const viewingOpPfp = document.getElementById("OP-pfp");
        viewingOpPfp.src = 'images/freddyt_logo.png';

        const OPusername = document.getElementById("OP-username");
        OPusername.textContent = (posts[i].user.username);

        const OPdate = document.getElementById("OP-date");
        OPdate.textContent = ("Posted on " + dateString);

        showPopup("view-post-popup");

    }

    const newPost = document.createElement("div");
    const postFlexTop = document.createElement("div")
    const postFlexBottom = document.createElement("div")
    const flexArea = document.createElement("div")
    postFlexTop.id = "post-flex-top";
    flexArea.id = "post-flex-display";
    postFlexBottom.id = "post-flex-bottom";

    /* isolate the date */
    
    const newContent = document.createElement("p");
    /*const postContent = document.createTextNode(posts[i].tag + ", " + posts[i].title + ", " + posts[i].content + ", " + dateString);*/
    
    /* user pfp placeholder */
    const userPfp = new Image();
    userPfp.src = 'images/freddyt_logo.png';
    userPfp.id = "user-pfp"

    /* post tag/flair */
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

    /* post content preview*/
    const postContent = document.createElement("p");
    postContent.id = "post-content";
    postContent.appendChild(document.createTextNode(posts[i].content));

    /* post title */
    const postTitle = document.createElement("p");
    postTitle.id = "post-title";
    postTitle.appendChild(document.createTextNode(posts[i].title));
    
    /* post date*/
    const postDate = document.createElement("p");
    postDate.id = "post-date"
    postDate.appendChild(document.createTextNode(dateString));


    /* add elements to the post view */
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

    /*add the new post to the dashboard */
    const workingDiv = document.getElementById("main-content");

    workingDiv.appendChild(viewButton);

    console.log(posts[i].tag);
    console.log(posts[i].title);
    console.log(posts[i].content);
    console.log(posts[i].date);
    console.log(posts[i].user);
};

const postButton = document.getElementsByClassName("view-post-button")
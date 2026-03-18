/* FOR CREATING NEW COMMENT 		*/

// function for creating posts and adding them to mongo

async function create_comment() {
	console.log("hai ", getCurrentUser());

	let voteCount = 0;
	
	// post constructor
	const comment = {
        author: getCurrentUser()._id,
        //post: getCurrentPost()._id,
        content: document.getElementById("full-comment-input").value,
        createdAt: new Date(),
        upvotes: voteCount,
        //parent_id: ,
        edited: false
    }

	// await post and JSON stringify the content
	const res = await fetch('/api/comments', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ comment })
	});

	console.log(res);
	
	
}


function getCurrentUser() {
  let user = sessionStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  }

  let cookieUser = getCookie("user");
  if (cookieUser) {
    sessionStorage.setItem("user", cookieUser);
    return JSON.parse(cookieUser);
  }
  return null;
  
}
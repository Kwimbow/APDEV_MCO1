/* FOR CREATING NEW POST 		*/

// function for creating posts and adding them to mongo

async function create_post() {
	console.log("hai ", getCurrentUser());

	let voteCount = 0;
	
	// post constructor
	const post = {
		postID:	crypto.randomUUID(),
		author: getCurrentUser()._id,
		title: document.getElementById('title').value,
		content: document.getElementById("content").value,
		tag: document.querySelector('input[name="tag"]:checked').value,
		createdAt: new Date(),
		score: voteCount,
		edited: false
	}

	// await post and JSON stringify the content
	const res = await fetch('/api/create_post', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ post })
	});

	console.log(res);
	
	//hide modal pop up and reload
	if (res.ok) {
	hidePopup('create-post-popup');
	location.reload();
	
	}
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

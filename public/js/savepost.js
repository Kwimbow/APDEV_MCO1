/* FOR CREATING NEW POST 		*/

/* This function searches the users stored in local storage and logs in using session storage (temporary)
RETURN: true if username & password matches one in the storage
        false if either of them don't match */
async function create_post() {
	let voteCount = 0;

	const post = {
		postID:	crypto.randomUUID(),
		author: getCurrentUser(),
		title: document.getElementById('title').value,
		content: document.getElementById("content").value,
		tag: document.querySelector('input[name="tag"]:checked').value,
		createdAt: new Date(),
		upvotes: voteCount,
		edited: false
	}

	const res = await fetch('/api/create_post', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ post })
	});

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

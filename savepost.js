/* FOR CREATING NEW POST 		*/

const new_post = document.getElementById("createpost_form");

new_post.addEventListener("submit", function(e) {
	e.preventDefault();

	const tag = document.querySelector('input[name="tag"]:checked').value;
	const title = document.getElementById("title").value;
	const content = document.getElementById("content").value;
	let voteCount = 0;
	
	const post = {
		postID: crypto.randomUUID(), // Unique ID
		tag: tag,
		title: title,
		content: content,
		date: new Date(),
		user: getCurrentUser(),
		votes: voteCount,
		edited: false
	}

	const posts = JSON.parse(localStorage.getItem("posts")) || [];
	posts.push(post);
	localStorage.setItem("posts", JSON.stringify(posts));

	window.location.replace('index.html');
});
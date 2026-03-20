
async function filter_posts(event, tag) {


	console.log("hai2 ");

	// await post and JSON stringify the content
	const res = await fetch(`/api/filter?term=${encodeURIComponent(tag)}`, {
	method: 'GET',
	headers: { 'Content-Type': 'application/json' }
	});

    const matchingPosts = await res.json();
	console.log(matchingPosts);

    load_searched_posts(matchingPosts);

}

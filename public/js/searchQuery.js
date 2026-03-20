
async function search_posts(event) {
    
    event.preventDefault();

	console.log("hai ");

    let searchTerm = document.getElementById('search-bar').value
    

	// await post and JSON stringify the content
	const res = await fetch(`/api/search?term=${encodeURIComponent(searchTerm)}`, {
	method: 'GET',
	headers: { 'Content-Type': 'application/json' }
	});

    const matchingPosts = await res.json();
	console.log(matchingPosts);

    load_searched_posts(matchingPosts);

}

/* JS file that contains the bookmarked post of a user.
   This should be only seen by the user who is logged into their account
   and they should only be able to see THEIR OWN bookmarks */


async function save_bookmark(postID) {
	console.log("saving ", getCurrentUser());
  user = getCurrentUser();

  console.log(user._id);

	const res = await fetch('/api/bookmarks', {
	method: 'PATCH',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({ user: user._id, postID: postID })
	});
   

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

async function show_bookmarks(event){
  user = getCurrentUser();

  const res = await fetch(`/api/getbookmarks?userid=${encodeURIComponent(user._id)}`, {
	method: 'GET',
	headers: { 'Content-Type': 'application/json' }
	});

  const matchingPosts = await res.json();
	console.log(matchingPosts);

  load_searched_posts(matchingPosts);


}
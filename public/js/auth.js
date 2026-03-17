/* JS file that processes the authentication logic for login and registration */

/* This function searches the users stored in local storage and logs in using session storage (temporary)
RETURN: true if username & password matches one in the storage
        false if either of them don't match */
function login(username, password) {
  let existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = existingUsers.find(user => user.username === username && user.password === password);

  if (validUser){
    sessionStorage.setItem("user", JSON.stringify({ username }));
    return true;
  }
  return false;
}

/* This function is accessed when the user clicks the remember me button. Remembers user for 3 weeks
RETURN: true if username & password matches one in the storage
        false if either of them don't match */
function rememberMe3Weeks(username, password) {
  let existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = existingUsers.find(user => user.username === username && user.password === password);

  if (validUser){
    let date = new Date();
    date.setTime(date.getTime() + (21 * 24 * 60 * 60 * 1000)); //
    let expires = "; expires=" + date.toUTCString();

    document.cookie = "user=" + JSON.stringify({ username }) + expires + "; path=/";
    sessionStorage.setItem("user", JSON.stringify({ username }));
    
    return true;
  }
  return false;
}

/* This function returns the value of cookie, yummy */
function getCookie(name){
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");

  if(parts.length === 2){
    return parts.pop().split(";").shift();
  }
}

/* This function is accessed when user logs out, terminates logged in period */
function logout() {
    sessionStorage.clear();
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // localStorage.clear(); //this clears all registered account data
}

/* This function gets the current user and checks if they are logged in or not (visitor)
RETURN: JS object or a user value if current user is logged in,
        null if current user is a visitor */
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

/* This function registers the user
RETURN: true if successfully registered and stored in local storage
        false if username already exists in local storage
        null if password does not match the re-entered password's  */
async function register() {
  const username = document.getElementById('reg-user-info').value;
  const password = document.getElementById('reg-pw-info').value;
  const repassword = document.getElementById('reg-repw-info').value;

  //passwords dont match
  if (password !== repassword){
    document.getElementById('reg-unmatch-pw').classList.add('invalid');
    return;
  }

  // le post
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (res.ok) { // if successful
    hidePopup('register-popup');
    document.getElementById('reg-success').classList.add('show');
  }

  else { // le error. username alr exists
    document.getElementById('reg-taken-user').classList.add('invalid');
  }
}
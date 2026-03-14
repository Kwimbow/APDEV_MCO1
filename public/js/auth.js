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
function register(username, password, repassword) {
  let users = JSON.parse(localStorage.getItem("users")) || [];

  //passwords dont match
  if (password !== repassword){
    return null;
  }
  //there exists a user with the same username
  if (users.some(user => user.username === username)){
    return false;
  }

  users.push({ username, password });
  localStorage.setItem("users", JSON.stringify(users));
  return true;
}
/* JS file that processes the authentication logic for login and registration */

function login(username, password) {
  let existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = existingUsers.find(user => user.username === username && user.password === password);

  if (validUser){
    sessionStorage.setItem("user", JSON.stringify({ username }));
    return true;
  }
  return false;
}

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

function getCookie(name){
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");

  if(parts.length === 2){
    return parts.pop().split(";").shift();
  }
}

function logout() {
    sessionStorage.clear();
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // localStorage.clear(); //this clears all registered account data
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
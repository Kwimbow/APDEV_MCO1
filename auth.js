/* JS file that processes the authentication logic for login and registration */

function login(username, password) {
  if (username === "admin" && password === "1234") {
    localStorage.setItem("user", JSON.stringify({ username }));
    return true;
  }
  return false;
}

function logout() {
    localStorage.clear();
  //localStorage.removeItem("user");
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

//not properly implemented yet
function register(username, password, repassword) {
  if (password !== repassword) {
    return false;
  }
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  if (existingUsers.find(user => user.username === username)) {
    return false;
  }
  existingUsers.push({ username, password });
  localStorage.setItem("users", JSON.stringify(existingUsers));
  return true;
}
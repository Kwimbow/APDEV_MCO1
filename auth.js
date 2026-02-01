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
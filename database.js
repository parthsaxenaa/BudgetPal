// Local Storage Functions
function saveUser(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  
  function updateCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
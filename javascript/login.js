const USERNAME_KEY = 'username';
const HIDDEN_CLASSNAME = 'hidden';

const loginForm = document.querySelector('#login-form');
const loginInput = document.querySelector('#login-form input');
const greeting = document.querySelector('#greeting');
const saved_username = localStorage.getItem(USERNAME_KEY);
const removeButton = document.querySelector('button');

loginForm.addEventListener('submit', handleLoginSubmit);
removeButton.addEventListener('click', removeLocalstorage);

function handleLoginSubmit(event) {
  event.preventDefault();
  const username = loginInput.value;
  loginForm.classList.add(HIDDEN_CLASSNAME);
  localStorage.setItem(USERNAME_KEY, username);
  writeGreetings(username);
}

function writeGreetings(username) {
  const GREETING_CONTENTS = `${username}님 환영합니다!`;
  greeting.innerText = GREETING_CONTENTS;
  greeting.classList.remove(HIDDEN_CLASSNAME);
}

function removeLocalstorage() {
  localStorage.removeItem(USERNAME_KEY);
  location.reload();
}

if (saved_username === null) {
  loginForm.classList.remove(HIDDEN_CLASSNAME);
  localStorage.removeItem(USERNAME_KEY);
} else {
  loginForm.classList.add(HIDDEN_CLASSNAME);
  writeGreetings(saved_username);
}
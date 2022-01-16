const todoForm = document.querySelector('#todo');
const todoInput = todoForm.querySelector('input');
const todoListForm = document.querySelector('#todo-list');
const TODO_KEY = 'todo';
const savedTodoList = localStorage.getItem(TODO_KEY);

let webTodoList = [];

function handleTodoSubmit(event) {
  event.preventDefault();
  const todoInputValue = todoInput.value;
  todoInput.value = '';
  const newTodoObject = {
    data: todoInputValue,
    id: Date.now(),
  };
  webTodoList.push(newTodoObject);
  paintTodo(newTodoObject);
  updateSavedTodoList();
}

function paintTodo(todo) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  const button = document.createElement('button');

  li.id = todo.id;
  span.innerText = todo.data;
  button.innerText = '❌';
  button.addEventListener('click', deleteTodo);

  todoListForm.append(li);
  li.append(span);
  li.append(button);
}

function deleteTodo(event) {
  const li = event.target.parentElement;
  webTodoList = webTodoList.filter((todo) => todo.id !== parseInt(li.id));
  li.remove();
  updateSavedTodoList();
}

function updateSavedTodoList() {
  localStorage.setItem(TODO_KEY, JSON.stringify(webTodoList));
}

if (savedTodoList !== null) {
  const parsedTodoList = JSON.parse(savedTodoList);
  webTodoList = parsedTodoList;
  parsedTodoList.forEach(paintTodo);
}

todoForm.addEventListener('submit', handleTodoSubmit);

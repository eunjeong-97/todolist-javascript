import { IMAGE_API_URL } from '../config.js';
const body = document.querySelector('body');

fetch(IMAGE_API_URL)
  .then(response => response.json())
  .then(data => {
    body.style = `background-image: url(${data.url})`;
  });
const username = localStorage.getItem("@username");
const todos = JSON.parse(localStorage.getItem("@todos")) || [];

const modalBg = document.querySelector(".modal-tp");
const screen = document.querySelector("main");

const ImageUrl =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyw7dUqHzR50-ejmTPOv-TtWCk6tduVbZzYzZbETDxEMpIzoWW9sb-spNM_ANyfQtIVrk&usqp=CAU";
const WEATHER_KEY = "4ae2bb77305e4ea91ace1ae6410c0fe1";
let isClickBtn = false;
let isModal = false;
let currentId = "";

const login = document.createElement("login-screen");
const weather = document.createElement("weather-screen");
const todo = document.createElement("todo-screen");
const modal = document.createElement("modal-screen");

const getImage = () => {
  const body = document.querySelector("body");
  const WINDOW_WIDTH = window.innerWidth;
  const WINDOW_HEIGHT = window.innerHeight;
  const IMG_API = `https://picsum.photos/${WINDOW_WIDTH}/${WINDOW_HEIGHT}`;
  console.log("getImage", IMG_API);
  body.style.backgroundImage = `url(${IMG_API})`;
};

getImage();
window.addEventListener("resize", getImage);

const getTime = () => {
  const hour = new Date().getHours().toString().padStart(2, "0");
  const minute = new Date().getMinutes().toString().padStart(2, "0");
  const second = new Date().getSeconds().toString().padStart(2, "0");
  return `${hour}:${minute}:${second}`;
};

if (!username) {
  screen.appendChild(login);
} else {
  screen.appendChild(weather);
  screen.appendChild(todo);
}

class Login extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      document.querySelector("#login-screen").content.cloneNode(true)
    );

    // 시간
    setInterval(() => {
      const time = this.shadowRoot.querySelector(".time");
      time.innerText = getTime();
    }, 1000);

    // 로그인
    const form = this.shadowRoot.querySelector("form");
    const input = this.shadowRoot.querySelector("input");
    form.addEventListener("submit", () => {
      localStorage.setItem("@username", input.value);
    });
  }
}

class Todo extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      document.querySelector("#todo-screen").content.cloneNode(true)
    );
    const name = this.shadowRoot.querySelector(".name");
    const btn = this.shadowRoot.querySelector("#btn");
    const ul = this.shadowRoot.querySelector("ul");
    const form = this.shadowRoot.querySelector("form");
    const input = document.createElement("input");
    input.placeholder = "할일을 입력하세요.";
    name.innerHTML = `<span style='color: #d87474; font-size:25px;'>${username}</span>'s 오늘의 할일!`;

    if (todos.length) {
      todos.forEach(({ id, value }) => {
        const li = document.createElement("li");
        li.setAttribute("id", id);
        li.innerText = value;
        ul.appendChild(li);
        li.addEventListener("click", (e) => {
          e.preventDefault();
          currentId = id;
          modalBg.style.display = "flex";
          modalBg.appendChild(modal);
        });
      });
    }

    btn.addEventListener("click", () => {
      if (isClickBtn) {
        ul.removeChild(input);
        isClickBtn = false;
        return;
      }
      ul.appendChild(input);
      isClickBtn = true;
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!input.value) {
        alert("할일을 입력해주세요");
        return;
      }
      todos.push({ id: e.timeStamp, value: input.value });
      localStorage.setItem("@todos", JSON.stringify(todos));
      location.reload();
    });
  }
}

class Modal extends HTMLElement {
  connectedCallback() {
    if (!isModal) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.append(
        document.querySelector("#modal-screen").content.cloneNode(true)
      );
    }
    isModal = true;
    const title = this.shadowRoot.querySelector("p");
    const form = this.shadowRoot.querySelector("form");
    const close = this.shadowRoot.querySelector(".close");
    const input = document.createElement("input");
    const [renameBtn, deleteBtn] = this.shadowRoot.querySelectorAll("button");

    const onClose = () => {
      if (modalBg.style.display === "flex") modalBg.removeChild(modal);
      modalBg.style.display = "none";
    };

    const [todoObj] = todos.filter((todo) => todo.id === currentId);
    title.innerText = todoObj.value;

    // 버튼 이벤트리스너
    renameBtn.addEventListener("click", () => {
      form.appendChild(input);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (input.value) {
          const _arr = todos.map((todo) =>
            todo.id === currentId ? { ...todo, value: input.value } : todo
          );
          localStorage.setItem("@todos", JSON.stringify(_arr));
          location.reload();
        }
        onClose();
      });
    });

    deleteBtn.addEventListener("click", () => {
      const _arr = todos.filter((todo) => todo.id !== currentId);
      localStorage.setItem("@todos", JSON.stringify(_arr));
      location.reload();
      onClose();
    });
    close.addEventListener("click", onClose);
  }
}

class Weather extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.append(
      document.querySelector("#weather-screen").content.cloneNode(true)
    );

    const [time, space, weather] = this.shadowRoot.querySelectorAll("p");
    const img = this.shadowRoot.querySelector("img");

    // 시간
    setInterval(() => {
      time.innerText = getTime();
    }, 1000);

    // 날씨
    navigator.geolocation?.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
        const params = { lat, lon, appid: WEATHER_KEY };
        const { data } = await axios.get(WEATHER_API, { params });
        const { main, icon } = data.weather[0];
        space.innerText = data.name;
        weather.innerText = main;
        img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      },
      () => console.log("좌표불러오기 실패")
    );
    // lat: 위도, lon: 경도
  }
}

customElements.define("login-screen", Login);
customElements.define("todo-screen", Todo);
customElements.define("modal-screen", Modal);
customElements.define("weather-screen", Weather);


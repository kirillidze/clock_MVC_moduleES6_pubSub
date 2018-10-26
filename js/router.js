'use strict';
import {
  Model
} from "./model.js";
import {
  ClockDOMView,
  ClockSVGView,
  ClockCanvasView
} from "./view.js";
import {
  Controller
} from "./controller.js";

class Router {
  constructor(map, rootElement) {
    this.map = map;
    this.rootElement = rootElement;
    // Подписаться на событие hashchange
    window.addEventListener('hashchange', this.onhashchange.bind(this));
  }

  onhashchange() {
    const activeHash = document.location.hash;
    // Отрисовать страницу для нового адреса
    this._route(activeHash);
  }

  _route(route) {
    const settings = this.map[route];
    if (settings) {
      this.rootElement.innerHTML = '';
      // запустить контроллер страницы,
      // которая соответствует адресу,
      // на который нужно перейти
      settings.runController(this.rootElement);
    }
  }

  navigateTo(route) {
    // Выполнить начальную навигацию на адрес по умолчанию
    if (document.location.hash === route && this.loaded) return;
    this._route(route);
    document.location.hash = route;
    this.loaded = true;
  }
}

//создаём контейнер для отображения контента
const div = document.createElement('div');
document.body.appendChild(div);

let model1 = new Model(0);
model1.changes.sub('change', (data) => console.log(data));

let map = {
  '#clock1': {
    pageName: 'London time',
    runController: rootElement => {
      new Controller(
        model1,
        new ClockDOMView(rootElement));
    }
  },
  '#clock2': {
    pageName: 'Minsk time',
    runController: rootElement => {
      new Controller(
        new Model(3),
        new ClockCanvasView(rootElement));
    }
  },
  '#clock3': {
    pageName: 'New York time',
    runController: rootElement => {
      new Controller(
        new Model(-5),
        new ClockSVGView(rootElement));
    }
  }
};

let route = new Router(map, div);
route.navigateTo('#clock2');

//создаём кнопки для перехода к разным страницам
for (let key in map) {
  let button = document.createElement('input');
  button.type = 'button';
  button.value = map[key].pageName;
  button.onclick = () => route.navigateTo(key);
  document.body.appendChild(button);
}
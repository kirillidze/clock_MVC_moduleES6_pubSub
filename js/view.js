'use strict';

//базовый класс представления часов
class ClockView {
    constructor(root) {
        this.root = root;

        this.element = null;
        this.dialOfClock = null;
        this.centerDot = null;
        this.hourHand = null;
        this.minuteHand = null;
        this.secondHand = null;
        this.digitalClock = null;

        this.corner = 30;

        this.sec = null;
        this.min = null;
        this.hour = null;

        this.startButton = null;
        this.stopButton = null;

        this.checkbox = null;
        this.startedChangeHandler = null;
    }

    render(model) {
        // представление создает dom элементы в первый раз
        if (!this.element) {
            this.timezone = document.createElement('span');
            if (model.timezone >= 0) {
                this.timezone.textContent = '+' + model.timezone + ' GMT';
            } else {
                this.timezone.textContent = '+' + model.timezone + ' GMT';
            }

            this.startButton = document.createElement('input');
            this.startButton.type = 'button';
            this.startButton.value = 'Старт';
            this.startButton.addEventListener('click',
                () => this.startedChangeHandler(true));

            this.stopButton = document.createElement('input');
            this.stopButton.type = 'button';
            this.stopButton.value = 'Стоп';
            this.stopButton.addEventListener('click',
                () => this.startedChangeHandler(false));

            this.checkbox = document.createElement('input');
            this.checkbox.type = 'checkbox';
            this.checkbox.checked = true;
            this.checkbox.addEventListener('change',
                e => this.startedChangeHandler(e.target.checked));

            this.root.appendChild(this.checkbox);
            this.root.appendChild(this.startButton);
            this.root.appendChild(this.stopButton);
            this.root.appendChild(this.timezone);

            //создаём и отрисовываем представление конкретного вида часов
            this.clockCreate();

            //вставляем остальные элементы часов
            this.element.appendChild(this.digitalClock);
            this.element.appendChild(this.hourHand);
            this.element.appendChild(this.minuteHand);
            this.element.appendChild(this.secondHand);
            this.element.appendChild(this.centerDot);

        }
        // и обновляет время по данным из модели
        this.digitalClock.textContent = model.date.toLocaleTimeString();

        this.sec = model.date.getSeconds();
        this.min = model.date.getMinutes();
        this.hour = model.date.getHours();

    }

    clockCreate() {
        //отрисовка каждого конкретного вида часов
    }

    setChangeHandler(handler) {
        this.startedChangeHandler = handler;
    }
}

//создаём класс-наследник DOM-часов
export class ClockDOMView extends ClockView {
    constructor(root) {
        super(root); //вызываем базовый конструктор
    }

    render(model) {

        super.render(model); //вызов базовой реализации

        this.secondHand.style.transform = `rotate(${this.sec*6}deg)`;
        this.minuteHand.style.transform = `rotate(${this.min*6}deg)`;
        this.hourHand.style.transform = `rotate(${this.hour*30 + this.min*0.5}deg)`;

    }

    clockCreate() {
        //DOM elements
        this.element = document.createElement('div');
        this.dialOfClock = document.createElement('div');
        this.centerDot = document.createElement('div');
        this.hourHand = document.createElement('div');
        this.minuteHand = document.createElement('div');
        this.secondHand = document.createElement('div');
        this.digitalClock = document.createElement('div');

        this.element.style.cssText = `width: 200px;
                                         height: 250px;
                                         position: relative;`;
        this.dialOfClock.style.cssText = `width: 200px;
                                             height: 200px;
                                             border-radius: 100px;
                                             background-color: #fcca66;
                                             position: relative;`;
        this.centerDot.style.cssText = `width: 4px;
                                          height: 4px;
                                          border-radius: 2px;
                                          background-color: black;
                                          position: absolute;
                                          top: 98px;
                                          left: 98px;`;
        this.hourHand.style.cssText = `width: 10px;
                                          height: 50px;
                                          border-radius: 5px;
                                          background-color: black;
                                          opacity: .6;
                                          position: absolute;
                                          top: 60px;
                                          left: 95px;
                                          transform-origin: 5px 40px;`;
        this.minuteHand.style.cssText = `width: 4px;
                                            height: 90px;
                                            border-radius: 2px;
                                            background-color: black;
                                            opacity: .6;
                                            position: absolute;
                                            top: 20px;
                                            left: 98px;
                                            transform-origin: 2px 80px;`;
        this.secondHand.style.cssText = `width: 2px;
                                            height: 100px;
                                            border-radius: 1px;
                                            background-color: red;
                                            opacity: .6;
                                            position: absolute;
                                            top: 10px;
                                            left: 99px;
                                            transform-origin: 1px 90px;`;
        this.digitalClock.style.cssText = `position: absolute;
                                              top: 25%;
                                              left: 38%;`;
        this.root.appendChild(this.element);
        this.element.appendChild(this.dialOfClock);

        //создаём цифры на табло, используя цикл
        for (let i = 1; i < 13; i++) {
            let numContainer = document.createElement('div'),
                numSpan = document.createElement('span');
            //стили фонов цифр
            numContainer.style.cssText = `display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            width: 26px;
                                            height: 26px;
                                            border-radius: 13px;
                                            background-color: #48b382;
                                            position: absolute;
                                            top: 10px;
                                            left: 87px;
                                            transform: rotate(${this.corner}deg);
                                            transform-origin: 13px 90px;`;
            //стили самих цифр
            numSpan.style.cssText = `display: inline-block;
                                       transform: rotate(-${this.corner}deg);
                                       transform-origin: center;`;
            //значение цифры
            numSpan.textContent = i;

            this.element.appendChild(numContainer);
            numContainer.appendChild(numSpan);
            //каждый последующий блок с цифрой располагаем на 30градусов дальше
            this.corner += 30;
        }
    }

    setChangeHandler(handler) {
        super.setChangeHandler(handler); //вызов базовой реализации
    }
}

export class ClockSVGView extends ClockView {
    constructor(root) {
        super(root); //вызываем базовый конструктор
    }

    render(model) {
        super.render(model); //вызов базовой реализации

        this.secondHand.setAttribute('transform', `rotate(${this.sec*6} 400 300)`);
        this.minuteHand.setAttribute('transform', `rotate(${this.min*6} 400 300)`);
        this.hourHand.setAttribute('transform', `rotate(${this.hour*30 + this.min*0.5} 400 300)`);
    }

    clockCreate() {
        //SVG elements
        this.element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.br = document.createElement('br');
        this.dialOfClock = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.centerDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        this.hourHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.minuteHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.secondHand = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        this.digitalClock = document.createElementNS('http://www.w3.org/2000/svg', 'text');

        //стилизуем элементы
        this.element.setAttribute('width', '1000');
        this.element.setAttribute('height', '400');
        this.element.setAttribute('viewBox', '250 100 1000 460');

        //само табло
        this.dialOfClock.setAttribute('cx', '400');
        this.dialOfClock.setAttribute('cy', '300');
        this.dialOfClock.setAttribute('r', '200');
        this.dialOfClock.setAttribute('fill', '#fcca66');

        //центральная точка
        this.centerDot.setAttribute('cx', '400');
        this.centerDot.setAttribute('cy', '300');
        this.centerDot.setAttribute('r', '4');
        this.centerDot.setAttribute('fill', 'black');

        //часовая стрелка
        this.hourHand.setAttribute('x1', '400');
        this.hourHand.setAttribute('y1', '310');
        this.hourHand.setAttribute('x2', '400');
        this.hourHand.setAttribute('y2', '220');
        this.hourHand.setAttribute('stroke', 'black');
        this.hourHand.setAttribute('stroke-width', '20');
        this.hourHand.setAttribute('stroke-opacity', '0.6');
        this.hourHand.setAttribute('stroke-linecap', 'round');

        //минутная стрелка
        this.minuteHand.setAttribute('x1', '400');
        this.minuteHand.setAttribute('y1', '310');
        this.minuteHand.setAttribute('x2', '400');
        this.minuteHand.setAttribute('y2', '150');
        this.minuteHand.setAttribute('stroke', 'black');
        this.minuteHand.setAttribute('stroke-width', '10');
        this.minuteHand.setAttribute('stroke-opacity', '0.6');
        this.minuteHand.setAttribute('stroke-linecap', 'round');

        //секундная стрелка
        this.secondHand.setAttribute('x1', '400');
        this.secondHand.setAttribute('y1', '310');
        this.secondHand.setAttribute('x2', '400');
        this.secondHand.setAttribute('y2', '120');
        this.secondHand.setAttribute('stroke', 'red');
        this.secondHand.setAttribute('stroke-width', '2');
        this.secondHand.setAttribute('stroke-opacity', '0.6');
        this.secondHand.setAttribute('stroke-linecap', 'round');

        this.digitalClock.setAttribute('x', '400');
        this.digitalClock.setAttribute('y', '250');
        this.digitalClock.setAttribute('font-size', '30');
        this.digitalClock.setAttribute('text-anchor', 'middle');

        this.root.appendChild(this.br);
        this.root.appendChild(this.element);
        this.element.appendChild(this.dialOfClock);

        //создаём цифры на табло, используя цикл
        for (let i = 1; i < 13; i++) {
            let numBackground = document.createElementNS('http://www.w3.org/2000/svg', 'circle'),
                numText = document.createElementNS('http://www.w3.org/2000/svg', 'text'),
                tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            //стили фона цифр
            numBackground.setAttribute('cx', '400');
            numBackground.setAttribute('cy', '140');
            numBackground.setAttribute('r', '26');
            numBackground.setAttribute('fill', '#48b382');
            numBackground.setAttribute('transform', `rotate(${this.corner} 400 300)`);

            //рассчитываем положение цифр
            let posX = 400 + 160 * Math.sin((Math.PI / 180) * this.corner),
                posY = 140 + 160 * (1 - Math.cos((Math.PI / 180) * this.corner));

            //поле с текстом для цифр
            numText.setAttribute('x', posX);
            numText.setAttribute('y', posY);
            numText.setAttribute('font-size', '30');
            numText.setAttribute('text-anchor', 'middle');
            numText.setAttribute('fill', 'black');

            //позиционируем сами цифры
            tspan.setAttribute('dx', '0');
            tspan.setAttribute('dy', '8');

            //добавляем фон и цифры
            this.element.appendChild(numBackground);
            this.element.appendChild(numText);
            numText.appendChild(tspan);
            tspan.textContent = i;

            //каждый последующий блок с цифрой располагаем на 30градусов дальше
            this.corner += 30;
        }
    }

    setChangeHandler(handler) {
        super.setChangeHandler(handler); //вызов базовой реализации
    }
}
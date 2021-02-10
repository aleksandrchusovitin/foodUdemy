"use strict";

// Обработчик для события: полное построение DOM-дерева
window.addEventListener("DOMContentLoaded", () => {
  //!TABS/
  //Получаем эелементы со страницы для последующей работы с ними
  const tabsParent = document.querySelector(".tabheader__items"),
    tabs = tabsParent.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent");

  // Функция, которая показывает НУЖНЫЙ таб при нажатии на
  // определенный элемент в списке "tabheader__items"
  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
  }

  // Функция, которая скрывает все ТАБЫ
  function hideTabContent() {
    tabsContent.forEach((tabContent) => {
      tabContent.classList.add("hide");
      tabContent.classList.remove("show", "fade");
    });
  }

  // По разу вызываем функции, чтобы скрыть все лишние табы и
  // показать ТАБ по дефолту(первый)
  hideTabContent();
  showTabContent();

  // Обработчик для события КЛИК на элемент из списка "tabheader__items"
  tabsParent.addEventListener("click", (event) => {
    const target = event.target;

    // Проверяем действительно ли было нажатие на НУЖНЫЙ нам эелемент
    if (target && target.classList.contains("tabheader__item")) {
      // Перебираем список из меню и ищем совпадение(элемент на который кликнули и элемент из меню)
      tabs.forEach((item, i) => {
        item.classList.remove("tabheader__item_active");
        if (target == item) {
          // Если совпадение найдено - скрываем все табы и открываем НУЖНЫЙ
          // i - порядковый номер из меню который соответствует порядковому номеру таба
          item.classList.add("tabheader__item_active");
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //!TIMER//
  // Задаем дату окончания таймера
  const deadline = "2021-03-10";

  // Функция для рассчета разницы между дедлайном и СЕЙЧАС
  // из этого timestamp получаем дни, часы, минуты и секунды, возвращаем все в виде объекта
  function getTimeRemaining(endtime) {
    const t = Date.parse(deadline) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  // Функция для добавления 0 перед односимвольными цифрами
  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    }
    return num;
  }

  // Функция для установки таймера в разметку, получаем все нужны элементы, устанавливаем таймер
  function setClock(elementParent, elementDays, elementHours, elementMinutes, elementSeconds, endtime) {
    const timer = document.querySelector(elementParent),
      days = timer.querySelector(elementDays),
      hours = timer.querySelector(elementHours),
      minutes = timer.querySelector(elementMinutes),
      seconds = timer.querySelector(elementSeconds),
      timerId = setInterval(updateClock, 1000);

    // Вызываем разово функцию обновления таймера, для того чтобы при загрузке страницы
    // сразу в разметку попали нужные цифры
    updateClock();

    // функция, которая непосредственно вставляет нужные цифры таймера в разметку
    // и по его истечению сбрасывает таймер
    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timerId);

        days.textContent = "00";
        hours.textContent = "00";
        minutes.textContent = "00";
        seconds.textContent = "00";
      }
    }
  }

  setClock(".timer", "#days", "#hours", "#minutes", "#seconds", deadline);

  //!MODAL WINDOW

  // Получаем элементы со страницы для дальнейшей работы
  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal"),
    modalCloseBtn = modal.querySelector("[data-close]");

  function openModal() {
    modal.classList.add("show", "fade");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    // clearInterval(modalTimerId);
  }

  // Вешаем на все кнопки для вызова модального окна обработчик для события КЛИК и
  // показываем модальное окно, а так же отменяем прокрутку страницы
  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  // Функция для скрытия модального окна, а так же для восстановления возможности скролла страницы
  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show", "fade");
    document.body.style.overflow = "";
  }

  // Обработчик для события КЛИК крестика модального окна(закрытие)
  modalCloseBtn.addEventListener("click", closeModal);

  // Обработчик для события КЛИЕ класса modal для сокрытия модального окна при клике на свободную область сайта
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  // Вешаем на весь документ обработчик для события НАЖАТИЕ КЛАВИШИ ВНИЗ, если модальное окно открыто
  // и нажата клавиша ESC - скрываем модальное окно
  document.addEventListener("keydown", (event) => {
    if (event.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  // const modalTimerId = setTimeout(openModal, 3000);

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  //!MENU Используем классы для карточек
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 74;
      this.convertToRub();
    }

    convertToRub() {
      this.price *= this.transfer;
    }

    render() {
      const element = document.createElement("div");
      element.innerHTML = `
      <div class="menu__item">
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
      </div>
      `;

      this.parent.append(element);
    }
  }

  new MenuCard(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/elite.jpg",
    "elite",
    "Меню “Премиум”",
    "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
    14,
    ".menu .container"
  ).render();

  new MenuCard(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
    21,
    ".menu .container"
  ).render();
});

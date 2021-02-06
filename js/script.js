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
  const deadline = "2021-02-09";

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
    // и поего истечению сбрасывает таймер
    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.textContent = getZero(t.days);
      hours.textContent = getZero(t.hours);
      minutes.textContent = getZero(t.minutes);
      seconds.textContent = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timerId);
      }
    }
  }

  setClock(".timer", "#days", "#hours", "#minutes", "#seconds", deadline);
});

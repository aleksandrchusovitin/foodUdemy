"use strict";

// Обработчик для события: полное построение DOM-дерева
window.addEventListener("DOMContentLoaded", () => {
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
});

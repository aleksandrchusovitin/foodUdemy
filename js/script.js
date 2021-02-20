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

  // Обработчик для события КЛИК класса modal для сокрытия модального окна при клике на свободную область сайта
  // или при клике на закрывающий крестик
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.getAttribute("data-close") == "") {
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
  // Создаем класс-шаблон для карточек меню
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.transfer = 74;
      this.convertToRub();
    }

    // Функция для перевода долларов в рубли
    convertToRub() {
      this.price *= this.transfer;
    }

    // метод для отрисовки в разметку карточки
    // создаем div, навешиваем нудные классы(...classes)
    render() {
      const element = document.createElement("div");

      if (this.classes.length === 0) {
        this.element = "menu__item";
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }
      // Сама разметка блока
      element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
      `;
      //Добавляем в конец родительского элемента(element)
      this.parent.append(element);
    }
  }

  // Функция для get запроса к серверу и получению объекта + проверка на успешность и выброс ошибки
  // в случае неудачи(напр. ошибка сервера 500)
  const getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Ошибка при запросе к базе данных по адресу ${url}. Статус ошибки: ${res.status}`);
    }

    return await res.json();
  };

  // Создаем по шаблону 3 карточки
  getResource("http://localhost:3000/menu").then((obj) => {
    obj.forEach(({ img, altimg, title, descr, price }) => {
      new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
    });
  });

  // ! Тоже самое что сверху - но с использованием библиотеки axios
  // axios.get("http://localhost:3000/menu").then((data) => {
  //   data.data.forEach(({ img, altimg, title, descr, price }) => {
  //     new MenuCard(img, altimg, title, descr, price, ".menu .container").render();
  //   });
  // });

  // ? Способ добавления карточек БЕЗ шаблонизации(когда нам нужно один раз отрисовать в верстке и все)
  // getResource("http://localhost:3000/menu")
  //   .then(data => getCard(data));

  // function getCard(data) {
  //   data.forEach(({ img, altimg, title, descr, price }) => {
  //     price *= 74;

  //     const element = document.createElement('div');
  //     element.classList.add('menu__item');

  //     element.innerHTML = `
  //     <img src=${img} alt=${altimg}>
  //     <h3 class="menu__item-subtitle">${title}</h3>
  //     <div class="menu__item-descr">${descr}</div>
  //     <div class="menu__item-divider"></div>
  //     <div class="menu__item-price">
  //       <div class="menu__item-cost">Цена:</div>
  //       <div class="menu__item-total"><span>${price}</span> руб/день</div>
  //     </div>
  //     `;
  //     document.querySelector('.menu .container').append(element);
  //   });
  // }

  //!FORMS
  // Получаем псевдомассив со всеми элементами - форма
  const forms = document.querySelectorAll("form");

  // Создаем вспомогательный объект - для хранения сообщений пользователю по состоянию отпраки данных на сервер
  // Так же храним здесь картинку для отображения статуса загрузки
  const messages = {
    loaded: "img/forms/spinner.svg",
    success: "Спасибо за ваше обращение! Мы скоро с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  // Перебираем псевдомассив со всеми формами и вызываем функцию с обработчиком на каждую
  forms.forEach((form) => {
    bindPostDate(form);
  });

  // Функция для настройки запроса к серверу, метод, заголовки, тело(пока только для json формата)
  const postDate = async (url, data) => {
    let res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: data,
    });

    return await res.json();
  };

  // функция , содержащая вызов обработчика для события - ОТПРАВКА ФОРМЫ для формы (form)
  function bindPostDate(form) {
    // Вешаем сам обработчик на форму
    form.addEventListener("submit", (event) => {
      // Обязательно сбрасываем поведение по умолчанию, чтобы страница не перезагружалась при отправке формы
      event.preventDefault();

      // Создаем блок img с картинкой прогресса загрузки,
      // адрес картинки и стили, добавляем после конца формы
      const statusMessage = document.createElement("img");
      statusMessage.src = messages.loaded;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      // Создаем объект,который даёт возможность делать HTTP-запросы к серверу без перезагрузки страницы.
      //!(устаревший метод)
      // const request = new XMLHttpRequest();

      // Указываем метод запроса и адрес сервера
      // request.open("POST", "server.php");
      // request.setRequestHeader("Content-type", "application/json; charset=utf-8"); //?для JSON обязательно заголовки
      // Создаем объект formDate, объект хранит все данные из формы в себе
      const formDate = new FormData(form);

      // //?Чтобы переделать объект(на самом деле не совсем объект) formDate в JSON делаем следующее:
      // //? Сначала создаем именно ОБЪЕКТ из массивоподобного formDate, потом форматируем в JSON
      // const obj = {};
      // formDate.forEach((value, key) => {
      //   obj[key] = value;
      // });

      // !Более элегантный способ сделать из formDate - JSON
      // Сначала делаем из fromdate массив массиво с помощью entries(). Потом с помощью Objec.frometries делаем объект
      // из него и преобразуем этот объект в JSON
      const json = JSON.stringify(Object.fromEntries(formDate.entries()));

      // const json = JSON.stringify(obj);

      // Современный метод через fetch(путем промисов)
      postDate("http://localhost:3000/requests", json)
        .then((date) => {
          console.log(date);
          showThanksModal(messages.success);
          statusMessage.remove(); // !проверить строчку
        })
        .catch(() => {
          showThanksModal(messages.failure);
        })
        .finally(() => {
          form.reset();
        });

      // request.send(formDate);// Отправляем данные в виде объекта formDate
      // request.send(json); //?Отправляем данные в формате JSON

      // Вешаем обработчик события LOAD(полыный цикл пермещение данных клиент-сервер-клиент) на request
      // request.addEventListener("load", () => {
      //   // Если ответ от сервера - УСПЕШНО то выводим соответствующее сообщение в модальное окно
      //   // очищаем форму
      //   if (request.status === 200) {
      //     console.log(request.response);
      //     showThanksModal(messages.success);
      //     form.reset();
      //     // В противном случае показываем модальное окно с ошибкой
      //   } else {
      //     showThanksModal(messages.failure);
      //   }
      // });
    });
  }

  // Функция для создания и показа модального окна с сообщениями о статусе запроса к серверу(отправки данных)
  function showThanksModal(message) {
    // Запоминаем стандарное модальное окно
    const prevModalDialog = document.querySelector(".modal__dialog");
    //скрываем его и открываем подложку для нового модального окна
    prevModalDialog.classList.add("hide");
    openModal();

    // Создаем новое модальное окно, вешаем соотвествующий класс и добавляем в разметку
    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
      <div data-close class="modal__content">
        <div class="modal__close"></div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    document.querySelector(".modal").append(thanksModal);

    // Устанавливаем таймер, через 4 сек новое модальное окно удаляем, стандартное возвращаем классами(показываем)
    // И закрываем подложку
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add("show", "fade");
      prevModalDialog.classList.remove("hide");
      closeModal();
    }, 4000);
  }

  // ! Slider
  const sliderCounter = document.querySelector(".offer__slider-counter"),
    currentCounter = sliderCounter.querySelector("#current"),
    totalCounter = sliderCounter.querySelector("#total"),
    prevArrow = sliderCounter.querySelector(".offer__slider-prev"),
    nextArrow = sliderCounter.querySelector(".offer__slider-next"),
    slides = document.querySelectorAll(".offer__slide");

  // * Мой убогий вариант
  // const countSlides = slides.length;
  // let currentIndex = +currentCounter.textContent;

  // function hideSlides() {
  //   slides.forEach((slide) => {
  //     slide.classList.add("hide");
  //     slide.classList.remove("show", "fade");
  //   });
  // }

  // hideSlides();

  // function showSlide(slide, slideIndex) {
  //   totalCounter.textContent = countSlides < 10 ? `0${countSlides}` : countSlides;
  //   currentCounter.textContent = slideIndex < 10 ? `0${slideIndex}` : slideIndex;

  //   slide.classList.add("show", "fade");
  //   slide.classList.remove("hide");
  // }

  // showSlide(slides[currentIndex - 1], currentIndex);

  // sliderCounter.addEventListener("click", (event) => {
  //   const target = event.target;
  //   console.log(target);

  //   if (target === prevArrow || target === sliderCounter.querySelector(".offer__slider-prev img")) {
  //     currentIndex--;
  //     if (currentIndex < 1) {
  //       currentIndex = countSlides;
  //     }
  //   } else if (target === nextArrow || target === sliderCounter.querySelector(".offer__slider-next img")) {
  //     currentIndex++;
  //     if (currentIndex > countSlides) {
  //       currentIndex = 1;
  //     }
  //   }

  //   hideSlides();
  //   showSlide(slides[currentIndex - 1], currentIndex);
  // });

  //* Вариант с урока

  // Берем начальынй индекс за 1
  let slideIndex = 1;

  // Скрываем все слайды из разметки и показываем первый
  showSlides(slideIndex);

  // Устанавливаем в разметку общее количество слайдов(берем из массива слайдов)
  // Плюс форматируем под нули(01, 02, 03)
  if (slides.length < 10) {
    totalCounter.textContent = `0${slides.length}`;
  } else {
    totalCounter.textContent = slides.length;
  }

  // Основная функция для показа слайдов
  function showSlides(n) {
    // Механика для переполнения(если слайдов 4 всего, то когда достигаем 4 и листаем дальше -становится снова индекс 1
    // и так же в другую сторону 0-4)
    if (n > slides.length) {
      slideIndex = 1;
    }

    if (n < 1) {
      slideIndex = slides.length;
    }

    // Перебираем псевдомассив со слайдами и все скрываем
    slides.forEach((slide) => {
      slide.classList.add("hide");
      slide.classList.remove("show", "fade");
    });

    // Показываем сладер с индексом slideIndex - 1(так как начинаем с 1 для удобочитаемости юзера)
    slides[slideIndex - 1].classList.add("show", "fade");
    slides[slideIndex - 1].classList.remove("hide");

    // Устанавливаем в разметку текущий номер слайдера(так же с форматированием)
    if (slideIndex < 10) {
      currentCounter.textContent = `0${slideIndex}`;
    } else {
      currentCounter.textContent = slideIndex;
    }
  }

  // Функция для (плюс/минус 1) от индекса
  function plusSlides(n) {
    showSlides((slideIndex += n));
  }

  // Вешаем обработчики событий на стрелочки и вызываем функцию (плюс/минус 1) от индекса
  prevArrow.addEventListener("click", () => {
    plusSlides(-1);
  });

  nextArrow.addEventListener("click", () => {
    plusSlides(1);
  });
});


// Задачка такая: у нас есть форма в которую пользователь пишет свой отзыв для интернет магазина.Пока пользователь
// не отправил отзыв нам необходимо его сохранять в localStorage, чтобы при перезагрузке или при потере интернета,
// данные сохранились и пользователю не пришлось повторно вводить данные.

import throttle from 'lodash.throttle'; // чтобы не устанавливать всю библиотеку lodash, установим только её один пакетик
// для использования в нашем коде.Всю библиотеку без надобности устанавливать плохо т.к.она же перейдёт и пользователю и
// будет в совокупности занимать больше времени на обработку страницы.
// Для каждого метода lodash есть отдельные пакетики и мы их можем устанавливать отдельно от всей библиотеки, в нашем случае
// нам необходимо установить только.throttle, поэтому читаем документацию для lodash.throttle и устанавливаем себе, обычно
// это через команду: "npm i lodash.throttle"
  
import '../css/common.css';
import '../css/feedback-form.css';

// в программировании есть очень плохая штука - магические числа и строки или антипатерн.Т.е.есть хорошие приемы
// программирования и есть плохие, один из плохих примеров это магические числа и строки.На примере это выглядит так:
// когда у нас в коде используется вот такой вариант 'feedback-msg'.На первый взгляд вроде как нормально, но эта
// запись используется 3 или большее кол - во раз подряд и если мы где - то при использовании случайно сделаем ошибку в
// названии, то придется очень долго сидеть думать и искать в чем проблема, поэтому такие вещи лучше всего выносить в
// константы, константы это именно то что большми буквами записывается в переменную и используется как константное значение
// между разными запусками скрипта. Поэтому из нашего 'feedback-msg' делаем константу и записываем в переменную:

const STORAGE_KEY = 'feedback-msg';

// Настроили связи с формой и полем инпута:
const refs = {
  form: document.querySelector('.js-feedback-form'),
  textarea: document.querySelector('.js-feedback-form  textarea'),
};

// повесили слушатель событий на кнопку и поле ввода данных:
refs.form.addEventListener('submit', onFormSubmit);
// refs.textarea.addEventListener('input', onTextareaInput); // без тротела
refs.textarea.addEventListener('input', throttle(onTextareaInput, 500)); 

populateTextarea();

/*
 * - Останавливаем поведение по умолчанию, т.е. перезагрузку страницы
 * - Отправляем форму
 * - Убираем сообщение из хранилища
 * - Очищаем форму
 */
function onFormSubmit(evt) {
  evt.preventDefault(); // убираем перезагрузку страницы

  console.log('Отправляем форму');
  evt.currentTarget.reset(); // очищаем форму после отправки. Метод формы reset(), сбрасываем значение всех полей к
  // начальному значению.
  // localStorage.removeItem('feedback-msg'); // очищаем хранилице после отправки
  localStorage.removeItem(STORAGE_KEY); // заменяем предыдущую запись через константу
}

/*
 * - Получаем значение поля
 * - Сохраняем его в хранилище
 * - Можно добавить throttle
 */
// Не приводим значение в json формат через stringify так как вводимое значение в инпут уже является строкой
function onTextareaInput(evt) {
  // const message = evt.currentTarget.value; // если мы укажем currentTarget, то при применении тротела, при всплывании 
  // событий будет ошибка, поэтому вместе с тротел или дебанс необходимо использовать только целевое событие:
  const message = evt.target.value;

  // localStorage.setItem('feedback-msg', message);
  localStorage.setItem(STORAGE_KEY, message); // заменяем предыдущую запись через константу
}

/*
 * - Получаем значение из хранилища
 * - Если там что-то было, обновляем DOM
 */
// После перезагрузки страницы подставляем из хранилища в наш инпут текстовое значение, которое вводил пользователь(т.е.
// если пользователь не отправил форму, то значит хранилище не очистилось, а значит подставляем в инпут сохранившееся значение)
// Проблема в том, что если пользователь впервые на сайте и мы захотим ему вернуть значение из хранилище, то т.к.там пусто
// метод getItem вернет null. Чтобы этого не произошло, необходимо в функции дополнительно прописать проверку с условием:
// т.е. если наш savedMessage = true тогда с ним работаем в противном случае ничего с ним не делаем. 

function populateTextarea() {
  // const savedMessage = localStorage.getItem('feedback-msg');
  const savedMessage = localStorage.getItem(STORAGE_KEY); // заменяем предыдущую запись через константу

  if (savedMessage) {
    refs.textarea.value = savedMessage; // ок, если условие выполняется, тогда обновляем значение в нашем инпуте
  }
}

// Если более сложна форма с несколькими инпутами, к примеру имя пользователя и т.д., то необходимо каждому полю
// задать атрибут name и сохранять наши инпуты в массив объектов с ключами(свойствами) и их значениями.

// Домой
// сделать так чтобы сохраняло не только сообщение но и имя, и все в одном обьекте

// const formData = {};

// refs.form.addEventListener('input', e => {
//   // console.log(e.target.name);
//   // console.log(e.target.value);

//   formData[e.target.name] = e.target.value; // если такого ключа ещё не будет, то в нашем объекте formData он
// запишется, если будет, то перезапишется. Для того чтобы записать наш объект в хранилище, необходимо будет использовать
// JSON.stringify(formData), а для того чтобы потом читать его, необходимо будет достать и распарсить, как мы делали в
// предыдущем примере:
// const savedUserData = '{"name":"Mango","age":21}';
// console.log(JSON.parse(savedUserData));

//   console.log(formData);
// });

// Можно к этой задаче добавить ещё и чек бокс, чтобы задачка была чуть более комплексной.

// В целом для таких задач есть уже готовые библиотеки, но на данном этапе важно научиться записывать и читать данные формы
// из хранилища, самостоятельно.

// ___________________________________________________________________________________________________________________________

// Оригинал:

// import throttle from 'lodash.throttle';
// import '../css/common.css';
// import '../css/feedback-form.css';

// const STORAGE_KEY = 'feedback-msg';

// // Настроили связи с формой и полем инпута:
// const refs = {
//   form: document.querySelector('.js-feedback-form'),
//   textarea: document.querySelector('.js-feedback-form  textarea'),
// };

// // повесили слушатель событий на кнопку и поле ввода данных:
// refs.form.addEventListener('submit', onFormSubmit);
// refs.textarea.addEventListener('input', throttle(onTextareaInput, 200));

// populateTextarea();

/*
 * - Останавливаем поведение по умолчанию
 * - Убираем сообщение из хранилища
 * - Очищаем форму
 */
// function onFormSubmit(evt) {
//   evt.preventDefault();

//   console.log('Отправляем форму');
//   evt.currentTarget.reset();
//   localStorage.removeItem(STORAGE_KEY);
// }

/*
 * - Получаем значение поля
 * - Сохраняем его в хранилище
 * - Можно добавить throttle
 */
// function onTextareaInput(evt) {
//   const message = evt.target.value;

//   localStorage.setItem(STORAGE_KEY, message);
// }

/*
 * - Получаем значение из хранилища
 * - Если там что-то было, обновляем DOM
 */
// function populateTextarea() {
//   const savedMessage = localStorage.getItem(STORAGE_KEY);

//   if (savedMessage) {
//     refs.textarea.value = savedMessage;
//   }
// }

// Домой
// сделать так чтобы сохраняло не только сообщение но и имя, и все в одном обьекте

// const formData = {};

// refs.form.addEventListener('input', e => {
//   // console.log(e.target.name);
//   // console.log(e.target.value);

//   formData[e.target.name] = e.target.value;

//   console.log(formData);
// });



// Пример кода из домашки 8.3 где в форме 2 поля:

// v1 чужой:
// import throttle from 'lodash.throttle';

// const formEl = document.querySelector('.feedback-form');
// const emailFieldEl = document.querySelector('[name="email"]');
// const messageFieldEl = document.querySelector('[name="message"]');

// const STORAGE = 'feedback-form-state';
// let storageData = '';
// let formData = {};

// restoreFormData();
// formEl.addEventListener('input', throttle(saveFormData, 500));
// formEl.addEventListener('submit', submitForm);

// function saveFormData(e) {
//   formData[e.target.name] = e.target.value;
//   storageData = JSON.stringify(formData);
//   localStorage.setItem(STORAGE, storageData);
// }

// function restoreFormData() {
//   storageData = localStorage.getItem(STORAGE);
//   if (!storageData) {
//     return;
//   }
//   formData = JSON.parse(storageData);
//   for (const element in formData) {
//     formEl[element].value = formData[element];
//   }
//   }

// function submitForm(e) {
//   e.preventDefault();
//   if (!emailFieldEl.value || !messageFieldEl.value) {
//     alert('Необхідно заповнити всі поля форми');
//     return;
//   }
//   console.log(formData);
//   formEl.reset();
//   formData = {};
//   localStorage.removeItem(STORAGE);
// }


// v2 мой:

// import throttle from 'lodash.throttle';

// const STORAGE_KEY = 'feedback-form-state';

// const refs = {
//     formEl: document.querySelector('.feedback-form'),
//     emailEl: document.querySelector('.feedback-form [name="email"]'),
//     messageEl: document.querySelector('.feedback-form [name="message"]'),
// };

// // console.log(refs);

// // повесили слушатель событий на кнопку и поле ввода данных:
// refs.formEl.addEventListener('submit', onFormSubmit);
// refs.emailEl.addEventListener('input', throttle(onTextareaInput, 500));
// refs.messageEl.addEventListener('input', throttle(onTextareaInput, 500)); 

// populateTextarea();

// function onFormSubmit(evt) {
// evt.preventDefault(); // убираем перезагрузку страницы

// // добавим проверку, если одно из полей не заполнено, ругаемся:     
//   if (!refs.emailEl.value || !refs.messageEl.value) {
//     alert('Необхідно заповнити всі поля форми');
//     return;
//   }
//   const emailValue = refs.emailEl.value;
//   const messageValue = refs.messageEl.value;

//   console.log('Email:', emailValue);
//   console.log('Message:', messageValue);
  
//   evt.currentTarget.reset(); // очищаем форму после отправки. Метод формы reset(), сбрасываем значение всех полей.
//   localStorage.removeItem(STORAGE_KEY); // заменяем предыдущую запись через константу
  
// }

// /*
//  * - Получаем значение поля
//  * - Сохраняем его в хранилище
//  * - Можно добавить throttle
//  */
// // Приводим значение в json формат через stringify:
// function onTextareaInput(evt) {
// const state = {
//         email: refs.emailEl.value,
//         message: refs.messageEl.value,
//       };
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//     }

// /*
//  * - Получаем значение из хранилища
//  * - Если там что-то было, обновляем DOM
//  */

// function populateTextarea() {
//   const savedMessage = localStorage.getItem(STORAGE_KEY); // записываем в переменную текущее значение лок.хранилища

//   if (savedMessage) {
//     const { email, message } = JSON.parse(savedMessage); // разбираем сохраненное сообщение обратно в отдельные значения

//     refs.emailEl.value = email; // обновляем значение поля emailEl
//     refs.messageEl.value = message; // обновляем значение поля messageEl
//   }
// }
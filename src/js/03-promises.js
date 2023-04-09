import { Notify } from 'notiflix/build/notiflix-notify-aio';

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  const resultObject = { position, delay };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        // Fulfill
        resolve(resultObject);
      } else {
        // Reject
        reject(resultObject);
      }
    }, delay);
  });
}

const form = document.querySelector('.form');
form.addEventListener('submit', handlerSubmit);

form.delay.value = 500;
form.step.value = 300;
form.amount.value = 4;

function handlerSubmit(event) {
  event.preventDefault();

  let delay = Number(form.delay.value);
  let amount = Number(form.amount.value);
  let step = Number(form.step.value);

  for (let i = 1; i <= amount; i += 1) {
    createPromise(i, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
    delay += step;
  }
}

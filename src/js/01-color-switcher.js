function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

const startBtn = document.querySelector('[data-start]');
const stopBtn = document.querySelector('[data-stop]');
const body = document.querySelector('body');

startBtn.addEventListener('click', handleStartColorChanging);

let changeColorWithInterval = 0;

function handleStartColorChanging() {
  // console.log('Починаємо міняти колір');
  // body.style.backgroundColor = 'teal';
  changeColorWithInterval = setInterval(() => {
    body.style.backgroundColor = getRandomHexColor();
  }, 1000);
  startBtn.disabled = true;
}

stopBtn.addEventListener('click', handleStopColorChanging);

function handleStopColorChanging() {
  //   console.log('Закінчуємо міняти колір');
  clearInterval(changeColorWithInterval);
  body.style.backgroundColor = '';
  startBtn.disabled = false;
}

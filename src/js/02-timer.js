import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
// console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
// console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

const refs = {
  setDateInput: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  outputDays: document.querySelector('[data-days]'),
  outputHours: document.querySelector('[data-hours]'),
  outputMinutes: document.querySelector('[data-minutes]'),
  outputSeconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.disabled = true;
let selectedDate = 0;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    // console.log(selectedDates[0]);
    if (selectedDates[0] <= Date.now()) {
      Notify.failure('Please choose a date in the future', { timeout: 3000 });
      refs.startBtn.disabled = true;
    } else {
      refs.startBtn.disabled = false;
      selectedDate = selectedDates[0];
      //   console.log(`Вибрали дату: ${selectedDate}`);
    }
  },
};

flatpickr(refs.setDateInput, options);
refs.startBtn.addEventListener('click', handleTimerCounting);

function handleTimerCounting() {
  refs.startBtn.disabled = true;
  const timerCounting = setInterval(() => {
    const timeLeft = selectedDate - Date.now();
    // console.log(timeLeft);
    // console.log(convertMs(timeLeft));

    // refs.outputDays.textContent = addLeadingZero(convertMs(timeLeft).days);
    // refs.outputHours.textContent = addLeadingZero(convertMs(timeLeft).hours);
    // refs.outputMinutes.textContent = addLeadingZero(convertMs(timeLeft).minutes);
    // refs.outputSeconds.textContent = addLeadingZero(convertMs(timeLeft).seconds);

    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    refs.outputDays.textContent = addLeadingZero(days);
    refs.outputHours.textContent = addLeadingZero(hours);
    refs.outputMinutes.textContent = addLeadingZero(minutes);
    refs.outputSeconds.textContent = addLeadingZero(seconds);

    if (timeLeft < 1000) {
      clearInterval(timerCounting);
    }
  }, 1000);
}

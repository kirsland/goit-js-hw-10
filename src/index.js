import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
let searchQuery = '';

searchBox.addEventListener(
  'input',
  debounce(onSearchInSearchBox, DEBOUNCE_DELAY)
);

function onSearchInSearchBox(e) {
  searchQuery = searchBox.value.trim();
  console.log(searchQuery);

  if (!searchQuery) {
    clearHtmlFromSearchBox();
    return;
  }

  fetchCountries(searchQuery)
    .then(resultFromQuery => {
      if (resultFromQuery.length > 10) {
        clearHtmlFromSearchBox();
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (resultFromQuery.length > 1 && resultFromQuery.length <= 10) {
        clearHtmlFromSearchBox();
        renderCountriesList(resultFromQuery);
      }
      if (resultFromQuery.length === 1) {
        clearHtmlFromSearchBox();
        renderCountryCard(resultFromQuery);
      }
    })
    .catch(err => {
      if ((err.message = '404')) {
        clearHtmlFromSearchBox();
        Notify.failure('Oops, there is no country with that name');
      }
      console.log(err);
    });

  function renderCountriesList(countriesListSource) {
    const markup = countriesListSource
      .map(country => {
        return `
              <li>
              <p><img src="${country.flags.svg}" width="40" height="auto"> ${country.name.official}</p>
              </li>
          `;
      })
      .join('');

    countryList.innerHTML = markup;
  }

  // function renderCountryCard(countryCardSource) {
  //   const markup = countryCardSource
  //     .map(country => {
  //       return `
  //           <li>
  //           <p><img src="${country.flags.svg}" width="40" height="auto"> ${country.name.official}</p>
  //           <p>Capital: ${country.capital}</p>
  //           <p>Population: ${country.population}</p>
  //           <p>Languages: ${country.languages}</p>
  //           </li>
  //       `;
  //     })
  //     .join('');

  //   countryInfo.innerHTML = markup;
  // }

  function renderCountryCard(countryCardSource) {
    const markup = countryCardSource
      .map(({ name, capital, population, flags, languages }) => {
        return `
        <div>
          <img src="${flags.svg}" alt="flag" width="200" height="auto">
          <p class="country__name">${name.official}</p>
        </div>
        <ul class="country__info">
            <li> <b>Capital</b>: ${capital}</li>
            <li> <b>Population</b>: ${population}</li>
            <li> <b>Languages</b>: ${Object.values(languages).join(', ')}</li>
        </ul>`;
      })
      .join('');

    countryInfo.innerHTML = markup;
  }
}

function clearHtmlFromSearchBox() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

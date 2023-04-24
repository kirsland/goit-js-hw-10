import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
searchQuery = '';

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
      clearHtmlFromSearchBox();
      Notify.failure('Oops, there is no country with that name');
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

  //   const renderCountryCard = data =>
  //     data.reduce(
  //       (acc, { flags: { svg }, name, capital, population, languages }) => {
  //         console.log(languages);
  //         languages = Object.values(languages).join(', ');
  //         console.log(name);
  //         return (countryInfo.innerHTML =
  //           acc +
  //           ` <img src="${svg}" alt="${name}" width="320" height="auto">
  //             <p> ${name.official}</p>
  //             <p>Capital: <span> ${capital}</span></p>
  //             <p>Population: <span> ${population}</span></p>
  //             <p>Languages: <span> ${languages}</span></p>`);
  //       },
  //       ''
  //     );

  function renderCountryCard(countryCardSource) {
    const markup = countryCardSource
      .map(({ name, capital, population, flags, languages }) => {
        return `
        <div><img src="${
          flags.svg
        }" alt="flag" width="200" height="auto"><p class="country__name">${
          name.official
        }</p></div>
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

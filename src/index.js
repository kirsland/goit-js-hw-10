import './css/styles.css';
// import { fetchCountries } from "./js/fetchCountries.js"

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener('input', _.debounce(() => {
    fetchCountries(searchBox.value)
        .then((getCountries) => renderCountriesList(getCountries))
        .catch((error) => console.log(error));
}, DEBOUNCE_DELAY));


function fetchCountries(name) {
    return fetch(
        `https://restcountries.com/v3.1/name/${name}`
      ).then((response) => {
        if (!response.ok) {
          throw new Error(response.status);
        }
        return response.json();
      });
};

function renderCountriesList (countriesList) {
    const markup = countriesList.map((country) => {
               return `
            <li>
            <p><img src="${country.flags.svg}" width="80"> ${country.name.official}</p>
            </li>
        `;
    })
    .join("");
   
    countryInfo.innerHTML = markup;
}
    
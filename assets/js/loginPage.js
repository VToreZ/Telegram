const formCountry = document.querySelector('.form_default--country');
const formPhone = document.querySelector('.form_default--phone');
const countryItem = document.querySelector(".countryItem");
const countryItemArr = document.querySelectorAll(".countryItem");
const country_list = document.querySelector(".country_list");

formCountry.addEventListener("change", () => {
  if (formCountry.value) {
    let arr = document.querySelectorAll(".inputLabel");
    arr.forEach((elem) => {elem.style.visibility = "visible"});
  } else {
    let arr = document.querySelectorAll(".inputLabel");
    arr.forEach((elem) => {elem.style.visibility = "hidden"});
  }
}); // NOTE: Lable control

formCountry.addEventListener("focus", () => {
  country_list.style.visibility = "visible";
  country_list.style.opacity = "1";
});
formCountry.addEventListener("blur", () => {
  country_list.style.opacity = "0";
  country_list.style.visibility = "hidden";
}); // NOTE: Country List visibility;

country_list.addEventListener("mousedown", () => {
  formCountry.value = event.target.childNodes[1].innerHTML;
  formPhone.value = event.target.childNodes[2].innerHTML;
  let len = event.target.childNodes[2].innerHTML.length - 1;
  formPhone.pattern = `\\+[0-9]{${len}}[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`;
}); // NOTE: Country input value & Phone input value

countryItemArr.forEach((elem) => (elem.addEventListener("mouseover", () => {
  formCountry.value = "";
  formCountry.placeholder = event.target.childNodes[1].innerHTML;
}))); // NOTE: Country input placeholder

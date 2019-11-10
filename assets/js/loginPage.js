const formCountry = document.querySelector('.form_default--country');
const formPhone = document.querySelector('.form_default--phone');
const formSubmit = document.querySelector('.form_default--next');
const countryItem = document.querySelector(".countryItem");
const countryItemArr = document.querySelectorAll(".countryItem");
const country_list = document.querySelector(".country_list");
// const country_item = document.querySelector()
let len = 0;
let addingNum = "";
let lang = 0;

let phoneFormat = {
  ru: {
    parts: [3, 3, 2, 2],
    maxLen: 17,
    spaceIndex(j) {
      let result = this.parts[0];
      for (let i = 1; i <= j; i++) {
        result += this.parts[i] + 1;
      }
      return result;
    },
      // return this.parts.slice(0, j + 1).reduce((sum, current) =>  current + sum) + j;
  },
  afg: {
    parts: [3, 4, 3],
    maxLen: 16
  }
}

function checkPhoneKey(key, lang) {
  let isBackspace = () => key === "Backspace";
  // let isArrowLeft = () => key === "ArrowLeft";
  // let isArrowRight = () => key === "ArrowRight";
  if ((formPhone.value.length == addingNum.length + phoneFormat.ru.spaceIndex(0) || formPhone.value.length == addingNum.length + phoneFormat.ru.spaceIndex(1) || formPhone.value.length == addingNum.length + phoneFormat.ru.spaceIndex(2)) && !isBackspace()) {
    formPhone.value += " ";
  } else if ((formPhone.value.length == addingNum.length + 5 || formPhone.value.length == addingNum.length + 9 || formPhone.value.length == addingNum.length + 12) && isBackspace()) {
    formPhone.value = formPhone.value.substr(0, formPhone.value.length - 1);
  }

  if (formPhone.value.length > addingNum.length) {
    return (key >= '0' && key <= '9') || key == 'ArrowLeft' || key == 'ArrowRight' || key == 'Delete' || key == 'Backspace';
  } else if (formPhone.value.length == addingNum.length) {
    return (key >= '0' && key <= '9');
  } else if (formPhone.value.length < addingNum.length) {
    formPhone.value = addingNum;
    return (key >= '0' && key <= '9') || key == 'ArrowRight' || key == 'Delete';
  }

}

function checkAddingNum(key) {
  // console.log(key);
  return (key >= '0' && key <= '9') || key == 'ArrowRight' || key == 'Delete';
};


formCountry.addEventListener("input", () => {
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
  if (country_list.value) {
    formPhone.focus();
  };

  // formPhone.focus();
}); // NOTE: Country List visibility + focusing at the Number form;

country_list.addEventListener("mousedown", () => {
  formCountry.value = event.target.childNodes[1].innerHTML;
  formPhone.value = event.target.childNodes[2].innerHTML + " ";

  let arr = document.querySelectorAll(".inputLabel");
  arr.forEach((elem) => {elem.style.visibility = "visible"});
  len = event.target.childNodes[2].innerHTML.length - 1;
  addingNum = event.target.childNodes[2].innerHTML + " ";
  lang = phoneFormat.ru;
  // formPhone.pattern = `\\+[0-9]{${len}}\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`;
  event.preventDefault();
  formPhone.focus();

}); // NOTE: Country input value & Phone input value

countryItemArr.forEach((elem) => (elem.addEventListener("mouseover", () => {
  formCountry.value = "";
  formCountry.placeholder = event.target.childNodes[1].innerHTML;
}))); // NOTE: Country input placeholder


// formPhone.onkeyup = (event) => {
//   return checkPhoneKey(event.key);
// };

formPhone.addEventListener("keydown", (event) => {
  if (checkPhoneKey(event.key, "ru")) {
    return true;
  }
  event.preventDefault();
});

formPhone.addEventListener("input", () => {
  if (formPhone.value.match(`\\+[0-9]{${len}}\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`)) {
    formSubmit.style.visibility = "visible";
    formSubmit.style.opacity = 1;
  } else {
    formSubmit.style.opacity = 0;
  }
  event.preventDefault();
});

formPhone.addEventListener("submit", () => {
  if (!formPhone.value.match(`\\+[0-9]{${len}}\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`)) {
    formPhone.style.border = "1px solid red";
    console.log("asdsad");
  }
});

formSubmit.addEventListener("transitionend", () => {
  if (!formPhone.value.match(`\\+[0-9]{${len}}\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`)) {
    formSubmit.style.visibility = "hidden";
  }
});

formSubmit.addEventListener("mousedown", () => {
  if (formPhone.value.match(`\\+[0-9]{${len}}\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`)) {
    document.querySelectorAll(".codePage").forEach((current) => {
      current.style.visibility = "visible";
    });
  } else {
    formPhone.style.border = "1px solid red"
    console.log("asdsad");
  }
});

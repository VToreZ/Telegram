const formCountry = document.querySelector('.form_default--country');
const formPhone = document.querySelector('.form_default--phone');
const formSubmit = document.querySelector('.form_default--next');
const countryItem = document.querySelector(".countryItem");
const countryItemArr = document.querySelectorAll(".countryItem");
const country_list = document.querySelector(".country_list");
const inputLabels = document.querySelectorAll(".signPage .inputLabel");

/////////////////////////////////////////////////////// CODE PAGE

const codeLabel = document.querySelector(".codeLabel");
/////////////////////////////////////////////////////// PASS PAGE

const passPage = document.querySelector(".passPage");
const passInput = document.querySelector(".form_default--pass");
const passShowButton = document.querySelector(".input_show_button");
const passLabel = document.querySelector(".passLabel");
const passNext = document.querySelector(".passNext");
/////////////////////////////////////////////////////// NAME PAGE

const namePage = document.querySelector(".namePage");
const nameInput = document.querySelector(".form_default--name");
const lastNameInput = document.querySelector(".form_default--lastName");
const photoButton = document.querySelector(".namePage .login_page_wrap_logo");
const addPhotoModule = document.querySelector(".addPhotoModule");
/////////////////////////////////////////////////////// MAIN PAGE

const mainPage = document.querySelector(".mainPage");

/////////////////////////////////////////////////////// API

function s(e) {
        return MtpApiManager.invokeApi("auth.sendCode", {
            flags: 0,
            phone_number: e,
            api_id: Config.App.id,
            api_hash: Config.App.hash,
            lang_code: navigator.language || "en"
        }, {
            dcID: 2,
            createNetworker: !0
        })
    }

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

function checkCode(key) { //CODE
  if (key === "Enter") {

    if (!codeValid()) {
      console.log("ccc");
      codeInput.style.boxShadow = "0 0 0 1px red";
      codeInput.style.borderColor = "red";
      codeLabel.style.opacity = 1;
    }
    return false;

  }
  return (key >= '0' && key <= '9') || key == 'ArrowLeft' || key == 'ArrowRight' || key == 'Delete' || key == 'Backspace';
}

function codeValid(code) {
  return (code == 12312);
}

function phoneNumValid(number) {
  return (number.match(`\\+[0-9]{${len}}\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}`));
}

formCountry.onkeydown = (event) => {
  event.preventDefault();
}

formCountry.addEventListener("input", () => {
  if (formCountry.value) {
    let arr = document.querySelectorAll(".inputLabel");
    arr.forEach((elem) => {elem.style.opacity = 1});
  } else {
    let arr = document.querySelectorAll(".inputLabel");
    arr.forEach((elem) => {elem.style.opacity = 0});
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

  inputLabels.forEach((elem) => {elem.style.opacity = "1"});
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
  if (event.key === "Enter") {
    if (phoneNumValid(formPhone.value)) {
      let phoneNum = formPhone.value;
      // s(phoneNum);
      // auth.sendCode();
      document.querySelector(".codePage").style.visibility = "visible";
      document.querySelector(".headerNum").innerText = phoneNum;
      document.querySelector(".signPage").style.visibility = "hidden";
      formSubmit.style.visibility = "hidden";
      event.preventDefault();
      codeInput.focus();
    }
    // else {
    //   formPhone.style.border = "1px solid red"
    //   formPhone.style.boxShadow = "0 0 0 1px red";
    //   console.log("asdsad");
    // }
  }
  event.preventDefault();
});

formPhone.addEventListener("input", () => {
  if (phoneNumValid(formPhone.value)) {
    formSubmit.style.visibility = "visible";
    formSubmit.style.opacity = 1;
  } else {
    formSubmit.style.opacity = 0;
  }
  event.preventDefault();
});

formPhone.addEventListener("submit", () => {
  if (phoneNumValid(formPhone.value)) {
    formPhone.style.border = "1px solid red";
    console.log("asdsad");
  }
});

formSubmit.addEventListener("transitionend", () => {
  if (!phoneNumValid(formPhone.value)) {
    formSubmit.style.visibility = "hidden";
  }
});
const codeInput = document.querySelector(".form_default--code");

formSubmit.addEventListener("mousedown", () => {
  if (phoneNumValid(formPhone.value)) {
    let phoneNum = formPhone.value;
    document.querySelector(".codePage").style.visibility = "visible";
    document.querySelector(".headerNum").innerText = phoneNum;
    document.querySelector(".signPage").style.visibility = "hidden";
    formSubmit.style.visibility = "hidden";
    event.preventDefault();
    codeInput.focus();
  } else {
    formPhone.style.border = "1px solid red";
    console.log("asdsad");
  }
});  //PAGE 2

// let codeValid = false;

codeInput.addEventListener("keydown", (event) => {
  if (checkCode(event.key)) {
    return true;
  }
  event.preventDefault();
})

//
codeInput.addEventListener("submit", (event) => {
  // event.preventDefault();
  if (codeValid(codeInput.value)) {
    //NEXT PAGE
  } else {
    console.log("ccc");
    codeInput.style.boxShadow = "0 0 0 1px red";
    codeInput.style.borderColor = "red";

    //border: 1px solid $textActiveColor
    //box-shadow: 0 0 0 1px $textActiveColor
  }
  return false;
});
//
codeInput.addEventListener("input", (event) => {
  codeInput.style.boxShadow = "0 0 0 1px #4ea4f6";
  codeInput.style.borderColor = "#4ea4f6";
  codeLabel.style.opacity = 0;
  if (codeInput.value.length == 5) {
    if (codeValid(codeInput.value)) {
      document.querySelector(".codePage").style.visibility = "hidden";
      document.querySelector('.passPage').style.visibility = "visible";
      passNext.style.visibility = "visible";
      passNext.style.opacity = "1";
      passInput.focus();
    } else {
      codeInput.style.boxShadow = "0 0 0 1px red";
      codeInput.style.borderColor = "red";
      codeLabel.style.opacity = 1;
    };

}});

/////////////////////////////////////////////////////// PASS PAGE

let passValid = (pass) => pass === "123123";

passShowButton.onclick = () => {
  console.log("xxx");
  if (passInput.type === "password") {
    passInput.type = "text";
    passShowButton.src = "./Design/Icons/eye2_svg.svg";
    passInput.focus();
  } else {
    passInput.type = "password";
    passShowButton.src = "./Design/Icons/eye1_svg.svg";
    passInput.focus();
  }
}

passInput.oninput = () => {
  if (passInput.value) {
    document.querySelector(".passLabel").style.opacity = "1";
  } else {
    document.querySelector(".passLabel").style.opacity = "0";
  }

  if (passLabel.innerHTML == "Invalid Password") {
    passInput.style.boxShadow = "0 0 0 1px #4ea4f6";
    passInput.style.borderColor = "#4ea4f6";
    passLabel.innerHTML = "Password";
    passLabel.style.color = "#4ea4f6";
  }
}

passInput.onkeydown = (event) => {
  if (event.key === "Enter") {
    if (passValid(passInput.value)) {
      passPage.style.visibility = "hidden";
      passNext.style.visibility = "hidden";
      namePage.style.visibility = "visible";
      event.preventDefault();
      nameInput.focus();
    } else {
      passInput.style.boxShadow = "0 0 0 1px red";
      passInput.style.borderColor = "red";
      passLabel.style.color = "red";
      passLabel.innerHTML = "Invalid Password";
    }
  }
}

passNext.onmousedown = (event) => {
  if (passValid(passInput.value)) {
    passPage.style.visibility = "hidden";
    passNext.style.visibility = "hidden";
    namePage.style.visibility = "visible";
    event.preventDefault();
    nameInput.focus();

  } else {
    passInput.style.boxShadow = "0 0 0 1px red";
    passInput.style.borderColor = "red";
    passLabel.style.color = "red";
    passLabel.innerHTML = "Invalid Password";
  }
}

/////////////////////////////////////// PAGE NAME

nameInput.oninput = () => {
  if (nameInput.value) {
    document.querySelector(".nameLabel").style.opacity = "1";
  } else {
    document.querySelector(".nameLabel").style.opacity = "0";
  }
};

lastNameInput.oninput = () => {
  if (lastNameInput.value) {
    document.querySelector(".lastNameLabel").style.opacity = "1";
  } else {
    document.querySelector(".lastNameLabel").style.opacity = "0";
  }
};

nameInput.onkeydown = (event) => {
  if (event.key === "Enter" && nameInput.value) {
    lastNameInput.focus();
    // document.querySelector(".form_default--start").style.opacity = 1;
  }
};

lastNameInput.onkeydown = (event) => {
  if (event.key === "Enter" && nameInput.value) {
    // NEXT
  }
};

lastNameInput.onfocus = (event) => {
  document.querySelector(".form_default--start").style.opacity = 1;
};

photoButton.onmousedown = (event) => {
  addPhotoModule.style.visibility = "visible";
  addPhotoModule.style.opacity = "1";
};

document.querySelector(".addPhotoClose").onmousedown = (event) => {
  addPhotoModule.style.opacity = "0";
  setTimeout(() => {addPhotoModule.style.visibility = "hidden"}, 200);
}

document.querySelector(".addPhotoCheckButton").onmousedown = (event) => {
  addPhotoModule.style.opacity = "0";
  setTimeout(() => {addPhotoModule.style.visibility = "hidden"}, 200);
}

document.querySelector(".form_default--start").onclick = (event) => {
  namePage.style.opacity = 0;
  setTimeout(() => {
    namePage.style.visibility = "hidden";
    document.querySelector(".form_default--start").style.visibility = "hidden";
}, 200);
  mainPage.style.visibility = "visible";
}

lastNameInput.onkeydown = (event) => {
  if (event.key == "Enter") {
    namePage.style.opacity = 0;
    setTimeout(() => {
      namePage.style.visibility = "hidden";
      document.querySelector(".form_default--start").style.visibility = "hidden";
  }, 200);
    mainPage.style.visibility = "visible";
    event.preventDefault();
  }
}

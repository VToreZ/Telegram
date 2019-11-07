selector = document.querySelector('.form_default--country')

selector.addEventListener("change", () => {
  if (selector.value) {
    let arr = document.querySelectorAll(".inputLabel");
    arr.forEach((elem) => {elem.style.visibility = "visible"});
  } else {
    let arr = document.querySelectorAll(".inputLabel");
    arr.forEach((elem) => {elem.style.visibility = "hidden"});
  }
}); // NOTE: Lable control

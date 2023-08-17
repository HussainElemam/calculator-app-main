// Store the main themes in variables to use them later
const themeOne = `
--main-background: hsl(222, 26%, 31%);
--toggle-background: hsl(223, 31%, 20%);
--keypad-background: hsl(223, 31%, 20%);
--screen-background: hsl(224, 36%, 15%);
--key-background: hsl(30, 25%, 89%);
--key-shadow: hsl(28, 16%, 65%);
--key-background-2: hsl(225, 21%, 49%);
--key-shadow-2: hsl(224, 28%, 35%);
--equal-key-background: hsl(6, 63%, 50%);
--equal-key-shadow: hsl(6, 70%, 34%);
--header-font-color: hsl(0, 0%, 100%);
--keys-font-color: hsl(221, 14%, 31%);
--keys-font-color-2: hsl(0, 0%, 100%);
--result-font-color: hsl(0, 0%, 100%);
--equal-key-font-color: hsl(0, 0%, 100%);
`;
const themeTwo = `
--main-background: hsl(0, 0%, 90%);
--toggle-background: hsl(0, 5%, 81%);
--keypad-background: hsl(0, 5%, 81%);
--screen-background: hsl(0, 0%, 93%);
--key-background: hsl(45, 7%, 89%);
--key-shadow: hsl(35, 11%, 61%);
--key-background-2: hsl(185, 42%, 37%);
--key-shadow-2: hsl(185, 58%, 25%);
--equal-key-background: hsl(25, 98%, 40%);
--equal-key-shadow: hsl(25, 99%, 27%);
--header-font-color: hsl(60, 10%, 19%);
--keys-font-color: hsl(60, 10%, 19%);
--keys-font-color-2: hsl(0, 0%, 100%);
--result-font-color: hsl(60, 10%, 19%);
--equal-key-font-color: hsl(0, 0%, 100%);
`;
const themeThree = `
--main-background: hsl(268, 75%, 9%);
--toggle-background: hsl(268, 71%, 12%);
--keypad-background: hsl(268, 71%, 12%);
--screen-background: hsl(268, 71%, 12%);
--key-background-2: hsl(281, 89%, 26%);
--key-shadow-2: hsl(285, 91%, 52%);
--key-background: hsl(268, 47%, 21%);
--key-shadow: hsl(290, 70%, 36%);
--equal-key-background: hsl(176, 100%, 44%);
--equal-key-shadow: hsl(177, 92%, 70%);
--header-font-color: hsl(52, 100%, 62%);
--keys-font-color: hsl(52, 100%, 62%);
--keys-font-color-2: hsl(0, 0%, 100%);
--result-font-color: hsl(52, 100%, 62%);
--equal-key-font-color: hsl(198, 20%, 13%);
`;
// #region Get elements
let root = document.documentElement;
const toggle = document.querySelector(".button-inner");
const states = document.querySelectorAll(".place-holder");
const result = document.querySelector(".result");
const numberkeys = document.querySelectorAll(
  ".key:not(.special):not(.equal):not(.operation)"
);
const operationKeys = document.querySelectorAll(".operation");
const deleteKey = document.querySelector(".del");
const resetKey = document.querySelector(".reset");
const equalKey = document.querySelector(".equal");
let currentTheme = localStorage.theme;
// #endregion

// #region check the localStorage for theme if no theme apply themeOne
if (currentTheme) {
  if (currentTheme === "themeOne") {
    root.style = themeOne;
    toggle.style.transform = `translateX(0)`;
  } else if (currentTheme === "themeTwo") {
    root.style = themeTwo;
    toggle.style.transform = `translateX(17px)`;
  } else {
    root.style = themeThree;
    toggle.style.transform = `translateX(34px)`;
  }
} else {
  currentTheme = "themeOne";
}
// #endregion

// #region Change the theme on toggle and store the theme in the local storage
states[0].addEventListener("click", () => {
  toggle.style.transform = `translateX(0)`;
  root.style = themeOne;
  localStorage.theme = "themeOne";
});
states[1].addEventListener("click", () => {
  toggle.style.transform = `translateX(17px)`;
  root.style = themeTwo;
  localStorage.theme = "themeTwo";
});
states[2].addEventListener("click", () => {
  toggle.style.transform = `translateX(34px)`;
  root.style = themeThree;
  localStorage.theme = "themeThree";
});
// #endregion

// #region calculator class to handle everything
class Calculator {
  constructor() {
    this.firstOperand = "";
    this.secondOperand = "";
    this.operation = "";
    this.stage = 1;
    this.result = "";
  }
  appendNumber(number) {
    this.result = "";
    if (this.stage === 1) {
      if (number === "." && this.firstOperand.includes(".")) return;
      if (number === "." && this.firstOperand === "") {
        this.firstOperand = "0.";
      } else {
        this.firstOperand += number;
      }
    } else {
      if (number === "." && this.secondOperand.includes(".")) return;
      if (number === "." && this.firstOperand === "") {
        this.secondOperand = "0.";
      } else {
        this.secondOperand += number;
      }
    }
  }
  appendOperation(operation) {
    if (this.result !== "") {
      this.firstOperand = this.result;
      this.operation = operation;
      this.stage = 2;
      return;
    }
    if (this.firstOperand === "") return;
    if (this.secondOperand === "") {
      this.operation = operation;
    } else {
      this.firstOperand = this.getResult().toString();
      this.secondOperand = "";
      this.operation = operation;
    }
    this.stage = 2;
  }
  getResult() {
    if (isNaN(this.firstOperand) || isNaN(this.secondOperand)) return "";
    switch (this.operation) {
      case "+":
        this.result = +this.firstOperand + +this.secondOperand;
        break;
      case "-":
        this.result =
          parseFloat(this.firstOperand) - parseFloat(this.secondOperand);
        break;
      case "x":
        this.result = +this.firstOperand * +this.secondOperand;
        break;
      case "/":
        this.result =
          parseFloat(this.firstOperand) / parseFloat(this.secondOperand);
        break;
      default:
        this.result = "";
    }
    return this.result;
  }
  display() {
    let first = "";
    if (this.firstOperand !== "") {
      if (this.firstOperand.includes(".")) {
        first = `${parseInt(
          this.firstOperand.split(".")[0]
        ).toLocaleString()}.${this.firstOperand.split(".")[1]}`;
      } else {
        first = parseInt(this.firstOperand).toLocaleString();
      }
    }
    // if (!this.firstOperand.includes(".")) {
    //   first = parseInt(this.firstOperand).toLocaleString();
    // } else if (this.firstOperand !== "") {
    //   first = `${parseInt(this.firstOperand.split(".")[0]).toLocaleString()}.${
    //     this.firstOperand.split(".")[1]
    //   }`;
    // } else {
    //   first = "0";
    // }
    let second = "";
    if (this.secondOperand.includes(".")) {
      second = `${parseInt(this.secondOperand.split(".")[0]).toLocaleString(
        "en"
      )}.${this.secondOperand.split(".")[1]}`;
    } else if (this.secondOperand !== "") {
      second = parseInt(this.secondOperand).toLocaleString();
    }
    result.innerHTML = `${first} ${this.operation} ${second}`;
  }
  delete() {
    if (this.result !== "") {
      this.firstOperand = this.result;
      this.result = "";
    }
    if (this.stage === 1) {
      this.firstOperand = this.firstOperand.toString().slice(0, -1);
    } else {
      if (this.secondOperand === "") {
        this.operation = "";
        this.stage = 1;
      } else {
        this.secondOperand = this.secondOperand.toString().slice(0, -1);
      }
    }
  }
  reset() {
    this.firstOperand = "";
    this.secondOperand = "";
    this.operation = "";
    result.innerHTML = "";
    this.stage = 1;
  }
}
// #endregion
// initialize the calculator
const calculator = new Calculator();

numberkeys.forEach((key) => {
  key.addEventListener("click", (e) => {
    calculator.appendNumber(e.target.innerHTML);
    calculator.display();
  });
});
operationKeys.forEach((key) => {
  key.addEventListener("click", (e) => {
    calculator.appendOperation(e.target.innerHTML);
    calculator.display();
  });
});
resetKey.onclick = () => {
  calculator.reset();
};
equalKey.addEventListener("click", () => {
  if (calculator.secondOperand !== "") {
    let tempResult = calculator.getResult();
    calculator.reset();
    result.innerHTML = tempResult;
  }
});
deleteKey.addEventListener("click", () => {
  calculator.delete();
  calculator.display();
});

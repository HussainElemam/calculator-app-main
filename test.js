let myString = "1234.0";
console.log(
  `${parseFloat(myString.split(".")[0]).toLocaleString()}.${
    myString.split(".")[1] ?? ""
  }`
);

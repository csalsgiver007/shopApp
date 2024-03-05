import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://playground-78b42-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(shoppingListInDB, inputValue);

  clearInputFieldEl();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let containerDivEl = document.getElementsByClassName("container")[0];
  let removeDivEl = document.getElementsByClassName("remove")[0];

  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    containerDivEl.setAttribute("style", "display: none");
    removeDivEl.setAttribute("style", "display: flex");

    removeDivEl.innerHTML = `<p>Are you sure you want to remove ${itemValue}?</p> <button id="yes">Yes</button> <button id="no">No</button>`;
    let yesButtonEl = document.getElementById("yes");

    yesButtonEl.addEventListener("click", function () {
      let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
      remove(exactLocationOfItemInDB);
      containerDivEl.setAttribute("style", "display: flex");
      removeDivEl.setAttribute("style", "display: none");
    });
    let noButtonEl = document.getElementById("no");
    noButtonEl.addEventListener("click", function () {
      containerDivEl.setAttribute("style", "display: flex");
      removeDivEl.setAttribute("style", "display: none");
    });

    //
  });

  shoppingListEl.append(newEl);
}

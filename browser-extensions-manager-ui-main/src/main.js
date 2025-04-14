import data from "../data.json" with { type: "json" };

function toggleColorSchema(button) {
  const currentScheme = window.localStorage.getItem("color-scheme");
  const newScheme = currentScheme === "dark" ? "light" : "dark";
  window.localStorage.setItem("color-scheme", newScheme);
  document.getElementsByTagName("html")[0].setAttribute("data-color-scheme", newScheme);
  const ColorSchemaIcon = button.getElementsByTagName("img")[0];
  ColorSchemaIcon.src = newScheme === "dark" ? "../assets/images/icon-sun.svg" : "../assets/images/icon-moon.svg";
}

window.toggleColorSchema = toggleColorSchema;

const ColorSchemaButton = document.getElementById("color-schema-toggle");
const ColorSchemaIcon = ColorSchemaButton.getElementsByTagName("img")[0];

const colorSchema = window.localStorage.getItem("color-scheme") || (window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light');

window.localStorage.setItem("color-scheme", colorSchema);
document.getElementsByTagName("html")[0].setAttribute("data-color-scheme", colorSchema);
ColorSchemaIcon.setAttribute("src", colorSchema === "dark" ? "../assets/images/icon-sun.svg" : "../assets/images/icon-moon.svg");

const searchParams = new URLSearchParams(location.search);
const sortFilter = searchParams.get("sort");
if (!sortFilter) {
  location.assign("?sort=all");
}

function generateCard(cardData) {
  const CardIcon = document.createElement("img")
  CardIcon.src = cardData.logo;
  CardIcon.alt = cardData.name;

  const CardTitle = document.createElement("h2")
  CardTitle.innerHTML = cardData.name;

  const CardDesciption = document.createElement("p")
  CardDesciption.innerHTML = cardData.description;

  const CardHeaderContainer = document.createElement("div")
  CardHeaderContainer.appendChild(CardTitle)
  CardHeaderContainer.appendChild(CardDesciption)

  const CardHeader = document.createElement("header")
  CardHeader.appendChild(CardIcon);
  CardHeader.appendChild(CardHeaderContainer);

  const CardActiveButton = document.createElement("button")
  CardActiveButton.classList.add(["button-reset"])
  CardActiveButton.value = cardData.isActive;
  CardActiveButton.innerHTML = "Remove"

  const CardSwitch = document.createElement("input")
  CardSwitch.type = "checkbox";
  CardSwitch.checked = cardData.isActive;

  const CardFooter = document.createElement("footer")
  CardFooter.appendChild(CardActiveButton);
  CardFooter.appendChild(CardSwitch);

  const Card = document.createElement("article")
  Card.classList.add("extension-card");
  Card.setAttribute("data-active", cardData.isActive);
  Card.appendChild(CardHeader);
  Card.appendChild(CardFooter);
  return Card;
}

function generateCards(data) {
  const filteredData = [];
  const cards = [];

  if (sortFilter === "active") {
    filteredData.push(...data.filter(data => data.isActive));
  } else if (sortFilter === "inactive") {
    filteredData.push(...data.filter(data => !data.isActive));
  } else if (sortFilter === "all") {
    filteredData.push(...data);
  }
  
  for (const cardData of filteredData) {
    const card = generateCard(cardData);
    cards.push(card);
  }

  return cards;
}

const cards = generateCards(data);
const extentionsContainer = document.getElementById("extensions-container");
extentionsContainer.append(...cards);

const extentionSortButtons = document.getElementById("extensions-sort");

for (const button of extentionSortButtons.children) {
  button.addEventListener("click", () => {
    location.assign(`?sort=${button.value}`);
  });

  if (sortFilter === button.value) {
    button.setAttribute("data-active", "true");
  }
}
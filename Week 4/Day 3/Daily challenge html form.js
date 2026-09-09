const form = document.getElementById("user-form");
const result = document.getElementById("result");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    lastName: document.getElementById("lastname").value.trim(),
  };

  const jsonString = JSON.stringify(data);
  const paragraph = document.createElement("p");
  paragraph.textContent = jsonString;
  result.innerHTML = "";
  result.appendChild(paragraph);
});

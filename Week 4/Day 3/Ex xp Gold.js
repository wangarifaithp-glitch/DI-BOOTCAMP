if (typeof window !== "undefined" && typeof document !== "undefined") {
	const params = new URLSearchParams(window.location.search);
	const name = params.get("name");
	const lastname = params.get("lastname");
	const resultSection = document.querySelector("#result");

	if (name && lastname) {
		resultSection.textContent = `Name: ${name} ${lastname}`;
	} else {
		resultSection.textContent = "No name was submitted.";
	}
}

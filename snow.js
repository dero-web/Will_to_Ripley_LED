const snowContainer = document.querySelector(".snow");
const flakesCount = 50;

for (let i = 0; i < flakesCount; i++) {
	const flake = document.createElement("div");
	flake.classList.add("flake");

	// Zufällige Größe zwischen 10px und px
	const size = 10 + Math.random() * 10;
	flake.style.width = `${size}px`;
	flake.style.height = `${size}px`;

	// Zufällige horizontale Startposition
	flake.style.left = `${Math.random() * 100}%`;

	// Zufällige Animation-Dauer (langsam)
	flake.style.animationDuration = `${5 + Math.random() * 10}s`;

	// Zufällige Opazität
	flake.style.opacity = `${0.1 + Math.random() * 0.2}`;

	// Zufälliger Blur (1px bis 4px)
	const blur = 1 + Math.random() * 3;
	flake.style.filter = `blur(${blur}px)`;

	// Zufälliger Startversatz
	flake.style.animationDelay = `${Math.random() * 40}s`;

	snowContainer.appendChild(flake);
}

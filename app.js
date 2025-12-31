class MessageApp {
	constructor() {
		this.form = document.getElementById("message-form");
		this.input = document.getElementById("message");
		this.errorBox = document.getElementById("error-box");
		this.spinner = document.querySelector(".spinner");

		this.setupEventListeners();
	}

	setupEventListeners() {
		this.input.addEventListener("input", () => this.validateInput());
		this.form.addEventListener("submit", (e) => this.handleSubmit(e));
	}

	validateInput() {
		this.input.value = this.input.value.toUpperCase();
		const text = this.input.value;

		// Fehler zu Beginn zurücksetzen
		this.showError("");

		// Wenn Text leer ist, keine weitere Validierung
		if (!text) return true;

		// Zeichenprüfung
		if (!/^[A-Z ]{0,25}$/.test(text)) {
			this.showError("Nur A-Z & Leerzeichen (keine Umlaute), max. 25 Zeichen!");
			return false;
		}

		return true;
	}

	showError(message) {
		this.errorBox.textContent = message;
	}

	setLoading(isLoading) {
		this.spinner.classList.toggle("hidden", !isLoading);
		this.form.querySelector("button").disabled = isLoading;
	}

	async handleSubmit(event) {
		event.preventDefault();

		if (!this.validateInput()) return;

		const msg = this.input.value.trim();
		if (!msg) return;

		this.setLoading(true);

		try {
			const res = await fetch(CONFIG.API_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message: msg }),
			});

			if (!res.ok) throw new Error("Serverfehler");

			const data = await res.json();
			this.showError(data.message);

			if (data.success) {
				this.input.value = "";
			}
		} catch {
			this.showError("Fehler beim Senden!");
		} finally {
			this.setLoading(false);
		}
	}
}

// App initialisieren
new MessageApp();

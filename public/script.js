// Espera a que todo el contenido del HTML esté listo
document.addEventListener("DOMContentLoaded", () => {

    // Busca el formulario en la página
    const voteForm = document.getElementById("vote-form");

    // Busca el mensaje de "gracias"
    const thankYouMessage = document.getElementById("thank-you-message");

    // Si no encontramos el formulario (ej. si el usuario ya votó), no hacemos nada
    if (!voteForm) {
        return;
    }

    // Añadimos un 'escuchador' de clics a todo el formulario
    voteForm.addEventListener("click", async (event) => {

        // Nos aseguramos de que se hizo clic en un BOTÓN
        if (event.target.tagName !== "BUTTON") {
            return;
        }

        // 1. Prevenimos que el formulario se envíe de la forma tradicional
        event.preventDefault();

        // 2. Obtenemos los datos del botón en el que se hizo clic
        const candidateName = event.target.value;
        const formAction = voteForm.action; // La URL (/vote)
        const formMethod = voteForm.method; // El método (POST)

        try {
            // 3. Enviamos los datos al servidor usando fetch
            const response = await fetch(formAction, {
                method: formMethod,
                headers: {
                    // Le decimos al servidor que estamos enviando JSON
                    "Content-Type": "application/json",
                },
                // Convertimos nuestro voto a un string JSON
                body: JSON.stringify({ candidate: candidateName }),
            });

            // 4. Si el servidor responde "OK" (ej. 200)
            if (response.ok) {
                // Ocultamos el formulario
                voteForm.style.display = "none";

                // Mostramos el mensaje de agradecimiento
                thankYouMessage.style.display = "block";
            } else {
                // Si algo salió mal en el servidor
                alert("Error al enviar el voto. Inténtalo de nuevo.");
            }
        } catch (error) {
            // Si hay un error de red (ej. sin conexión)
            console.error("Error de red:", error);
            alert("Error de conexión. No se pudo enviar el voto.");
        }
    });
});
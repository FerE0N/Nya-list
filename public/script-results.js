document.addEventListener("DOMContentLoaded", () => {
    const progressBars = document.querySelectorAll(".progress-bar-fill");

    // Animar las barras de progreso
    progressBars.forEach(bar => {
        const percentage = bar.dataset.percentage;
        if (percentage) {
            // Usamos setTimeout para que la animación se dispare DESPUÉS de que el DOM esté renderizado
            // Esto asegura que la transición CSS tenga un punto de partida (width: 0%)
            setTimeout(() => {
                bar.style.width = percentage + "%";
            }, 100);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {

    // Função para inicializar um carrossel específico
    function initializeCarousel(containerSelector, interval) {
        const container = document.querySelector(containerSelector);
        if (!container) return; // Se o container não existir na página, não faz nada

        const slides = container.querySelectorAll('.slide');
        const prevButton = container.querySelector('.prev');
        const nextButton = container.querySelector('.next');
        if (slides.length <= 1) { // Não inicia se tiver 1 slide ou menos
            if (prevButton) prevButton.style.display = 'none'; // Esconde setas se não precisar
            if (nextButton) nextButton.style.display = 'none';
            return;
        }

        let currentSlide = 0;
        let slideIntervalId = null; // Para controlar o intervalo

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
            currentSlide = index;
        }

        function nextSlide() {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            let prevIndex = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }

        function startAutoSlide() {
            // Limpa qualquer intervalo anterior para evitar duplicação
            stopAutoSlide();
            slideIntervalId = setInterval(nextSlide, interval);
        }

        function stopAutoSlide() {
            clearInterval(slideIntervalId);
        }

        // Event listeners para as setas
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                nextSlide();
                startAutoSlide(); // Reinicia o timer ao clicar manualmente
            });
        }
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                prevSlide();
                startAutoSlide(); // Reinicia o timer ao clicar manualmente
            });
        }

        // Event listeners para pausar no hover
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);

        // Inicia o carrossel
        showSlide(0); // Garante que o primeiro slide esteja visível
        startAutoSlide(); // Inicia a troca automática
    }

    // Inicializa os carrosséis
    initializeCarousel('.graduation-slider', 5000); // Formatura a cada 5s
    initializeCarousel('.professional-slider', 4000); // Profissional a cada 4s

});
document.addEventListener('DOMContentLoaded', function() {

    // 1. Rolagem Suave para links (melhorado para funcionar com o botão "Voltar ao Topo")
    const allLinks = document.querySelectorAll('a[href^="#"]');

    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Verifica se o link é para o topo da página atual ou outra página
            if (targetId === '#' || targetId === '#inicio') {
                 window.scrollTo({
                     top: 0,
                     behavior: 'smooth'
                 });
            } else {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // 2. Interatividade dos FAQs
    const faqQuestions = document.querySelectorAll('.faq-pergunta');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const wasActive = question.classList.contains('active');

            // Fecha todos os outros FAQs
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('open');
                     q.nextElementSibling.style.maxHeight = null; // Recolhe o item
                }
            });

            // Abre ou fecha o FAQ clicado
            if (!wasActive) {
                question.classList.add('active');
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + "px"; // Define a altura máxima para a animação
            } else {
                 question.classList.remove('active');
                 answer.classList.remove('open');
                 answer.style.maxHeight = null; // Recolhe o item
            }
        });
    });

     // Ajuste para garantir que a altura do FAQ seja recalculada se a janela for redimensionada
    window.addEventListener('resize', () => {
        faqQuestions.forEach(question => {
            if (question.classList.contains('active')) {
                const answer = question.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });


    // 3. Animações de Scroll
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-right, .slide-in-left');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });

    // 4. Botão Voltar ao Topo
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) { // Verifica se o botão existe na página
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
         // Ação de clique já tratada no item 1 (Rolagem Suave)
    }

    // 5. Menu Ativo que acompanha a rolagem (Scroll Spy)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (sections.length > 0 && navLinks.length > 0) { // Executa só se houver seções e links
         const sectionObserver = new IntersectionObserver((entries, observer) => {
            let currentActiveFound = false;
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    navLinks.forEach(link => {
                        link.classList.remove('active-link');
                        if (link.getAttribute('href').substring(1) === entry.target.id) {
                            link.classList.add('active-link');
                            currentActiveFound = true;
                        }
                    });
                }
            });
             // Fallback se nenhuma seção estiver 50% visível (ex: topo ou fim da página)
            if (!currentActiveFound) {
                 // Remove todos os ativos se não achar um principal
                // navLinks.forEach(link => link.classList.remove('active-link'));
                 // Ou poderia tentar marcar o mais próximo, mas pode ser complexo
            }

        }, {
            threshold: 0.5, // A seção precisa estar 50% visível
            rootMargin: '-50px 0px -50% 0px' // Ajusta a "área de detecção" para ativar antes
        });

        sections.forEach(section => {
             // Só observa seções que têm ID e não são o Hero inicial (para evitar ativar "Sobre Mim" no topo)
            if (section.id && section.id !== 'inicio') {
                sectionObserver.observe(section);
            }
        });

         // Highlight inicial para o link "Sobre Mim" se a página carregar no topo
        if (window.scrollY < 200) {
             const homeLink = document.querySelector('.nav-menu a[href="#sobre"]'); // Ajuste se o primeiro link não for #sobre
            if (homeLink) {
                // homeLink.classList.add('active-link'); // Decide se quer marcar um por padrão
            }
        }
    }


    // --- NOVA VALIDAÇÃO DO FORMULÁRIO ---
    const form = document.getElementById('contact-form');

    if (form) { // Executa só se o formulário existir na página
        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const telefoneInput = document.getElementById('telefone');
        const mensagemInput = document.getElementById('mensagem');

        const nomeError = document.getElementById('nome-error');
        const emailError = document.getElementById('email-error');
        const telefoneError = document.getElementById('telefone-error');
        const mensagemError = document.getElementById('mensagem-error');

        // Função para mostrar erro
        function showError(inputElement, errorElement, message) {
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('visible');
            }
            if (inputElement) {
                inputElement.classList.add('error');
            }
        }

        // Função para limpar erro
        function clearError(inputElement, errorElement) {
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('visible');
            }
             if (inputElement) {
                inputElement.classList.remove('error');
             }
        }

        // Função para validar email
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex simples para formato de email
            return re.test(String(email).toLowerCase());
        }

        // Função para validar telefone (opcional - permite vários formatos BR)
        function validatePhone(phone) {
             // Regex que aceita (XX) XXXX-XXXX, (XX) XXXXX-XXXX, XX XXXX XXXX, XX XXXXX XXXX, etc.
             const re = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})-?(\d{4}))$/;
            return phone === '' || re.test(phone); // Válido se vazio ou se corresponder ao regex
        }


        form.addEventListener('submit', function(event) {
            let isValid = true;

            // Limpa erros anteriores
            clearError(nomeInput, nomeError);
            clearError(emailInput, emailError);
            clearError(telefoneInput, telefoneError);
            clearError(mensagemInput, mensagemError);

            // Valida Nome (apenas verifica se não está vazio, pois já tem 'required')
            if (nomeInput && nomeInput.value.trim() === '') {
                 // Embora 'required' pegue isso, podemos adicionar uma mensagem mais clara
                // showError(nomeInput, nomeError, 'Por favor, informe seu nome.');
                // isValid = false;
                 // Deixando o required HTML atuar por padrão
            }

            // Valida Email
            if (emailInput && !validateEmail(emailInput.value)) {
                showError(emailInput, emailError, 'Por favor, insira um endereço de e-mail válido.');
                isValid = false;
            }

            // Valida Telefone (se preenchido)
            if (telefoneInput && telefoneInput.value.trim() !== '' && !validatePhone(telefoneInput.value)) {
                 showError(telefoneInput, telefoneError, 'Formato de telefone inválido. Use (XX) XXXXX-XXXX ou similar.');
                 isValid = false;
            }

            // Valida Mensagem (apenas verifica se não está vazio)
             if (mensagemInput && mensagemInput.value.trim() === '') {
                 // Deixando o required HTML atuar por padrão
                 // showError(mensagemInput, mensagemError, 'Por favor, escreva sua mensagem.');
                 // isValid = false;
             }

            // Impede o envio do formulário se houver erros
            if (!isValid) {
                event.preventDefault();
            }
            // Se isValid for true, o formulário será enviado normalmente para o Formsubmit
        });

         // Opcional: Limpar erro ao digitar
         [nomeInput, emailInput, telefoneInput, mensagemInput].forEach((input) => {
             if (input) {
                 input.addEventListener('input', () => {
                     clearError(input, document.getElementById(`${input.id}-error`));
                 });
             }
         });
    }

});
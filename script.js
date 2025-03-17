const apiKey = '204f26e69e034b7ea2bf87a86e1a90fa'; // chave de API RAWG
async function getGameImage(gameName) {
    const url = `https://api.rawg.io/api/games?search=${encodeURI(gameName)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0 && data.results[0].background_image) {
            return data.results[0].background_image;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Erro ao buscar imagem de jogo:', error);
        return null;
    }
}
async function getNewsImages(count) {
    const url = `https://api.rawg.io/api/games?key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.results
            .filter(game => game.background_image)
            .slice(0, count)
            .map(game => game.background_image);
    } catch (error) {
        console.error('Erro ao buscar imagens de notícias:', error);
        return Array(count).fill('https://via.placeholder.com/500x300');
    }
}
async function getAvatarImage(userName) {
    const url = `https://api.rawg.io/api/games?search=${encodeURI(userName)}&key=${apiKey}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0 && data.results[0].background_image) {
            return data.results[0].background_image;
        } else {
            return 'https://via.placeholder.com/80';
        }
    } catch (error) {
        console.error('Erro ao buscar imagem de avatar:', error);
        return 'https://via.placeholder.com/80';
    }
}

// Script principal, executado quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
    const gameCards = document.querySelectorAll('.games-grid .game-card');
    const gameNames = Array.from(gameCards).map(gameCard => {
        return gameCard.querySelector('.game-info h3').textContent;
    });
    const gameImagePromises = gameNames.map(gameName => getGameImage(gameName));
    const imageUrls = await Promise.all(gameImagePromises);
    gameCards.forEach((gameCard, index) => {
        const img = gameCard.querySelector('img');
        if (imageUrls[index]) {
            img.src = imageUrls[index];
        }
    });

    const newsCards = document.querySelectorAll('.news-section .news-card');
    const numNewsImagesNeeded = newsCards.length;
    const newsImageUrls = await getNewsImages(numNewsImagesNeeded);
    newsCards.forEach((newsCard, index) => {
        const img = newsCard.querySelector('.news-image img');
        if (newsImageUrls[index]) {
            img.src = newsImageUrls[index];
            img.onerror = () => { img.src = 'https://via.placeholder.com/500x300'; };
        }
    });

    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialNames = Array.from(testimonialCards).map(card => {
        return card.querySelector('.testimonial-content h4').textContent;
    });
    const avatarImagePromises = testimonialNames.map(name => getAvatarImage(name));
    const avatarImageUrls = await Promise.all(avatarImagePromises);
    testimonialCards.forEach((card, index) => {
        const img = card.querySelector('.testimonial-avatar img');
        if (avatarImageUrls[index]) {
            img.src = avatarImageUrls[index];
            img.onerror = () => { img.src = 'https://via.placeholder.com/80'; }; // Fallback
        }
    });
});

// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu(); // Menu mobile
    initCountdown(); // Contador regressivo
    initScrollAnimations(); // Animações ao scroll
    initNewsletterForm(); // Validação do formulário de newsletter
});

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuBtn.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Fechar menu ao clicar em links
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(event) {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu')) {
                navMenu.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            }
        });
    }
}
function initCountdown() {
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (daysElement && hoursElement && minutesElement && secondsElement) {
        // Definir a data final da promoção (1 semana a partir de agora)
        const currentDate = new Date();
        const endDate = new Date();
        endDate.setDate(currentDate.getDate() + 7);
        
        // Atualizar o contador a cada segundo
        function updateCountdown() {
            const currentTime = new Date();
            const diff = endDate - currentTime;
            
            if (diff <= 0) {
                // Promoção encerrada
                daysElement.textContent = '00';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                return;
            }
            
            // Calcular dias, horas, minutos e segundos
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            // Atualizar elementos do DOM
            daysElement.textContent = days < 10 ? '0' + days : days;
            hoursElement.textContent = hours < 10 ? '0' + hours : hours;
            minutesElement.textContent = minutes < 10 ? '0' + minutes : minutes;
            secondsElement.textContent = seconds < 10 ? '0' + seconds : seconds;
        }
        
        // Iniciar o contador
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
}
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.game-card, .news-card, .testimonial-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(element);
    });
}
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const nameInput = newsletterForm.querySelector('input[type="text"]');
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (!nameInput.value.trim()) {
                showFormError(nameInput, 'Por favor, informe seu nome.');
                return;
            }
            if (!emailInput.value.trim()) {
                showFormError(emailInput, 'Por favor, informe seu email.');
                return;
            }
            if (!isValidEmail(emailInput.value)) {
                showFormError(emailInput, 'Por favor, informe um email válido.');
                return;
            }
            
            // Simulação de envio bem-sucedido
            const formData = {
                name: nameInput.value,
                email: emailInput.value
            };

            console.log('Dados enviados:', formData);
            showFormSuccess(newsletterForm, 'Inscrição realizada com sucesso! Obrigado por se juntar a nós.');
            newsletterForm.reset();
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormError(inputElement, message) {
        removeFormError(inputElement);

        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error';
        errorMessage.textContent = message;
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '0.8rem';
        errorMessage.style.marginTop = '0.3rem';
        
        inputElement.classList.add('error');
        inputElement.style.borderColor = 'red';
        inputElement.parentNode.appendChild(errorMessage);

        inputElement.focus();
    }

    function removeFormError(inputElement) {
        inputElement.classList.remove('error');
        inputElement.style.borderColor = '';
        
        const errorMessage = inputElement.parentNode.querySelector('.form-error');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    function showFormSuccess(form, message) {
        const existingMessage = document.querySelector('.form-success');
        if (existingMessage) {
            existingMessage.remove();
        }

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.textContent = message;
        successMessage.style.color = '#4CAF50';
        successMessage.style.padding = '1rem';
        successMessage.style.marginTop = '1rem';
        successMessage.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        successMessage.style.borderRadius = '5px';
        successMessage.style.textAlign = 'center';
        
        form.parentNode.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }
}

// Rolagem suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});
// Efeito de parallax para o hero
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    }
});
// Animação de entrada para os elementos do hero
window.addEventListener('load', function() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }
});

// Pré-estilização do hero content para animação
document.querySelector('.hero-content').style.opacity = '0';
document.querySelector('.hero-content').style.transform = 'translateY(30px)';
document.querySelector('.hero-content').style.transition = 'opacity 1s ease, transform 1s ease';
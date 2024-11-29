const muteIcon = document.querySelector('#mute-icon');
const soundIcon = document.querySelector('#sound-icon');
var audio = document.querySelector('#audioElement');
audio.volume = 0.03;

let isMuted = false;

soundIcon.addEventListener('click', () => {
    audio.volume = isMuted ? 0.03 : 0;
    isMuted = !isMuted;
    const icono = document.getElementById("mute-icon");
    const icon = document.getElementById("sound-icon");
    icon.style.display = 'none';
    icono.style.display = 'block';
});

muteIcon.addEventListener('click', () => {
    audio.volume = isMuted ? 0.03 : 0;
    isMuted = !isMuted;
    const icono = document.getElementById("mute-icon");
    const icon = document.getElementById("sound-icon");
    icon.style.display = 'block';
    icono.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const words = document.querySelectorAll('.word');
    const correctMessage = document.getElementById('correct-message');
    const errorMessage = document.getElementById('error-message');
    const completedMessage = document.getElementById('completed');
    const modalGameOver = document.getElementById('gameOverModal');

    // Sonidos
    const audioCorrecto = new Audio('../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../audio/gameover.mp3');

    let selectedCard = null;
    let selectedWord = null;
    let attempts = 0;
    const maxAttempts = 3;
    let matchedPairs = 0;
    const totalPairs = cards.length / 2;
    let lives = 3; // Número inicial de vidas

    // Selector de corazones
    const hearts = document.querySelectorAll('.heart');

    cards.forEach(card => {
        card.addEventListener('click', selectCard);
    });

    words.forEach(word => {
        word.addEventListener('click', selectWord);
    });

    function selectCard() {
        if (selectedCard === null || this !== selectedCard) {
            if (selectedCard !== null) {
                selectedCard.classList.remove('selected');
                selectedCard.style.border = '';
                selectedCard.style.transform = '';
            }
            selectedCard = this;
            this.classList.add('selected');
            this.style.border = '3px solid green';
            this.style.transform = 'scale(1.1)';
        }
    }

    function selectWord() {
        if (selectedCard) {
            selectedWord = this;
            const word = this.dataset.word;
            const cardWord = selectedCard.dataset.word;
            if (word === cardWord) {
                correctMatch();
            } else {
                incorrectMatch();
            }
        }
    }

    function correctMatch() {
        selectedCard.classList.add('destroyed');
        selectedWord.classList.add('destroyed');
        selectedCard.removeEventListener('click', selectCard);
        selectedCard = null;
        selectedWord = null;
        matchedPairs++;
        correctMessage.style.display = 'block';
        playAudio(audioCorrecto);
        setTimeout(function () {
            correctMessage.style.display = 'none';
        }, 1000);

        if (matchedPairs === totalPairs) {
            completedMessage.style.display = 'block';

        }

        // Verificar si todas las cartas están deshabilitadas
        const allDisabled = Array.from(cards).every(card => card.classList.contains('destroyed'));

        if (allDisabled) {
            // Todas las cartas están deshabilitadas, mostrar la flecha
            const arrowIcon = document.getElementById('arrow-icon');
            const modal = document.getElementById("modal");
            modal.style.display="flex";
            modal.classList.add("show");
            arrowIcon.style.display = 'inline-block'; // Cambia 'inline-block' según el estilo de la flecha en tu CSS
            arrowIcon.addEventListener('click', function() {
                window.location.href = '../final.html';
            });
            setTimeout(() => {
                modal.classList.remove("show");
                modal.classList.add("hide");
                setTimeout(() => {
                    modal.style.display = "none";
                    modal.classList.remove("hide");
                }, 500);
            }, 1200);
        }
    }

    function incorrectMatch() {
        selectedCard.classList.add('incorrect');
        selectedWord.classList.add('incorrect');
        selectedCard.classList.remove('selected');
        selectedCard.style.border = '';
        selectedCard.style.transform = '';
        selectedCard = null;
        selectedWord = null;
        attempts++;
        errorMessage.style.display = 'block';
        playAudio(audioIncorrecto);
        setTimeout(function () {
            errorMessage.style.display = 'none';
        }, 1000);

        // Reducir el número de vidas y animar la desaparición de un corazón
        lives--;
        if (lives >= 0) {
            animateHeartDisappearance(hearts[lives]); // Animar la desaparición del corazón correspondiente
        }

        if (attempts === maxAttempts) {
            setTimeout(function () {
                mostrarGameOver();
            }, 500);
        }
    }

    function mostrarGameOver() {
        modalGameOver.style.display = 'block';

        const reintentarBtn = document.getElementById('reintentarBtn');
        const salirBtn = document.getElementById('salirBtn');

        reintentarBtn.addEventListener('click', function () {
            window.location.reload();
        });

        salirBtn.addEventListener('click', function () {
            modalGameOver.style.display = 'none';
            window.location.href = '../index.html'
        });

        audioGameOver.volume = 0.5;
        audioGameOver.play();
    }

    function animateHeartDisappearance(heart) {
        heart.style.transition = 'opacity 0.5s ease-out'; // Agrega una transición para el efecto de desvanecimiento
        heart.style.opacity = '0'; // Reduce gradualmente la opacidad del corazón hasta que desaparezca
        setTimeout(() => {
            heart.style.display = 'none'; // Oculta el corazón después de que termine la animación
        }, 500); // La duración de la transición es de 0.5 segundos
    }

    var closeSVG = document.querySelector(".close-svg");

    // Función para manejar el clic en el SVG de cierre
    function handleCloseClick() {
        // Redirigir a la página de inicio
        window.location.href = "https://www.ejemplo.com";
    }


    function playAudio(audio) {
        if (audio.paused) {
            audio.currentTime = 0;
            audio.play();
        } else {
            audio.pause();
            audio.currentTime = 0;
            audio.play();
        }
    }
});
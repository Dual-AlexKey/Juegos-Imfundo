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
    const buttons = document.querySelectorAll('.boton');
    const containers = document.querySelectorAll('.contenedor');
    const flecha = document.querySelector('#arrow-icon');
    const modal = document.getElementById("modal");
    const maxAttempts = 3;
    let attempts = 0;
    let selectedButton = null;
    let correctMatches = 0;

    
    // Sonidos
    const audioCorrecto = new Audio('../../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../../audio/gameover.mp3');

    buttons.forEach(button => {
        button.addEventListener('click', selectWord);
    });

    containers.forEach(container => {
        container.addEventListener('click', placeWord);
    });
    function playSound(sound) {
        sound.pause(); // Detener el sonido actual antes de reproducirlo nuevamente
        sound.currentTime = 0; // Reiniciar el tiempo de reproducción al principio
        sound.play(); // Reproducir el sonido
    }
    function selectWord() {
        if (selectedButton) {
            selectedButton.classList.remove('selected'); // Elimina la selección del botón anterior
        }

        selectedButton = this;
        this.classList.add('selected'); // Aplica la selección al botón actual
    }

    function placeWord() {
        if (!selectedButton) return;

        const buttonWord = selectedButton.dataset.word;
        const containerWord = this.dataset.word;

        if (buttonWord === containerWord) {
            const buttonClone = selectedButton.cloneNode(true);
            this.innerHTML = ''; // Elimina cualquier contenido existente en el contenedor
            this.appendChild(buttonClone); // Agrega el clon del botón al contenedor
            playSound(audioCorrecto); // Reproduce el sonido antes de realizar las operaciones
            this.classList.add('correct');
            selectedButton.classList.add('destroyed');
            correctMatches++;
            checkCompletion();
        } else {
            playSound(audioIncorrecto); // Reproduce el sonido antes de realizar las operaciones
            attempts++;
            updateLives();
        }

        selectedButton.classList.remove('selected');
        selectedButton = null;
    }


    function updateLives() {
        const hearts = document.querySelectorAll('.heart');
        if (attempts <= maxAttempts) {
            playSound(audioIncorrecto); // Reproduce el sonido antes de realizar las operaciones
            animateHeartDisappearance(hearts[attempts - 1]);
        }

        if (attempts >= maxAttempts) {
            playSound(audioGameOver); // Reproduce el sonido antes de realizar las operaciones
            showGameOver();
        }
    }

    function checkCompletion() {
        if (correctMatches === containers.length) {
            flecha.style.display = 'block'; // Muestra la flecha al completar todo el juego
            modal.style.display="flex";
            modal.classList.add("show");            
            flecha.addEventListener('click', () => {
                window.location.href = '../Juego3/game3.html';
                let currentModule = parseInt(localStorage.getItem('currentModule')) || 1;
                localStorage.setItem('currentModule', currentModule + 1);
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

    function showGameOver() {
        const gameOverModal = document.querySelector('#gameOverModal');
        gameOverModal.style.display = 'block';
        document.querySelector('#reintentarBtn').addEventListener('click', () => location.reload());
        document.querySelector('#salirBtn').addEventListener('click', () => window.location.href = '../../index.html');
    }

    function animateHeartDisappearance(heart) {
        heart.style.transition = 'opacity 0.5s ease-out'; // Agrega una transición para el efecto de desvanecimiento
        heart.style.opacity = '0'; // Reduce gradualmente la opacidad del corazón hasta que desaparezca
        setTimeout(() => {
            heart.style.display = 'none'; // Oculta el corazón después de que termine la animación
        }, 500); // La duración de la transición es de 0.5 segundos
    }
});

// Obtener el modal y el botón para abrirlo
const modal = document.getElementById('miModal');
const iconoAyuda = document.getElementById('abrirModal');

// Obtener el botón para cerrar el modal
const btnCerrarModal = document.getElementsByClassName('cerrar')[0];

// Función para abrir el modal al hacer clic en el icono de ayuda
iconoAyuda.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Función para cerrar el modal al hacer clic en el botón de cerrar
btnCerrarModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Función para cerrar el modal si se hace clic fuera de él
window.addEventListener('click', (evento) => {
  if (evento.target === modal) {
    modal.style.display = 'none';
  }
});

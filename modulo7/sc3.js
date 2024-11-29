document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.boton');
    const maxAttempts = 3;
    let attempts = 0;
    let correctMatches = 0;
    var modal = document.getElementById('miModal');
    const modal2 = document.getElementById("modal");
    const flecha = document.querySelector('#arrow-icon');
        
    // Sonidos
    const audioCorrecto = new Audio('../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../audio/gameover.mp3');

    buttons.forEach(button => {
        button.addEventListener('click', checkSelection);
    });

    function playSound(sound) {
        sound.pause(); // Detener el sonido actual antes de reproducirlo nuevamente
        sound.currentTime = 0; // Reiniciar el tiempo de reproducción al principio
        sound.play(); // Reproducir el sonido
    }

    function checkSelection() {
        const isCorrect = this.classList.contains('correct'); // Verifica si el botón tiene la clase 'correct'
        const parentParagraph = this.parentElement; // Obtiene el contenedor padre (el <p> que contiene los botones)

        if (isCorrect) {
            playSound(audioCorrecto);
            this.classList.remove('correct'); // Remueve la clase 'correct'
            this.classList.add('selected'); // Agrega la clase 'selected'
            correctMatches++;

            // Desactiva todos los botones de la misma fila y aplica escala de grises
            Array.from(parentParagraph.children).forEach(button => {
                button.disabled = true; // Desactiva el botón
                if (!button.classList.contains('selected')) {
                    button.style.filter = 'grayscale(100%)'; // Aplica la escala de grises
                }
            });

            checkCompletion();
        } else {
            playSound(audioIncorrecto);
            attempts++;
            updateLives();
        }
    }

    function updateLives() {
        const hearts = document.querySelectorAll('.heart');
        if (attempts <= maxAttempts) {
            playSound(audioIncorrecto);
            animateHeartDisappearance(hearts[attempts - 1]);
        }

        if (attempts >= maxAttempts) {
            playSound(audioGameOver);
            showGameOver();
        }
    }

    function checkCompletion() {
        if (correctMatches === buttons.length / 5) { // Supongamos que hay 5 botones por fila
            modal2.style.display = "flex";
            modal2.classList.add("show");
            flecha.style.display = 'block'; // Muestra la flecha al completar todo el juego
            flecha.addEventListener('click', () => {
                window.location.href = '../final.html'; // Redirige a final.html al hacer clic en la flecha
            });
            setTimeout(() => {
                modal2.classList.remove("show");
                modal2.classList.add("hide");
                setTimeout(() => {
                    modal2.style.display = "none";
                    modal2.classList.remove("hide");
                }, 500); 
            }, 1200);
        }
    }

    function showGameOver() {
        const gameOverModal = document.querySelector('#gameOverModal');
        gameOverModal.style.display = 'block';
        document.querySelector('#reintentarBtn').addEventListener('click', () => location.reload());
        document.querySelector('#salirBtn').addEventListener('click', () => window.location.href = '../index.html');
    }

    function animateHeartDisappearance(heart) {
        heart.style.transition = 'opacity 0.5s ease-out';
        heart.style.opacity = '0';
        setTimeout(() => {
            heart.style.display = 'none';
        }, 500);
    }
});

// Modal de ayuda
const modal = document.getElementById('miModal');
const iconoAyuda = document.getElementById('abrirModal');
const btnCerrarModal = document.getElementsByClassName('cerrar')[0];

iconoAyuda.addEventListener('click', () => {
    modal.style.display = 'block';
});

btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (evento) => {
    if (evento.target === modal) {
        modal.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const centerBox = document.getElementById('center');
    const muteIcon = document.querySelector('#mute-icon');
    const soundIcon = document.querySelector('#sound-icon');
    const audio = document.querySelector('#audioElement');
    const correctMessage = document.getElementById('correct-message');
    const errorMessage = document.getElementById('error-message');
    const completedMessage = document.getElementById('completed');
    const modalGameOver = document.getElementById('gameOverModal');
    const hearts = document.querySelectorAll('.heart');
    const reintentarBtn = document.getElementById('reintentarBtn');
    const salirBtn = document.getElementById('salirBtn');

    const audioCorrecto = new Audio('../../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../../audio/gameover.mp3');
    audio.volume = 0.03;
    audioGameOver.volume = 0.5;

    function playSound(sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.play();
    }

    soundIcon.addEventListener('click', toggleSound);
    muteIcon.addEventListener('click', toggleSound);

    reintentarBtn.addEventListener('click', () => window.location.reload());
    salirBtn.addEventListener('click', () => window.location.href = '../../index.html');

    function toggleSound() {
        audio.volume = isMuted ? 0.03 : 0;
        isMuted = !isMuted;
        soundIcon.style.display = isMuted ? 'none' : 'block';
        muteIcon.style.display = isMuted ? 'block' : 'none';
    }

    const positions = {
        top: { left: '160px', top: '10px' },
        bottom: { left: '160px', top: '310px' },
        left: { left: '10px', top: '160px' },
        right: { left: '310px', top: '160px' }
    };

    let currentPos = { left: '160px', top: '160px' };
    let lives = 3;
    let gameOver = false;
    let attempts = 0;
    let isMuted = false;
    const maxAttempts = 3;

    const directions = {
        ArrowUp: 'top',
        ArrowDown: 'bottom',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };

    const characteristics = ["Amoroso", "Presumido", "Tímido", "Comprensivo"];
    const targetPositions = ["top", "bottom", "left", "right"];
    let remainingCharacteristics = [...characteristics];

    function setRandomCharacteristic() {
        if (remainingCharacteristics.length === 0) {
            gameOver = true;
            return;
        }

        const randomIndex = Math.floor(Math.random() * remainingCharacteristics.length);
        const characteristic = remainingCharacteristics[randomIndex];
        centerBox.textContent = characteristic;
        centerBox.setAttribute('data-target', targetPositions[characteristics.indexOf(characteristic)]);
    }

    function checkWin(targetPosition) {
        const target = centerBox.getAttribute('data-target');
        if (target === targetPosition) {
            remainingCharacteristics = remainingCharacteristics.filter(char => char !== centerBox.textContent);
            if (remainingCharacteristics.length > 0) {
                setRandomCharacteristic();
                resetPosition();
                playSound(audioCorrecto);
            } else {
                centerBox.textContent = "O";
                gameOver = true;
                showModal();  // Mostrar modal cuando gane
            }
        } else {
            attempts++;
            lives--;
            if (lives >= 0) {
                animateHeartDisappearance(hearts[lives]);
                setRandomCharacteristic();
                resetPosition();
                playSound(audioIncorrecto);
            }

            if (attempts === maxAttempts) {
                setTimeout(mostrarGameOver, 500);
                gameOver = true;
            }
        }
    }

    function mostrarGameOver() {
        modalGameOver.style.display = 'block';
        playSound(audioGameOver);
    }

    function animateHeartDisappearance(heart) {
        heart.style.transition = 'opacity 0.5s ease-out';
        heart.style.opacity = '0';
        setTimeout(() => {
            heart.style.display = 'none';
        }, 500);
    }

    function showModal() {
        const arrowIcon = document.getElementById('arrow-icon');
        const modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = "flex";
            modal.classList.add("show");
            arrowIcon.style.display = 'inline-block';
            arrowIcon.addEventListener('click', function() {
                window.location.href = '../Juego2/game2.html';
            });

            setTimeout(() => {
                modal.classList.remove("show");
                modal.classList.add("hide");
                setTimeout(() => {
                    modal.style.display = "none";
                    modal.classList.remove("hide");
                }, 500);
            }, 1000); // Mostrar durante 10 segundos
        }
    }

    function resetPosition() {
        currentPos = { left: '160px', top: '160px' };
        centerBox.style.left = currentPos.left;
        centerBox.style.top = currentPos.top;
    }

    function handleClick(targetPosition) {
        if (!gameOver) {
            checkWin(targetPosition); // Verificar si la imagen corresponde al objetivo sin mover el cuadro
        }
    }

    // Añadir eventos de clic a las imágenes
    document.getElementById('top').addEventListener('click', () => handleClick('top'));
    document.getElementById('bottom').addEventListener('click', () => handleClick('bottom'));
    document.getElementById('left').addEventListener('click', () => handleClick('left'));
    document.getElementById('right').addEventListener('click', () => handleClick('right'));

    // Control con teclas del teclado
    document.addEventListener('keydown', (e) => {
        if (!gameOver && directions[e.key]) {
            const targetPosition = directions[e.key]; // Obtener la posición objetivo basada en la tecla presionada
            currentPos = positions[targetPosition]; // Mover la caja central a la posición correspondiente
            centerBox.style.left = currentPos.left;
            centerBox.style.top = currentPos.top;
            checkWin(targetPosition); // Verificar si la posición es la correcta
        }
    });

    setRandomCharacteristic();
});

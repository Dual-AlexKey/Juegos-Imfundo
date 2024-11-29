document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const characteristics = document.querySelectorAll('.word[data-characteristic]');
    const correctMessage = document.getElementById('correct-message');
    const errorMessage = document.getElementById('error-message');
    const hearts = document.querySelectorAll('.heart');
    const modalGameOver = document.getElementById('gameOverModal');
    const audioCorrecto = new Audio('../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../audio/gameover.mp3');
    const arrowIcon = document.getElementById('arrow-icon');
    const completedMessage = document.getElementById('completed');
    const charactersModal = document.getElementById('charactersModal');
    
    const closeBtns = document.querySelectorAll('.close');
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
    

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            btn.parentElement.parentElement.style.display = 'none';
        });
    });


    arrowIcon.style.display = 'none'; // Asegúrate de que la flecha esté oculta inicialmente

    let selectedCard = null;
    let selectedCharacteristic = null;
    let matchedPairs = 0;
    const totalPairs = characteristics.length;
    let lives = 3; // Número inicial de vidas

    cards.forEach(card => {
        card.addEventListener('click', selectCard);
    });

    characteristics.forEach(characteristic => {
        characteristic.addEventListener('click', selectCharacteristic);
    });

    function selectCharacteristic() {
        if (selectedCharacteristic) {
            selectedCharacteristic.classList.remove('selected');
        }
        selectedCharacteristic = this;
        selectedCharacteristic.classList.add('selected');

        if (selectedCard) {
            const character = selectedCard.dataset.character;
            const characteristicsList = selectedCard.dataset.characteristics.split(',');
            const characteristic = selectedCharacteristic.dataset.characteristic;

            if (characteristicsList.includes(characteristic)) {
                correctMatch();
            } else {
                incorrectMatch();
            }
        }
    }

    function selectCard() {
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
        selectedCard = this;
        selectedCard.classList.add('selected');

        if (selectedCharacteristic) {
            const character = selectedCard.dataset.character;
            const characteristicsList = selectedCard.dataset.characteristics.split(',');
            const characteristic = selectedCharacteristic.dataset.characteristic;

            if (characteristicsList.includes(characteristic)) {
                correctMatch();
            } else {
                incorrectMatch();
            }
        }
    }

    function correctMatch() {
        correctMessage.style.display = 'block';
        playAudio(audioCorrecto);
        setTimeout(function () {
            correctMessage.style.display = 'none';
        }, 1000);

        selectedCharacteristic.classList.add('correct');
        animateCharacteristicDisappearance(selectedCharacteristic);

        // Obtener la carta seleccionada y su cuadro de características
        const selectedCharacterCard = selectedCard.querySelector('.characteristics');
        const modal = document.getElementById("modal");
        // Agregar la característica al cuadro de características asociadas
        const characteristicText = selectedCharacteristic.textContent;
        const characteristicElement = document.createElement('div');
        characteristicElement.textContent = characteristicText;
        selectedCharacterCard.appendChild(characteristicElement);

        selectedCard.classList.remove('selected');
        selectedCharacteristic.classList.remove('selected');
        selectedCharacteristic = null;
        selectedCard = null;

        matchedPairs++;
        if (matchedPairs === totalPairs) {
            completedMessage.style.display = 'block';
            modal.style.display = "flex";
            modal.classList.add("show");

            // Mostrar la flecha para avanzar al siguiente juego
            arrowIcon.style.display = 'inline-block';
            arrowIcon.addEventListener('click', function () {
                window.location.href = 'game2.html';
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
        errorMessage.style.display = 'block';
        playAudio(audioIncorrecto);
        setTimeout(function () {
            errorMessage.style.display = 'none';
        }, 1000);

        // Reducir el número de vidas
        lives--;
        if (lives >= 0) {
            animateHeartDisappearance(hearts[lives]);
        }

        // Verificar si el juego ha terminado
        if (lives <= 0) { // Cambiar de === a <= para mayor robustez
            mostrarGameOver();
            return; // Detener la ejecución de la función
        }

        // Quitar selección de la carta y característica incorrectas
        if (selectedCard) {
            selectedCard.classList.remove('selected');
        }
        if (selectedCharacteristic) {
            selectedCharacteristic.classList.remove('selected');
        }

        selectedCard = null;
        selectedCharacteristic = null;
    }
    function animateCharacteristicDisappearance(characteristic) {
        characteristic.style.transition = 'opacity 0.5s ease-out';
        characteristic.style.opacity = '0';
        setTimeout(() => {
            characteristic.style.display = 'none';
        }, 500);
    }

    function mostrarGameOver() {
        modalGameOver.style.display = 'block';

        const reintentarBtn = document.getElementById('reintentarBtn');
        const salirBtn = document.getElementById('salirBtn');

        // Deshabilitar interacciones adicionales
        cards.forEach(card => {
            card.removeEventListener('click', selectCard);
        });
        characteristics.forEach(characteristic => {
            characteristic.removeEventListener('click', selectCharacteristic);
        });

        reintentarBtn.addEventListener('click', () => {
            window.location.reload();
        });

        salirBtn.addEventListener('click', () => {
            modalGameOver.style.display = 'none';
            window.location.href = '../index.html';
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

    function playAudio(audio) {
        audio.currentTime = 0;
        audio.play();
    }
});
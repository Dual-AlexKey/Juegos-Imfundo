document.addEventListener('DOMContentLoaded', () => {
    const centerBox = document.getElementById('center');
    const modalGameOver = document.getElementById('gameOverModal');
    const modalSuccess = document.getElementById('successModal'); // Modal para el éxito
    const hearts = document.querySelectorAll('.heart');
    const reintentarBtn = document.getElementById('reintentarBtn');
    const salirBtn = document.getElementById('salirBtn');

    const audioCorrecto = new Audio('../../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../../audio/gameover.mp3');

    let currentSentenceIndex = 0;
    let lives = 3;
    let selectedWords = [];
    let isMuted = false;

    function playSound(sound) {
        if (!isMuted) {
            sound.pause();
            sound.currentTime = 0;
            sound.play();
        }
    }

    function shuffleSentences(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const sentences = shuffleSentences([
        { words: ["ayer", "estuve", "en", "mi", "casa"], correctOrder: "ayer estuve en mi casa" },
        { words: ["he", "estado", "en", "la", "cocina", "toda", "la", "mañana"], correctOrder: "he estado en la cocina toda la mañana" },
        { words: ["mañana", "estaré", "en", "el", "parque", "con", "mis", "amigos"], correctOrder: "mañana estaré en el parque con mis amigos" },
        { words: ["estuve", "trabajando", "todo", "el", "día", "en", "ese", "proyecto"], correctOrder: "estuve trabajando todo el día en ese proyecto" }
    ]);

    function loadSentence() {
        const wordBank = document.getElementById('word-bank');
        const sentenceBox = document.getElementById('sentence');
        const result = document.getElementById('result');

        wordBank.innerHTML = '';
        sentenceBox.innerHTML = '';
        result.innerText = '';
        selectedWords = [];

        const currentSentence = sentences[currentSentenceIndex];
        currentSentence.words.sort(() => Math.random() - 0.5);

        currentSentence.words.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('word');
            wordElement.innerText = word;
            wordElement.addEventListener('click', () => selectWord(word, wordElement));
            wordBank.appendChild(wordElement);
        });
    }

    function selectWord(word, element) {
        selectedWords.push(word);
        document.getElementById('sentence').innerText = selectedWords.join(' ');
        element.style.display = 'none';
    }

    function updateHearts() {
        const hearts = document.querySelectorAll('.heart');
        if (lives >= 0 && lives < hearts.length) {
            hearts[lives].classList.add('corazon-roto');
        }
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

    reintentarBtn.addEventListener('click', () => {
        window.location.reload();
    });

    salirBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
    });
    function showGameOver() {
        const gameOverModal = document.querySelector('#gameOverModal');
        gameOverModal.style.display = 'block';
        document.querySelector('#reintentarBtn').addEventListener('click', () => location.reload());
        document.querySelector('#salirBtn').addEventListener('click', () => window.location.href = '../../index.html');
    }
    document.getElementById('check-button').addEventListener('click', () => {
        const constructedSentence = selectedWords.join(' ').trim();
        const correctSentence = sentences[currentSentenceIndex].correctOrder.trim();
        const result = document.getElementById('result');

        if (constructedSentence === correctSentence) {
            result.innerText = "¡Correcto!";
            result.style.color = 'green';
            playSound(audioCorrecto);
            if (currentSentenceIndex < sentences.length - 1) {
                currentSentenceIndex++;
                setTimeout(loadSentence, 2000);
            } else {
                result.innerText += " ¡Has completado todas las frases!";
                showModal(); // Mostrar modal de éxito al completar
            }
        } else {
            lives--;
            updateHearts();

            if (lives > 0) {
                result.innerText = "Inténtalo de nuevo.";
                result.style.color = 'red';
                playSound(audioIncorrecto);
            } else {
                result.innerText = "¡Game Over!";
                result.style.color = 'red';
                showGameOver() // Mostrar modal de Game Over
                audioGameOver.play()
                document.getElementById('check-button').disabled = true;
            }
        }
    });

    document.getElementById('clear-button').addEventListener('click', () => {
        const sentence = document.getElementById('sentence');
        const wordBank = document.getElementById('word-bank');
        sentence.innerHTML = '';
        document.getElementById('result').innerText = '';

        selectedWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('word');
            wordElement.innerText = word;
            wordElement.addEventListener('click', () => selectWord(word, wordElement));
            wordBank.appendChild(wordElement);
        });

        selectedWords = [];
    });

    loadSentence();
});

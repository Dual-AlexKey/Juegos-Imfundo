document.addEventListener('DOMContentLoaded', () => {
    const errorMessage = document.getElementById('error-message');
    const correctMessage = document.getElementById('correct-message');
    const modalGameOver = document.getElementById('gameOverModal');
    const hearts = document.querySelectorAll('.heart');
    const wordSearchContainer = document.getElementById('word-search');
    const wordList = document.querySelectorAll('#word-list li');
    const reintentarBtn = document.getElementById('reintentarBtn');
    const salirBtn = document.getElementById('salirBtn');

    const gridSize = 14;
    const wordBank = ["NAHUATL", "INDEPENDENCIA", "TEQUILA", "MAYAS", "PATRIMONIO", "TOMATE"];
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    let selectedLetters = [];
    let foundWords = [];
    let lives = 3;
    let attempts = 0;

    const audioCorrecto = new Audio('../../audio/correcto.mp3');
    const audioIncorrecto = new Audio('../../audio/incorrecto.mp3');
    const audioGameOver = new Audio('../../audio/gameover.mp3');

    reintentarBtn.addEventListener('click', () => window.location.reload());
    salirBtn.addEventListener('click', () => window.location.href = '../../index.html');

    function getRandomLetter() {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    function canPlaceWord(word, row, col, direction) {
        const len = word.length;
        for (let i = 0; i < len; i++) {
            let r = row, c = col;

            if (direction === 'right') c += i;
            if (direction === 'left') c -= i;
            if (direction === 'down') r += i;
            if (direction === 'up') r -= i;
            if (direction === 'diagonalDownRight') { r += i; c += i; }
            if (direction === 'diagonalUpLeft') { r -= i; c -= i; }

            if (r < 0 || r >= gridSize || c < 0 || c >= gridSize || (grid[r][c] && grid[r][c] !== word[i])) {
                return false;
            }
        }
        return true;
    }

    function getRandomDirection() {
        const directions = ['right', 'left', 'down', 'up', 'diagonalDownRight', 'diagonalUpLeft'];
        return directions[Math.floor(Math.random() * directions.length)];
    }

    function placeWord(word) {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            const direction = getRandomDirection();
            if (canPlaceWord(word, row, col, direction)) {
                for (let i = 0; i < word.length; i++) {
                    let r = row, c = col;
                    if (direction === 'right') c += i;
                    if (direction === 'left') c -= i;
                    if (direction === 'down') r += i;
                    if (direction === 'up') r -= i;
                    if (direction === 'diagonalDownRight') { r += i; c += i; }
                    if (direction === 'diagonalUpLeft') { r -= i; c -= i; }

                    grid[r][c] = word[i];
                }
                placed = true;
            }
        }
    }

    function fillGridWithRandomLetters() {
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                if (!grid[row][col]) {
                    grid[row][col] = getRandomLetter();
                }
            }
        }
    }

    function renderGrid() {
        wordSearchContainer.innerHTML = '';
        grid.forEach((row, rowIndex) => {
            row.forEach((letter, colIndex) => {
                const cell = document.createElement('div');
                cell.className = 'letter';
                cell.textContent = letter;
                cell.addEventListener('click', () => toggleLetterSelection(rowIndex, colIndex, cell));
                wordSearchContainer.appendChild(cell);
            });
        });
    }

    function toggleLetterSelection(row, col, cell) {
        if (cell.classList.contains('found')) return;

        const letter = grid[row][col];
        const selectedIndex = selectedLetters.findIndex(item => item.row === row && item.col === col);

        if (selectedIndex > -1) {
            selectedLetters.splice(selectedIndex, 1);
            cell.classList.remove('selected');
        } else {
            selectedLetters.push({ letter, row, col });
            cell.classList.add('selected');
        }

        checkSelectedWord();
    }

    function checkSelectedWord() {
        const selectedWord = selectedLetters.map(item => item.letter).join('');
        if (wordBank.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            foundWords.push(selectedWord);
            markWordAsFound();
            audioCorrecto.play();
            updateWordList(selectedWord);
            attempts++
            if (attempts==6){
                showModal()

                const arrowIcon = document.getElementById('arrow-icon');
                const modal = document.getElementById("modal");
                if (modal) {  // Verificación adicional
                    modal.style.display = "flex";
                    modal.classList.add("show");
                    arrowIcon.style.display = 'inline-block';
                    arrowIcon.addEventListener('click', function() {
                        window.location.href = '../juego2/game2.html';
                    });
        
                    // Ocultar el modal después de 10 segundos
                    setTimeout(() => {
                        modal.classList.remove("show");
                        modal.classList.add("hide");
                        setTimeout(() => {
                            modal.style.display = "none";
                            modal.classList.remove("hide");
                        }, 500); 
                    }, 1000); // 10000 milisegundos = 10 segundos
                } else {
                    console.error('El elemento con el ID "modal" no existe en el DOM.');
                }
            }
            selectedLetters = [];
        } else if (selectedWord.length > Math.max(...wordBank.map(w => w.length))) {
            loseLife();
            resetSelection();
            audioIncorrecto.play();
        }
    }

    function markWordAsFound() {
        selectedLetters.forEach(({ row, col }) => {
            const cells = document.querySelectorAll('.letter');
            const cell = cells[row * gridSize + col];
            cell.classList.add('found');
            cell.classList.remove('selected');
        });
    }

    function updateWordList(word) {
        wordList.forEach(item => {
            if (item.textContent.toUpperCase() === word.toUpperCase()) {
                item.style.textDecoration = 'line-through';
            }
        });
    }

    function resetSelection() {
        selectedLetters.forEach(({ row, col }) => {
            const cells = document.querySelectorAll('.letter');
            const cell = cells[row * gridSize + col];
            cell.classList.remove('selected');
        });
        selectedLetters = [];
    }

    function loseLife() {
        if (lives > 0) {
            lives--;
            hearts[lives].style.display = 'none';
            if (lives === 0) {
                mostrarGameOver();
            }
        }
    }
    function mostrarGameOver() {
        modalGameOver.style.display = 'flex'; // Asegúrate de que el estilo es "flex" o el necesario para mostrarlo
        modalGameOver.classList.add("show");
        audioGameOver.play(); // Reproduce el audio de Game Over si es necesario
    }
    

    function showModal() {
        const modal = document.getElementById("modal");
        if (modal) {
            modal.style.display = "flex";
            modal.classList.add("show");
            setTimeout(() => {
                modal.classList.remove("show");
                modal.classList.add("hide");
                setTimeout(() => {
                    modal.style.display = "none";
                    modal.classList.remove("hide");
                }, 500);
            }, 1000);
        }
    }

    
    wordBank.forEach(placeWord);
    fillGridWithRandomLetters();
    renderGrid();
});

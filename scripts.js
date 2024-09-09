let words = [];
let currentWord = {};

document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            parseCSV(text);
            startGame();
        };
        reader.readAsText(file);
    }
}

function parseCSV(text) {
    const lines = text.split('\n');
    lines.forEach(line => {
        const [derWord, dieWord, dasWord] = line.split(',');
        
        // Agregamos palabras a la lista, asignándoles su género correspondiente
        if (derWord) words.push({ word: derWord.trim(), genre: 'der' });
        if (dieWord) words.push({ word: dieWord.trim(), genre: 'die' });
        if (dasWord) words.push({ word: dasWord.trim(), genre: 'das' });
    });

    // Filtrar palabras que tengan contenido válido
    words = words.filter(item => item.word);
}

function startGame() {
    document.getElementById('gameContainer').style.display = 'block';
    loadNextWord();
}

function loadNextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById('wordDisplay').textContent = currentWord.word;
    document.getElementById('feedback').textContent = '';
}

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedGenre = e.target.getAttribute('data-genre');
        checkAnswer(selectedGenre);
    });
});

function checkAnswer(selectedGenre) {
    if (selectedGenre === currentWord.genre) {
        document.getElementById('feedback').textContent = '¡Correcto!';
    } else {
        document.getElementById('feedback').textContent = 'Incorrecto, intenta de nuevo.';
    }
    setTimeout(loadNextWord, 1000);
}

let words = [];
let currentWord = {};
let racha = 0;

document.querySelector('.gameContainer').style.display = 'none';
document.getElementById('fileInput').addEventListener('change', handleFile);


if(localStorage.getItem("Wörter")){
    document.getElementById('btn-storage').addEventListener('click', startGame);
}else{
    document.getElementById('btn-storage').style.display = 'none';
}


function handleFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            parseCSV(text);
            localStorage.setItem("Wörter", JSON.stringify(words));
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
    return words;
}

function startGame() {
    document.querySelector('.gameContainer').style.display = 'flex';
    document.querySelector('.gameMenu').style.display = 'none';
    words = JSON.parse(localStorage.getItem("Wörter"))
    document.querySelector("#palabras-totales").textContent = words.length;
    document.querySelector("#palabras-faltantes").textContent = words.length;
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
    racha = parseInt(document.getElementById('racha').textContent)
    if (selectedGenre === currentWord.genre) {
        document.getElementById('feedback').textContent = '¡Correcto!';
        document.getElementById('racha').textContent = ++racha
        document.getElementById('aciertos').textContent = parseInt(document.getElementById('aciertos').textContent) + 1;
    } else {
        document.getElementById('feedback').textContent = `Incorrecto, era ${currentWord.genre}.`;
        document.getElementById('racha').textContent = 0
    }
    document.querySelector("#palabras-faltantes").textContent = parseInt(document.getElementById('palabras-faltantes').textContent) - 1;
    setTimeout(loadNextWord, 1500);
}

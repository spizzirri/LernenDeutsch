let words = [];
let currentWord = {};
let racha = 0;

const percentage = document.querySelector("#percentage");
const output = document.querySelector("output");
output.textContent = percentage.value;

percentage.addEventListener("input", function () {
  output.textContent = percentage.value;
});

document.querySelector('.gameContainer').style.display = 'none';
document.getElementById('fileInput').addEventListener('change', handleFile);
document.getElementById('btn-online').addEventListener('click', downloadCSV);



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
        const [derWord, derMeaning, dieWord, dieMeaning, dasWord, dasMeaning] = line.split(',');
        
        // Agregamos palabras a la lista, asignándoles su género correspondiente
        if (derWord) words.push({ word: derWord.trim(), genre: 'der', meaning: derMeaning.trim() });
        if (dieWord) words.push({ word: dieWord.trim(), genre: 'die', meaning: dieMeaning.trim() });
        if (dasWord) words.push({ word: dasWord.trim(), genre: 'das', meaning: dasMeaning.trim() });
    });

    // Filtrar palabras que tengan contenido válido
    words = words.filter(item => item.word);
    return words;
}

function startGame() {
    document.querySelector('.gameContainer').style.display = 'flex';
    document.querySelector('.gameMenu').style.display = 'none';
    words = loadWordsToPlay()
    document.querySelector("#palabras-totales").textContent = words.length;
    document.querySelector("#palabras-faltantes").textContent = words.length;
    loadNextWord();
}

function loadWordsToPlay(){
    storedWords = JSON.parse(localStorage.getItem("Wörter"));
    percentageOfWords = parseInt(percentage.value) / 100;
    amountOfWords = parseInt(storedWords.length * percentageOfWords);

    for(let i = 0; i < amountOfWords; i++){
        const indexRandomWord = Math.floor(Math.random() * storedWords.length)
        currentWord = storedWords.splice(indexRandomWord, 1)[0];
        words.push(currentWord);

    }
    return words;
}

function loadNextWord() {
    if(words.length > 0){
        const indexRandomWord = Math.floor(Math.random() * words.length)
        currentWord = words.splice(indexRandomWord, 1)[0];
        document.getElementById('wordDisplay').textContent = currentWord.word;
        document.getElementById('wordMeaning').textContent = `(${currentWord.meaning})`;
        document.getElementById('feedback').textContent = '';
    }
    else
        finishGame();
}

function finishGame(){
    alert("Juego terminado!, refresca para comenzar otra vez");
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


async function downloadCSV(){
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQdAq04r2wx_KN7-nV_lx84m-qNPKpR-ykx_v0CU0l2LwXpsJEPWp-ItA6ZnQWbDeElpV0Q5mdwFVU8/pub?gid=2014136788&single=true&output=csv';

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';
    try {
        const response = await fetch(corsProxy + url);
        
        if (!response.ok) {
            throw new Error('Error al descargar el CSV');
        }

        const text = await response.text();
        parseCSV(text);
        localStorage.setItem("Wörter", JSON.stringify(words));
        startGame();

 
    } catch (error) {
        console.error('Hubo un problema al obtener el archivo CSV:', error);
    }
}
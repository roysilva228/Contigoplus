// --- VARIABLES DE ESTADO DEL JUEGO ---
const PALABRAS = ['PROGRAMACION', 'JAVASCRIPT', 'GITHUB', 'FRONTEND', 'CSS'];
let palabraSecreta = '';
let palabraAdivinada = []; // Array que guarda las letras adivinadas, ej: ['P', '_', 'O', 'G', ...]
let fallos = 0;
const MAX_FALLOS = 6;
let letrasUsadas = [];
let juegoTerminado = false;

// Elementos del DOM
const palabraElemento = document.getElementById('palabra-secreta');
const mensajeElemento = document.getElementById('mensaje-juego');
const letrasUsadasElemento = document.querySelector('#letras-usadas span');
const tecladoElemento = document.getElementById('teclado-letras');
const reiniciarBtn = document.getElementById('reiniciar-btn');
const partesAhorcado = [
    document.getElementById('cabeza'),
    document.getElementById('cuerpo'),
    document.getElementById('brazo-izquierdo'),
    document.getElementById('brazo-derecho'),
    document.getElementById('pierna-izquierda'),
    document.getElementById('pierna-derecha')
];

// --- FUNCIONES DE INICIO Y REINICIO ---

function seleccionarPalabra() {
    const indice = Math.floor(Math.random() * PALABRAS.length);
    palabraSecreta = PALABRAS[indice];
    palabraAdivinada = Array(palabraSecreta.length).fill('_');
}

function inicializarJuego() {
    juegoTerminado = false;
    fallos = 0;
    letrasUsadas = [];

    // 1. Reiniciar la palabra
    seleccionarPalabra();
    
    // 2. Limpiar la interfaz
    palabraElemento.innerHTML = '';
    mensajeElemento.textContent = '¡Adivina la palabra!';
    mensajeElemento.className = 'mensaje';
    letrasUsadasElemento.textContent = '';
    reiniciarBtn.style.display = 'none';
    
    // 3. Ocultar partes del ahorcado
    partesAhorcado.forEach(parte => parte.classList.remove('parte-visible'));

    // 4. Crear el teclado (solo se hace una vez al inicio, luego se reinicia)
    if (tecladoElemento.children.length === 0) {
        crearTeclado();
    } else {
        // Habilitar todos los botones al reiniciar
        Array.from(tecladoElemento.children).forEach(btn => btn.disabled = false);
    }
    
    // 5. Actualizar la vista inicial
    actualizarPalabraDOM();
}

// --- MANEJO DEL TECLADO ---

function crearTeclado() {
    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i); // Convertir código ASCII a letra (A-Z)
        const boton = document.createElement('button');
        boton.textContent = letra;
        boton.className = 'letra-btn';
        boton.addEventListener('click', () => manejarAdivinanza(letra));
        tecladoElemento.appendChild(boton);
    }
}

// --- LÓGICA PRINCIPAL DEL JUEGO ---

function manejarAdivinanza(letra) {
    if (juegoTerminado || letrasUsadas.includes(letra)) {
        return; // Ignorar si el juego terminó o la letra ya se usó
    }

    letrasUsadas.push(letra);
    let acierto = false;

    // 1. Revisar si la letra está en la palabra secreta
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra) {
            palabraAdivinada[i] = letra; // Reemplazar el guion con la letra
            acierto = true;
        }
    }
    
    // 2. Manejar fallo
    if (!acierto) {
        fallos++;
        actualizarHorcaDOM();
    }
    
    // 3. Actualizar la interfaz
    actualizarPalabraDOM();
    actualizarLetrasUsadasDOM();
    
    // Deshabilitar el botón de la letra usada
    const botonUsado = Array.from(tecladoElemento.children).find(btn => btn.textContent === letra);
    if (botonUsado) {
        botonUsado.disabled = true;
    }
    
    // 4. Comprobar si terminó el juego
    comprobarFinDelJuego();
}

// --- FUNCIONES DE ACTUALIZACIÓN DEL DOM ---

function actualizarPalabraDOM() {
    // Une el array de letras adivinadas y lo muestra con espacios
    palabraElemento.textContent = palabraAdivinada.join(' ');
}

function actualizarLetrasUsadasDOM() {
    letrasUsadasElemento.textContent = letrasUsadas.join(', ');
}

function actualizarHorcaDOM() {
    // Muestra una parte del cuerpo por cada fallo
    if (fallos > 0 && fallos <= MAX_FALLOS) {
        // fallos - 1 porque el array empieza en 0
        partesAhorcado[fallos - 1].classList.add('parte-visible');
    }
}

function deshabilitarTeclado() {
    Array.from(tecladoElemento.children).forEach(btn => btn.disabled = true);
}

function comprobarFinDelJuego() {
    // Comprobar Victoria
    if (!palabraAdivinada.includes('_')) {
        juegoTerminado = true;
        mensajeElemento.textContent = '¡Felicidades! ¡GANASTE! 🎉';
        mensajeElemento.classList.add('victoria');
        deshabilitarTeclado();
        reiniciarBtn.style.display = 'block';
        return;
    }

    // Comprobar Derrota
    if (fallos >= MAX_FALLOS) {
        juegoTerminado = true;
        mensajeElemento.textContent = `¡PERDISTE! La palabra era: ${palabraSecreta}`;
        mensajeElemento.classList.add('derrota');
        deshabilitarTeclado();
        reiniciarBtn.style.display = 'block';
    }
}

// --- EVENT LISTENERS ---
reiniciarBtn.addEventListener('click', inicializarJuego);

// Permitir que el usuario escriba letras con el teclado físico
document.addEventListener('keydown', (event) => {
    // Convertir a mayúsculas y validar que sea una letra A-Z
    const letra = event.key.toUpperCase();
    if (letra.length === 1 && letra >= 'A' && letra <= 'Z') {
        manejarAdivinanza(letra);
    }
});

// Iniciar el juego al cargar la página
document.addEventListener('DOMContentLoaded', inicializarJuego);

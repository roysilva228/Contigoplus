// --- VARIABLES DE ESTADO DEL JUEGO ---
const PALABRAS = ['PROGRAMACION', 'JAVASCRIPT', 'GITHUB', 'FRONTEND', 'CSS'];
let palabraSecreta = '';
let palabraAdivinada = []; 
let fallos = 0;
const MAX_FALLOS = 6;
let letrasUsadas = [];
let juegoTerminado = false;

// Elementos del DOM (Declarados aquí, pero asignados en asignarElementosDOM)
let palabraElemento;
let mensajeElemento;
let letrasUsadasElemento;
let tecladoElemento;
let reiniciarBtn;
let partesAhorcado; 

// --- FUNCIONES DE INICIO Y REINICIO ---

function seleccionarPalabra() {
    const indice = Math.floor(Math.random() * PALABRAS.length);
    palabraSecreta = PALABRAS[indice];
    palabraAdivinada = Array(palabraSecreta.length).fill('_');
}

function inicializarJuego() {
    // Es CRUCIAL que los elementos del DOM ya estén asignados antes de esto
    if (!palabraElemento) return;

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

    // 4. Crear el teclado (solo se hace una vez al inicio)
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
        return; 
    }

    letrasUsadas.push(letra);
    let acierto = false;

    // 1. Revisar si la letra está en la palabra secreta
    for (let i = 0; i < palabraSecreta.length; i++) {
        if (palabraSecreta[i] === letra) {
            palabraAdivinada[i] = letra; 
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
    palabraElemento.textContent = palabraAdivinada.join(' ');
}

function actualizarLetrasUsadasDOM() {
    letrasUsadasElemento.textContent = letrasUsadas.join(', ');
}

function actualizarHorcaDOM() {
    if (fallos > 0 && fallos <= MAX_FALLOS) {
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

// --- ASIGNACIÓN DE ELEMENTOS DEL DOM Y LISTENERS ---

function asignarElementosDOM() {
    // Asigna los elementos del HTML a las variables JS (solo se hace una vez)
    palabraElemento = document.getElementById('palabra-secreta');
    mensajeElemento = document.getElementById('mensaje-juego');
    letrasUsadasElemento = document.querySelector('#letras-usadas span');
    tecladoElemento = document.getElementById('teclado-letras');
    reiniciarBtn = document.getElementById('reiniciar-btn');
    partesAhorcado = [
        document.getElementById('cabeza'),
        document.getElementById('cuerpo'),
        document.getElementById('brazo-izquierdo'),
        document.getElementById('brazo-derecho'),
        document.getElementById('pierna-izquierda'),
        document.getElementById('pierna-derecha')
    ];
}

// Iniciar el juego al cargar la página (ES LA ÚNICA PARTE QUE SE EJECUTA AL INICIO)
document.addEventListener('DOMContentLoaded', () => {
    asignarElementosDOM(); 
    inicializarJuego();
    
    // Añadir listener para reiniciar DEPUÉS de que el botón exista
    reiniciarBtn.addEventListener('click', inicializarJuego);
});

// Permitir que el usuario escriba letras con el teclado físico
document.addEventListener('keydown', (event) => {
    // Convertir a mayúsculas y validar que sea una letra A-Z
    const letra = event.key.toUpperCase();
    if (letra.length === 1 && letra >= 'A' && letra <= 'Z') {
        manejarAdivinanza(letra);
    }
});

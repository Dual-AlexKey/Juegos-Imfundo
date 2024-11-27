let clicado = false;
var flechaSound = document.getElementById('flechaSound');

document.getElementById('flecha').addEventListener('click', function() {
    flechaSound.currentTime = 0;
    flechaSound.volume = 0.1;
    flechaSound.play();

    const bloque1 = document.querySelector('.bloque1');
    const bloque2 = document.querySelector('.bloque2');

    if (bloque1.style.display === 'block') {
        bloque1.style.display = 'none';
        bloque2.style.display = 'block';
        document.getElementById('flecha').style.transform = 'rotate(180deg)';
    } else {
        bloque1.style.display = 'block';
        bloque2.style.display = 'none';
        document.getElementById('flecha').style.transform = 'rotate(0deg)';
    }
});

function reproducirSonidoHover() {
    var sonidoHover = document.getElementById('hoverSound');
    sonidoHover.volume = 0.1;
    sonidoHover.currentTime = 0; // Reinicia el sonido para reproducirlo desde el principio
    sonidoHover.play();
}

// Función para manejar el redireccionamiento de los botones
function handleModule(event) {
    const modulo = event.target.dataset.module; // Obtener el número de módulo del botón
    const moduloEnlace = clicado ? parseInt(modulo) + 6 : parseInt(modulo); // Ajustar el número de módulo en función de si la flecha está clicada o no
    window.location.href = `./modulo${moduloEnlace}/modulo${moduloEnlace}.html`; // Redirigir al módulo correspondiente
}

const botones = document.querySelectorAll('.animated-button');

botones.forEach(boton => {
    boton.addEventListener('mouseover', reproducirSonidoHover);
    boton.addEventListener('click', handleModule);
});

var audio = document.getElementById('audioElement');
audio.volume = 0.3;

// Variables de la pelota
let pelotaX, pelotaY;
let velocidadPelotaX = 6.7;
let velocidadPelotaY = 7;
let diametroPelota = 26;
let imgPelota;
let anguloPelota = 0;


// Variables de las paletas
const anchoPaleta = 10;
let altoPaleta;

// Paleta del jugador (izquierda)
let paletaJugadorY;
const velocidadJugador = 10;

// Paleta de la computadora (derecha)
let paletaComputadoraY;
const velocidadComputadora = 5.8;

// Puntajes y límite de puntaje
let puntajeJugador = 0;
let puntajeComputadora = 0;
const puntajeMaximo = 10;
let ganador = '';

// dimensiones del canvas
let canvasWidth = 0;
let canvasHeight = 0;

// Variables para la imagen de fondo y sonidos
let fondo, perdedor, score, rebote;

function preload() {
  fondo = loadImage('imagenes/fondo2.png');
  imgPelota = loadImage('./imagenes/pokebola.png');
  perdedor = loadSound('./sonidos/gameover.wav');
  rebote = loadSound('./sonidos/rebotes.wav');
  score = loadSound('./sonidos/score.wav');
}

function setup() {
  // Ajustar dimensiones del canvas según el tamaño de la pantalla
  canvasWidth = windowWidth -16;
  canvasHeight = windowHeight -16;

  createCanvas(canvasWidth, canvasHeight);


  // Ajustar el alto de la paleta en función de la altura del canvas
  altoPaleta = height * 0.25;

  // Verificar si la pantalla está en modo vertical
  if (windowWidth <= 480 && windowHeight > windowWidth) {
    mostrarMensaje();
  }

  // Inicializar el juego
  reiniciarJuego();
  reglas();
}

function windowResized() {
  // Redimensionar el canvas cuando se cambia el tamaño de la ventana
  resizeCanvas(windowWidth, windowHeight);
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  altoPaleta = height * 0.25;
}

function mostrarMensaje() {
  textSize(32);
  textAlign(CENTER);
  fill(255);
  background(0);
  let text = "Gira el dispositivo";
  text(text, width / 2, height / 2);
}

function reglas() {
  if (confirm("El primero en llegar a los 10 puntos, gana. Usa las flechas para deslizar tu raqueta")) {
    loop();
  } else {
    noLoop();
    perdedor.play();
  }
}

function draw() {
  background(fondo);
  verificarGanador();
  moverPelota();
  mostrarPelota();
  moverPaletaJugador();
  mostrarPaleta(10, paletaJugadorY);
  moverPaletaComputadora();
  mostrarPaleta(width - 20, paletaComputadoraY);
  verificarColisionPaleta(10, paletaJugadorY);
  verificarColisionPaleta(width - 20, paletaComputadoraY);
  mostrarPuntaje();
}

function reiniciarJuego() {
  pelotaX = width / 2;
  pelotaY = height / 2;
  anguloPelota = 0;
  paletaJugadorY = height / 2 - altoPaleta / 2;
  paletaComputadoraY = height / 2 - altoPaleta / 2;
}

function moverPelota() {
  pelotaX += velocidadPelotaX;
  pelotaY += velocidadPelotaY;
  anguloPelota += 1;

  // Rebote en los bordes superior e inferior
  if (pelotaY < 0 || pelotaY > height) {
    velocidadPelotaY *= -1;
  }

  // Verificar si la pelota sale de los límites izquierdo o derecho
  if (pelotaX < 0 || pelotaX > width) {
    if (pelotaX < 0) {
      puntajeComputadora++;
    } else {
      puntajeJugador++;
    }
    score.play();

    if (puntajeJugador < puntajeMaximo && puntajeComputadora < puntajeMaximo) {
      narrarMarcador();
    } else {
      perdedor.play();
    }

    reiniciarJuego();
  }
}

function mostrarPelota() {
  push();
  translate(pelotaX, pelotaY);
  rotate(anguloPelota);
  imageMode(CENTER);
  image(imgPelota, 0, 0, diametroPelota, diametroPelota);
  pop();
}

function moverPaletaJugador() {
  if (keyIsDown(UP_ARROW)) {
    paletaJugadorY -= velocidadJugador;
  }
  if (keyIsDown(DOWN_ARROW)) {
    paletaJugadorY += velocidadJugador;
  }
  paletaJugadorY = constrain(paletaJugadorY, 0, height - altoPaleta);
}

function moverPaletaComputadora() {
  if (pelotaY > paletaComputadoraY + altoPaleta / 2) {
    paletaComputadoraY += velocidadComputadora;
  } else if (pelotaY < paletaComputadoraY + altoPaleta / 2) {
    paletaComputadoraY -= velocidadComputadora;
  }
  paletaComputadoraY = constrain(paletaComputadoraY, 0, height - altoPaleta);
}

function mostrarPaleta(x, y) {
  noStroke();
  fill('yellow');
  rect(x, y, anchoPaleta, altoPaleta);
}

function verificarColisionPaleta(x, y) {
  const dentroDelRangoVertical = (pelotaY > y) && (pelotaY < y + altoPaleta);

  if (
    (pelotaX - diametroPelota / 2 < x + anchoPaleta) &&
    (pelotaX + diametroPelota / 2 > x) &&
    dentroDelRangoVertical
  ) {
    velocidadPelotaX *= -1;
    rebote.play();

    if (pelotaX < x) {
      pelotaX = x - diametroPelota / 2;
    } else {
      pelotaX = x + anchoPaleta + diametroPelota / 2;
    }
  }
}

function mostrarPuntaje() {
  textSize(32);
  textAlign(CENTER, TOP);
  fill(255);
  text(`${puntajeJugador} - ${puntajeComputadora}`, width / 2, 10);
}

function verificarGanador() {
  if (puntajeJugador >= puntajeMaximo || puntajeComputadora >= puntajeMaximo) {
    ganador = puntajeJugador >= puntajeMaximo ? "Jugador" : "Computadora";
    let reiniciar = confirm(`${ganador} es el GANADOR!. ¿Quieres jugar de nuevo?`);
    narrarGanador(ganador);

    if (reiniciar) {
      puntajeJugador = 0;
      puntajeComputadora = 0;
      reiniciarJuego();
    } else {
      noLoop();
      alert("Adiós, ¡vuelve pronto!");
    }
  }
}

// Función de narración del marcador
function narrarMarcador() {
  let narracion = `${puntajeJugador} a ${puntajeComputadora}`;
  let utterance = new SpeechSynthesisUtterance(narracion);
  speechSynthesis.speak(utterance);
}

// Función de narración del ganador
function narrarGanador(ganador) {
  let narracion = `${ganador} es el ganador!`;
  let utterance = new SpeechSynthesisUtterance(narracion);
  speechSynthesis.speak(utterance);
}

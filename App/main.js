/**
 * Clase para modelar los personajes
 */
class Personaje {
  constructor(id, nombre, imagen, poder) {
    this.id = id;
    this.nombre = nombre;
    this.imagen = imagen;
    this.poder = poder;
  }
}

const masPoder = 10;
const mensaje = $("#mensaje");
const alerta = $("#alerta").addClass("alerta").hide();

/**
 * Asignación de funciones a selectores JQuery cuando se hace click
 */
$("#botonFiltro").click(filtrarPersonajes);
$("#cargar-jugadores").click(cargarJugadores);
$("#start-stop").on("click", () => {
  controlarAudioFondo();
  cambiarTextoBotonAudio();
});

configurarInicio();

/**
 * Función para hacer configuraciones iniciales
 */
function configurarInicio() {
  $("#sonido-fondo")[0].volume = 0.1;

  $("main #section-personajes").prepend(
    "<h1>Simulador Mariokart</h1><h2>Personajes</h2>"
  );

  $("h2").hide();

  $("h1")
    .hide()
    .fadeIn("slow", function () {
      $("h3").fadeOut("slow");
      $("h2").fadeIn("slow");
    });

  traerPersonajesDeJSON();
}

/**
 * Función para obtener personajes desde el archivo JSON
 */
function traerPersonajesDeJSON() {
  $.ajax({
    url: "./personajes.json",
  }).done(function (data) {
    let personajes = [...data];
    guardarEnLocalStorage(personajes);
    crearPersonajes(personajes);
    asignarListeners(personajes);
    $("#botonReset").on("click", function () {
      resetearFiltro(personajes)
    })
  });
}

/**
 * Función para guardar datos en local storage
 */
function guardarEnLocalStorage(personajes) {
  localStorage.clear();
  localStorage.setItem("personajes", JSON.stringify(personajes));
}

/**
 * Función para crear el HTML de la lista de personajes
 * @param {*} personajes lista de personajes de tipo Personaje
 */
function crearPersonajes(personajes) {
  $("#listaPersonajes").html("");

  for (const personaje of personajes) {
    const card = $("<div></div>").addClass("card");

    const img = $("<img />").attr({
      src: personaje.imagen,
      alt: personaje.nombre,
    });

    const container = $("<div></div>").addClass("container");

    const h4 = $("<h4></h4>").html(personaje.nombre);

    const progress = $("<progress></progress>").attr({
      id: personaje.id,
      max: "100",
      value: personaje.poder,
    });

    const botonAumentarPoder = $("<button></button>")
      .html("+")
      .addClass("mas-boton");

    const h5 = $("<h5></h5>")
      .attr({
        id: `poderTitulo${personaje.id}`,
      })
      .html(`${personaje.poder}%`);

    container.append(h4);

    card.append(container);
    card.append(img);
    card.append(progress);
    card.append(h5);
    card.append(botonAumentarPoder);

    const li = $("<li></li>")
      .attr({ id: personaje.nombre + personaje.id })
      .append(card);

    $("#listaPersonajes").append(li).hide().fadeIn(1500);
  }
  autoComplete(personajes);
}

/**
 * Función para filtrar los personajes
 * @returns
 */
function filtrarPersonajes() {
  mensaje.html("");
  const inputFiltro = $("#inputFiltro").val();

  if (inputFiltro.toLowerCase() === "") {
    crearPersonajes(personajes);
    asignarListeners();
    return;
  }

  const listaFiltrada = personajes.filter(
    (personaje) => personaje.nombre.toLowerCase() === inputFiltro.toLowerCase()
  );

  if (listaFiltrada.length == 0) {
    mensaje.html("El personaje no está en la lista");
  }

  crearPersonajes(listaFiltrada);
  asignarListeners();
}

/**
 * Función para resetear el listado de personajes después de filtrar
 */
function resetearFiltro(personajes) {
  $("h3").fadeIn("slow", () => $("h3").fadeOut("slow"));
  mensaje.html("");
  crearPersonajes(personajes);
  asignarListeners();
  $("#inputFiltro").val("");
}

/**
 * Función para asignar evento click a los personajes
 */
function asignarListeners(personajes) {
  const personajesIds = [
    "#Peach1",
    "#Mario2",
    "#Luigi3",
    "#Yoshi4",
    "#Bowser5",
    "#Toad6",
  ];

  for (let i = 0; i < personajesIds.length; i++) {
    aumentarPoder(personajesIds[i], i + 1, `poderTitulo${i + 1}`, personajes);
  }
}

/**
 * Función para incrementar el poder de un personaje
 * @param {*} personaje personaje al que se le aumentará el poder
 * @param {*} nivelPoder id HTML del progress antes de aumentar
 * @param {*} poderTitulo texto a mostrar cuando se aumente el poder en porcentaje
 * * @param {*} personajes texto a mostrar cuando se aumente el poder en porcentaje
 */
function aumentarPoder(personaje, nivelPoder, poderTitulo, personajes) {
  $(`${personaje} button`).on("click", () => {
    let nivel = $(`#${nivelPoder}`).val();

    if (nivel === 100) {
      alerta
        .html("Este personaje ya tiene el máximo poder")
        .fadeIn("slow", () => {
          alerta.fadeOut(4000);
        });
      return;
    }

    nivel += masPoder;

    $(`#${poderTitulo}`).html(`${nivel}%`);
    $(`#${nivelPoder}`).val(`${nivel}`);

    const person = personajes.find((personaje) => personaje.id === nivelPoder);

    if (person.length !== 0) {
      person.poder = nivel;
      localStorage.setItem(person.nombre, nivel);
    }

    $("#sonido-aumentar-poder")[0].play();
  });
}

/**
 * Función para obtener jugadores desde JSON Placeholder
 */
function cargarJugadores() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/users",
  }).done(function (data) {
    console.log("Datos de JSON placeholder:", data);
    mostrarUsuarios(data);
  });
}

/**
 * Función para crear el HTML de la lista de jugadores
 * @param {*} jugadores lista de jugadores
 */
function mostrarUsuarios(jugadores) {
  $("#jugadores h4").html(`Jugadores en línea (${jugadores.length})`);

  for (const jugador of jugadores) {
    const name = $("<p></p>");
    const username = $("<p></p>");
    const website = $("<p></p>");

    name.html(`Nombre: ${jugador.name}`);
    username.html(`Usuario: ${jugador.username}`);
    website.html(`Sitio Web: ${jugador.website}`);

    const usuario = $("<div></div>")
      .addClass("jugador-container")
      .append(name)
      .append(username)
      .append(website);
    $("#jugadores").append(usuario);
  }

  $("#cargar-jugadores").fadeOut(1000);
  moverScrollHaciaAbajo();
}

/**
 * Función para desplazar el scroll hacia abajo cuando se carguen los jugadores
 */
function moverScrollHaciaAbajo() {
  const $target = $("html,body");
  $target.animate({ scrollTop: $target.height() }, 1000);
}

/**
 * Función para dar play o poner en pausa el audio de fondo
 * @returns
 */
function controlarAudioFondo() {
  if ($("#start-stop").text() === "Pausado") {
    $("#sonido-fondo")[0].play();
    return;
  }
  $("#sonido-fondo")[0].pause();
}

/**
 * Función para cambiar el texto del botón de control de audio de fondo
 */
function cambiarTextoBotonAudio() {
  const text = $("#start-stop").text();
  if (text === "Sonando") {
    $("#start-stop").text("Pausado");
  } else {
    $("#start-stop").text("Sonando");
  }
}

function autoComplete(personajes) {
  $("#inputFiltro").keyup(function(e) {
     if(e.target.value.length > 2) {
      const listaFiltrada = personajes.filter(
        (personaje) => personaje.nombre.includes(e.target.value.toLowerCase())
      );
    
      if (listaFiltrada.length === 0) {
        mensaje.html("El personaje no está en la lista");
      }
    
      crearPersonajes(listaFiltrada);
      asignarListeners();
     }
    })


}

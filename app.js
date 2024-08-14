// Declaración de variables y constantes
const mensajes = [];

// Función para mostrar los mensajes en la consola
function mostrarMensajes() {
    console.clear();
    console.log("Chat de WhatsApp:");
    mensajes.forEach((mensaje, index) => {
        const estado = mensaje.leido ? "Leído" : "No leído";
        console.log(`${index + 1}: [${mensaje.hora}] ${mensaje.remitente}: ${mensaje.texto} (${estado})`);
    });
    mostrarMensajesNoLeidos();
}

// Función para mostrar el número de mensajes no leídos
function mostrarMensajesNoLeidos() {
    const noLeidos = mensajes.filter(mensaje => !mensaje.leido).length;
    console.log(`Tienes ${noLeidos} mensajes no leídos.`);
}

// Función para enviar un mensaje
function enviarMensaje() {
    const remitente = prompt("Escribe tu nombre:");
    const texto = prompt("Escribe tu mensaje:");
    const hora = new Date().toLocaleTimeString();
    if (remitente && texto) {
        mensajes.push({ remitente, texto, hora, leido: false });
        alert("Mensaje enviado");
        mostrarMensajes();
    } else {
        alert("Mensaje vacío. Inténtalo de nuevo.");
    }
}

// Función para eliminar un mensaje
function eliminarMensaje() {
    const indice = prompt("Ingresa el número del mensaje que deseas eliminar:");
    if (indice && !isNaN(indice) && indice > 0 && indice <= mensajes.length) {
        const confirmar = confirm(`¿Estás seguro de que deseas eliminar el mensaje ${indice}?`);
        if (confirmar) {
            mensajes.splice(indice - 1, 1);
            alert("Mensaje eliminado");
            mostrarMensajes();
        } else {
            alert("Eliminación cancelada");
        }
    } else {
        alert("Índice inválido. Inténtalo de nuevo.");
    }
}

// Función para responder a un mensaje
function responderMensaje() {
    const indice = prompt("Ingresa el número del mensaje al que deseas responder:");
    if (indice && !isNaN(indice) && indice > 0 && indice <= mensajes.length) {
        const texto = prompt("Escribe tu respuesta:");
        const hora = new Date().toLocaleTimeString();
        const remitente = "Tú";
        if (texto) {
            mensajes.push({ remitente, texto: `Re: ${mensajes[indice - 1].texto} - ${texto}`, hora, leido: false });
            alert("Respuesta enviada");
            mostrarMensajes();
        } else {
            alert("Respuesta vacía. Inténtalo de nuevo.");
        }
    } else {
        alert("Índice inválido. Inténtalo de nuevo.");
    }
}

// Función para marcar un mensaje como leído/no leído
function marcarMensaje() {
    const indice = prompt("Ingresa el número del mensaje que deseas marcar como leído/no leído:");
    if (indice && !isNaN(indice) && indice > 0 && indice <= mensajes.length) {
        mensajes[indice - 1].leido = !mensajes[indice - 1].leido;
        alert(`El mensaje ${indice} ha sido marcado como ${mensajes[indice - 1].leido ? "leído" : "no leído"}`);
        mostrarMensajes();
    } else {
        alert("Índice inválido. Inténtalo de nuevo.");
    }
}

// Ciclo de interacción
let continuar = true;
while (continuar) {
    const opcion = prompt("Selecciona una opción:\n1. Enviar mensaje\n2. Eliminar mensaje\n3. Responder mensaje\n4. Marcar mensaje como leído/no leído\n5. Salir");
    switch (opcion) {
        case '1':
            enviarMensaje();
            break;
        case '2':
            eliminarMensaje();
            break;
        case '3':
            responderMensaje();
            break;
        case '4':
            marcarMensaje();
            break;
        case '5':
            continuar = false;
            alert("Saliendo del simulador");
            break;
        default:
            alert("Opción inválida. Inténtalo de nuevo.");
    }
}
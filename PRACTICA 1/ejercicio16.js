function obtenerDatos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Datos del servidor");
    }, 2000);
  });
}

function mostrarDatos() {
  obtenerDatos()
    .then(datos => {
      console.log(datos);
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

mostrarDatos();
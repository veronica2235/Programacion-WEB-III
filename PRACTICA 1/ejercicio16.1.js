function obtenerDatos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Datos del servidor");
    }, 2000);
  });
}

async function mostrarDatos() {
  try {
    let datos = await obtenerDatos();
    console.log(datos);
  } catch (error) {
    console.log("Error:", error);
  }
}

mostrarDatos();
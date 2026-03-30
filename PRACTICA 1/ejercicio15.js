function tareaConCallback(callback) {
  setTimeout(() => {
    let exito = true;

    if (exito) {
      callback(null, "Datos obtenidos correctamente");
    } else {
      callback("Ocurrió un error", null);
    }
  }, 2000);
}

function convertirAPromesa() {
  return new Promise((resolve, reject) => {
    tareaConCallback((error, resultado) => {
      if (error) {
        reject(error);
      } else {
        resolve(resultado);
      }
    });
  });
}

convertirAPromesa()
  .then(resultado => console.log(resultado))
  .catch(error => console.log(error));
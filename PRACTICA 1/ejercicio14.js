function tareaConPromesa() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Resultado correcto");
    }, 2000);
  });
}

function usarCallback(callback) {
  tareaConPromesa()
    .then(resultado => callback(null, resultado))
    .catch(error => callback(error, null));
}

usarCallback((error, resultado) => {
  if (error) {
    console.log("Error:", error);
  } else {
    console.log("Resultado:", resultado);
  }
});
function paso1(callback) {
  setTimeout(() => {
    console.log("Paso 1 completado");
    callback();
  }, 1000);
}

function paso2(callback) {
  setTimeout(() => {
    console.log("Paso 2 completado");
    callback();
  }, 1000);
}

function paso3(callback) {
  setTimeout(() => {
    console.log("Paso 3 completado");
    callback();
  }, 1000);
}

paso1(() => {
  paso2(() => {
    paso3(() => {
      console.log("Todos los pasos terminados");
    });
  });
});
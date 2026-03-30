function paso1() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Paso 1 completado");
      resolve();
    }, 1000);
  });
}

function paso2() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Paso 2 completado");
      resolve();
    }, 1000);
  });
}

function paso3() {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("Paso 3 completado");
      resolve();
    }, 1000);
  });
}

async function ejecutarPasos() {
  await paso1();
  await paso2();
  await paso3();
  console.log("Todos los pasos terminados");
}

ejecutarPasos();
function miFuncion(texto) {
  let resultado = { a: 0, e: 0, i: 0, o: 0, u: 0 };

  for (let letra of texto.toLowerCase()) {
    if (resultado.hasOwnProperty(letra)) {
      resultado[letra]++;
    }
  }

  return resultado;
}

let obj = miFuncion("euforia");
console.log(obj);
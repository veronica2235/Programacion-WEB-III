function miFuncion(cadena) {
  let invertida = cadena.split("").reverse().join("");
  return cadena.toLowerCase() === invertida.toLowerCase();
}

let band1 = miFuncion("oruro");
console.log(band1); // true

let band2 = miFuncion("hola");
console.log(band2); // false
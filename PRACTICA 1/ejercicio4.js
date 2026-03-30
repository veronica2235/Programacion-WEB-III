function miFuncion(arreglo) {
  return {
    mayor: Math.max(...arreglo),
    menor: Math.min(...arreglo)
  };
}

let obj = miFuncion([3, 1, 5, 4, 2]);
console.log(obj); 
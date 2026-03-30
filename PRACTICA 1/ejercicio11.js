let promesa = new Promise((resolve) => {
  resolve(5);
});

promesa
  .then(numero => {
    console.log(numero); // 5
    return numero * 2;
  })
  .then(resultado => {
    console.log(resultado); // 10
    return resultado + 3;
  })
  .then(final => {
    console.log(final); // 13
  });
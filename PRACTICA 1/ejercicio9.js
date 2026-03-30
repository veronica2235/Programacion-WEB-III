let promesa = new Promise((resolve, reject) =>{
    setTimeout(() =>{
        resolve("Exito: la promesa se resolvio despues de 3 segundos");
    
    },3000);
});

 promesa.then(resultado => {
    console.log(resultado);
 });
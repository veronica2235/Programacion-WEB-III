function obtenerUsuario() {
  return Promise.resolve("Juan");
}

function obtenerPedidos(usuario) {
  return Promise.resolve(["Pedido1", "Pedido2"]);
}

function mostrarPedidos() {
  obtenerUsuario()
    .then(usuario => {
      return obtenerPedidos(usuario);
    })
    .then(pedidos => {
      console.log(pedidos);
    })
    .catch(error => {
      console.log("Error:", error);
    });
}

mostrarPedidos();
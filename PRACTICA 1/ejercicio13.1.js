function obtenerUsuario() {
  return Promise.resolve("Juan");
}

function obtenerPedidos(usuario) {
  return Promise.resolve(["Pedido1", "Pedido2"]);
}

async function mostrarPedidos() {
  try {
    let usuario = await obtenerUsuario();
    let pedidos = await obtenerPedidos(usuario);
    console.log(pedidos);
  } catch (error) {
    console.log("Error:", error);
  }
}

mostrarPedidos();
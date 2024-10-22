let carrito = [];

async function cargarProductos() {
  try {
    const response = await axios.get("./productos.json");
    const productos = response.data;
    mostrarProductos(productos);
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function mostrarProductos(productos) {
  const productosContainer = document.getElementById("productos");
  productosContainer.innerHTML = "";

  productos.forEach((producto) => {
    const productoDiv = document.createElement("div");
    productoDiv.className = "producto col-12 col-md-6 col-lg-4 text-center";

    productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${
      producto.nombre
    }" class="img-fluid">
            <h5>${producto.nombre}</h5>
            <p>Precio: $${producto.precio.toLocaleString()}</p>
            <button class="btn btn-primary" onclick="agregarAlCarrito('${
              producto.nombre
            }', ${producto.precio})">Agregar al Carrito</button>
        `;

    productosContainer.appendChild(productoDiv);
  });
}

function agregarAlCarrito(nombre, precio) {
  const producto = { nombre, precio };
  carrito.push(producto);

  Swal.fire({
    title: `${nombre} agregado al carrito`,
    icon: "success",
    confirmButtonText: "Aceptar",
  });
}

function actualizarCarritoModal() {
  const carritoItemsModal = document.getElementById("carrito-items-modal");
  const modalSubTotal = document.getElementById("modal-sub-total");
  const modalTotalValor = document.getElementById("modal-total-valor");

  carritoItemsModal.innerHTML = "";
  let subTotal = 0;

  carrito.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.innerText = `${item.nombre} - $${item.precio.toLocaleString()}`;
    const eliminarBtn = document.createElement("button");
    eliminarBtn.innerText = "Eliminar";
    eliminarBtn.className = "btn btn-danger btn-sm ml-2";
    eliminarBtn.onclick = () => eliminarDelCarrito(index);

    itemDiv.appendChild(eliminarBtn);
    carritoItemsModal.appendChild(itemDiv);
    subTotal += item.precio;
  });

  modalSubTotal.innerText = `Sub Total: $${subTotal.toLocaleString()}`;
  modalTotalValor.innerText = `Valor Total: $${subTotal.toLocaleString()}`;
}

function eliminarDelCarrito(index) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Este producto será eliminado del carrito.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito.splice(index, 1);
      actualizarCarritoModal();
      Swal.fire(
        "Eliminado!",
        "El producto ha sido eliminado del carrito.",
        "success"
      );
    }
  });
}

function finalizarCompra() {
  Swal.fire({
    title: "Compra finalizada!",
    text: "Gracias por su compra!",
    icon: "success",
    confirmButtonText: "Aceptar",
  }).then(() => {
    carrito = [];
    $("#carritoModal").modal("hide");
  });
}

$("#carritoModal").on("show.bs.modal", function () {
  actualizarCarritoModal();
});

document
  .getElementById("finalizar-compra-modal")
  .addEventListener("click", finalizarCompra);

function filtrarProductos() {
  const categoria = document.getElementById("filtroCategoria").value;
  cargarProductosPorCategoria(categoria);
}

async function cargarProductosPorCategoria(categoria) {
  try {
    const response = await axios.get("./productos.json");
    const productos = response.data;

    let productosFiltrados =
      categoria === "todos"
        ? productos
        : productos.filter(
            (producto) =>
              producto.categoria.toLowerCase() === categoria.toLowerCase()
          );

    mostrarProductos(productosFiltrados);
    if (productosFiltrados.length === 0) {
      Swal.fire("No se encontraron productos para esta categoría.");
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

document
  .getElementById("filtroCategoria")
  .addEventListener("change", filtrarProductos);

cargarProductos();

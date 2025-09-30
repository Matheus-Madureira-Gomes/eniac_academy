// script.js
document.addEventListener("DOMContentLoaded", () => {
  const catalogEl = document.getElementById("catalog");
  const subtotalEl = document.getElementById("subtotal");
  const descontoEl = document.getElementById("desconto");
  const totalEl = document.getElementById("total");
  const goCheckoutBtn = document.getElementById("goCheckout");

  // Busca produtos do backend
  function loadProducts() {
    fetch("backend/api/get_products.php")
      .then(res => res.json())
      .then(products => {
        catalogEl.innerHTML = "";
        products.forEach(p => {
          const card = document.createElement("div");
          card.className = "product-card";
          card.innerHTML = `
            <img src="${p.imagem}" alt="${p.nome}" onerror="this.src='https://via.placeholder.com/200'"/>
            <h3>${p.nome}</h3>
            <p>${p.descricao}</p>
            <p class="price">R$ ${Number(p.preco).toFixed(2).replace('.',',')}</p>
            <div class="quantity">Quantidade: <input type="number" value="1" min="1" data-product-id="${p.id}"></div>
            <button class="add-to-cart" data-id="${p.id}">Adicionar ao carrinho</button>
          `;
          catalogEl.appendChild(card);
        });

        // liga eventos aos botões
        document.querySelectorAll(".add-to-cart").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const productId = btn.dataset.id;
            // pega quantidade no input da mesma carta
            const qtyInput = btn.parentElement.querySelector(".quantity input");
            const quantidade = parseInt(qtyInput.value) || 1;

            addToCart(productId, quantidade);
          });
        });
      });
  }

  function addToCart(productId, quantidade) {
    const data = new URLSearchParams();
    data.append("product_id", productId);
    data.append("quantidade", quantidade);

    fetch("backend/api/add_to_cart.php", {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.status === "success") {
        alert("Produto adicionado ao carrinho!");
        updateSummary();
      } else {
        alert("Erro ao adicionar ao carrinho: " + (resp.msg||''));
      }
    });
  }

  // Atualiza resumo puxando cart do backend
  function updateSummary() {
    fetch("backend/api/get_cart.php")
      .then(res => res.json())
      .then(items => {
        let subtotal = 0;
        items.forEach(it => subtotal += parseFloat(it.preco) * parseInt(it.quantidade));
        const desconto = subtotal > 1000 ? 50 : 0;
        const total = subtotal - desconto;

        subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.',',')}`;
        descontoEl.textContent = `R$ ${desconto.toFixed(2).replace('.',',')}`;
        totalEl.textContent = `R$ ${total.toFixed(2).replace('.',',')}`;
      });
  }

  // botão finalizar compra -> vai para checkout
  goCheckoutBtn.addEventListener("click", () => {
    // redireciona para checkout — checkout carrega o carrinho do backend
    window.location.href = "checkout.html";
  });

  // init
  loadProducts();
  updateSummary();
});

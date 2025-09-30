// checkoutJS.js
document.addEventListener("DOMContentLoaded", () => {
  const editarBtn = document.getElementById("editar-btn");
  const salvarBtn = document.getElementById("salvar-btn");
  const dadosView = document.querySelector(".dados-view");
  const dadosEdit = document.querySelector(".dados-edit");
  const itemsList = document.getElementById("items-list");
  const summarySubtotal = document.getElementById("summary-subtotal");
  const summaryFrete = document.getElementById("summary-frete");
  const summaryDesconto = document.getElementById("summary-desconto");
  const summaryTotal = document.getElementById("summary-total");
  const confirmBtn = document.getElementById("confirm-btn");

  // carregar dados do usuário
  function loadUser() {
    fetch("backend/api/get_user.php")
      .then(res => res.json())
      .then(user => {
        if (!user) return;
        dadosView.innerHTML = `
          <p><strong>Nome:</strong> ${user.nome || ''}</p>
          <p><strong>E-mail:</strong> ${user.email || ''}</p>
          <p><strong>Telefone:</strong> ${user.telefone || ''}</p>
          <p><strong>Endereço:</strong> ${user.endereco || ''}</p>
        `;
        // preencher inputs de edição
        document.getElementById("input-nome").value = user.nome || '';
        document.getElementById("input-email").value = user.email || '';
        document.getElementById("input-telefone").value = user.telefone || '';
        document.getElementById("input-endereco").value = user.endereco || '';
      });
  }

  editarBtn.addEventListener("click", () => {
    dadosView.style.display = "none";
    dadosEdit.style.display = "block";
  });

  salvarBtn.addEventListener("click", () => {
    // aqui podemos opcionalmente enviar ao backend para gravar (não implementado)
    const nome = document.getElementById("input-nome").value;
    const email = document.getElementById("input-email").value;
    const telefone = document.getElementById("input-telefone").value;
    const endereco = document.getElementById("input-endereco").value;

    dadosView.innerHTML = `
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Endereço:</strong> ${endereco}</p>
    `;

    dadosEdit.style.display = "none";
    dadosView.style.display = "block";
  });

  // carregar itens do carrinho
  function loadCart() {
    fetch("backend/api/get_cart.php")
      .then(res => res.json())
      .then(items => {
        itemsList.innerHTML = "";
        let subtotal = 0;
        items.forEach(it => {
          const row = document.createElement("div");
          row.className = "checkout-item";
          row.innerHTML = `
            <img src="${it.imagem}" alt="${it.nome}" style="width:60px;height:60px;object-fit:cover;margin-right:8px;" onerror="this.src='https://via.placeholder.com/60'">
            <strong>${it.nome}</strong> x ${it.quantidade} — R$ ${ (it.preco * it.quantidade).toFixed(2).replace('.',',') }
            <div style="font-size:12px;color:#666;">(unit: R$ ${Number(it.preco).toFixed(2).replace('.',',')})</div>
          `;
          itemsList.appendChild(row);
          subtotal += parseFloat(it.preco) * parseInt(it.quantidade);
        });

        const desconto = subtotal > 1000 ? 50 : 0;
        const frete = 0; // você pode implementar cálculo de frete depois
        const total = subtotal - desconto + frete;

        summarySubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.',',')}`;
        summaryDesconto.textContent = `R$ ${desconto.toFixed(2).replace('.',',')}`;
        summaryFrete.textContent = `R$ ${frete.toFixed(2).replace('.',',')}`;
        summaryTotal.textContent = `R$ ${total.toFixed(2).replace('.',',')}`;
      });
  }

  // CONFIRMAR compra -> chama create_order.php
  confirmBtn.addEventListener("click", () => {
    // pegar forma de pagamento e tipo de entrega
    const forma = document.querySelector("input[name='pagamento']:checked")?.value || 'pix';
    const entrega = document.querySelector("input[name='tipo-entrega']:checked")?.value || 'retirada';
    const endereco = document.getElementById("input-endereco").value || '';

    const data = new URLSearchParams();
    data.append("forma_pagamento", forma);
    data.append("entrega_tipo", entrega);
    data.append("endereco", endereco);

    fetch("backend/api/create_order.php", {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then(resp => {
      if (resp.status === "success") {
        alert("Pedido criado com sucesso! Exemplo de mensagem — ID: " + resp.order_id);
        // redirecionar para a página do usuário (histórico)
        window.location.href = "usuario.html";
      } else {
        alert("Erro ao criar pedido: " + (resp.msg||''));
      }
    });
  });

  // init
  loadUser();
  loadCart();
});

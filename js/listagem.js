(function () {
  const STORAGE_KEY = "celulares";

  const $tbody = document.getElementById("tbodyCelulares");
  const $btnCadastrar = document.getElementById("btnCadastrar");

  function carregarLista() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function salvarLista(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function formatarBRL(v) {
    const n = Number(v ?? 0);
    if (Number.isNaN(n)) return "R$ 0,00";
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function renderTabela() {
    const lista = carregarLista();
    $tbody.innerHTML = "";

    if (lista.length === 0) {
      $tbody.innerHTML = `<tr>
        <td colspan="7" style="text-align:center; opacity:.7">Nenhum celular cadastrado.</td>
      </tr>`;
      return;
    }

    lista.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.marca ?? ""}</td>
        <td>${item.modelo ?? ""}</td>
        <td>${item.cor ?? ""}</td>
        <td>${formatarBRL(item.valor)}</td>
        <td>${(item.condicao ?? "").toLowerCase() === "novo" ? "Novo" : "Usado"}</td>
        <td>${item.info ?? ""}</td>
        <td>
          <button type="button" class="btn-alterar" data-index="${index}">Alterar</button>
          <button type="button" class="btn-excluir" data-index="${index}">Excluir</button>
        </td>
      `;
      $tbody.appendChild(tr);
    });
  }

  // Delegação de eventos para Alterar/Excluir
  $tbody.addEventListener("click", (e) => {
    const btnAlt = e.target.closest(".btn-alterar");
    const btnExc = e.target.closest(".btn-excluir");

    if (btnAlt) {
      const idx = Number(btnAlt.dataset.index);
      // Abre a tela de cadastro em modo edição
      window.location.href = `index.html?edit=${idx}`;
      return;
    }

    if (btnExc) {
      const idx = Number(btnExc.dataset.index);
      const lista = carregarLista();
      if (idx >= 0 && idx < lista.length) {
        lista.splice(idx, 1);
        salvarLista(lista);
        renderTabela();
      }
      return;
    }
  });

  // Botão “Cadastrar” abaixo da tabela (se existir)
  const $btnCadastrarExist = document.getElementById("btnCadastrar");
  if ($btnCadastrarExist) {
    $btnCadastrarExist.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) renderTabela();
  });

  document.addEventListener("DOMContentLoaded", renderTabela);
})();

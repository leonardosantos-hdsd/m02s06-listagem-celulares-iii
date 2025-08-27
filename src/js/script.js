// src/js/script.js (LISTAGEM) – Ex.: 05 com botão Alterar + Exclusão
const KEY = "celulares_m02s06"; // mesma chave usada no Ex. 03
const CADASTRO_URL = "../m02s06-cadastro-celulares-iii/index.html"; // ajuste conforme sua estrutura

function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

function formatBRL(num) {
  const n = Number(num);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function render() {
  const tbody = document.getElementById("tbody");
  const vazio = document.getElementById("vazio");
  const data = loadAll();

  tbody.innerHTML = "";

  if (!data.length) {
    vazio.style.display = "block";
    return;
  }
  vazio.style.display = "none";

  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.marca || "-"}</td>
      <td>${item.modelo || "-"}</td>
      <td>${item.armazenamento ? `${item.armazenamento} GB` : "-"}</td>
      <td>${item.cor || "-"}</td>
      <td>${formatBRL(item.preco)}</td>
      <td>${item.so || "-"}</td>
      <td class="col-actions">
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <button class="btn btn--primary btn-sm" data-edit="${item.id}">Alterar</button>
          <button class="btn btn--danger btn-sm" data-id="${item.id}">Excluir</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Exclusão
  tbody.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const lista = loadAll().filter((i) => i.id !== id);
      saveAll(lista);
      render();
    });
  });

  // Alteração → abre cadastro com ?edit=<id>
  tbody.querySelectorAll("button[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit");
      const url = new URL(CADASTRO_URL, window.location.href);
      url.searchParams.set("edit", id);
      window.location.href = url.toString();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Botão "Cadastrar" → vai para a tela de cadastro (Ex. 03)
  const btnCadastrar = document.getElementById("btn-cadastrar");
  if (btnCadastrar) {
    btnCadastrar.addEventListener("click", () => {
      window.location.href = CADASTRO_URL;
    });
  }

  render();
});

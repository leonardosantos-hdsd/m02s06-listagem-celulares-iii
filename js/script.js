(function () {
  const STORAGE_KEY = "celulares";

  // --- Seletores principais
  const form = document.getElementById("formCadastro");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnVoltar = document.getElementById("btnVoltar");

  const marcaEl = document.getElementById("marca");
  const modeloEl = document.getElementById("modelo");
  const corEl = document.getElementById("cor");
  const valorEl = document.getElementById("valor");
  const infoEl = document.getElementById("info");

  // Estado de edição
  let editIndex = null; // quando !== null, estamos editando

  // --- Utils
  function getCondicao() {
    const checked = document.querySelector('input[name="condicao"]:checked');
    return checked ? checked.value : "";
  }

  function setCondicao(valor) {
    const radio = document.querySelector(`input[name="condicao"][value="${valor}"]`);
    if (radio) radio.checked = true;
  }

  function validar() {
    const marca = marcaEl.value?.trim();
    const modelo = modeloEl.value?.trim();
    const cor = corEl.value?.trim();
    const valor = String(valorEl.value ?? "").trim();
    const condicao = getCondicao();

    const camposPreenchidos =
      marca !== "" && modelo !== "" && cor !== "" && valor !== "" && condicao !== "";

    const valorValido = !isNaN(Number(valor)) && Number(valor) > 0;

    btnSalvar.disabled = !(camposPreenchidos && valorValido);
  }

  [marcaEl, modeloEl, corEl, valorEl, infoEl].forEach((el) =>
    el.addEventListener("input", validar)
  );
  document.querySelectorAll('input[name="condicao"]').forEach((el) =>
    el.addEventListener("change", validar)
  );

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

  function limparFormulario() {
    form.reset();
    const radioNovo = document.querySelector('input[name="condicao"][value="novo"]');
    if (radioNovo) radioNovo.checked = true;
    validar();
  }

  // --- Detecta modo edição via ?edit=<index>
  function initEdicaoSeNecessario() {
    const params = new URLSearchParams(window.location.search);
    const idxStr = params.get("edit");
    if (idxStr === null) return;

    const idx = Number(idxStr);
    const lista = carregarLista();

    if (!Number.isInteger(idx) || idx < 0 || idx >= lista.length) {
      // índice inválido → ignora edição
      return;
    }

    editIndex = idx;
    const item = lista[idx];

    // Pré-preenche
    marcaEl.value = item.marca ?? "";
    modeloEl.value = item.modelo ?? "";
    corEl.value = item.cor ?? "";
    valorEl.value = item.valor ?? "";
    setCondicao(item.condicao ?? "novo");
    infoEl.value = item.info ?? "";

    // Troca rótulo do botão para deixar claro que é edição (opcional)
    if (btnSalvar) btnSalvar.textContent = "Salvar alterações";

    validar();
  }

  // --- Submit: insere OU atualiza
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    validar();
    if (btnSalvar.disabled) return;

    const novoItem = {
      marca: marcaEl.value.trim(),
      modelo: modeloEl.value.trim(),
      cor: corEl.value.trim(),
      valor: Number(valorEl.value),
      condicao: getCondicao(),
      info: infoEl.value.trim(),
      atualizadoEm: new Date().toISOString(),
    };

    const lista = carregarLista();

    if (editIndex !== null) {
      // Atualiza o registro existente
      const anterior = lista[editIndex] ?? {};
      lista[editIndex] = {
        ...anterior,
        ...novoItem,
        criadoEm: anterior?.criadoEm ?? new Date().toISOString(),
      };
      salvarLista(lista);

      // limpa query ?edit=...
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete("edit");
        window.history.replaceState({}, "", url.toString());
      }

      window.alert("Dados salvos com sucesso (registro atualizado).");
      // Você pode redirecionar de volta à listagem, se quiser:
      // window.location.href = "listagem.html";
    } else {
      // Inserção nova
      lista.push({
        ...novoItem,
        criadoEm: new Date().toISOString(),
      });
      salvarLista(lista);
      window.alert("Dados salvos com sucesso");
    }

    limparFormulario();
    editIndex = null;
    if (btnSalvar) btnSalvar.textContent = "Salvar"; // volta ao padrão
  });

  // --- Voltar
  if (btnVoltar) {
    btnVoltar.addEventListener("click", function () {
      window.location.href = "listagem.html";
    });
  }

  // Inicializações
  validar();
  initEdicaoSeNecessario();
})();

document.addEventListener("DOMContentLoaded", function () {

  // ===== Dados de exemplo (mock) para cada tipo de documento =====
  // Em uma versão com back-end, isso viria da IA que processa o arquivo/texto real.
  const exemplos = {
    contrato: {
      descricao: "Contrato de prestação de serviços com vigência de 12 meses.",
      valor: "R$ 450,00 por mês",
      vencimento: "05/09/2026",
      vencimentoTitulo: "Próximo pagamento",
      acao: "Revise a cláusula de rescisão e o prazo de aviso antes de assinar.",
      lembrete: "Avisaremos antes da renovação automática."
    },
    laudo: {
      descricao: "Exame com resultados dentro da faixa considerada normal, com um ponto de atenção leve.",
      valor: null,
      vencimento: "Repetir em 3 meses",
      vencimentoTitulo: "Acompanhamento",
      acao: "Leve este resumo à sua próxima consulta médica.",
      lembrete: "Avisaremos antes do exame de acompanhamento."
    },
    boleto: {
      descricao: "Fatura de serviço referente ao mês atual.",
      valor: "R$ 129,90",
      vencimento: "10/09/2026",
      vencimentoTitulo: "Vencimento",
      acao: "Pague até a data de vencimento para evitar multa e juros.",
      lembrete: "Avisaremos antes do vencimento."
    },
    juridico: {
      descricao: "Notificação extrajudicial sobre uma pendência contratual.",
      valor: null,
      vencimento: "Prazo de resposta: 15 dias",
      vencimentoTitulo: "Prazo",
      acao: "Responda dentro do prazo indicado ou procure orientação jurídica.",
      lembrete: "Avisaremos antes do prazo terminar."
    },
    publico: {
      descricao: "Edital de processo seletivo com vagas limitadas.",
      valor: null,
      vencimento: "Inscrições até 20/09/2026",
      vencimentoTitulo: "Prazo de inscrição",
      acao: "Separe os documentos exigidos e se inscreva pelo site oficial.",
      lembrete: "Avisaremos antes do fim das inscrições."
    },
    correspondencia: {
      descricao: "Comunicado informando uma alteração nos seus dados de cobrança.",
      valor: null,
      vencimento: null,
      vencimentoTitulo: "Vencimento",
      acao: "Confira se os dados informados estão corretos e guarde este aviso.",
      lembrete: null
    },
    outro: {
      descricao: "Documento enviado para uma análise geral do conteúdo.",
      valor: null,
      vencimento: null,
      vencimentoTitulo: "Vencimento",
      acao: "Leia com atenção e guarde uma cópia para referência futura.",
      lembrete: null
    }
  };

  const tipoGrid = document.getElementById("tipoGrid");
  const tabArquivo = document.getElementById("tabArquivo");
  const tabTexto = document.getElementById("tabTexto");
  const painelArquivo = document.getElementById("painelArquivo");
  const painelTexto = document.getElementById("painelTexto");

  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const uploadArquivo = document.getElementById("uploadArquivo");
  const uploadArquivoNome = document.getElementById("uploadArquivoNome");
  const uploadArquivoRemover = document.getElementById("uploadArquivoRemover");
  const textoArea = document.getElementById("textoArea");

  const btnContinuar = document.getElementById("btnContinuar");
  const loadingOverlay = document.getElementById("loadingOverlay");

  const modalOverlay = document.getElementById("modalOverlay");
  const resultClose = document.getElementById("resultClose");
  const resultArquivoIcon = document.getElementById("resultArquivoIcon");
  const resultArquivoNome = document.getElementById("resultArquivoNome");
  const resultDescricao = document.getElementById("resultDescricao");
  const linhaValor = document.getElementById("linhaValor");
  const resultValor = document.getElementById("resultValor");
  const linhaVencimento = document.getElementById("linhaVencimento");
  const resultVencimento = document.getElementById("resultVencimento");
  const resultVencimentoTitulo = document.getElementById("resultVencimentoTitulo");
  const resultAcao = document.getElementById("resultAcao");
  const lembreteBox = document.getElementById("lembreteBox");
  const lembreteTexto = document.getElementById("lembreteTexto");
  const btnNovoDocumento = document.getElementById("btnNovoDocumento");

  let tipoSelecionado = null;
  let modoEnvio = "arquivo"; // "arquivo" ou "texto"
  let arquivoSelecionado = null;

  // ===== Passo 1: escolher o tipo de documento =====
  tipoGrid.addEventListener("click", function (e) {
    const card = e.target.closest(".tipoCard");
    if (!card) return;

    tipoGrid.querySelectorAll(".tipoCard").forEach(c => c.classList.remove("tipoCard--ativo"));
    card.classList.add("tipoCard--ativo");

    tipoSelecionado = card.dataset.tipo;
    atualizarBotaoContinuar();
  });

  // ===== Alternar entre "Enviar arquivo" e "Colar texto" =====
  function selecionarModo(modo) {
    modoEnvio = modo;

    tabArquivo.classList.toggle("enviarCard--ativo", modo === "arquivo");
    tabTexto.classList.toggle("enviarCard--ativo", modo === "texto");

    painelArquivo.hidden = modo !== "arquivo";
    painelTexto.hidden = modo !== "texto";

    atualizarBotaoContinuar();
  }

  tabArquivo.addEventListener("click", () => selecionarModo("arquivo"));
  tabTexto.addEventListener("click", () => selecionarModo("texto"));

  // ===== Upload de arquivo =====
  uploadArea.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      mostrarArquivo(fileInput.files[0]);
    }
  });

  ["dragover", "dragenter"].forEach(evento => {
    uploadArea.addEventListener(evento, function (e) {
      e.preventDefault();
      uploadArea.style.borderColor = "var(--green)";
    });
  });

  ["dragleave", "drop"].forEach(evento => {
    uploadArea.addEventListener(evento, function (e) {
      e.preventDefault();
      uploadArea.style.borderColor = "";
    });
  });

  uploadArea.addEventListener("drop", function (e) {
    const arquivos = e.dataTransfer.files;
    if (arquivos.length > 0) {
      mostrarArquivo(arquivos[0]);
    }
  });

  function mostrarArquivo(arquivo) {
    arquivoSelecionado = arquivo;
    uploadArquivoNome.textContent = arquivo.name;
    uploadArea.hidden = true;
    uploadArquivo.hidden = false;
    atualizarBotaoContinuar();
  }

  uploadArquivoRemover.addEventListener("click", function () {
    arquivoSelecionado = null;
    fileInput.value = "";
    uploadArea.hidden = false;
    uploadArquivo.hidden = true;
    atualizarBotaoContinuar();
  });

  // ===== Colar texto =====
  textoArea.addEventListener("input", atualizarBotaoContinuar);

  // ===== Habilita/desabilita o botão Continuar =====
  function atualizarBotaoContinuar() {
    const temEnvio = modoEnvio === "arquivo"
      ? !!arquivoSelecionado
      : textoArea.value.trim().length > 0;

    btnContinuar.disabled = !temEnvio;
  }

  // ===== Clique em Continuar: mostra loading e depois o pop-up =====
  btnContinuar.addEventListener("click", function () {
    if (btnContinuar.disabled) return;

    loadingOverlay.hidden = false;

    setTimeout(function () {
      abrirResultado();
      loadingOverlay.hidden = true;
    }, 1300);
  });

  function abrirResultado() {
    const dados = exemplos[tipoSelecionado] || exemplos.outro;

    // Nome/ícone do "arquivo" analisado, de acordo com o que o usuário enviou
    if (modoEnvio === "arquivo" && arquivoSelecionado) {
      const nome = arquivoSelecionado.name;
      const extensao = nome.split(".").pop().toUpperCase();
      resultArquivoIcon.textContent = extensao.length <= 4 ? extensao : "DOC";
      resultArquivoNome.textContent = nome;
    } else {
      const texto = textoArea.value.trim();
      const previa = texto.length > 28 ? texto.slice(0, 28) + "…" : texto;
      resultArquivoIcon.textContent = "TXT";
      resultArquivoNome.textContent = previa || "Texto colado";
    }

    resultDescricao.textContent = dados.descricao;

    if (dados.valor) {
      resultValor.textContent = dados.valor;
      linhaValor.hidden = false;
    } else {
      linhaValor.hidden = true;
    }

    if (dados.vencimento) {
      resultVencimentoTitulo.textContent = dados.vencimentoTitulo || "Vencimento";
      resultVencimento.textContent = dados.vencimento;
      linhaVencimento.hidden = false;
    } else {
      linhaVencimento.hidden = true;
    }

    resultAcao.textContent = dados.acao;

    if (dados.lembrete) {
      lembreteTexto.textContent = dados.lembrete;
      lembreteBox.hidden = false;
    } else {
      lembreteBox.hidden = true;
    }

    modalOverlay.hidden = false;
  }

  function fecharResultado() {
    modalOverlay.hidden = true;
  }

  resultClose.addEventListener("click", fecharResultado);
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) fecharResultado();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modalOverlay.hidden) fecharResultado();
  });

  // ===== Recomeçar =====
  btnNovoDocumento.addEventListener("click", function () {
    fecharResultado();

    tipoSelecionado = null;
    tipoGrid.querySelectorAll(".tipoCard").forEach(c => c.classList.remove("tipoCard--ativo"));

    arquivoSelecionado = null;
    fileInput.value = "";
    uploadArea.hidden = false;
    uploadArquivo.hidden = true;

    textoArea.value = "";
    selecionarModo("arquivo");

    atualizarBotaoContinuar();

    document.getElementById("passoTipo").scrollIntoView({ behavior: "smooth", block: "start" });
  });

});

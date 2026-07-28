document.addEventListener("DOMContentLoaded", function () {

  // ===== Dados de exemplo (mock) para cada tipo de documento =====
  // Em uma versão com back-end, isso viria da IA que processa o arquivo real.
  const exemplos = {
    aluguel: {
      resumo: [
        "Este é um contrato de aluguel de imóvel residencial com duração de 30 meses.",
        "O valor do aluguel é reajustado uma vez por ano pelo índice IGP-M.",
        "Há uma multa caso você queira sair do contrato antes do prazo combinado.",
        "Você é responsável por pequenos consertos; consertos estruturais são do proprietário."
      ],
      acao: [
        "Guarde uma cópia assinada do contrato em local seguro.",
        "Anote a data de vencimento do aluguel todo mês.",
        "Avise o proprietário com antecedência caso queira encerrar o contrato."
      ],
      lembrete: "Vencimento do aluguel: todo dia 5 do mês."
    },
    laudo: {
      resumo: [
        "O exame indicou um resultado dentro da faixa considerada normal.",
        "Foi identificado um pequeno ponto de atenção que não é urgente.",
        "O médico recomenda repetir o exame em alguns meses para acompanhar."
      ],
      acao: [
        "Leve este resumo na sua próxima consulta.",
        "Agende o exame de acompanhamento indicado pelo médico.",
        "Caso sinta algum sintoma novo, procure atendimento antes da data marcada."
      ],
      lembrete: "Refazer exame de acompanhamento em 3 meses."
    },
    boleto: {
      resumo: [
        "Esta conta se refere ao consumo do mês anterior, não do mês atual.",
        "O valor inclui uma taxa de serviço além do consumo.",
        "Pagando após o vencimento, incide multa e juros por dia de atraso."
      ],
      acao: [
        "Confira se o valor está de acordo com o consumo do período.",
        "Pague até a data de vencimento para evitar multa.",
        "Guarde o comprovante de pagamento por segurança."
      ],
      lembrete: "Vencimento da conta em 5 dias."
    },
    edital: {
      resumo: [
        "Este edital abre inscrições para um processo seletivo com vagas limitadas.",
        "As inscrições precisam ser feitas apenas pelo site indicado, dentro do prazo.",
        "É necessário enviar documentos digitalizados junto com a inscrição."
      ],
      acao: [
        "Separe os documentos pedidos antes de começar a inscrição.",
        "Faça a inscrição com alguns dias de antecedência do prazo final.",
        "Guarde o comprovante de inscrição gerado pelo site."
      ],
      lembrete: "Prazo final das inscrições se aproximando."
    }
  };

  const tipoGrid = document.getElementById("tipoGrid");
  const passoUpload = document.getElementById("passoUpload");
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const uploadArquivo = document.getElementById("uploadArquivo");
  const uploadArquivoNome = document.getElementById("uploadArquivoNome");
  const uploadArquivoRemover = document.getElementById("uploadArquivoRemover");
  const btnSimplificar = document.getElementById("btnSimplificar");
  const passoLoading = document.getElementById("passoLoading");
  const passoResultado = document.getElementById("passoResultado");
  const resumoLista = document.getElementById("resumoLista");
  const acaoLista = document.getElementById("acaoLista");
  const lembreteBox = document.getElementById("lembreteBox");
  const lembreteTexto = document.getElementById("lembreteTexto");
  const btnLembrete = document.getElementById("btnLembrete");
  const btnNovoDocumento = document.getElementById("btnNovoDocumento");

  let tipoSelecionado = null;

  // ===== Passo 1: escolher o tipo de documento =====
  tipoGrid.addEventListener("click", function (e) {
    const card = e.target.closest(".tipoCard");
    if (!card) return;

    tipoGrid.querySelectorAll(".tipoCard").forEach(c => c.classList.remove("tipoCard--ativo"));
    card.classList.add("tipoCard--ativo");

    tipoSelecionado = card.dataset.tipo;
    passoUpload.classList.remove("ferramentaCard--disabled");
    passoUpload.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // ===== Passo 2: upload do arquivo (simulado) =====
  uploadArea.addEventListener("click", function () {
    fileInput.click();
  });

  fileInput.addEventListener("change", function () {
    if (fileInput.files.length > 0) {
      mostrarArquivo(fileInput.files[0].name);
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
      mostrarArquivo(arquivos[0].name);
    }
  });

  function mostrarArquivo(nome) {
    uploadArquivoNome.textContent = nome;
    uploadArea.hidden = true;
    uploadArquivo.hidden = false;
    btnSimplificar.disabled = false;
  }

  uploadArquivoRemover.addEventListener("click", function () {
    fileInput.value = "";
    uploadArea.hidden = false;
    uploadArquivo.hidden = true;
    btnSimplificar.disabled = true;
  });

  // ===== Passo 3: gerar o resultado (simulado) =====
  btnSimplificar.addEventListener("click", function () {
    if (!tipoSelecionado) return;

    passoUpload.hidden = true;
    passoLoading.hidden = false;

    // Simula o tempo de processamento da IA
    setTimeout(function () {
      exibirResultado(tipoSelecionado);
      passoLoading.hidden = true;
      passoResultado.hidden = false;
      passoResultado.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1400);
  });

  function exibirResultado(tipo) {
    const dados = exemplos[tipo];

    resumoLista.innerHTML = "";
    dados.resumo.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      resumoLista.appendChild(li);
    });

    acaoLista.innerHTML = "";
    dados.acao.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      acaoLista.appendChild(li);
    });

    if (dados.lembrete) {
      lembreteTexto.textContent = dados.lembrete;
      lembreteBox.hidden = false;
    } else {
      lembreteBox.hidden = true;
    }
  }

  btnLembrete.addEventListener("click", function () {
    btnLembrete.textContent = "Adicionado ✓";
    btnLembrete.disabled = true;
  });

  // ===== Recomeçar =====
  btnNovoDocumento.addEventListener("click", function () {
    tipoSelecionado = null;
    tipoGrid.querySelectorAll(".tipoCard").forEach(c => c.classList.remove("tipoCard--ativo"));

    fileInput.value = "";
    uploadArea.hidden = false;
    uploadArquivo.hidden = true;
    btnSimplificar.disabled = true;

    passoUpload.classList.add("ferramentaCard--disabled");
    passoUpload.hidden = false;
    passoResultado.hidden = true;

    btnLembrete.textContent = "Adicionar ao calendário";
    btnLembrete.disabled = false;

    document.getElementById("passoTipo").scrollIntoView({ behavior: "smooth", block: "start" });
  });

});

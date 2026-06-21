const areaPacientes = document.getElementById("pacientes");

function adicionarPaciente() {
  const total = document.querySelectorAll(".paciente-card").length + 1;

  const card = document.createElement("div");
  card.className = "card paciente-card";

  card.innerHTML = `
    <h3>👤 Paciente ${total}</h3>

    <div class="campo">
      <label>Número da ocorrência</label>
      <input type="text" class="ocorrencia" placeholder="Ex: S1963374">
    </div>

    <div class="campo">
      <label>Nome do paciente</label>
      <input type="text" class="nomePaciente" placeholder="Digite o nome do paciente">
    </div>

    <div class="campo">
      <label>Idade</label>
      <input type="number" class="idadePaciente" placeholder="Ex: 26">
    </div>

    <div class="campo">
      <label>Status</label>
      <select class="statusPaciente">
        <option value="removido">Removido</option>
        <option value="removida">Removida</option>
        <option value="recusou">Recusou atendimento</option>
        <option value="finalizado">Finalizado no hospital</option>
        <option value="obito">Óbito</option>
      </select>
    </div>

    <div class="campo">
      <label>Viatura</label>
      <input list="listaViaturas" type="text" class="viatura" placeholder="Ex: USA, USB 01, BAS">
    </div>

    <div class="campo">
      <label>Hospital / destino</label>
      <input list="listaHospitais" type="text" class="hospital" placeholder="Ex: Hospital Regional de Limoeiro">
    </div>

    <div class="campo">
      <label>Observação do paciente</label>
      <input type="text" class="obsPaciente" placeholder="Ex: recusou atendimento no local">
    </div>

    <button type="button" class="botao-remover" onclick="removerPaciente(this)">
      − Excluir paciente
    </button>
  `;

  areaPacientes.appendChild(card);
}

function removerPaciente(botao) {
  botao.closest(".paciente-card").remove();
  atualizarNumeracaoPacientes();
}

function atualizarNumeracaoPacientes() {
  const pacientes = document.querySelectorAll(".paciente-card");

  pacientes.forEach((card, index) => {
    const titulo = card.querySelector("h3");
    if (titulo) titulo.textContent = `👤 Paciente ${index + 1}`;
  });
}

function valor(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function formatarNumero(numero) {
  return String(numero).padStart(2, "0");
}

function textoVitimas(quantidade) {
  return quantidade === 1 ? "01 vítima" : `${formatarNumero(quantidade)} vítimas`;
}

function textoPacientes(quantidade) {
  return quantidade === 1 ? "01 paciente" : `${formatarNumero(quantidade)} pacientes`;
}

function gerarObservacaoAutomatica() {
  const pacientes = document.querySelectorAll(".paciente-card");
  const local = valor("local");
  const municipio = valor("municipio");

  let totalVitimas = pacientes.length;
  let removidos = [];
  let recusas = 0;
  let obitos = 0;
  let finalizados = 0;

  pacientes.forEach(card => {
    const status = card.querySelector(".statusPaciente").value;
    const viatura = card.querySelector(".viatura").value.trim();
    const hospital = card.querySelector(".hospital").value.trim();

    if (status === "removido" || status === "removida") {
      removidos.push({ viatura, hospital });
    }

    if (status === "recusou") recusas++;
    if (status === "obito") obitos++;
    if (status === "finalizado") finalizados++;
  });

  let texto = "";

  texto += `📊 Ocorrência com ${textoVitimas(totalVitimas)}`;

  if (local) texto += ` na ${local}`;
  if (municipio) texto += ` – ${municipio}`;

  texto += `.\n\n`;

  if (removidos.length > 0) {
    const viaturas = [...new Set(removidos.map(item => item.viatura).filter(Boolean))];
    const hospitais = [...new Set(removidos.map(item => item.hospital).filter(Boolean))];

    const textoViaturas = viaturas.length > 0 ? viaturas.join(", ") : "viatura";
    const textoHospitais = hospitais.length > 0 ? hospitais.join(", ") : "";

    texto += `🚑 ${textoViaturas} realizou a remoção de ${textoVitimas(removidos.length)}`;

    if (textoHospitais) {
      texto += ` para ${textoHospitais}`;
    }

    texto += `.\n\n`;
  }

  if (finalizados > 0) {
    texto += `🏥 ${textoPacientes(finalizados)} finalizado(s) em unidade hospitalar.\n\n`;
  }

  if (recusas > 0) {
    texto += `❌ ${textoVitimas(recusas)} recusou/recusaram atendimento no local.\n\n`;
  }

  if (obitos > 0) {
    texto += `⚫ ${textoVitimas(obitos)} em óbito no local.\n\n`;
  }

  texto += `✅ Ocorrência finalizada.`;

  document.getElementById("observacaoGeral").value = texto.trim();
}

function gerarMensagemOcorrencia() {
  const titulo = valor("titulo") || "OCORRÊNCIA";
  const observacaoGeral = valor("observacaoGeral");
  const pacientes = document.querySelectorAll(".paciente-card");

  let mensagem = `🚑 *${titulo.toUpperCase()}*\n\n`;

  pacientes.forEach(card => {
    const ocorrencia = card.querySelector(".ocorrencia").value.trim();
    const nome = card.querySelector(".nomePaciente").value.trim();
    const idade = card.querySelector(".idadePaciente").value.trim();
    const status = card.querySelector(".statusPaciente").value;
    const viatura = card.querySelector(".viatura").value.trim();
    const hospital = card.querySelector(".hospital").value.trim();
    const obs = card.querySelector(".obsPaciente").value.trim();

    if (ocorrencia) mensagem += `📋 *${ocorrencia}*\n`;
    if (nome) mensagem += `👤 ${nome}\n`;
    if (idade) mensagem += `🎂 ${idade} anos\n`;

    if (status === "recusou") {
      mensagem += `❌ Recusou atendimento no local\n`;
    } else if (status === "removido") {
      mensagem += `🚑 Removido pela ${viatura || "-"}\n`;
    } else if (status === "removida") {
      mensagem += `🚑 Removida pela ${viatura || "-"}\n`;
    } else if (status === "finalizado") {
      mensagem += `🏥 Finalizado no ${hospital || "-"}\n`;
    } else if (status === "obito") {
      mensagem += `⚫ Óbito no local\n`;
    }

    if (
      hospital &&
      status !== "recusou" &&
      status !== "obito" &&
      status !== "finalizado"
    ) {
      mensagem += `🏥 ${hospital}\n`;
    }

    if (obs) {
      mensagem += `📝 ${obs}\n`;
    }

    mensagem += `\n`;
  });

  if (observacaoGeral) {
    mensagem += `ℹ️ ${observacaoGeral}\n`;
  }

  document.getElementById("mensagemOcorrencia").value = mensagem.trim();
}

function copiarMensagemOcorrencia() {
  const mensagem = document.getElementById("mensagemOcorrencia");

  if (!mensagem.value.trim()) {
    alert("Gere a mensagem primeiro.");
    return;
  }

  mensagem.select();
  mensagem.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(mensagem.value)
    .then(() => alert("Mensagem copiada! Agora é só colar no WhatsApp."))
    .catch(() => {
      document.execCommand("copy");
      alert("Mensagem copiada!");
    });
}

function limparOcorrencia() {
  if (!confirm("Deseja limpar a ocorrência?")) return;

  document.getElementById("titulo").value = "";
  document.getElementById("municipio").value = "";
  document.getElementById("local").value = "";
  document.getElementById("observacaoGeral").value = "";
  document.getElementById("mensagemOcorrencia").value = "";

  areaPacientes.innerHTML = "";
  adicionarPaciente();
}

adicionarPaciente();
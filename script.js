const ambulancias = [
  {
    nome: "USA Paulista",
    icone: "🚑",
    campos: ["Médico(a)", "Enfermeiro(a)", "Técnico(a)", "Telefone"],
    moto: false
  },
  {
    nome: "USB 01",
    icone: "🚑",
    campos: ["Técnico(a)", "Telefone"],
    moto: false
  },
  {
    nome: "USB 02",
    icone: "🚑",
    campos: ["Técnico(a)", "Telefone"],
    moto: false
  },
  {
    nome: "USB 03",
    icone: "🚑",
    campos: ["Técnico(a)", "Telefone"],
    moto: false
  },
  {
    nome: "Equipe Moto",
    icone: "🏍️",
    campos: ["Telefone"],
    moto: true
  }
];

const container = document.getElementById("ambulancias");

function carregarCampos() {
  if (!container) return;

  container.innerHTML = "";

  ambulancias.forEach((amb, index) => {
    const card = document.createElement("div");
    card.className = "card";

    let html = `<h3>${amb.icone} ${amb.nome}</h3>`;

    if (amb.moto) {
      html += `
        <div id="moto-enfermeiros-${index}">
          <div class="campo enfermeiro-moto">
            <label>Enfermeiro(a) 1</label>
            <input type="text" class="moto-enf" placeholder="Digite o nome do enfermeiro(a)">
          </div>

          <div class="campo enfermeiro-moto">
            <label>Enfermeiro(a) 2</label>
            <input type="text" class="moto-enf" placeholder="Digite o nome do enfermeiro(a)">
          </div>
        </div>

        <div class="botoes-moto">
          <button type="button" class="botao-adicionar" onclick="adicionarEnfermeiroMoto(${index})">
            + Adicionar enfermeiro
          </button>

          <button type="button" class="botao-remover" onclick="removerEnfermeiroMoto(${index})">
            − Remover enfermeiro
          </button>
        </div>
      `;
    }

    amb.campos.forEach(campo => {
      const id = `${index}-${campo}`;

      html += `
        <div class="campo">
          <label>${campo}</label>
          <input type="text" id="${id}" placeholder="Digite ${campo.toLowerCase()}">
        </div>
      `;
    });

    html += `
      <div class="campo">
        <label>Status</label>
        <select id="${index}-status">
          <option value="ATIVADA">🟢 ATIVADA</option>
          <option value="DM QUEBRADA">🟠 DM QUEBRADA</option>
          <option value="SEM EQUIPE">⚪ SEM EQUIPE</option>
          <option value="INATIVA">🔴 INATIVA</option>
        </select>
      </div>

      <div class="campo">
        <label>Observação</label>
        <input type="text" id="${index}-obs" placeholder="Ex: pneu furado, sem técnico...">
      </div>
    `;

    card.innerHTML = html;
    container.appendChild(card);
  });
}

function adicionarEnfermeiroMoto(index) {
  const area = document.getElementById(`moto-enfermeiros-${index}`);
  if (!area) return;

  const total = area.querySelectorAll(".moto-enf").length + 1;

  const div = document.createElement("div");
  div.className = "campo enfermeiro-moto";

  div.innerHTML = `
    <label>Enfermeiro(a) ${total}</label>
    <input type="text" class="moto-enf" placeholder="Digite o nome do enfermeiro(a)">
  `;

  area.appendChild(div);
}

function removerEnfermeiroMoto(index) {
  const area = document.getElementById(`moto-enfermeiros-${index}`);
  if (!area) return;

  const enfermeiros = area.querySelectorAll(".enfermeiro-moto");

  if (enfermeiros.length <= 2) {
    alert("A Equipe Moto deve ter pelo menos 2 enfermeiros.");
    return;
  }

  enfermeiros[enfermeiros.length - 1].remove();
}

function pegarValor(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function gerarMensagem() {
  const campoMensagem = document.getElementById("mensagem");
  if (!campoMensagem) return;

  const hoje = new Date();

  const data = hoje.toLocaleDateString("pt-BR");
  const diaSemana = hoje.toLocaleDateString("pt-BR", {
    weekday: "long"
  });

  let mensagem = `🚑 *PLANTÃO PAULISTA*\n`;
  mensagem += `📅 ${data} - ${diaSemana}\n\n`;

  ambulancias.forEach((amb, index) => {
    const status = pegarValor(`${index}-status`);
    const obs = pegarValor(`${index}-obs`);

    mensagem += `${amb.icone} *${amb.nome}*\n`;

    if (amb.moto) {
      const enfermeiros = document.querySelectorAll(`#moto-enfermeiros-${index} .moto-enf`);

      enfermeiros.forEach((input, i) => {
        const valor = input.value.trim();

        if (valor) {
          mensagem += `👩‍⚕️ Enf ${i + 1}: ${valor}\n`;
        }
      });
    }

    amb.campos.forEach(campo => {
      const valor = pegarValor(`${index}-${campo}`);

      if (campo.includes("Médico")) {
        mensagem += `🩺 Médico: ${valor || "-"}\n`;
      }

      if (campo.includes("Enfermeiro")) {
        mensagem += `👩‍⚕️ Enf: ${valor || "-"}\n`;
      }

      if (campo.includes("Técnico")) {
        mensagem += `🧑‍⚕️ Tec: ${valor || "-"}\n`;
      }

      if (campo.includes("Telefone")) {
        mensagem += `📞 Tel: ${valor || "-"}\n`;
      }
    });

    mensagem += `📌 Status: *${status || "-"}*\n`;

    if (obs) {
      mensagem += `📝 Obs: ${obs}\n`;
    }

    mensagem += `\n`;
  });

  campoMensagem.value = mensagem;
}

function copiarMensagem() {
  const mensagem = document.getElementById("mensagem");

  if (!mensagem || !mensagem.value.trim()) {
    alert("Gere a mensagem primeiro.");
    return;
  }

  mensagem.select();
  mensagem.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(mensagem.value)
    .then(() => {
      alert("Mensagem copiada! Agora é só colar no WhatsApp.");
    })
    .catch(() => {
      document.execCommand("copy");
      alert("Mensagem copiada!");
    });
}

function limparTudo() {
  const confirmar = confirm("Deseja limpar todos os campos?");

  if (!confirmar) return;

  carregarCampos();

  const mensagem = document.getElementById("mensagem");
  if (mensagem) mensagem.value = "";

  gerarMensagem();
}

carregarCampos();
gerarMensagem();

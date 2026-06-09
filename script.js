const ambulancias = [
  {
    nome: "USA Paulista",
    campos: ["Médico(a)", "Enfermeiro(a)", "Técnico(a)", "Telefone"]
  },
  {
    nome: "USB 01",
    campos: ["Técnico(a)", "Telefone"]
  },
  {
    nome: "USB 02",
    campos: ["Técnico(a)", "Telefone"]
  },
  {
    nome: "USB 03",
    campos: ["Técnico(a)", "Telefone"]
  },
  {
    nome: "USB 04",
    campos: ["Técnico(a)", "Telefone"]
  },
  {
    nome: "Equipe Moto",
    campos: ["Enfermeiro(a) 1", "Enfermeiro(a) 2", "Telefone"]
  }
];

const container = document.getElementById("ambulancias");

function carregarCampos() {
  ambulancias.forEach((amb, index) => {
    const card = document.createElement("div");
    card.className = "card";

    let html = `<h3>🚑 ${amb.nome}</h3>`;

    amb.campos.forEach(campo => {
      const id = `${index}-${campo}`;

      html += `
        <div class="campo">
          <label>${campo}</label>
          <input type="text" id="${id}" placeholder="Digite ${campo.toLowerCase()}" />
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
        <input type="text" id="${index}-obs" placeholder="Ex: pneu furado, sem técnico..." />
      </div>
    `;

    card.innerHTML = html;
    container.appendChild(card);
  });
}

function pegarValor(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function gerarMensagem() {
  const hoje = new Date();
  const data = hoje.toLocaleDateString("pt-BR");
  const diaSemana = hoje.toLocaleDateString("pt-BR", { weekday: "long" });

  let mensagem = `🚑 *PLANTÃO PAULISTA*\n`;
  mensagem += `📅 ${data} - ${diaSemana}\n\n`;

  ambulancias.forEach((amb, index) => {
    const status = pegarValor(`${index}-status`);
    const obs = pegarValor(`${index}-obs`);

    mensagem += `🚑 *${amb.nome}*\n`;

    amb.campos.forEach(campo => {
      const valor = pegarValor(`${index}-${campo}`);

      if (campo.includes("Médico")) {
        if (valor) {
          mensagem += `🩺 Médico: ${valor}\n`;
        }
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

    mensagem += `📌 Status: *${status}*\n`;

    if (obs) {
      mensagem += `📝 Obs: ${obs}\n`;
    }

    mensagem += `\n`;
  });

  document.getElementById("mensagem").value = mensagem;
}

function copiarMensagem() {
  const mensagem = document.getElementById("mensagem");

  if (!mensagem.value.trim()) {
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

  document.querySelectorAll("input").forEach(input => input.value = "");
  document.querySelectorAll("select").forEach(select => select.selectedIndex = 0);
  document.getElementById("mensagem").value = "";
}

carregarCampos();
gerarMensagem();
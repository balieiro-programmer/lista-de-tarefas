
// 1. Capturando os elementos do HTML
const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("tarefa");
const listaTarefas = document.getElementById("lista-tarefas");
const contador = document.getElementById("contador");
const concluidas = document.getElementById("concluidas");
const limparConcluidas = document.getElementById("limpar-concluidas");

// 2. Atualizando os contadores
function atualizarContadores() {
    const total = listaTarefas.children.length;
    const totalConcluidas = listaTarefas.querySelectorAll(".concluida").length;

    contador.textContent = `Tarefas: ${total}`;
    concluidas.textContent = `Concluídas: ${totalConcluidas}`;
}

// 3. Salvando tarefas no navegador
function salvarTarefas() {
    const tarefas = [];

    listaTarefas.querySelectorAll("li").forEach(function(tarefa) {
        const texto = tarefa.querySelector("span").textContent;
        const concluida = tarefa.classList.contains("concluida");

        tarefas.push({
            texto: texto,
            concluida: concluida
        });
    });

    localStorage.setItem("minhasTarefas", JSON.stringify(tarefas));
}

// 4. Criando uma tarefa na tela
function criarTarefa(textoTarefa, estaConcluida = false) {
    const novaTarefa = document.createElement("li");

    const texto = document.createElement("span");
    texto.textContent = textoTarefa;

    const botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = "Concluir";

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.classList.add("excluir");

    if (estaConcluida) {
        novaTarefa.classList.add("concluida");
        botaoConcluir.textContent = "Desfazer";
    }

    // Evento de conclusão
    botaoConcluir.addEventListener("click", function() {
        novaTarefa.classList.toggle("concluida");

        if (novaTarefa.classList.contains("concluida")) {
            botaoConcluir.textContent = "Desfazer";
        } else {
            botaoConcluir.textContent = "Concluir";
        }

        atualizarContadores();
        salvarTarefas();
    });

    // Evento de exclusão
    botaoExcluir.addEventListener("click", function() {
        novaTarefa.remove();
        atualizarContadores();
        salvarTarefas();
    });

    novaTarefa.appendChild(texto);
    novaTarefa.appendChild(botaoConcluir);
    novaTarefa.appendChild(botaoExcluir);

    listaTarefas.appendChild(novaTarefa);
}

// 5. Carregando tarefas salvas
function carregarTarefas() {
    const tarefasSalvas = localStorage.getItem("minhasTarefas");

    if (tarefasSalvas === null) {
        atualizarContadores();
        return;
    }

    const tarefas = JSON.parse(tarefasSalvas);

    tarefas.forEach(function(tarefaSalva) {
        criarTarefa(tarefaSalva.texto, tarefaSalva.concluida);
    });

    atualizarContadores();
}

// 6. Adicionando novas tarefas
formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const textoTarefa = campoTarefa.value.trim();

    if (textoTarefa === "") {
        alert("Digite uma tarefa antes de adicionar!");
        return;
    }

    criarTarefa(textoTarefa);

    atualizarContadores();
    salvarTarefas();

    campoTarefa.value = "";
    campoTarefa.focus();
});

limparConcluidas.addEventListener("click", function() {
    const tarefasConcluidas = listaTarefas.querySelectorAll(".concluida");

    tarefasConcluidas.forEach(function(tarefa) {
        tarefa.remove();
    });

    atualizarContadores();
    salvarTarefas();
});

// 7. Executando o carregamento ao abrir a página
carregarTarefas();

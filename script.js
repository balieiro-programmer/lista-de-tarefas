//1. Capturando os elementos do HTML
const campoSenha = document.getElementById("senha");
const tamanhoSenha = 
document.getElementById("tamanho");

const maiusculas = document.getElementById("maiusculas");
const minusculas = document.getElementById("minusculas");
const numeros = document.getElementById("numeros");
const simbolos = document.getElementById("simbolos");

const botaoGerar = document.getElementById("gerar");
const botaoCopiar = document.getElementById("copiar");

//2. Função para sortear um índice com segurança
function sortearIndice(maximo) {
   const limite = Math.floor(4294967296 / maximo) * maximo;
   const numero = new Uint32Array(1);
   
   do {
      crypto.getRandomValues(numero);
   } while (numero[0] >= limite);
   
   return numero[0] % maximo;
}

//3. Função para misturar os caracteres 
function embaralhar(lista) {
   for (let i = lista.legth - 1; i > 0; i--) {
      const j = sortearIndice(i+1);

      [lista[i], lista[j]] = [lista[j], lista[i]];
   } 

   return lista;
}

//4. Função principal: gerar senha
function gerarSenha() {
   const tamanho = Number(tamanhoSenha.value);
   
   if(!Number.isInteger(tamanho) || tamanho < 4 || tamanho > 32) {
      alert("Escolha um tamanho entre 4 e 32");
      return;
   }

   let caracteres = "";
   const gruposSelecionados = [];

   if (maiusculas.checked) {
       const grupo = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      caracteres += grupo;
      gruposSelecionados.push(grupo);
   }

   if (minusculas.checked) {
       const grupo = "abcdefghijklmnopqrstuvwxyz";
       caracteres += grupo;
       gruposSelecionados.push(grupo);
   }

   if (numeros.checked) {
       const grupo = "012456789";
       caracteres += grupo;
       gruposSelecionados.push(grupo);
   }

   if (simbolos.checked) {
       const grupo = "!@#$%¨&*()_+{}[]:;,.<>?";
       caracteres += grupo;
       gruposSelecionados.push(grupo);
   }

   if (gruposSelecionados.length === 0) {
       alert("Selecione pelo menos um tipo de caractere");
       return;
   }

// Garante pelo menos um caractere de cada grupo escolhido
const senha = gruposSelecionados.map(grupo => {
   return grupo[sortearIndice(grupo.length)]; 
});

// Completa a senha até atingir o tamanho escolhido 
while (senha.length < tamanho) {

senha.push(caracteres[sortearIndice(caracteres.length)]);
}

// Mistura os caracteres para evitar uma ordem previsível
embaralhar(senha);

campoSenha.value = senha.join("");
}

//5. Função para copiar a senha
async function copiarSenha(){
  if (campoSenha.value === "") {
      alert("Gere uma senha primeiro!");
      return;
  }

  try {
     await navigator.clipboard.writeText(campoSenha.value);
     alert("Senha copiada com sucesso!");
  } catch (erro) {
      alert("Não foi possível copiar. Verifique a permissão do navegador.");
  }
}

//6. Eventos dos botões
botaoGerar.addEventListener("click", gerarSenha);
botaoCopiar.addEventListener("click", copiarSenha);


<template>
  <form id="form-pergunta-chat">
    <div>
      <div class="listDescription">
        <h3>Lista de ingredientes</h3>
        <span> Digite quantos ingredientes preferir, e pesquise pela melhor receita possível!</span>
      </div>
      <div v-for="(ingredient, index) in ingredients" :key="index">
        <label>
          Ingrediente {{ index + 1 }}:
        </label>
        <b-input-group class="mt-3 ">
          <b-form-input v-model="ingredient.text" placeholder="Digite o seu ingrediente"></b-form-input>
          <b-input-group-append>
            <b-button variant="danger" :disabled="excludeDisabled" @click="deleteIngredient(index)">X</b-button>
          </b-input-group-append>
        </b-input-group>
      </div>
      <b-row class="btnRow">
        <b-col>
          <button class="btn btn-primary mt-4 addBtn" @click="addIngredient">
            +
            Adicionar ingrediente
          </button>
        </b-col>
        <b-col>
          <button type="submit" class="btn btn-outline-primary mt-4 searchBtn" @click="searchRecipes">
            Pesquisar receita
          </button>
        </b-col>
      </b-row>

      <span>{{ searchText }}</span>
    </div>
    <br>
    <div id="resposta"></div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      ingredients: [{
        text: ""
      }],
      searchText: "",
      excludeDisabled: true
    }
  },
  methods: {
    addIngredient: function (e) {
      this.ingredients.push({ text: "" })
      if (this.ingredients.length != 1) {
        this.excludeDisabled = false
      }
      e.preventDefault();
    },
    deleteIngredient: function (index) {
      this.ingredients.splice(index, 1)
      if (this.ingredients.length == 1) {
        this.excludeDisabled = true
      }

    },
    searchRecipes: function () {
      let searchText = "Monte uma receita com os seguintes ingredientes: ";

      this.ingredients.forEach(ingredient => searchText += ingredient.text + ", ")

      this.searchText = searchText

      // Receber o SELECTOR do formulário
      const formPerguntaChat = document.getElementById('form-pergunta-chat');

      // Chave da API do OPENAI
      const OPENAI_API_KEY = "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";

      // Verificar se tem a chave
      if (OPENAI_API_KEY === "") {
        document.getElementById('pergunta').innerHTML = "<span style='color: #f00;'>Necessário colocar a chave na API no arquivo custom.js</span>";
      }

      // Acessa o IF quando tem o SELETOR na página HTML
      if (formPerguntaChat) {

        // Aguardar o usuário clicar no botão Enviar
        formPerguntaChat.addEventListener("submit", async (e) => {

          // Bloquear o recarregamento da página
          e.preventDefault();

          // Substituir o texto do botão para "Pesquisando..."
          //document.getElementById('btn-pergunta-chat').value = "Pesquisando...";

          // Receber o valor do campo pergunta
          let pergunta = searchText

          // Enviar o texto da pergunta para a página HTML
          //document.getElementById('pergunta').innerHTML = pergunta;

          // Limpar a resposta
          document.getElementById('resposta').innerHTML = "<span></span>";

          // Requisição para chatgpt
          await fetch("https://api.openai.com/v1/completions", {

            // Método para enviar os dados
            method: "POST",

            // Dados ennviados no cabeçalho da requisição
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + OPENAI_API_KEY,
            },

            // Enviar os dados no corpo da requisição
            body: JSON.stringify({
              model: "text-davinci-003", //Modelo
              prompt: pergunta, // Texto da pergunta
              max_tokens: 2048, // Tamanho da resposta
              temperature: 0.5 // Criatividade na resposta
            }),
          })
            // Acessa o then quando obtiver resposta
            .then((resposta) => resposta.json())
            .then((dados) => {
              //console.log(dados);
              //console.log(dados.choices[0].text);

              // Enviar o texto da resposta para a página HTML
              document.getElementById('resposta').innerHTML = dados.choices[0].text;
            })
            // Retorna catch quando gerar erro
            .catch((error) => {
              // Enviar o texto da resposta para a página HTML
              document.getElementById('resposta').innerHTML = "Sem resposta";
              console.log(error)
            });

          // Substituir o texto do botão para "Enviar"
          //document.getElementById('btn-pergunta-chat').value = "Enviar";
        });
      }

    }
  }
}
</script>

<style scoped>
.addBtn {
  max-width: fit-content;
  float: left;
  margin-left: 12px;
}

.searchBtn {
  max-width: fit-content;
  float: right;
  margin-right: 12px;
}

.btnRow .col {
  padding: 0;
}

.listDescription {
  text-align: start;
  margin-top: 85px;
  margin-bottom: 30px;
}

label {
  float: left;
  margin-top: 30px;
}
</style>


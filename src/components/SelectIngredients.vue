<template>
  <form @submit="(e) => e.preventDefault()">
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
          <button class="btn btn-outline-primary mt-4 searchBtn" @click="searchRecipes">
            Pesquisar receita
          </button>
        </b-col>
      </b-row>

      <span>{{ responseText }}</span>
    </div>
    <br>
    <div id="resposta"></div>
  </form>
</template>

<script>
import { db } from "../firebase.js"
import { addDoc, collection, where, query, getDocs } from "firebase/firestore"; 

export default {
  data() {
    return {
      ingredients: [{ text: "" }],
      responseText: "",
      excludeDisabled: true
    }
  },
  methods: {
    //Atualiza o JSON com uma nova receita
    updateRecipes: function(newRecipe){
      let ingredients = this.ingredients.map(ingredient => ingredient.text);

      let document = {
        ingredients,
        name: newRecipe
      }

      addDoc(collection(db, "Recipes"), document)
    },

    //Verifica se a receita já é conhecida
    findRecipe: async function(){
      const recipesRef = collection(db, "Recipes")
      let ingredients = this.ingredients.map(ingredient => ingredient.text);
      let recipeQuery = query(recipesRef, where("ingredients", "==", ingredients))
      console.log(ingredients)
      let recipe = await (await getDocs(recipeQuery)).docs[0];
      console.log("RECIPE", recipe)
      if(recipe){
        return recipe.data().name
      }
      return false;
    },
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
    searchRecipes: async function () {
      let knownRecipe = await this.findRecipe();
      let _this = this;
      if(knownRecipe){
        this.responseText = `Com esses ingredientes você consegue fazer um(a): ${knownRecipe}`;
        return;
      }
      let question = "Monte uma receita somente com os seguintes ingredientes: ";

      this.ingredients.forEach((ingredient, index) => {
        if(index == this.ingredients.length - 1)
          question += ingredient.text
        else
          question += ingredient.text + ", "}
        )

      this.ingredients
      // Chave da API do OPENAI
      const OPENAI_API_KEY = "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";

      fetch("https://api.openai.com/v1/completions", {

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
          prompt: question, // Texto da pergunta
          max_tokens: 3000, // Tamanho da resposta
          temperature: 0.5 // Criatividade na resposta
        }),
        })
        .then((resposta) => resposta.json())
        .then((dados) => {
          _this.responseText = dados.choices[0].text
          _this.updateRecipes(dados.choices[0].text)
        })
        .catch((error) => {
          console.log(error)
        });
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


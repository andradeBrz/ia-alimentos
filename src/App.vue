<template>
  <div id="app">
    <h1> Vem cozinhar com a gente </h1>
    <h5 class="my-4">Escolha quantos ingredientes quiser, e evite o desperdício!!</h5>
    <b-container>
      <SelectIngredients class="my-4" />

    </b-container>
  </div>
</template>

<script>
import SelectIngredients from './components/SelectIngredients.vue'

export default {
  name: 'App',
  components: {
    SelectIngredients
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

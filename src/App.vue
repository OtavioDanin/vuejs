<template>
  <div id="app">
    <header class="header">
      <nav class="main-nav">
        <router-link to="/">Consulta de Clientes</router-link>
        <router-link to="/cadastro">Cadastro de Cliente</router-link>
      </nav>
    </header>
    <main class="content-area">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  background-color: #f0f2f5;
  display: flex;
  justify-content: center;
  padding: 20px;
}

#app {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto; /* Centraliza o app */
}

.header {
  background-color: #f7f7f7;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px; /* Adiciona margem abaixo do header */
}

.logo {
  height: 40px;
}

.main-nav a {
  margin-left: 20px;
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  transition: color 0.2s ease;
}

.main-nav a:hover {
  color: #0056b3;
}

.main-nav a.router-link-exact-active {
  color: #0056b3;
  font-weight: bold;
}

.content-area {
}

.card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 1.2em;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
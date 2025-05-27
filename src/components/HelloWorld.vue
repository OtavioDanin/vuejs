<template>
  <div>
    <h2>Lista de Pessoas</h2>
    <p v-if="loading">Carregando dados...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <ul v-if="pessoas.length">
      <li v-for="pessoa in pessoas" :key="pessoa.id" class="pessoa-item">
        <strong>Nome:</strong> {{ pessoa.nome }} <br />
        <strong>CPF:</strong> {{ pessoa.cpf }} <br />
        <strong>Nascimento:</strong> {{ pessoa.data_nascimento }} <br />
        <span v-if="pessoa.cidade">
          <strong>Cidade:</strong> {{ pessoa.cidade.nome }} -
          {{ pessoa.cidade.estado }}
        </span>
        <hr />
      </li>
    </ul>
    <p v-else-if="!loading && !error">Nenhuma pessoa encontrada.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PessoasList',
  data() {
    return {
      pessoas: [],
      loading: true,
      error: null,
    };
  },
  // O hook 'created' é chamado depois que a instância é criada
  // e antes que o DOM seja montado. É um bom lugar para buscar dados.
  created() {
    this.fetchPessoas();
  },
  methods: {
    async fetchPessoas() {
      try {
        const response = await axios.get('http://localhost:8001/api/clientes');
        this.pessoas = response.data;
      } catch (err) {
        this.error = 'Não foi possível carregar os dados das pessoas.';
        console.error('Erro ao buscar pessoas:', err);
        // Em um app real, você pode querer exibir uma mensagem de erro mais amigável ao usuário.
      } finally {
        this.loading = false; // Finaliza o estado de carregamento, mesmo em caso de erro
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}

ul {
  list-style: none;
  padding: 0;
}

.pessoa-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.pessoa-item strong {
  color: #333;
}

.pessoa-item hr {
  border: none;
  border-top: 1px dashed #eee;
  margin: 10px 0;
}
</style>
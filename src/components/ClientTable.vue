<template>
  <div class="table-container">
    <p v-if="loading">Carregando clientes...</p>
    <p v-if="error" class="error-message">Erro: {{ error }}</p>

    <table v-if="!loading && !error && clientes.length">
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th>Cliente</th>
          <th>CPF</th>
          <th>Data Nasc.</th>
          <th>Estado</th>
          <th>Cidade</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cliente in clientes" :key="cliente.id">
          <td>
            <button class="btn-action edit" @click="$emit('edit', cliente.id)">
              Editar
            </button>
          </td>
          <td>
            <button
              class="btn-action exclude"
              @click="$emit('exclude', cliente.id, cliente.nome)"
            >
              Excluir
            </button>
          </td>
          <td>{{ cliente.nome }}</td>
          <td>{{ cliente.cpf }}</td>
          <td>{{ cliente.data_nascimento }}</td>
          <td>{{ cliente.cidade.estado }}</td>
          <td>{{ cliente.cidade.nome }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!loading && !error && clientes.length === 0">
      Nenhum cliente encontrado com os filtros aplicados.
    </p>
  </div>
</template>

<script>
export default {
  name: 'ClientTable',
  props: {
    clientes: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
  },
  emits: ['edit', 'exclude'], // Declara os eventos que este componente pode emitir
};
</script>

<style scoped>
.table-container {
  overflow-x: auto; /* Adiciona scroll horizontal para tabelas em telas pequenas */
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap; /* Impede que o texto quebre dentro das células */
}

table th,
table td {
  border: 1px solid #e0e0e0;
  padding: 10px 12px;
  text-align: left;
  font-size: 0.9em;
  color: #333;
}

table th {
  background-color: #f7f7f7;
  font-weight: 600;
  color: #444;
}

table tbody tr:nth-child(even) {
  background-color: #fdfdfd; /* Fundo mais claro para linhas pares */
}

.btn-action {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85em;
  transition: background-color 0.2s ease;
  white-space: nowrap; /* Mantém o botão em uma linha */
}

.btn-action.edit {
  background-color: #28a745; /* Verde */
  color: white;
}

.btn-action.edit:hover {
  background-color: #218838;
}

.btn-action.exclude {
  background-color: #dc3545; /* Vermelho */
  color: white;
  margin-left: 5px;
}

.btn-action.exclude:hover {
  background-color: #c82333;
}

.error-message {
  color: red;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
}
</style>
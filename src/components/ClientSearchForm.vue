<template>
  <div class="card">
    <h3>Consulta Cliente</h3>
    <div class="form-grid">
      <div class="form-group">
        <label for="cpf">CPF :</label>
        <input
          type="tel"
          id="cpf"
          v-model="filters.cpf"
          placeholder="___.___.___-__"
          maxlength="14"
          @input="formatCpf"
        />
      </div>
      <div class="form-group">
        <label for="nome">Nome :</label>
        <input type="text" id="nome" v-model="filters.nome" />
      </div>
      <div class="form-group">
        <label for="dataNascimento">Data Nascimento:</label>
        <input type="date" id="dataNascimento" v-model="filters.data_nascimento" />
      </div>
      <div class="form-group">
        <label for="estado">Estado:</label>
        <select id="estado" v-model="filters.estado">
          <option value="">Todos</option>
          <option value="SP">SP</option>
          <option value="RJ">RJ</option>
          <option value="SC">SC</option>
          <option value="PA">PA</option>
          <option value="MG">MG</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cidade">Cidade:</label>
        <select id="cidade" v-model="filters.cidade">
          <option value="">Todas</option>
          <option value="Guarulhos">Guarulhos</option>
          <option value="SaoPaulo">São Paulo</option>
          <option value="Trindade">Trindade</option>
          <option value="Vilage">Vilage</option>
          <option value="Belem">Belém</option>
          <option value="Belo Horizonte">Belo Horizonte</option>
          <option value="Campinas">Campinas</option>
        </select>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn btn-primary" @click="searchClients">Pesquisar</button>
      <button class="btn btn-secondary" @click="clearFilters">Limpar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClientSearchForm',
  data() {
    return {
      filters: {
        cpf: '',
        nome: '',
        data_nascimento: '',
        estado: '', // Valor padrão 'Todos'
        cidade: '', // Valor padrão 'Todas'
      },
    };
  },
  methods: {
    formatCpf(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
      if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
      if (value.length > 11)
        value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
      this.filters.cpf = value; 
    },
    searchClients() {
      this.$emit('search', { ...this.filters }); 
    },
    clearFilters() {
      this.filters = {
        cpf: '',
        nome: '',
        data_nascimento: '',
        sexo: 'M',
        estado: '',
        cidade: '',
      };
      this.$emit('clear');
    },
  },
};
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colunas padrão */
  gap: 15px 20px; /* Espaço entre as linhas e colunas */
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr); /* 2 colunas em telas menores */
  }
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr; /* 1 coluna em telas muito pequenas */
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
  font-size: 0.9em;
}

.form-group input[type='text'],
.form-group input[type='date'],
.form-group select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}

.form-group input[type='text']::placeholder {
  color: #aaa;
}

.radio-group {
  flex-direction: row; 
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.radio-group label {
  margin-bottom: 0;
  font-weight: 400;
  cursor: pointer;
}

.radio-group input[type='radio'] {
  margin-right: 5px;
}

.form-actions {
  display: flex;
  justify-content: flex-end; /* Alinha botões à direita */
  gap: 10px;
  margin-top: 25px;
}
</style>
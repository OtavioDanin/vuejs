<template>
  <div id="app">
    <header class="header">
      <!-- <img src="./assets/logo_upd8.png" alt="Logo upd8" class="logo" /> -->
    </header>

    <div class="container">
      <ClientSearchForm @search="handleSearch" @clear="handleClear" />

      <div class="card result-card">
        <h3>Resultado da Pesquisa</h3>
        <ClientTable
          :clientes="clientes"
          :loading="loading"
          :error="error"
          @edit="handleEdit"
          @exclude="handleExclude"
        />
        <PaginationControls
          v-if="clientes.length > 0"
          :currentPage="pagination.currentPage"
          :totalPages="pagination.totalPages"
          @goToPage="goToPage"
          @previousPage="goToPreviousPage"
          @nextPage="goToNextPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ClientSearchForm from './components/ClientSearchForm.vue';
import ClientTable from './components/ClientTable.vue';
import PaginationControls from './components/PaginationControls.vue';
import axios from 'axios'; // Importa o axios

export default {
  name: 'App',
  components: {
    ClientSearchForm,
    ClientTable,
    PaginationControls,
  },
  data() {
    return {
      clientes: [],
      loading: false,
      error: null,
      searchFilters: {}, // Objeto para armazenar os filtros de busca
      pagination: {
        currentPage: 1,
        itemsPerPage: 4, // Como na imagem, 4 itens por página
        totalItems: 0,
        totalPages: 1,
      },
    };
  },
  created() {
    // Ao carregar o app, busca os clientes iniciais
    this.fetchClients();
    // Ao criar o componente, buscamos a lista de estados
    this.fetchEstados();  
  },
  methods: {
    async fetchEstados() {
      this.estadosLoading = true;
      this.estadosError = null;
      try {
        // --- SUBSTITUA ESTA URL PELA URL REAL DO SEU ENDPOINT DE ESTADOS NO LARAVEL ---
        const response = await axios.get('http://localhost:8001/api/clientes');
        this.estados = response.data.cidade; // Supondo que sua API retorna um array de objetos { id, nome, sigla }
      } catch (error) {
        this.estadosError = 'Erro ao carregar estados.';
        console.error('Erro ao buscar estados:', error);
      } finally {
        this.estadosLoading = false;
      }
    },
    async fetchClients() {
      this.loading = true;
      this.error = null;

      try {
        // Simulação de delay da API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // URL da sua API Laravel (ajuste conforme necessário)
        const baseUrl = 'http://localhost:8001/api/clientes';

        // Constrói os parâmetros de busca
        const params = {
          page: this.pagination.currentPage,
          per_page: this.pagination.itemsPerPage,
          ...this.searchFilters, // Adiciona os filtros de busca
        };

        // Simula dados da API para o exemplo (remova isso e use a requisição real)
        const mockApiResponse = {
          data: [
            {
              id: 1,
              nome: 'Wesley Barbosa',
              cpf: '378.658.658-00',
              data_nascimento: '06/06/1990',
              estado: 'SP',
              cidade: 'Guarulhos',
              sexo: 'M',
            },
            {
              id: 2,
              nome: 'Ricardo Menezes',
              cpf: '326.652.654-00',
              data_nascimento: '06/06/1980',
              estado: 'SP',
              cidade: 'São Paulo',
              sexo: 'M',
            },
            {
              id: 3,
              nome: 'Margaret Hamil',
              cpf: '235.326.148-12',
              data_nascimento: '06/06/1995',
              estado: 'RJ',
              cidade: 'Trindade',
              sexo: 'F',
            },
            {
              id: 4,
              nome: 'Joan Clarke',
              cpf: '032.324.674-78',
              data_nascimento: '06/06/2000',
              estado: 'SC',
              cidade: 'Vilage',
              sexo: 'M',
            },
            {
              id: 5,
              nome: 'Ana Paula',
              cpf: '111.222.333-44',
              data_nascimento: '10/01/1985',
              estado: 'PA',
              cidade: 'Belém',
              sexo: 'F',
            },
            {
              id: 6,
              nome: 'Carlos Eduardo',
              cpf: '555.666.777-88',
              data_nascimento: '05/03/1992',
              estado: 'MG',
              cidade: 'Belo Horizonte',
              sexo: 'M',
            },
            {
              id: 7,
              nome: 'Fernanda Lima',
              cpf: '999.888.777-66',
              data_nascimento: '12/11/1978',
              estado: 'SP',
              cidade: 'Campinas',
              sexo: 'F',
            },
          ],
          total: 7, // Total de itens mockados
        };

        // Implementação da paginação manual para os dados mockados
        const startIndex =
          (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        const pagedData = mockApiResponse.data.slice(startIndex, endIndex);

        this.clientes = pagedData;
        this.pagination.totalItems = mockApiResponse.total;
        this.pagination.totalPages = Math.ceil(
          mockApiResponse.total / this.pagination.itemsPerPage
        );
        // Descomente e use a requisição real com axios quando sua API estiver pronta:
        const response = await axios.get(baseUrl, { params });
        this.clientes = response.data; // Assumindo que a API retorna 'data' dentro do objeto de resposta
        this.pagination.totalItems = response.data.total; // Assumindo que a API retorna 'total'
        this.pagination.totalPages = response.data.last_page; // Assumindo que a API retorna 'last_page'
        
      } catch (err) {
        this.error = 'Erro ao carregar clientes: ' + err.message;
        console.error('Erro na API:', err);
      } finally {
        this.loading = false;
      }
    },
    handleSearch(filters) {
      this.searchFilters = { ...filters }; // Atualiza os filtros
      this.pagination.currentPage = 1; // Reseta para a primeira página na nova busca
      this.fetchClients(); // Refaz a busca com os novos filtros
    },
    handleClear() {
      this.searchFilters = {}; // Limpa os filtros
      this.pagination.currentPage = 1; // Reseta para a primeira página
      this.fetchClients(); // Refaz a busca (sem filtros)
    },
    handleEdit(clienteId) {
      alert(`Editando cliente com ID: ${clienteId}`);
      // Em um app real: this.$router.push(`/clientes/${clienteId}/editar`);
    },
    async handleExclude(clienteId, clienteNome) {
      if (confirm(`Tem certeza que deseja excluir o cliente: ${clienteNome}?`)) {
        try {
          // await axios.delete(`http://localhost:8000/api/clientes/${clienteId}`);
          alert(`Cliente ${clienteNome} excluído com sucesso!`);
          this.fetchClients(); // Recarrega a lista após a exclusão
        } catch (err) {
          alert('Erro ao excluir cliente: ' + err.message);
          console.error('Erro ao excluir:', err);
        }
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.pagination.totalPages) {
        this.pagination.currentPage = page;
        this.fetchClients();
      }
    },
    goToPreviousPage() {
      this.goToPage(this.pagination.currentPage - 1);
    },
    goToNextPage() {
      this.goToPage(this.pagination.currentPage + 1);
    },
  },
};
</script>

<style>
/* Estilos globais (muitos movidos para o CSS, mas App.vue pode ter alguns) */
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
  max-width: 1000px; /* Largura máxima para centralizar */
}

.container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}

.header {
  background-color: #f7f7f7;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.logo {
  height: 40px; /* Ajuste conforme o tamanho real da sua logo */
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
  background-color: #007bff; /* Azul */
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d; /* Cinza */
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.result-card {
  margin-top: 0; /* Remove margem superior extra se for o segundo card */
  border-top: none; /* Remove borda superior extra */
  border-radius: 0 0 8px 8px; /* Arredonda apenas as bordas inferiores se for o último card no container */
  padding-top: 10px; /* Ajusta o padding para compensar a falta da borda */
}
</style>
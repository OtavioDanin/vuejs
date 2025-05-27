<template>
  <div class="client-search-page">
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
        v-if="pagination.totalItems > 0"
        :currentPage="pagination.currentPage"
        :totalPages="pagination.totalPages"
        @goToPage="goToPage"
        @previousPage="goToPreviousPage"
        @nextPage="goToNextPage"
      />
    </div>
  </div>
</template>

<script>
import ClientSearchForm from '../components/ClientSearchForm.vue';
import ClientTable from '../components/ClientTable.vue';
import PaginationControls from '../components/PaginationControls.vue';
import axios from 'axios';

export default {
  name: 'ClientSearchPage',
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
      searchFilters: {},
      pagination: {
        currentPage: 1,
        itemsPerPage: 4,
        totalItems: 0,
        totalPages: 1,
      },
    };
  },
  created() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      this.loading = true;
      this.error = null;

      try {
        const apiUrl = 'http://localhost:8001/api/clientes';

        const mockApiResponse = {
          data: [
            { id: 1, nome: 'Wesley Barbosa', cpf: '37865865800', data_nascimento: '06/06/1990', cidade: { nome: 'Guarulhos', estado: 'SP' }, sexo: 'M' },
            { id: 2, nome: 'Ricardo Menezes', cpf: '32665265400', data_nascimento: '06/06/1980', cidade: { nome: 'São Paulo', estado: 'SP' }, sexo: 'M' },
            { id: 3, nome: 'Margaret Hamil', cpf: '23532614812', data_nascimento: '06/06/1995', cidade: { nome: 'Trindade', estado: 'RJ' }, sexo: 'F' },
            { id: 4, nome: 'Joan Clarke', cpf: '03232467478', data_nascimento: '06/06/2000', cidade: { nome: 'Vilage', estado: 'SC' }, sexo: 'M' },
            { id: 5, nome: 'Luiz Danin', cpf: '87454185002', data_nascimento: '07/02/1986', cidade: { nome: 'Belem', estado: 'PA' }, sexo: 'M' },
            { id: 6, nome: 'Otavio Danin', cpf: '87454185002', data_nascimento: '08/09/1998', cidade: { nome: 'Belem', estado: 'PA' }, sexo: 'M' },
            { id: 7, nome: 'Ana Paula', cpf: '11122233344', data_nascimento: '10/01/1985', cidade: { nome: 'Belém', estado: 'PA' }, sexo: 'F' },
            { id: 8, nome: 'Carlos Eduardo', cpf: '55566677788', data_nascimento: '05/03/1992', cidade: { nome: 'Belo Horizonte', estado: 'MG' }, sexo: 'M' },
            { id: 9, nome: 'Fernanda Lima', cpf: '99988877766', data_nascimento: '12/11/1978', cidade: { nome: 'Campinas', estado: 'SP' }, sexo: 'F' },
          ],
          total: 9,
        };

        await new Promise((resolve) => setTimeout(resolve, 500));

        const filteredData = mockApiResponse.data.filter((cliente) => {
          const cpfMatch = this.searchFilters.cpf
            ? cliente.cpf.includes(this.searchFilters.cpf.replace(/\D/g, ''))
            : true;
          const nomeMatch = this.searchFilters.nome
            ? cliente.nome.toLowerCase().includes(this.searchFilters.nome.toLowerCase())
            : true;
          const dataNascimentoMatch = this.searchFilters.data_nascimento
            ? cliente.data_nascimento === this.searchFilters.data_nascimento
            : true;
          const sexoMatch = this.searchFilters.sexo
            ? (cliente.sexo ? cliente.sexo.toUpperCase() === this.searchFilters.sexo.toUpperCase() : false)
            : true;
          const estadoMatch = this.searchFilters.estado
            ? (cliente.cidade && cliente.cidade.estado && cliente.cidade.estado.toUpperCase() === this.searchFilters.estado.toUpperCase())
            : true;
          const cidadeMatch = this.searchFilters.cidade
            ? (cliente.cidade && cliente.cidade.nome && cliente.cidade.nome.toLowerCase().includes(this.searchFilters.cidade.toLowerCase()))
            : true;
          return cpfMatch && nomeMatch && dataNascimentoMatch && sexoMatch && estadoMatch && cidadeMatch;
        });

        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        const pagedData = filteredData.slice(startIndex, endIndex);

        this.clientes = pagedData.map((item) => ({
          id: item.id,
          nome: item.nome,
          cpf: this.formatCpfForDisplay(item.cpf),
          data_nascimento: item.data_nascimento,
          estado: item.cidade ? item.cidade.estado : 'teste',
          cidade: item.cidade ? item.cidade.nome : '',
          sexo: item.sexo || 'N/A',
        }));
        this.pagination.totalItems = filteredData.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);

        
        const params = {
          page: this.pagination.currentPage,
          per_page: this.pagination.itemsPerPage,
          cpf: this.searchFilters.cpf ? this.searchFilters.cpf.replace(/\D/g, '') : '',
          nome: this.searchFilters.nome,
          data_nascimento: this.searchFilters.data_nascimento,
          sexo: this.searchFilters.sexo,
          estado: this.searchFilters.estado,
          cidade: this.searchFilters.cidade,
        };

        const response = await axios.get(apiUrl, { params });

        this.clientes = response.data.map(item => ({
          id: item.id,
          nome: item.nome,
          cpf: this.formatCpfForDisplay(item.cpf),
          data_nascimento: item.data_nascimento,
          estado: item.cidade ? item.cidade.estado : '',
          cidade: item.cidade ? item.cidade.nome : '',
          sexo: item.sexo || 'N/A',
        }));
        this.pagination.currentPage = response.data.current_page;
        this.pagination.totalItems = response.data.total;
        this.pagination.totalPages = response.data.last_page;
        
      } catch (err) {
        this.error = 'Erro ao carregar clientes: ' + err.message;
        console.error('Erro na API:', err);
      } finally {
        this.loading = false;
      }
    },
    formatCpfForDisplay(rawCpf) {
      if (!rawCpf) return '';
      const cpf = String(rawCpf).replace(/\D/g, '');
      if (cpf.length === 11) {
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      return rawCpf;
    },
    handleSearch(filters) {
      this.searchFilters = { ...filters };
      this.pagination.currentPage = 1;
      this.fetchClients();
    },
    handleClear() {
      this.searchFilters = {};
      this.pagination.currentPage = 1;
      this.fetchClients();
    },
    handleEdit(clienteId) {
    //   alert(`Editando cliente com ID: ${clienteId}`);
    this.$router.push(`/clientes/${clienteId}/editar`);
    },
    async handleExclude(clienteId, clienteNome) {
      if (confirm(`Tem certeza que deseja excluir o cliente: ${clienteNome}?`)) {
        try {
          await axios.delete('http://localhost:8001/api/clientes/' + clienteId );
          alert(`Cliente ${clienteNome} excluído com sucesso!`);
          this.fetchClients();
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

<style scoped>
.client-search-page .card.result-card {
  margin-top: 0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding-top: 10px;
}
</style>
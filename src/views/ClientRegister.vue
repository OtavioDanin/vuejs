<template>
  <div id="client-register-page">
    <header class="header">
      <!-- <img src="../assets/logo_upd8.png" alt="Logo upd8" class="logo" /> -->
    </header>

    <div class="container">
      <div class="card">
        <h3>Cadastro Cliente</h3>
        <div class="form-grid">
          <div class="form-group">
            <label for="registerCpf">CPF :</label>
            <input
              type="text"
              id="registerCpf"
              v-model="client.cpf"
              placeholder="___.___.___-__"
              maxlength="14"
              @input="formatCpf"
            />
          </div>
          <div class="form-group">
            <label for="registerNome">Nome :</label>
            <input type="text" id="registerNome" v-model="client.nome" />
          </div>
          <div class="form-group">
            <label for="registerDataNascimento">Data Nascimento:</label>
            <input type="date" id="registerDataNascimento" v-model="client.data_nascimento" />
          </div>
          <div class="form-group radio-group">
            <label>Sexo:</label>
            <input type="radio" id="registerSexoMasculino" name="registerSexo" value="M" v-model="client.sexo" />
            <label for="registerSexoMasculino">Masculino</label>
            <input type="radio" id="registerSexoFeminino" name="registerSexo" value="F" v-model="client.sexo" />
            <label for="registerSexoFeminino">Feminino</label>
          </div>
          <div class="form-group full-width">
            <label for="endereco">Endereço:</label>
            <input type="text" id="endereco" v-model="client.endereco" placeholder="Rua, número, complemento" />
          </div>
          <div class="form-group">
            <label for="registerEstado">Estado:</label>
            <select id="registerEstado" v-model="client.estado" @change="fetchCidades">
              <option value="">Selecione</option>
              <option v-if="estadosLoading">Carregando estados...</option>
              <option v-else-if="estadosError">{{ estadosError }}</option>
              <option v-else-if="!estados.length">Nenhum estado disponível.</option>
              <option v-for="estado in estados" :key="estado.id" :value="estado.sigla">
                {{ estado.nome }} ({{ estado.sigla }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="registerCidade">Cidade:</label>
            <select id="registerCidade" v-model="client.cidade_id" :disabled="!client.estado && !cidadesLoading">
              <option value="">Selecione</option>
              <option v-if="cidadesLoading">Carregando cidades...</option>
              <option v-else-if="cidadesError">{{ cidadesError }}</option>
              <option v-else-if="!cidades.length && client.estado">Nenhuma cidade encontrada para este estado.</option>
              <option v-for="cidade in cidades" :key="cidade.id" :value="cidade.id">
                {{ cidade.nome }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn-primary" @click="saveClient">Salvar</button>
          <button class="btn btn-secondary" @click="clearForm">Limpar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientRegister',
  data() {
    return {
      client: {
        id: null, // Para edição, se aplicável
        cpf: '',
        nome: '',
        data_nascimento: '',
        sexo: 'M', // Padrão
        endereco: '',
        estado: '', // Sigla do estado selecionado
        cidade_id: '', // ID da cidade selecionada (para enviar à API)
      },
      estados: [],
      cidades: [],
      estadosLoading: false,
      estadosError: null,
      cidadesLoading: false,
      cidadesError: null,
    };
  },
  created() {
    this.fetchEstados(); // Carrega os estados ao criar o componente
  },
  methods: {
    async fetchEstados() {
      this.estadosLoading = true;
      this.estadosError = null;
      try {
        // --- SUBSTITUA ESTA URL PELA URL REAL DO SEU ENDPOINT DE ESTADOS NO LARAVEL ---
        const response = await axios.get('http://localhost:8000/api/estados');
        this.estados = response.data; // Supondo que sua API retorna um array de objetos { id, nome, sigla }
      } catch (error) {
        this.estadosError = 'Erro ao carregar estados.';
        console.error('Erro ao buscar estados:', error);
      } finally {
        this.estadosLoading = false;
      }
    },
    async fetchCidades() {
      this.cidades = [];
      this.client.cidade_id = ''; // Reseta a cidade selecionada

      if (!this.client.estado) {
        this.cidadesError = null;
        return;
      }

      this.cidadesLoading = true;
      this.cidadesError = null;
      try {
        // --- SUBSTITUA ESTA URL PELA URL REAL DO SEU ENDPOINT DE CIDADES NO LARAVEL ---
        const response = await axios.get(`http://localhost:8000/api/cidades?estado_sigla=${this.client.estado}`);
        this.cidades = response.data; // Supondo que sua API retorna um array de objetos { id, nome, estado_id }
      } catch (error) {
        this.cidadesError = 'Erro ao carregar cidades.';
        console.error('Erro ao buscar cidades:', error);
      } finally {
        this.cidadesLoading = false;
      }
    },
    formatCpf(event) {
      let value = event.target.value.replace(/\D/g, '');
      if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
      if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
      if (value.length > 11)
        value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
      this.client.cpf = value;
    },
    async saveClient() {
      // Remover máscara do CPF antes de enviar para a API
      const clientToSend = { ...this.client };
      clientToSend.cpf = clientToSend.cpf.replace(/\D/g, '');

      // Validar dados (exemplo simples)
      if (!clientToSend.nome || !clientToSend.cpf || !clientToSend.data_nascimento || !clientToSend.cidade_id) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      try {
        // --- SUBSTITUA ESTA URL PELA URL REAL DO SEU ENDPOINT DE CADASTRO/EDIÇÃO ---
        const apiUrl = 'http://localhost:8000/api/clientes';

        let response;
        if (clientToSend.id) {
          // Lógica de edição (PUT/PATCH)
          response = await axios.put(`${apiUrl}/${clientToSend.id}`, clientToSend);
          alert('Cliente atualizado com sucesso!');
        } else {
          // Lógica de criação (POST)
          response = await axios.post(apiUrl, clientToSend);
          alert('Cliente cadastrado com sucesso!');
        }
        console.log('Resposta da API:', response.data);
        this.clearForm(); // Limpa o formulário após sucesso
        // Opcional: Redirecionar para a página de consulta após o salvamento
        // this.$router.push('/consulta-clientes');
      } catch (error) {
        alert('Erro ao salvar cliente: ' + (error.response?.data?.message || error.message));
        console.error('Erro ao salvar cliente:', error.response || error);
      }
    },
    clearForm() {
      this.client = {
        id: null,
        cpf: '',
        nome: '',
        data_nascimento: '',
        sexo: 'M',
        endereco: '',
        estado: '',
        cidade_id: '',
      };
      this.cidades = []; // Limpa a lista de cidades também
      this.cidadesError = null;
    },
    // Método para carregar cliente para edição (se você quiser implementar)
    // async loadClientForEdit(id) {
    //   try {
    //     const response = await axios.get(`http://localhost:8000/api/clientes/${id}`);
    //     const clientData = response.data;
    //     this.client.id = clientData.id;
    //     this.client.cpf = this.formatCpfForDisplay(clientData.cpf); // Formatar para exibição
    //     this.client.nome = clientData.nome;
    //     this.client.data_nascimento = clientData.data_nascimento;
    //     this.client.sexo = clientData.sexo;
    //     this.client.endereco = clientData.endereco;
    //     this.client.estado = clientData.cidade?.estado || '';
    //     await this.fetchCidades(); // Carrega as cidades do estado do cliente
    //     this.client.cidade_id = clientData.cidade_id;
    //   } catch (error) {
    //     console.error('Erro ao carregar cliente para edição:', error);
    //     alert('Não foi possível carregar o cliente para edição.');
    //   }
    // },
    // formatCpfForDisplay (utilizado no loadClientForEdit, se necessário)
    // formatCpfForDisplay(rawCpf) {
    //   if (!rawCpf) return '';
    //   const cpf = String(rawCpf).replace(/\D/g, '');
    //   if (cpf.length === 11) {
    //     return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    //   }
    //   return rawCpf;
    // },
  },
};
</script>

<style scoped>
#client-register-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto; /* Centraliza a página */
}

.header {
  background-color: #f7f7f7;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px; /* Adiciona margem abaixo do header */
  border-radius: 8px; /* Mantém o border-radius */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Adiciona sombra */
}

.logo {
  height: 40px;
}

.container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  overflow: hidden;
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

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px 20px;
}

.form-group.full-width {
  grid-column: 1 / -1; /* Ocupa todas as colunas */
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .form-group.full-width {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.full-width {
    grid-column: 1 / -1;
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
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
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
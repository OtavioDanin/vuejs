<template>
  <div class="pagination">
    <button class="pagination-btn arrow" @click="$emit('previousPage')" :disabled="currentPage === 1">
      ← Anterior
    </button>
    <div class="pagination-numbers">
      <button
        v-for="page in totalPages"
        :key="page"
        class="pagination-btn page"
        :class="{ active: page === currentPage }"
        @click="$emit('goToPage', page)"
      >
        {{ page }}
      </button>
    </div>
    <button class="pagination-btn arrow" @click="$emit('nextPage')" :disabled="currentPage === totalPages">
      Próximo →
    </button>
  </div>
</template>

<script>
export default {
  name: 'PaginationControls',
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
  },
  emits: ['goToPage', 'previousPage', 'nextPage'], // Declara os eventos que podem ser emitidos
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 5px;
}

.pagination-btn {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f8f8f8;
  cursor: pointer;
  font-size: 0.9em;
  color: #333;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.pagination-btn:hover:not(.active):not(:disabled) {
  background-color: #e9e9e9;
  border-color: #ccc;
}

.pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-btn.page.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  font-weight: bold;
}

.pagination-numbers {
  display: flex;
  gap: 5px;
  margin: 0 10px;
}

.pagination-btn.arrow {
  background-color: #f0f0f0;
}

.pagination-btn.arrow:hover:not(:disabled) {
  background-color: #e0e0e0;
}
</style>
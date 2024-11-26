<template>
<div class="history-transaction">
    <h1 class="tittle">Historial de movimientos</h1>

    <div v-if="loading">
      <p class="loading">Cargando transacciones...</p>
    </div>

    <div v-else-if="transactions.length > 0">
    <table>
        <thead>
            <tr>
                <th>Tipo</th>
                <th>Criptomoneda</th>
                <th>Cantidad</th>
                <th>Monto</th>
                <th>Fecha y hora</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaction in transactions" :key="transaction._id">
                <td> {{ transaction.action === 'purchase' ? 'Compra' : 'Venta' }} </td>
                <td> {{ transaction.crypto_code }} </td>
                <td> {{ transaction.crypto_amount }} </td>
                <td> {{ transaction.money }} </td>
                <td> {{ new Date(transaction.datetime).toLocaleString() }} </td>
                <td>
                  <button @click="viewTransaction(transaction._id)">Leer</button>
                  <button @click="editTransaction(transaction)">Editar</button>
                  <button @click="deleteTransaction(transaction._id)">Borrar</button>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="btn-inicio">
    <router-link to="/home" class="btn">Ir a inicio</router-link>
    </div>
    </div>
    
    <p v-else class="no-information">
      Oops! No tienes transacciones.
    </p>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2> {{ isEditMode ? 'Editar Transaccion' : 'Detalles de la transaccion' }} </h2>

        <div v-if="!isEditMode">
        <p><strong>Tipo:</strong> {{ selectedTransaction.action === 'purchase' ? 'Compra' : 'Venta' }}</p>
        <p><strong>Criptomoneda:</strong> {{ selectedTransaction.crypto_code }}</p>
        <p><strong>Cantidad:</strong> {{ selectedTransaction.crypto_amount }}</p>
        <p><strong>Monto:</strong> {{ selectedTransaction.money }}</p>
        <p><strong>Fecha y hora:</strong> {{ new Date(selectedTransaction.datetime).toLocaleString() }}</p>
        </div>

        <form v-else @submit.prevent="submitEditTransaction">
        <label>Criptomoneda:</label>
        <input v-model="selectedTransaction.crypto_code" type="text" />

        <label>Cantidad:</label>
        <input v-model="selectedTransaction.crypto_amount" type="number" />

        <label>Monto:</label>
        <input v-model="selectedTransaction.money" type="number" />

        <button class="save-button" type="submit">Guardar cambios</button>
        </form>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      transactions: [],
      selectedTransaction: {},
      showModal: false,
      isEditMode: false,
      loading: true,
      headers: {
        'x-apikey': '60eb09146661365596af552f'
      }
    }
  },
  async mounted () {
    const userId = localStorage.getItem('userId')
    console.log('user_id:', userId)
    if (userId) {
      try {
        const response = await axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${userId}"}`, { headers: this.headers })
        console.log('response data:', response.data)
        this.transactions = response.data
      } catch (error) {
        console.error('Error al obtener el historial', error)
      } finally {
        this.loading = false
      }
    } else {
      this.loading = false
    }
  },

  methods: {
    async fetchTransactions (userId) {
      try {
        const response = await axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${userId}"}`, { headers: this.headers })
        this.transactions = response.data
      } catch (error) {
        console.error('Error', error)
      }
    },

    async viewTransaction (id) {
      try {
        const response = await axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions/${id}`, { headers: this.headers })
        this.selectedTransaction = response.data
        this.isEditMode = false
        this.showModal = true
      } catch (error) {
        console.error('Error', error)
      }
    },

    editTransaction (transaction) {
      this.selectedTransaction = { ...transaction }
      this.isEditMode = true
      this.showModal = true
    },

    closeModal () {
      this.showModal = false
    },
    async submitEditTransaction () {
      const id = this.selectedTransaction._id
      const updateData = {
        crypto_amount: this.selectedTransaction.crypto_amount,
        money: this.selectedTransaction.money
      }

      try {
        await axios.patch(`https://laboratorio3-f36a.restdb.io/rest/transactions/${id}`, updateData, { headers: this.headers })
        alert('Transaccion actualizada correctamente')
        this.showModal = false

        const userId = localStorage.getItem('userId')
        if (userId) {
          await this.fetchTransactions(userId)
        }
      } catch (error) {
        console.error('Error al editar la transaccion', error)
      }
    },

    async deleteTransaction (transactionId) {
      const confirmDelete = confirm('Estas seguro que deseas eliminar la transaccion?')
      if (confirmDelete) {
        try {
          await axios.delete(`https://laboratorio3-f36a.restdb.io/rest/transactions/${transactionId}`, { headers: this.headers })
          this.transactions = this.transactions.filter(t => t._id !== transactionId)
          alert('Transaccion eliminada con exito.')
          this.fetchTransactions()
        } catch (error) {
          console.error('Error al borrar la transaccion', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.history-transaction {
    padding: 20px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th, td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
}

td{
  background-color: #f1f1f1;
}

th {
    background-color: #007bff;
    color: white;
}

p {
    text-align: center;
    margin-top: 20px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  margin: 5px;
  cursor: pointer;
}

button:first-child {
  background-color: #727273;
  color: white;
}

button:nth-child(2) {
  background-color: #2ecc71;
  color: white;
}

button:last-child {
  background-color: #e74c3c;
  color: white;
}

.save-button {
  background-color: #007bff !important;
}

.btn{
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-right:5px;
    text-align: center;
}
.btn-inicio{
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.modal{
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content{
  background-color: #fff;
  margin: 15% auto;
  padding: 20px;
  width: 30%;
}

input {
  display: block;
  width: 95%;
  margin-top: 5px;
  margin-bottom: 10px;
}

.close{
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus{
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.no-information {
  max-width: 350px;
  font-size: 1.2rem;
  color: #e63946;
  text-align: center;
  margin-top: 20px;
  font-weight: bold;
  background-color: #ffe5e5;
  padding: 10px;
  border: 1px solid #e63946;
  border-radius: 5px;
  margin: 20px auto;
}

.tittle {
  font-size: 2rem;
  color: #2d3436;
  text-align: center;
  margin: 20px 0;
  font-weight: bold;
}

.loading {
  font-size: 1.2rem;
  color: #3498db;
  text-align: center;
  margin: 10px auto;
  font-style: italic;
  max-width: 350px;
  padding: 10px;
  background-color: #eaf4ff;
  border: 1px solid #3498db;
  border-radius: 5px;
  font-weight: bold;
}
</style>

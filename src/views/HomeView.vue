<template>
  <div class="home">
    <div v-if="loading" class="loading-container">
      <p class="loading">Cargando información..</p>
    </div>

    <div v-else>
    <h1 class="tittle">Bienvenido a tu cartera de criptomonedas, ¡{{ userId }}!</h1>

    <div v-if="transactions.length === 0" class="transactions-msg">
      <p><b>Aún no tienes transacciones registradas.</b> Haz tu primer compra para luego ver el historial de criptomonedas aqui.</p>
      <router-link to="/purchase" class="btn">Realizar compra</router-link>
    </div>

    <div v-else class="container-acciones">
      <h2>&#129047; Acciones para realizar &#129047;</h2>
      <router-link to="/history" class="btn">Ver historial</router-link>
      <router-link to="/purchase" class="btn">Realizar compra</router-link>
      <router-link to="/sale" class="btn">Realizar venta</router-link>
      <router-link to="/currenStatus" class="btn">Analisis de estado actual</router-link>
    </div>
    </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      userId: localStorage.getItem('userId'),
      transactions: [],
      cryptos: [],
      totalValue: 0,
      loading: true,
      headers: {
        'x-apikey': '60eb09146661365596af552f'
      }
    }
  },

  created () {
    if (!this.userId) {
      this.$router.push({ name: 'UserLogin' })
    } else {
      this.loadTransactions()
    }
  },

  methods: {
    async loadTransactions () {
      try {
        const response = await axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${this.userId}"}`, { headers: this.headers })
        this.transactions = response.data
        this.loadCryptos()
      } catch (error) {
        console.error('Error al obtener las transacciones', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
  .home{
    padding: 20px;
    text-align: center;
  }

  .wallet-home {
    margin: 40px;
    font-size: 20px;
    color: lightseagreen;
  }

  .tittle {
  font-size: 3rem;
  color: #6791ff;
  text-align: center;
  margin: 80px 0;
  font-weight: bold;
  }

  .btn {
  padding: 10px 20px;
  display: inline-block;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  margin-right:15px;
}
  .btn:hover {
    background-color: #649fde;
    color: black;
    border: 1px solid #51769e;
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

.transactions-msg {
  margin: 40px auto;
  color: #666;
  text-align: center;
  font-size: 1.2rem;
  max-width: 600px;
  padding: 20px;
  background-color: #d1dedb;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.transactions-msg p {
  margin-bottom: 20px;
  color: #2d3436;
  line-height: 1.6;
}

.container-acciones{
  margin-top: 50px;
  font-size:1.5rem;
}
</style>

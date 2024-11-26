<template>
<div class="div-crypto-purchase">
  <h1>Comprar criptomonedas</h1>
  <div class="div-success-message">
  <div v-if="showMessage" class="success-message">
    ¡Compra exitosa de {{ cryptoAmount }} {{ selectedCrypto.toUpperCase() }}! 
  </div>
  </div>
  <div class="form-container">
  <form @submit.prevent="submitPurchase" class="crypto-purchase">
      <div class="form-group">
          <label for="cryptoSelect">Seleccionar criptomoneda</label>
          <select v-model="selectedCrypto" id="cryptoSelect" required>
          <option v-for="crypto in cryptos" :key="crypto.code" :value="crypto.code">
          {{ crypto.name }}
          </option>
          </select>
      </div>
      <div class="form-group">
          <label for="cryptoAmount">Cantidad</label>
          <input type="number" v-model="cryptoAmount" id="cryptoAmount" required min="0.01" step="any" @input="calculateTotalPrice" />
      </div>
      <div class="form-group">
          <label for="cryptoSpent">Monto a pagar</label>
          <input type="number" :value="totalPrice" id="cryptoSpent" required min="0.01" step="any" readonly />
      </div>
      <div class="form-group">
          <label for="datetime">Fecha y hora</label>
          <input type="datetime-local" v-model="purchaseDateTime" id="datetime" />
      </div>
      
      <button type="submit">Comprar</button>
  
  </form>
    </div>
    <router-link to="/home" class="btn">Volver</router-link>
    <router-link to="/history" class="btn">Ver historial</router-link>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      cryptos: [
        { code: 'eth', name: 'Ethereum' },
        { code: 'usdt', name: 'Tether' },
        { code: 'usdc', name: 'USD Coin' },
        { code: 'sol', name: 'Solana' }
      ],
      selectedCrypto: '',
      cryptoAmount: 0,
      purchaseDateTime: '',
      cryptoPrice: 0,
      showMessage: false
    }
  },

  watch: {
    selectedCrypto (newCrypto) {
      if (newCrypto) {
        this.fetchCryptoPrices(newCrypto)
      }
    }
  },

  methods: {
    async fetchCryptoPrices (crypto) {
      try {
        const response = await axios.get(`https://criptoya.com/api/letsbit/${crypto.toUpperCase()}/ARS/0.1`)
        this.cryptoPrice = response.data.totalBid || 0
      } catch (error) {
        console.error('Error al obtener los precios:', error)
      }
    },

    async submitPurchase () {
      const amount = parseFloat(this.cryptoAmount)
      if (!this.selectedCrypto) {
        alert('Debes seleccionar una criptomoneda')
        return
      }
      if (!this.amount <= 0) {
        alert('Debes ingresar una cantidad mayor a 0')
        return
      }
      if (!this.purchaseDateTime) {
        alert('Debes ingresar una fecha y hora validas')
        return
      }
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('No se encontro el ID del usuario')
        return
      }
      const purchaseData = {
        user_id: userId,
        action: 'purchase',
        crypto_code: this.selectedCrypto,
        crypto_amount: amount,
        money: this.totalPrice,
        datetime: this.purchaseDateTime
      }
      const headers = {
        'x-apikey': '60eb09146661365596af552f',
        'Content-Type': 'application/json'
      }

      try {
        await axios.post('https://laboratorio3-f36a.restdb.io/rest/transactions', purchaseData, { headers })
        this.showMessage = true;
      } catch (error) {
        console.error('error al comprar:', error)
        alert('Error')
      }
    }
  },

  mounted () {
    if (this.selectedCrypto) {
      this.fetchCryptoPrices(this.selectedCrypto)
    }
  },

  computed: {
    totalPrice () {
      return (this.cryptoAmount * this.cryptoPrice).toFixed(2)
    }
  }
}
</script>

<style scoped>
  .div-crypto-purchase{
    padding-top: 20px;
  }

  .crypto-purchase{
    padding: 40px;
    background-color:f4f7f6;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 20%;
    margin: 20px auto;
  }

  .form-container{
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h1{
    color: #333;
    font-size: 30px;
  }

  .form-group input, .form-group select{
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #f9f9f9;
  }

  .form-group input, .form-group select{
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    background-color: #f9f9f9;
  }

  .form-group label{
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #555;
  }

  .form-group{
    margin-bottom: 20px;
  }

  button{
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    transition: background-color 0.5s;
    font-size: 16px;
    cursor: pointer;
  }
  
  .btn{
    display: inline-block;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-right:5px;
    cursor: pointer;
  }

  .success-message{
    width: 23%;
    background-color: #d4edda;
    color: #155724;
    padding: 15px;
    margin-top: 20px;
    border: solid 1px #c3e6cb;
    border-radius: 5px;
    text-align: center;
  }

  .div-success-message{
    display: flex;
    justify-content: center;
  }
</style>

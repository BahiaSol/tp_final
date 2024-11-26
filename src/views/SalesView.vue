<template>
    <div class="div-crypto-sale">
        <h1>Vender criptomonedas</h1>
        <div class="div-success-message">
        <div v-if="showMessage" class="success-message">
          Venta exitosa de {{ cryptoAmount }} {{ selectedCrypto.toUpperCase() }}! 
        </div>
        </div>
        <div class="form-container">
        <form @submit.prevent="submitSale" class="crypto-sale">
            <div class="form-group">
                <label for="cryptoSelect">Seleccionar criptomoneda</label>
                <select v-model="selectedCrypto">
                <option value="btn">Bitcoin</option>
                <option value="eth">Ethereum</option>
                <option value="usdc">USD Coin</option>
                <option value="sol">Solana</option>
                </select>
            </div>

            <div class="form-group">
                <label for="amount">Cantidad</label>
                <input type="number" v-model="cryptoAmount" step="any" required />
            </div>

            <div class="form-group">
                <label for="money">Monto entrante</label>
                <input type="number" v-model="money" step="any" required />
            </div>

            <div class="form-group">
                <label for="datetime">Fecha y hora</label>
                <input type="datetime-local" v-model="datetime" required />
            </div>

            
            <button type="submit">Vender</button>
            
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
      selectedCrypto: '',
      cryptoAmount: 0,
      money: '',
      datetime: '',
      cryptoPrice: 0,
      showMessage: false,
      userId: localStorage.getItem('userId'),
      headers: {
        'x-apikey': '60eb09146661365596af552f'
      }
    }
  },
  watch: {
    selectedCrypto (newVal) {
      if (newVal) {
        this.getCryptoPrice(newVal)
      }
    },
    cryptoAmount (newVal) {
      if (newVal && this.cryptoPrice > 0) {
        this.money = (newVal * this.cryptoPrice).toFixed(2)
      }
    }
  },
  methods: {
    async getCryptoPrice (cryptoCode) {
      try {
        const response = await axios.get(`https://criptoya.com/api/letsbit/${cryptoCode}/ARS/0.1`)
        this.cryptoPrice = response.data.totalAsk || 0
      } catch (error) {
        console.error('Hubo un error', error)
      }
    },

    async submitSale () {
      if (!this.selectedCrypto || !this.cryptoAmount || !this.money || !this.datetime) {
        alert('Porfavor completa los datos de los campos')
        return
      }
      const saleData = {
        user_id: this.userId,
        action: 'sale',
        crypto_code: this.selectedCrypto,
        crypto_amount: parseFloat(this.cryptoAmount),
        money: this.money,
        datetime: this.datetime
      }
      try {
        await axios.post(
          'https://laboratorio3-f36a.restdb.io/rest/transactions', saleData, { headers: this.headers }
        )
        this.showMessage = true;
        this.amount = ''
        this.money = ''
        this.datetime = ''
      } catch (error) {
        console.error('La venta no se ha registrado', error.response ? error.response.data : error.message)
        alert('Hubo un error al registrar la venta')
      }
    }
  }
}
</script>

<style scoped>
  .div-crypto-sale{
    padding-top: 20px;
  }

  .crypto-sale{
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
    width: 100%;
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
  }
  .btn{
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 5px;
    margin-right: 5px;
    margin-left: 5px;
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

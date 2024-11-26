<template>
    <div class="current-analysis">
        <h1 class="tittle">Analisis de estado actual</h1>

        <div v-if="loading">
          <p class="loading">Cargando estado actual...</p>
        </div>

        <table v-else-if="cryptos.length > 0">
        <thead>
        <tr>
            <th>Criptomoneda</th>
            <th>Cantidad</th>
            <th>Dinero</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="crypto in cryptos" :key="crypto.code || crypto.name">
        <td>{{ crypto.code }}</td>
        <td>{{ crypto.amount }}</td>
        <td>{{ (crypto.amount * crypto.price).toFixed(2).replace('.', ',') }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
        <td><strong>Total</strong></td>
        <td></td>
        <td class="total"><strong>${{ totalValue.toFixed(2).replace('.', ',') }}</strong></td>
        </tr>
        </tfoot>
        </table>
        <p v-else-if="error">{{ error }}</p>
        <p v-else-if="cryptos.length === 0" class="no-information">
          Oops! No tienes criptomonedas.
        </p>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      loading: true,
      error: null,
      transactions: [],
      cryptos: [],
      totalValue: 0,
      headers: {
        'x-apikey': '60eb09146661365596af552f'
      },
      cryptoPrices: {

      }
    }
  },
  async mounted() {
    this.loading = true;
    const userId = localStorage.getItem('userId')
    if (userId) {
        await this.fetchTransactions(userId)
        await this.calculateCryptoValues()
    }
    this.loading = false;
  },
  methods: {
    async fetchTransactions(userId) {
     try {
      const response = await axios.get(`https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id": "${userId}"}`, { headers: this.headers })
      this.transactions = response.data
     } catch (error) {
      console.error('error')
     }
    },
  
    async calculateCryptoValues(){
      const cryptoMap = {};

      this.transactions.forEach(transaction => {
        const cryptoCode = transaction.crypto_code
        const cryptoAmount = parseFloat(transaction.crypto_amount) || 0;

        if(!cryptoCode){
          console.error("Transaccion sin codigo de criptomoneda:", transaction);
          return;
        }

        if(!cryptoMap[cryptoCode]){
          cryptoMap[cryptoCode] = {amount: 0}
        }
        
        if(transaction.action === 'purchase'){
          cryptoMap[cryptoCode].amount += cryptoAmount;
        } else if (transaction.action === 'sale') {
          cryptoMap[cryptoCode].amount -= cryptoAmount;
        }
      })

      for (const [cryptoCode, data] of Object.entries(cryptoMap)) {
        if (data.amount > 0) {
          this.cryptos.push({
            name: this.getCryptoName(cryptoCode),
            code: cryptoCode,
            amount: data.amount
          })
        }
      }
      await this.fetchCryptoPrices();
    },

    getCryptoName(cryptoCode) {
      const cryptoNames = {
        btc: 'Bitcoin',
        eth: 'Ethereum',
        usdt: 'Tether',
        usdc: 'USD Coin',
        sol: 'Solana'
      }
      return cryptoNames[cryptoCode] || "criptomoneda desconocida";
    },

    async fetchCryptoPrices() {
      try {
          const priceRequests = this.cryptos.map((crypto) => {
            return axios.get(`https://criptoya.com/api/letsbit/${crypto.code}/ars/0.1`, { headers: this.headers })
              .then(response => response.data)
              .catch(error => { console.error('Error al obtener el precio:', error.message);
              return { totalBid: 0 }
            })
        })
        const responses = await Promise.all(priceRequests)

        responses.forEach((data, index) => {
          if(data && data.totalBid) {
          this.cryptos[index].price = data.totalBid;
          } else {
            console.error('Precio no encontrado:', data)
            this.cryptos[index].price = 0;
          }
        })

        this.totalValue = this.cryptos.reduce((acc, crypto) => acc + 
        (crypto.amount * (crypto.price || 0)), 0)
        
      } catch (error) {
      console.error('Error al obtener los precios:', error.message)
      }
    }
  }
}
</script>

<style scoped>
  .current-analysis {
      padding: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  th, td {
    padding: 12px;
    text-align: center;
    border: 1px solid #ddd;
  }

  th {
    background-color: #007bff;
    color: #fff;
    font-weight: bold;
  }

  td {
    background-color: #f1f1f1;
  }

  tfoot td {
    background-color: #0056b3;
    font-weight: bold;
    color: white;
  }

  tfoot th {
    background-color: #0056b3;
  }

  tfoot td strong {
    color: white;
  }

  .sale {
    padding: 20px;
  }

  .form-container{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #333;
    border-radius: 5px;
    font-size: 18px;
    margin-right: 10px;
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

  @media (max-width: 768px) {
    table {
      font-size: 14px;
    }

    th, td {
      padding: 8px;
    }
  }

</style>

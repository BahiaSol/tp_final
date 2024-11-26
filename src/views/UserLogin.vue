<template>
  <div class="user-login">
    <h1>Iniciar sesión</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <div class="input-container">
        <input type="text" v-model="userId" id="userId" required placeholder="Ingrese su id"/>
      </div>
      <button type="submit">Ingresar</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userId: ''
    }
  },

  methods: {
    login () {
      const validId = /^[a-zA-Z0-9]+$/
      if (!validId.test(this.userId)) {
        alert('El ID solo puede contener caracteres alfanumericos')
        return
      }
      localStorage.setItem('userId', this.userId)
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>

<style scoped>
  .user-login{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    height: 90vh;
    background-color: #f4f6f8;
    padding: 20px;
  }

  .user-login .form-group{
    width: 100%;
    max-width: 400px;
  }
  
  .user-login input[type="text"]{
    width: 100%;
    padding: 10px 15px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  h1{
    color: #333;
    font-size: 30px;
    margin-bottom: 20px;
  }

  button{
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    transition: background-color 0.5s;
    font-size: 18px;
    margin-top: 20px;
    width: 100%;
    cursor: pointer; 
  }
</style>

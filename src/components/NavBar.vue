<template>
<nav class="navbar">
    <ul>
        <li><router-link to="/home">INICIO</router-link></li>
        <li><router-link to="/history">HISTORIAL</router-link></li>
        <li><router-link to="/currenStatus">ESTADO</router-link></li>

        <button @click="logout" class="logout">SALIR</button>
    </ul>
</nav>
</template>

<script>
export default {
    methods: {
        logout(){
            localStorage.removeItem('userId')
            this.$router.push('/')
        }
    }
}
</script>

<style>
.navbar {
    background-color: #007bff;
    padding: 0.5rem;
}

.navbar ul {
    list-style-type: none;
    display: flex;
    gap: 15px;
    padding: 8px;
    margin: 10px;
    flex-grow: 1;
}

.navbar li {
    display: inline;
}

.navbar a {
    color: white;
    text-decoration: none;
}

.navbar a:hover {
    color: #581fb5;
}

.logout {
    margin-left: auto;
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
}

.logout:hover {
    background-color: #c82333;
}
</style>
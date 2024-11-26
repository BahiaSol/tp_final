module.exports = {
    root: true,
    env: {
      node: true,
      browser: true,
    },
    extends: [
      'plugin:vue/vue3-recommended', // Para Vue 3
      'eslint:recommended'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Asegúrate de que esté habilitado si usas JSX
    },
    },
    plugins: [
        'vue', // Asegúrate de que el plugin Vue esté instalado
        'jsx',  // Habilita el soporte para JSX si lo estás usando
    ],
    rules: {
      // Puedes agregar reglas personalizadas aquí
    },
  };
  
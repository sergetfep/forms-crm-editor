require('./css/style.css');
const App = require('./app/App');

const root = document.querySelector('#app');
const app = new App(root);
app.start();

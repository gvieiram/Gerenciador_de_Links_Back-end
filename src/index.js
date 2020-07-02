const express = require('express');
const db = require('./models');
const response = require('./middlewares/response');

const authContoller = require('./controllers/auth');

const app = express();

app.use(response);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authContoller);

app.get('/', (req, res) => {
  return res.json('Api está rodando!!');
});

db.sequelize.sync().then(()=> {
  app.listen(3001, () => {
    console.log('Executando na porta 3001')
  });
});
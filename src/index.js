const express = require('express');
const db = require('./models');

const authContoller = require('./controllers/auth');

const app = express();

app.use('/auth', authContoller);

app.get('/', (req, res) => {
  return res.json('Api está rodando!!');
});

db.sequelize.sync().then(()=> {
  app.listen(3001, () => {
    console.log('Listening on port 3001')
  });
});
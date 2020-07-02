const express = require('express');
const bcrypt = require('bcrypt');
const {Account} = require('../models');

const router = express.Router();

const saltRounds = 10;

router.get('/sign-in', (req, res)=> {
  return res.json('Sign-in');
});

router.get('/sign-up', async (req, res) => {
  //Lê o email e a senha digitados
  const { email, password } = req.body;

  //Verifica se já existe o mesmo email
  const account = await Account.findOne({ where: { email } });
  if (account) return res.jsonBadRequest(null, 'Esta conta já existe');

  //Encripta senha
  const hash = bcrypt.hashSync(password, saltRounds);
  const newAccount = await Account.create({ email, password: hash });

  return res.jsonOK(newAccount, 'Conta criada com sucesso.');
});

module.exports = router;
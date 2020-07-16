const express = require('express');
const bcrypt = require('bcrypt');
const {Account} = require('../models');
const {accountSignUp, accountSignIn} = require('../validators/account');
const {getMessage} = require('../helpers/validator');
const {genarateJwt, genarateRefreshJwt} = require('../helpers/jwt');

const router = express.Router();

const saltRounds = 10;

router.post('/sign-in', accountSignIn, async (req, res)=> {
  //Lê o email e a senha digitados
  const { email, password } = req.body;

  //Verifica se já existe o mesmo email
  const account = await Account.findOne({ where: { email } });

  //Validar Senha e exibe mensagem de erro, se houver
  const match = account ? bcrypt.compareSync(password, account.password) : null;
  if (!match) return res.jsonBadRequest(null, getMessage('account.signin.invalid'));

  //Cria o token e o refresh token para o usuário
  const token = genarateJwt({id: account.id});
  const refreshToken = genarateRefreshJwt({id: account.id, version: account.jwtVersion});

  return res.jsonOK(account, getMessage('account.signin.sucess'), {token, refreshToken});
});

router.post('/sign-up', accountSignUp, async (req, res) => {
  //Lê o email e a senha digitados
  const { email, password } = req.body;

  //Verifica se já existe o mesmo email, se sim, mostra mensagem de erro
  const account = await Account.findOne({ where: { email } });
  if (account) return res.jsonBadRequest(null, getMessage('account.signup.email_exists'));

  //Encripta senha & cria usuário
  const hash = bcrypt.hashSync(password, saltRounds);
  const newAccount = await Account.create({ email, password: hash });

  //Cria o token e o refresh token para o usuário
  const token = genarateJwt({id: newAccount.id});
  const refreshToken = genarateRefreshJwt({id: newAccount.id, version: newAccount.jwtVersion});
 
  return res.jsonOK(newAccount, getMessage('account.signup.sucess'), {token, refreshToken});
});

module.exports = router;
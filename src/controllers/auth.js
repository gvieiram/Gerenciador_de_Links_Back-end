const express = require('express');
const bcrypt = require('bcrypt');
const {Account} = require('../models');
const {accountSignUp, accountSignIn} = require('../validators/account');
const {getMessage} = require('../helpers/validator');
const {generateJwt, generateRefreshJwt, verifyRefreshJwt, getTokenFromHeaders} = require('../helpers/jwt');

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
  const token = generateJwt({id: account.id});
  const refreshToken = generateRefreshJwt({id: account.id, version: account.jwtVersion});

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
  const token = generateJwt({id: newAccount.id});
  const refreshToken = generateRefreshJwt({id: newAccount.id, version: newAccount.jwtVersion});
 
  return res.jsonOK(newAccount, getMessage('account.signup.sucess'), {token, refreshToken});
});

router.post('/refresh', async (req, res) => {
  const token = getTokenFromHeaders(req.headers);
  if (!token) {
    return res.jsonUnauthorized(null, 'Invalid token');
  }

  try {
    const decoded = verifyRefreshJwt(token);
    const account = await Account.findByPk(decoded.id);
    if (!account) return res.jsonUnauthorized(null, 'Invalid token');

    if (decoded.version !== account.jwtVersion) {
      return res.jsonUnauthorized(null, 'Invalid token');
    }

    const meta = {
      token: generateJwt({ id: account.id }),
    };

    return res.jsonOK(null, null, meta);
  } catch (error) {
    return res.jsonUnauthorized(null, 'Invalid token');
  }
});

module.exports = router;
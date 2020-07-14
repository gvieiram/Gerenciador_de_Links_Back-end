const express = require('express');
const {Link} = require('../models');
const router = express.Router();

// LISTAR LINKS (GET ALL)
router.get('/', async (req, res) => {
  const accountId = 1; ///req.id;
  const links = await Link.findAll({ where: { accountId } });

  return res.jsonOK(links);
});

// OBTER LINK PELO ID (GET SINGLE)
router.get('/:id', async (req, res) => {
  const accountId = 1; ///req.id;
  const { id } = req.params;
  const link = await Link.findOne({ where: { id, accountId } });
  if (!link) return res.jsonNotFound();
  return res.jsonOK(link);
});

// ADICIONAR LINK
router.post('/', async (req, res)=> {
  const accountId = 1; ///req.id;
  const {label, url, isSocial} = req.body;

  const image = "http://gustavovieira.epizy.com/img/Eu.jpg"

  const link = await Link.create({label, url, isSocial, image, accountId});

  return res.jsonOK(link);
});

// EDITAR LINK
router.put('/:id', async (req, res)=> {
  const accountId = 1; ///req.id;
  const {id} = req.params;
  const {body} = req;
  const fields = ['label', 'url', 'isSocial'];

  const link = await Link.findOne({where: {id, accountId}});
  if(!link) return res.jsonNotFound();

  fields.map(fieldName=>{
    const newValue = body[fieldName];
    if (newValue) link[fieldName] = newValue; //fazer a verificação se newValue é diferemte de undefine
  });

  await link.save();

  return res.jsonOK(link);
});

// EXCLUIR LINK
router.delete('/:id', async (req, res) => {
  const accountId = 1; ///req.id;
  const { id } = req.params;
  const link = await Link.findOne({ where: { id, accountId } });
  if (!link) return res.jsonNotFound();
  await link.destroy();
  return res.jsonOK();
});

module.exports = router;
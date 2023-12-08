
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 3000;
const bodyparser = require ("body-parser");
const fs = require ("fs")
const scrto = "AOKSdsdakosaa@!"
const usuariosbd = require("./data.json");
const { v4: uuidv4 } = require('uuid');
const getCurrentDateTime = () => new Date().toISOString();
app.use(bodyparser.json());





// CADASTRO DOS USUARIOS SIGN UP //
app.post('/signup', async (req, res) => {
  const { nome, email, senha, telefone } = req.body;


  // VERIFICAÇÃO DE EMAIL E VALIDAÇÃO // 

    if (usuariosbd [email]) {
      return res.status(400).json({ error: 'E-mail já existente' });
     }
        
  
  // Cryptografar bcrypt
  const chave = await bcrypt.hash (senha, 10);

  // Criação do token
  const token = jwt.sign({id: uuidv4()}, scrto, { expiresIn: 1800 });


   // Cria um novo usuário
   const newUser = {
    id: uuidv4(),
    nome,
    email,
    senha: chave,
    telefone,
    data_criacao: getCurrentDateTime(),
    data_atualizacao: getCurrentDateTime(),
    ultimo_login: getCurrentDateTime(),
    token: token
  };
  usuariosbd.push(newUser);

  return res.status(201).json({
    id: newUser.id,
    data_criacao: newUser.data_criacao,
    data_atualizacao: newUser.data_atualizacao,
    ultimo_login: newUser.ultimo_login,
    token: newUser.token,
  });

});


app.post ("./signin", async (req,res) => {
const {email,senha}= req.body;

  // Verificar se email e senha estão corretos
const usuario = usuariosbd [email]

if (!usuario || !(await bcrypt.compare(senha, user.senha))) {
  return res.status(401).json({ msg: 'Usuário e/ou senha inválidos' });
}






});

// Endpoint para buscar informações do usuário
app.get('/usuario', (req, res) => {
  const token = req.headers.authorization;

  // Verifica se o token está presente
  if (!token) {
    return res.status(401).json({ msg: 'Não autorizado' });
  }

  // Verifica se o token é válido
  jwt.verify(token.split(' ')[1], 'chave-secreta', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Sessão inválida' });
      }
      return res.status(401).json({ msg: 'Não autorizado' });
    }

    // Retorna as informações do usuário
    const usuario = usuariosbd[decoded.email];
    res.json({ email: usuario.email });
  });
});

// Tratamento de endpoint não encontrado
app.use((req, res) => {
  res.status(404).json({ msg: 'Endpoint não encontrado' });
});







app.listen (PORT, function (){
  console.log("server funcionando")
});
/* Desafio 01 
  O arquivo contém vários comentários para facilitar a compreensão de todos
*/

// Vincular o express no projeto
const express = require("express");

//Criar o express
const server = express();

//Configura o express para o entendimento do JSON na aplicação
server.use(express.json());

/** Declaração de variáveis */
const projects = [];
let amountRequests = 0;

/** Middleware para checar se o projeto existe  */
function checkExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

/* Middleware para gerar o log do número de requisições */
function logCountRequest(req, res, next) {
  amountRequests++;
  console.log(`Quantidade de requisições: ${amountRequests}`);
  return next();
}

/* Middleware global chamado em todas requisições que imprime a
 * contagem de quantas requisições foram feitas na aplicação até então; */
server.use(logCountRequest);

/* Criação das rotas */

/* Rotas POST /projects: A rota deve receber id e title dentro corpo de cadastrar 
  um novo projeto dentro de um array no seguinte 
  formato: { id: "1", title: 'Novo projeto', tasks: [] };
*/
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

/*GET /projects: Rota que lista todos projetos e suas tarefas; */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/* PUT /projects/id A rota deve alterar apenas o título do projeto com o id 
  presente nos parâmetros da rota; */
server.put("/projects/:id", checkExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.title = title;
  return res.json(project);
});

/* DELETE /projects/id A rota deve deletar o projeto com o id presente nos 
  parâmetros da rota; */
server.delete("/projects/:id", checkExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id === id);
  projects.splice(projectIndex, 1);
  return res.send();
});

/*POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova   
  tarefa no array de tarefas de um projeto específico escolhido através do id 
  presente nos parâmetros da rota; */
server.post("/projects/:id/tasks", checkExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id === id);
  project.tasks.push(title);
  return res.json(project);
});

server.listen(3000);

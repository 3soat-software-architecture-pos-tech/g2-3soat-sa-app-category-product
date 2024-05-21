# PÓS-TECH SOAT3 TECH CHALLENGE

API Sistema de pedidos 'Totem de autoatendimento'

## Setup

Para configurar a aplicação em ambiente kubernetes, execute os seguintes comandos

Deploy
```bash
$ kubectl apply -f deployment.yml
$ kubectl apply -f hpa.yml
$ kubectl apply -f service.yml
```
ou `make deploy`

Se necessário, remover os recursos da infraestrutura
```bash
$ kubectl delete service app-service
$ kubectl delete hpa app-hpa
$ kubectl delete deployment app-deployment
```
ou `make undeploy`

Se necessário, atualizar a imagem
```bash
$ docker build -t carlostofoli/tech-challenge-fase3:latest .
$ docker login
$ docker tag carlostofoli/tech-challenge-fase3:latest carlostofoli/tech-challenge-fase3:latest
$ docker push carlostofoli/tech-challenge-fase3:latest
```
ou `make update-image`

### Setup testes

Para rodar todos os testes localmente, você pode executar o comando
```bash
$ npm run tests
```

Para rodar um teste específico, você pode executar o comando
```bash
$ npm run test <caminho-do-teste>
```


## Tech challenge Fase 4

### Desenho da arquitetura



### Collection:

	Swagger UI: http://localhost/docs

### Guia completo com todas as instruções para execução do projeto e a ordem de execução das APIs, caso seja necessário.

#### API's:

Nosso banco de dados já está populado, no entanto, caso deseje criar novos registros, seguir a ordem indicada abaixo.

- Criar cliente
- Criar categoria
- Criar produto associado à categoria
- Criar pedido associado à cliente e produto


## Team
 - Turma: 3SOAT
 - Grupo: 2

   [André Felipe](andrefelipegodoi@gmail.com)
   
   [Bruna Carlota](brunacarlota@gmail.com)

   [Carlos Tofoli](henrique.tofoli@hotmail.com)

   [Guilherme Oliveira](guilherme.oliveira182@yahoo.com.br)

   [Valdeir Jesus](valdeir_014@hotmail.com)

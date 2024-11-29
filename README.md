# Projeto Final - Desenvolvimento Móvel

> API do projeto final da disciplina de Desenvolvimento Móvel da UTFPR - CM. 

API responsável por servir um sistema de agendamento de salas.

## Setup

Para configurar o projeto, siga os passos a abaixo:
```bash
# Clone o projeto
git clone git@github.com:afmireski/OPT120-projeto-final-api.git # via ssh
# ou
git clone https://github.com/afmireski/OPT120-projeto-final-api.git # via https

# Acesse a pasta do projeto
cd OPT120-projeto-final-api

# Instale a versão do node
mise trust
mise install

# Instale as dependências do projeto
npm install

# Suba o banco de dados com o docker
docker-compose up -d

# Migre o banco
npm run migrate

# Execute o projeto
npm run start:dev
```
- Para [instalar o mise](https://mise.jdx.dev).

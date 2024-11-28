# Use a imagem oficial do Node.js com Alpine
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código da aplicação para o contêiner
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Define o comando para iniciar a aplicação
CMD ["npm", "run", "start"]
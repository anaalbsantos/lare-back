# ![Logo da Larê](./lare-logo.svg) Larê - Back

Esse repositório é destinado à construção da API em NestJS para o e-commerce Larê. Ela fornece rotas para gerenciar produtos, usuários, carrinhos e pedidos.

## 💻 Tecnologias utilizadas

- [NestJS](https://nestjs.com/): Um framework de Node.js para construir aplicações backend escaláveis e eficientes
- [Prisma](https://www.prisma.io/): ORM moderno para Node.js e TypeScript que simplifica o acesso e gerenciamento do banco de dados
- [Swagger](https://swagger.io/): Ferramenta para documentação automática de APIs RESTful

## Funcionalidades

### 🔐 Autenticação

- Login de usuários com email e senha, retornando um token JWT

### 👤 Usuários

- Cadastro de novos usuários
- Listagem de todos os usuários (requer admin)
- Busca de usuário por ID
- Atualização de dados do usuário
- Remoção de usuário

### 📦 Produtos

- Criação de produtos (requer admin)
- Listagem de todos os produtos
- Busca de produto por ID
- Atualização de produtos (requer admin)
- Remoção de produtos (requer admin)

### 🛒 Carrinho

- Visualização do carrinho do usuário
- Adição de produtos ao carrinho
- Remoção de produtos do carrinho
- Finalização da compra do carrinho

## ✨ Rodando o projeto

Para conseguir rodar o projeto, certifique-se de que possui instalado o gerenciador de pacotes [pnpm](https://pnpm.io/pt/). Tendo ele instalado, siga os passos abaixo para instalar as dependências e iniciar o ambiente de desenvolvimento:

### 1. Instale as dependências:

```bash
$ pnpm install
```

## 2. Inicie a aplicação

```bash
$ pnpm run start
```

Prontinho, a api deve estar rodando em [http://localhost:3000](http://localhost:3000)!

## 📄 Documentação

Para acessar a documentação feita com o Swagger, você deve acessar [http://localhost:3000/docs](http://localhost:3000/docs).

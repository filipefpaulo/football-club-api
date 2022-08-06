# football-club-api
CRUD feito com TypeScript, Sequelize e muito POO

Nesta API temos o gerenciamento de partidas de futebol feitas a partir de inserções do usuário.

## Executando o projeto

Para executar o projeto é necessário que alguns passos sejam seguidos:
 - Clonar o repositório: ``git clone git@github.com:filipefpaulo/football-club-api.git``
 - Executar as instalações das depêndencias do projeto: ``npm i`` ou ``yarn``
 - Certificar que seu banco de dados esteja rodando e alterar as chaves do arquivo ``.env.example`` (Importante lembrar de renomear o arquivo de ``.env.example`` para ``.env``)
 - Executar o comando para iniciar a aplicação em modo dev: ``npm run dev`` ou ``yarn dev``
 
## Mapa de rotas

 - ``/login``: Rota do tipo ``POST``, recebe body do tipo ``{ email: example@example.com, password: 123456}``, retorna um objeto do tipo ``{token: 'valid_token'}``
 
 - ``/validate``: Rota do tipo ``GET``, recebe headers do tipo ``{ authorization: 'valid_token' }``, retorna uma string com o tipo de usuário ``admin`` ou ``user``
 
 - ``/teams``: Rota do tipo ``GET``, recebe headers do tipo ``{ authorization: 'valid_token' }``, retorna um array com todos os times listados, 
 do tipo ``{id: 'valid_id', teamName: 'valid_name'}``
 
 - ``/teams/:id``: Rota do tipo ``GET``, recebe headers do tipo ``{ authorization: 'valid_token' }`` e params do tipo string com o id do time ``/teams/valid_id``, 
 retorna objeto do tipo ``{id: 'valid_id', teamName: 'valid_name'}``
 
 - ``/matches``: Rota do tipo ``GET``, recebe headers do tipo ``{ authorization: 'valid_token' }`` e opcionalmente uma querry com o status do jogo ``/matches``, retorna um array com todos os times listados, 
 do tipo ``{id: 'valid_id', teamName: 'valid_name'}``

## Consumindo a API

O consumo da API é baseado na validação de tokens, para iniciar seu consumo é importante que seja acessada a rota ´´/login´´ passando email e senha como um objeto JSON,
o retorno da rota é um objeto JSON com o token.

Com esse token é possível utilizar o restante da API, sempre lembrando de setar o valor do mesmo na chave ``headers.authorization``.

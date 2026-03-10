//instanciando a biblioteca do express e armazenando na constante library
const library = require('express');

//atrelando a função mestre do express na constante app
const app = library();

//fazendo com que o express utilize o json como formato de recebimento informações do front-end
app.use(library.json());


//Configurando o servidor node.js express para 'ouvir' requisições na porta de serviços 3000, informando que está funcionando
app.listen(3000, () => {
    console.log("Servidor Funcionando e esperando requests!");
});

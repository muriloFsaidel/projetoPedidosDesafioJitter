//instanciando a biblioteca do express e armazenando na constante library
const library = require('express');

//atrelando a função mestre do express na constante app
const app = library();

//fazendo com que o express utilize o json como formato de recebimento informações do front-end
app.use(library.json());

//instanciando a biblioteca do prisma
const { PrismaClient } = require('@prisma/client');

//armazenado o objeto na constante
const prisma = new PrismaClient();

// mapeando a rota /order do tipo post para criar um novo pedido no servidor local na porta 3000
app.post('/order', async (request, response) => {

    // estou desmembrando os dados enviados pela requisição por parte do cliente e armazenando os respectivos valores nas variáveis equivalentes aos campos/chaves do JSON
    let { numeroPedido, valorTotal, dataCriacao, items } = request.body;

    //fazendo a verificação se os dados são válidos
    if ((numeroPedido == "" || numeroPedido === undefined) || (valorTotal === undefined) || (dataCriacao == "" || dataCriacao === undefined) || (items.length == 0)) {
        return response.status(400).send({ mensagem: "algum dos valores não foi preenchido, favor verificar" });
    }
    else {
        //executando operação de criação no banco de dados mongo db na tabela order
        const pedido = await prisma.order.create({
            data: {
                //mapeando os dados recebidos da request para um objeto 
                orderId: numeroPedido,
                value: valorTotal,
                creationDate: new Date(dataCriacao),
                items: {
                    set: items.map(produto => ({
                        productId: produto.idItem,
                        quantity: produto.quantidadeItem,
                        price: produto.valorItem
                    }))
                },
                version: 0
            }
        });
        //retorno com status 201 'criado com sucesso' e os dados do pedido
        return response.status(201).send(pedido);
    }

});

// mapeando a rota /order do tipo get para listar todos os pedidos no servidor local na porta 3000
app.get('/order/list', async (request, response) => {
    //executando operação de buscar todos os registros no banco de dados mongo db na tabela order
    const orders = await prisma.order.findMany();
    //lança a resposta com todos os pedidos
    return response.status(200).send(orders);
});




// mapeando a rota /order/valordonumerodopedido do tipo get para devolver os dados daquele pedido por numeroPedido  no servidor local na porta 3000
app.get('/order/:numeroPedido', async (request, response) => {
    const orderId = request.params.numeroPedido.toString();
    try {
        //executando operação de busca de um pedido no banco de dados mongo db na tabela order
        const order = await prisma.order.findUnique({
            where: { orderId }
        });
        //lança a resposta com o pedido encontrado
        return response.status(200).send(order);
    } catch (error) {
        //lança a resposta como não encontrado
        return response.status(404).send({ mensagem: "número do pedido não foi encontrado!!!" });
    }
});


//Configurando o servidor node.js express para 'ouvir' requisições na porta de serviços 3000, informando que está funcionando
app.listen(3000, () => {
    console.log("Servidor Funcionando e esperando requests!");
});

import express from 'express';
import { executarsql } from '../database/index.js';
const router = express.Router()

router.get('/', async (req, res) => {
    // #swagger.description = 'Busca todos os clientes'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de clientes',
            schema: [{
                cliente_id: 1,
                nome:"nome do cliente",
                cpf: "000.000.000-00",
                telefone: "8500000000",
                enderco:"nome do endereco",
                email: "email@email.com"
            }]
    } */

    const Clientes = await executarsql(`select * from Cliente`);
    for (let cliente of Clientes) {
        const Veiculos = await executarsql(`select * from Veículo where cliente_id = ${cliente.cliente_id}`);
        cliente.veiculos = Veiculos;
    }
    res.json(Clientes);
})


router.get('/:id', async (req, res) => {
    // #swagger.description = 'Busca um cliente'
    /* #swagger.responses[200] = {
            description: 'Retorna um cliente',
            schema: {
                cliente_id: 1,
                nome:"nome do cliente",
                cpf: "000.000.000-00",
                telefone: "8500000000",
                enderco:"nome do endereco",
                email: "email@email.com"
            }
    } */
    res.json(await executarsql(`select * from Cliente where cliente_id = ${req.params.id}`))
})

router.post('/', async (req, res) => {
    // #swagger.description = "Cria um cliente"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $nome:"nome do cliente",
                    $cpf: "000.000.000-00",
                    $telefone: "8500000000",
                    $enderco:"nome do endereco",
                    $email: "email@email.com"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */

    let resultado = await executarsql(`insert into Cliente (nome, cpf, telefone, enderco, email) values ('${req.body.nome}', '${req.body.cpf}', '${req.body.telefone}' , '${req.body.enderco}' , '${req.body.email}')`)
    if (resultado.length == 0) {
        res.json({
            tipo: "success",
            mensagem: "registro criado com sucesso"
        })
    }

})

router.put('/:id', async (req, res) => {
    // #swagger.description = "Edita um cliente"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $cliente_id: 1,
                    $nome:"nome do cliente",
                    $cpf: "000.000.000-00",
                    $telefone: "8500000000",
                    $enderco:"nome do endereco",
                    $email: "email@email.com"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    let linha = await executarsql(`select * from Cliente where cliente_id = ${req.params.id}`)
    if (linha.length > 0) {
        let cliente = linha[0]
        if (req.body.nome) {
            cliente.nome = req.body.nome
        }
        if (req.body.cpf) {
            cliente.cpf = req.body.cpf
        }
        if (req.body.telefone) {
            cliente.telefone = req.body.telefone
        }
        if (req.body.enderco) {
            cliente.enderco = req.body.enderco
        }
        if (req.body.email) {
            cliente.email = req.body.email
        }
        let resultado = await executarsql(`update cliente set nome = '${cliente.nome}', cpf = '${cliente.cpf}', telefone = '${cliente.telefone}' , enderco = '${cliente.enderco}' , email = '${cliente.email}' where cliente_id = ${req.params.id}`)
        if (resultado.length == 0) {
            res.json({
                tipo: "success",
                mensagem: "registro atualizado com sucesso"
            })
        }
    } else {
        res.json({
            tipo: "warning",
            mensagem: "registro nao encontrado"
        })
    }

})

router.delete('/:id', async (req, res) => {
    // #swagger.description = "Deleta um cliente"
    /* #swagger.responses[200] = {
            description: 'Registro deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */

    let resultado = await executarsql(`delete from Cliente where cliente_id = ${req.params.id}`)
    if (resultado.length == 0) {
        res.json({
            tipo: "success",
            mensagem: "registro deletado com sucesso"
        })
    }
    return res.json({
        tipo: "warning",
        mensagem: "registro em uso"
    })
})

export default router 
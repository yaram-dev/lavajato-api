import express from 'express';
import { executarsql } from '../database/index.js';
const router = express.Router()

router.get('/', async (req, res) => {
     // #swagger.description = 'Busca todos os veiculos'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de veiculos',
            schema: [{
                veiculo_id: 2,
                cliente_id:"nome do cliente",
                placa: "identificacao da placa",
                modelo: "modelo do veiculo",
                cor: "cor do veiculo" ,
                ano: 2025
            }]
    } */
    res.json(await executarsql(`select * from Veículo INNER JOIN Cliente ON Veículo.cliente_id = Cliente.cliente_id`))
})

router.get('/:id', async (req, res) => {
    // #swagger.description = 'Busca um veiculo'
    /* #swagger.responses[200] = {
            description: 'Retorna um veiculo',
            schema: {
                veiculo_id: 2,
                cliente_id:2,
                placa: "pma0987",
                modelo: "corolla",
                cor: "preto" ,
                ano: 2025
            }
    } */
    res.json(await executarsql(`select * from Veículo where veiculo_id = ${req.params.id}`))
})

router.post('/', async (req, res) => {
    // #swagger.description = "Cria um veiculo"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $cliente_id: 1,
                    $placa: "identificacao da placa",
                    $modelo: "modelo do veiculo",
                    $cor: "cor do veiculo",
                    $ano: 2025,
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Veiculo criado com sucesso',
            schema: {
                type: 'success',
                description: 'Veiculo criado com sucesso.',
            }
    } */

    let resultado = await executarsql(`insert into Veículo (cliente_id, placa, modelo, cor, ano) values (${req.body.cliente_id},'${req.body.placa}', '${req.body.modelo}', '${req.body.cor}' , ${req.body.ano})`)
    if (resultado.length == 0) {
        res.json({
            tipo: "success",
            mensagem: "Veiculo criado com sucesso"
        })
    }

})

router.put('/:id', async (req, res) => {
     // #swagger.description = "Edita um veiculo"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $cliente_id: 2,
                    $placa: "identificacao da placa",
                    $modelo: "modelo do veiculo",
                    $cor: "cor do veiculo",
                    $ano: 2025,
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Veiculo atualizado com sucesso',
            schema: {
                type: 'success',
                description: 'Veiculo atualizado com sucesso.'
            }
    } */
    let linha = await executarsql(`select * from Veículo where veiculo_id = ${req.params.id}`)
    console.log(linha);
    
    if (linha.length > 0) {
        let veiculo = linha[0]

        if (req.body.cliente_id) {
            veiculo.cliente_id = req.body.cliente_id
        }
        if (req.body.placa) {
            veiculo.placa = req.body.placa
        }
        if (req.body.modelo) {
            veiculo.modelo = req.body.modelo
        }
        if (req.body.cor) {
            veiculo.cor = req.body.cor
        }   
         if (req.body.ano) {
            veiculo.ano = req.body.ano
        }   
        let resultado = await executarsql(`update Veículo set cliente_id = ${veiculo.cliente_id}, placa = '${veiculo.placa}', modelo = '${veiculo.modelo}', cor = '${veiculo.cor}', ano = ${veiculo.ano} where veiculo_id = ${req.params.id}`)
        if (resultado.length == 0) {
            res.json({
                tipo: "success",
                mensagem: "veiculo atualizado com sucesso"
            })
        }
    } else {
        res.json({
            tipo: "warning",
            mensagem: "veiculo nao encontrado"
        })
    }

})

router.delete('/:id', async (req, res) => {
     // #swagger.description = "Deleta um veiculo"
    /* #swagger.responses[200] = {
            description: 'registro deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */

    let resultado = await executarsql(`delete from Veículo where veiculo_id = ${req.params.id}`)
    if (resultado.length == 0) {
        res.json({
            tipo: "success",
            mensagem: "registro deletado com sucesso"
        })
    }
})

export default router 
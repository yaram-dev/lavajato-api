import express from 'express';
import { executarsql } from '../database/index.js';
const router = express.Router()

router.get('/', async (req, res) => {
    // #swagger.description = 'Busca todos os pagamentos'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de pagamentos',
            schema: [{
                pagamento_id: 1,
                os_id: 1,
                forma_pagamento: "pix",
                valor_pago: "49.9",
                data_pagamento: "25-09-25"
            }]
    } */
    const pagamentos = await executarsql(`select * from Pagamento INNER JOIN Ordem_servico ON Pagamento.os_id = Ordem_servico.os_id INNER JOIN Veículo ON Ordem_servico.veiculo_id = Veículo.veiculo_id INNER JOIN Cliente ON Veículo.cliente_id = Cliente.cliente_id`)
    const os = await executarsql(`select count(*) as servicos from Ordem_servico WHERE status = 'concluido'`)
    const faturamento = await executarsql(`select COALESCE(SUM(valor_pago), 0):: float as total from pagamento`)
    const requisicoes = await Promise.all([pagamentos, os, faturamento])
    if (requisicoes){
        res.json({pagamentos: requisicoes[0], totalServicos: requisicoes[1][0].servicos, faturamento: requisicoes[2][0].total || 0})
        return
    }
    res.json({pagamentos: requisicoes[0], totalServicos: requisicoes[1][0].servicos, faturamento: requisicoes[2][0].total || 0})
})

router.get('/:id', async (req, res) => {
    // #swagger.description = 'Busca um valor pago'
    /* #swagger.responses[200] = {
            description: 'Retorna um valor pago',
            schema: {
                pagamento_id: 1,
                os_id: 1,
                forma_pagamento: "pix",
                valor_pago: "49.9",
                data_pagamento: "25-09-25"
            }
    } */
    res.json(await executarsql(`select * from Pagamento where pagamento_id = ${req.params.id}`))
})

router.post('/', async (req, res) => {
    // #swagger.description = "Cria um valor pago "
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $os_id: 1,
                    $forma_pagamento: "pix",
                    $valor_pago:"49.9",
                    $data_pagamento: "25-09-25"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */
    let resultado = await executarsql(`insert into pagamento (os_id, forma_pagamento, valor_pago, data_pagamento) values ('${req.body.os_id}', '${req.body.forma_pagamento}', ${Number(req.body.valor_pago)}, '${req.body.data_pagamento}')`)
    if (resultado.length == 0) {
        let osUpdate = await executarsql(`update Ordem_servico set status = 'concluido' where os_id = ${req.body.os_id}`)
        if (osUpdate.rowCount > 0) {    
            res.json({
                tipo: "success",
                mensagem: "registro criado com sucesso"
            })
        }

    }

})

router.put('/:id', async (req, res) => {
    // #swagger.description = "Edita um pagamento"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $forma_pagamento: "pix",
                    $valor_pago:"49.9",
                    $data_pagamento: "25-09-25"
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    let linha = await executarsql(`select * from Pagamento where pagamento_id = ${req.params.id}`)
    if (linha.length > 0) {
        let pagamento = linha[0]
        if (req.body.forma_pagamento) {
            pagamento.forma_pagamento = req.body.forma_pagamento
        }
        if (req.body.valor_pago) {
            pagamento.valor_pago = req.body.valor_pago
        }
        if (req.body.data_pagamento) {
            pagamento.data_pagamento = req.body.data_pagamento

        }
        let resultado = await executarsql(`update Pagamento set forma_pagamento = '${pagamento.forma_pagamento}', valor_pago = '${pagamento.valor_pago}', data_pagamento = '${pagamento.data_pagamento}' where pagamento_id = ${req.params.id}`)
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
    // #swagger.description = "Deleta um valor pago"
    /* #swagger.responses[200] = {
            description: 'Registro deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */

    let resultado = await executarsql(`delete from Pagamento where pagamento_id = ${req.params.id}`)
    if (resultado.length == 0) {
        res.json({
            tipo: "success",
            mensagem: "registro deletado com sucesso"
        })
    }
})

export default router 
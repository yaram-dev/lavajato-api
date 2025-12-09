import express from 'express';
import { executarsql } from '../database/index.js';
const router = express.Router()

router.get('/', async (req, res) => {
    // #swagger.description = 'Busca todos os servicos'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de servicos',
            schema: [{
                os_id: 1,
                cliente_id: 1 ,
                veiculo_id: 1,
                data_abertura: "2025-10-25 12:00:01",
                data_fechamento:"2025-10-25 12:00:01",
                status: "pago",
                valor_total: 39.9
            }]
    } */
    let oss = await executarsql(`select * from Ordem_servico INNER JOIN veículo ON Ordem_servico.veiculo_id = veículo.veiculo_id INNER JOIN Cliente ON Veículo.cliente_id = Cliente.cliente_id`)
    for (let os of oss) {
        const Servicos = await executarsql(`select * from itens_os  INNER JOIN serviço ON itens_os.servico_id = serviço.servico_id where os_id = ${os.os_id}`);
        os.servicos = Servicos;
    }
    res.json(oss);
})

router.get('/:id', async (req, res) => {
    // #swagger.description = 'Busca uma ordem de servico'
    /* #swagger.responses[200] = {
            description: 'Retorna uma ordem de servico',
            schema: {
                os_id: 1,
                cliente_id: 1 ,
                veiculo_id: 1,
                data_abertura: "2025-10-25 12:00:01",
                data_fechamento:"2025-10-25 12:00:01",
                status: "pago",
                valor_total: 39.9
            }
    } */
    res.json(await executarsql(`select * from Ordem_servico where os_id = ${req.params.id}`))
})

router.post('/', async (req, res) => {
    // #swagger.description = "Cria uma ordem de servico"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $cliente_id: 1 ,
                    $veiculo_id: 1,
                    $data_abertura: "2025-10-25 12:00:01",
                    $data_fechamento:"2025-10-25 12:00:01",
                    $status: "",
                    $valor_total: 39.9
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */

    let resultado = await executarsql(`insert into Ordem_servico (cliente_id, veiculo_id, data_abertura, data_fechamento, status, valor_total ) values (${req.body.cliente_id}, ${req.body.veiculo_id}, '${req.body.data_abertura}' , '${req.body.data_fechamento}', '${req.body.status}', ${req.body.valor_total})`)
    if (resultado.affectedRows > 0) {
        req.body.servicos.map(async (servico) => {
            await executarsql(`insert into itens_os (os_id, servico_id) values (${resultado.insertId}, '${servico}')`)
        })
        res.json({
            tipo: "success",
            mensagem: "registro criado com sucesso"
        })
    }

})

router.put('/:id', async (req, res) => {
    // #swagger.description = "Edita uma ordem de servico"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $cliente_id: 1 ,
                    $veiculo_id: 1,
                    $data_abertura: "2025-10-25 12:00:01",
                    $data_fechamento:"2025-10-25 12:00:01",
                    $status: "",
                    $valor_total: 39.9
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    let linha = await executarsql(`select * from Ordem_servico where os_id = ${req.params.id}`)
    if (linha.length > 0) {
        let ordem = linha[0]
        if (req.body.cliente_id) {
            ordem.cliente_id = req.body.cliente_id
        }
        if (req.body.veiculo_id) {
            ordem.veiculo_id = req.body.veiculo_id
        }
        if (req.body.data_abertura) {
            ordem.data_abertura = req.body.data_abertura
        }
        if (req.body.data_fechamento) {
            ordem.data_fechamento = req.body.data_fechamento
        }
        if (req.body.status) {
            ordem.status = req.body.status
        }
        if (req.body.valor_total) {
            ordem.valor_total = req.body.valor_total
        }
        let resultado = await executarsql(`update Ordem_servico set cliente_id = ${ordem.cliente_id}, veiculo_id = ${ordem.veiculo_id}, data_abertura = '${ordem.data_abertura}' , data_fechamento = '${ordem.data_fechamento}' , status = '${ordem.status}', valor_total = ${ordem.valor_total} where os_id = ${req.params.id}`)
        if (resultado.affectedRows > 0) {
            req.body.servicos.map(async (servico) => {
                await executarsql(`insert into itens_os (os_id, servico_id) values (${resultado.insertId}, '${servico}')`)
            })
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
    // #swagger.description = "Deleta uma ordem de servico"
    /* #swagger.responses[200] = {
            description: 'Registro deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */

    let resultado = await executarsql(`delete from Ordem_servico where os_id = ${req.params.id}`)
    if (resultado.affectedRows > 0) {
        res.json({
            tipo: "success",
            mensagem: "registro deletado com sucesso"
        })
    }
})

export default router 
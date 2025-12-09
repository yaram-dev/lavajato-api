import express from 'express';
import { executarsql } from '../database/index.js';
const router = express.Router()

router.get('/', async (req, res) => {
    // #swagger.description = 'Busca todos os itens da ordem de servico'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de itens da ordem de servico',
            schema: [{
                itens_os_id: 1,
                os_id: 1,
                servico_id: 1,
                quantidade: 1,
                
            }]
    } */
    res.json(await executarsql(`select * from Itens_OS`))
})

router.get('/:id', async (req, res) => {
    // #swagger.description = 'Busca um item da ordem de servico'
    /* #swagger.responses[200] = {
            description: 'Retorna um item da ordem de servico',
            schema: {
                itens_os_id: 1,
                os_id: 1,
                servico_id: 1,
                quantidade: 1,
            }
    } */
    res.json(await executarsql(`select * from Itens_OS where itens_os_id = ${req.params.id}`))
})

router.post('/', async (req, res) => {
    // #swagger.description = "Cria um item da ordem de servico"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $os_id:1,
                    $servico_id: 1,
                    $quantidade: 1
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */

    let resultado = await executarsql(`insert into Itens_OS (os_id, servico_id, quantidade) values (${req.body.os_id}, ${req.body.servico_id}, ${req.body.quantidade})`)
    if (resultado.affectedRows > 0) {
        res.json({
            tipo: "success",
            mensagem: "registro criado com sucesso"
        })
    }

})

router.put('/:id', async (req, res) => {
    // #swagger.description = "Edita um item da ordem de servico"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $os_id:1,
                    $servico_id: 1,
                    $quantidade: 1,
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    let linha = await executarsql(`select * from Itens_OS where itens_os_id = ${req.params.id}`)
    if (linha.length > 0) {
        let Itens_OS = linha[0]
        if (req.body.os_id) {
            Itens_OS.os_id = req.body.os_id
        }
        if (req.body.servico_id) {
            Itens_OS.servico_id = req.body.servico_id
        }
        if (req.body.quantidade) {
            Itens_OS.quantidade = req.body.quantidade
        }
      
        let resultado = await executarsql(`update Itens_OS set os_id = ${Itens_OS.os_id}, servico_id = ${Itens_OS.servico_id}, quantidade = ${Itens_OS.quantidade} where itens_os_id = ${req.params.id}`)
        if (resultado.affectedRows > 0) {
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
    // #swagger.description = "Deleta um item da ordem de servico"
    /* #swagger.responses[200] = {
            description: 'Registro deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */

    let resultado = await executarsql(`delete from Itens_OS where itens_os_id = ${req.params.id}`)
    if (resultado.affectedRows > 0) {
        res.json({
            tipo: "success",
            mensagem: "registro deletado com sucesso"
        })
    }
})

export default router 
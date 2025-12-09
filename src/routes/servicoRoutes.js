import express from 'express';
import { executarsql } from '../database/index.js';
const router = express.Router()

router.get('/', async (req, res) => {
    // #swagger.description = 'Busca todos os serviços'
    /* #swagger.responses[200] = {
            description: 'Retorna lista de serviços',
            schema: [{
                servico_id: 1,
                nome:"nome do servico",
                descricao: "descricao do servico",
                valor_base: 20,
            }]
    } */
    res.json(await executarsql(`select * from \`serviço\``))
})

router.get('/:id', async (req, res) => {
    // #swagger.description = 'Busca um serviço'
    /* #swagger.responses[200] = {
            description: 'Retorna um serviço',
            schema: {
                servico_id: 1,
                nome:"nome do servico",
                descricao: "descricao do servico",
                valor_base: 20,
            }
    } */
    res.json(await executarsql(`select * from \`serviço\` where servico_id = ${req.params.id}`))
})

router.post('/', async (req, res) => {
    // #swagger.description = "Cria um servico"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $nome: "nome do servico",
                    $descricao: "descricao do servico",
                    $valor_base: 20,
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro criado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro criado com sucesso.',
            }
    } */

    let resultado = await executarsql(`insert into \`serviço\` (nome, descricao, valor_base) values ('${req.body.nome}', '${req.body.descricao}', ${req.body.valor_base})`)
    if (resultado.affectedRows > 0) {
        res.json({
            tipo: "success",
            mensagem: "registro criado com sucesso"
            
        })
    }

})

router.put('/:id', async (req, res) => {
    // #swagger.description = "Edita um servico"
    /* #swagger.parameters['obj'] = {
                in: 'body',
                schema: {
                    $nome: "nome do servico",
                    $descricao: "descricao do servivo",
                    $valor_base: 20,
                    $servico_id: 1 ,
                }
        } */
    /* #swagger.responses[200] = {
            description: 'Registro atualizado com sucesso',
            schema: {
                type: 'success',
                description: 'Registro atualizado com sucesso.',
            }
    } */
    let linha = await executarsql(`select * from \`serviço\` where servico_id = ${req.params.id}`)
    if (linha.length > 0) {
        let servico = linha[0]
        if (req.body.nome) {
            servico.nome = req.body.nome
        }
        if (req.body.descricao) {
            servico.descricao = req.body.descricao
        }
        if (req.body.valor_base) {
            servico.valor_base = req.body.valor_base
        }
        let resultado = await executarsql(`update \`serviço\` set nome = '${servico.nome}', descricao = '${servico.descricao}', valor_base = ${servico.valor_base} where servico_id = ${req.params.id}`)
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
    // #swagger.description = "Deleta um servico"
    /* #swagger.responses[200] = {
            description: 'servico deletado',
            schema: {
                type: 'success',
                description: 'Registro deletado com sucesso.',
            }
    } */
    try {
        let resultado = await executarsql(`delete from \`serviço\` where servico_id = ${req.params.id}`)

        if (resultado.affectedRows > 0) {
            res.json({
                tipo: "success",
                mensagem: "registro deletado com sucesso"
            })
            return
        }
        return res.json({
            tipo: "warning",
            mensagem: "registro em uso"
        })
    } catch (error) {
        res.json({
            tipo: "error",
            mensagem: error.message
        })
    }
})

export default router 
import express from "express"
import cors from "cors"

import servicoRoutes from "./src/routes/servicoRoutes.js" 
import clienteRoutes from "./src/routes/clienteRoutes.js" 
import veiculoRoutes from "./src/routes/veiculoRoutes.js" 
import itensRoutes from "./src/routes/itensRoutes.js" 
import osRoutes from "./src/routes/osRoutes.js" 
import pagamentoRoutes from "./src/routes/pagamentoRoutes.js" 


import swaggerui from "swagger-ui-express";

import swaggeroutput from "./src/docs/swagger-output.json" with {type:"json"}
import { executarsql } from "./src/database/index.js"

const app = express()
app.use(cors())
app.use(express.json())
app.use("/servicos", servicoRoutes)
app.use("/clientes", clienteRoutes)
app.use("/veiculos", veiculoRoutes)
app.use("/itens", itensRoutes)
app.use("/os", osRoutes)
app.use("/pagamentos", pagamentoRoutes)
app.get("/dashboard", async (req, res) => {
    const clientes = await executarsql(`select count(*) as clientes from Cliente`)
    const veiculos = await executarsql(`select count(*) as veiculos from Veículo`)
    const ordens = await executarsql(`select count(*) as ordens from Ordem_servico WHERE status = 'aberta'`)
    const faturamento = await executarsql(`select SUM(valor_pago) as total from pagamento`)
    const requisicoes = await Promise.all([clientes, veiculos, ordens, faturamento])
    if (requisicoes){
        res.json({clientes:clientes[0].clientes, veiculos:veiculos[0].veiculos, ordens:ordens[0].ordens, faturamento: faturamento[0].total || 0})
    }
    
})



app.use("/docs", swaggerui.serve, swaggerui.setup(swaggeroutput))

app.get("/", (req, res) => {
    res.redirect("/docs")
})

app.listen(8000, () => {
    console.log(
        "http://localhost:8000"
    );
    
})
import mysql from "mysql2/promise"
import 'dotenv/config';

async function executarsql(sql) {
    try {
        const conexao = await mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.PORT

        })
        const [result] = await conexao.query(sql);
        conexao.end();
        return result
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        }
    }

}
export {executarsql}
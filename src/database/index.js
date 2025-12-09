import pkg from "pg";
import "dotenv/config";

const { Pool } = pkg;

const pool = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
    ssl: { rejectUnauthorized: false } // Neon exige SSL
});

async function executarsql(sql) {
    try {
        const result = await pool.query(sql);
        return result.rows; // equivalente ao result do MySQL
    } catch (error) {
        return {
            tipo: "error",
            mensagem: error.message
        };
    }
}

export { executarsql };
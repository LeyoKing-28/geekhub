import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'geekhub',
  user: 'adityajadhav',
  password: '',
});

export default pool;

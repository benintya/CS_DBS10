const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const { Pool } = require('pg')
const Redis = require('ioredis')

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

const JWT_SECRET = 'your_secret_key'

const db = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_6piru0NYGbVd@ep-green-bar-aqy8akx5-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: { rejectUnauthorized: false }
})

const redis = new Redis({ host: 'localhost', port: 6379 })

async function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    const blacklisted = await redis.get('blacklist:' + token)
    if (blacklisted) return res.status(401).json({ error: 'Token revoked' })
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' })
  try {
    await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
      [username, email, password]
    )
    res.json({ message: 'Registered successfully' })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  const result = await db.query(
    'SELECT * FROM users WHERE username=$1 AND password=$2',
    [username, password]
  )
  if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' })
  const user = result.rows[0]
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1d' })
  res.json({ token, user: { id: user.id, username: user.username } })
})

app.post('/logout', auth, async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  await redis.set('blacklist:' + token, '1', 'EX', 86400)
  res.json({ message: 'Logged out' })
})

app.get('/items', auth, async (req, res) => {
  const result = await db.query('SELECT * FROM items ORDER BY id DESC')
  res.json(result.rows)
})

app.get('/items/:id', auth, async (req, res) => {
  const result = await db.query('SELECT * FROM items WHERE id=$1', [req.params.id])
  if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' })
  res.json(result.rows[0])
})

app.post('/items', auth, async (req, res) => {
  const { name, description, price, stock, category } = req.body
  const result = await db.query(
    'INSERT INTO items (name, description, price, stock, category, seller) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, description, price, stock, category, req.user.username]
  )
  res.json(result.rows[0])
})

app.put('/items/:id', auth, async (req, res) => {
  const { name, description, price, stock, category } = req.body
  const result = await db.query(
    'UPDATE items SET name=$1, description=$2, price=$3, stock=$4, category=$5 WHERE id=$6 RETURNING *',
    [name, description, price, stock, category, req.params.id]
  )
  res.json(result.rows[0])
})

app.delete('/items/:id', auth, async (req, res) => {
  await db.query('DELETE FROM items WHERE id=$1', [req.params.id])
  res.json({ message: 'Deleted' })
})

app.listen(3000, () => console.log('Backend running on http://localhost:3000'))

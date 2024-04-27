const express = require('express')
const path = require('path')
const cors = require('cors')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'robo.db')
app.use(cors())
app.use(express.json())

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/', async (req, res) => {
  const dbquery = `select * from robo;`
  const data = await db.all(dbquery)
  res.send(data)
})

app.delete('/robo/:Id/', async (request, response) => {
  const {Id} = request.params
  const deleteBookQuery = `
    DELETE FROM
      robo
    WHERE
      ID = ${Id};`
  const dele = await db.run(deleteBookQuery)
  response.send(dele)
})

app.get('/robo/:Id/', async (request, response) => {
  const {Id} = request.params
  const getBookQuery = `
    SELECT
      *
    FROM
      robo
    WHERE
      ID = ${Id};`
  const book = await db.get(getBookQuery)
  response.send(book)
})

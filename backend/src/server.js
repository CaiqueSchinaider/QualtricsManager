import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai'
import { db } from './firebase.js'
import { collection, getDocs } from 'firebase/firestore'

dotenv.config()

const appServer = express()

appServer.use(cors({
  origin: ["https://qualtricsmanager.onrender.com"]
}))

appServer.use(express.json())

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GOOGLEGEN })

let usersSession = []

function CreateToken() {
  let min = 100000
  let max = 999999

  const createNumber = () => Math.floor(Math.random() * (max - min + 1 )) + min 

  let token
  let exists = true

  while (exists) {
    token = createNumber()
    exists = usersSession.find(u => u.token === token)
  }

  return token
}

appServer.post('/api/users', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ signal: false, log: "Dados incompletos" })
  }

  try {
    const snapshot = await getDocs(collection(db, "users"))

    const users = snapshot.docs.map(doc => doc.data())

    const validUser = users.find(
      u => u.username === username && u.password === password
    )

    if (!validUser) {
      return res.status(200).json({ signal: false, log: "Acesso negado" })
    }

    const token = CreateToken()

    usersSession.push({ username, token })

    return res.status(200).json({
      signal: true,
      token,
      log: "Acesso permitido"
    })

  } catch (error) {
    console.error("ERRO USERS:", error)
    return res.status(500).json({ signal: false, log: "Erro interno" })
  }
}) 

appServer.post('/api/scripts', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "scripts"))
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (error) {
    console.error("ERRO SCRIPTS:", error)
    res.status(500).json({ log: "Erro scripts" })
  }
})

appServer.post('/api/layouts', async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "structures"))
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (error) {
    console.error("ERRO LAYOUTS:", error)
    res.status(500).json({ log: "Erro layouts" })
  }
})

const port = process.env.PORT || 8080

appServer.listen(port, () => {
  console.log("Servidor rodando na porta", port)
})
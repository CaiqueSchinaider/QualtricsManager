import express from 'express'
import cors from 'cors'
import { GoogleGenAI } from '@google/genai'
import { db } from './firebase.js'
import path from 'path'
import { fileURLToPath } from 'url'
import PromptLinkLive from '../Prompts/LinkLivePrompt.js'
import PromptTestesQa from '../Prompts/TestesQaPrompt.js'
import PromptTranslate from '../Prompts/TranslatePrompt.js'

const appServer = express()
appServer.use(cors({
  origin: [
    "https://qualtrics-manager.vercel.app",
    "http://localhost:5173"
  ]
}))
appServer.use(express.json())

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GOOGLEGEN })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let usersSession = []

function CreateToken() {
  let min = 100000
  let max = 999999
  const createNumber = () => Math.floor(Math.random() * (max - min + 1)) + min
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
    const snapshot = await db.collection("users").get()
    const users = snapshot.docs.map(doc => doc.data())
    const validUser = users.find(u => u.username == username && u.password == password)
    if (!validUser) {
      console.log('Usuarios:', users)
      return res.status(200).json({ signal: false, log: "Acesso negado" })
    }
    const token = CreateToken()
    usersSession.push({ username, token })
    return res.status(200).json({ signal: true, token, log: "Acesso permitido" })
  } catch (error) {
    console.error("ERRO USERS:", error)
    return res.status(500).json({ signal: false, log: "Erro interno" })
  }
})

appServer.post('/api/scripts', async (req, res) => {
  const { username, token } = req.body

  const session = usersSession.find(u => u.username == username && u.token == token)

  if (!session) {
    return res.status(200).json([
      {
        name: "Exemplo de Script",
        script: "let count = 0;\nfor (let i = 0; i < 10; i++) {\n  count += i;\n}\nconsole.log(count);",
        scriptImg: "code.png",
        imgStyle: {
          filter: "invert(48%)",
          width: "40px"
        }
      }
    ])
  }

  try {
    const snapshot = await db.collection("scripts").get()
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (error) {
    console.error("ERRO SCRIPTS:", error)
    res.status(500).json({ log: "Erro scripts" })
  }
})

appServer.post('/api/layouts', async (req, res) => {
  try {
    const snapshot = await db.collection("structures").get()
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    res.status(200).json(data)
  } catch (error) {
    console.error("ERRO LAYOUTS:", error)
    res.status(500).json({ log: "Erro layouts" })
  }
})

appServer.post('/api/promptlive', async (req, res) => {
  const { tipo } = req.body

  try {

    if (tipo === 'live') {
      const { username, token, obs, link, params, idioma } = req.body

      const session = usersSession.find(u => u.username == username && u.token == token)

      const prompt = await PromptLinkLive({
        obs,
        link,
        params,
        idioma,
        mode: session ? 'full' : 'generic'
      })

      if (!prompt || prompt.trim() === '') {
        return res.status(400).json({ signal: false, log: "Prompt vazio (live)" })
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      })

      return res.status(200).json({
        text: response.text || '',
        signal: true
      })
    }

    if (tipo === 'translate') {
      const { text, idioma, tom } = req.body

      const prompt = await PromptTranslate({
        text,
        idioma,
        tom,
        mode: 'full' 
      })

      if (!prompt || prompt.trim() === '') {
        return res.status(400).json({ signal: false, log: "Prompt vazio (translate)" })
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      })

      return res.status(200).json({
        text: response.text || '',
        signal: true
      })
    }

    if (tipo === 'qa') {
      const { username, token, text, idioma } = req.body

      const session = usersSession.find(u => u.username == username && u.token == token)

      const prompt = await PromptTestesQa({
        idioma,
        text,
        mode: session ? 'full' : 'generic'
      })

      if (!prompt || prompt.trim() === '') {
        return res.status(400).json({ signal: false, log: "Prompt vazio (qa)" })
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      })

      return res.status(200).json({
        text: response.text || '',
        signal: true
      })
    }

    return res.status(200).json({
      text: '',
      signal: false
    })

  } catch (error) {
    console.error("ERRO PROMPT:", error)

    return res.status(500).json({
      text: '',
      signal: false
    })
  }
})

appServer.post('/api/parameters', async (req, res) => {
  const { username, token } = req.body

  const session = usersSession.find(u => u.username == username && u.token == token)

  try {
    const snapshot = await db.collection("parameters").get()
    const data = snapshot.docs.map(doc => doc.data())

    const group = session ? 'default' : 'generic'

    const paramsDoc = data.find(d => d.group === group)

    if (!paramsDoc) {
      return res.status(200).json([])
    }

    return res.status(200).json(paramsDoc.param || [])

  } catch (error) {
    console.error("ERRO PARAMETERS:", error)
    return res.status(200).json([])
  }
})

appServer.post('/api/download', async (req, res) => {
  const { username, token } = req.body

  const session = usersSession.find(u => u.username == username && u.token == token)
  if (!session) {
    return res.status(403).json({ log: "Acesso negado" })
  }

  const filePath = path.join(__dirname, '..', 'Assets', 'BASE_SURVEY_NEW.qsf')

  res.setHeader('Content-Disposition', 'attachment; filename="BASE_SURVEY_NEW.qsf"')
  res.setHeader('Content-Type', 'application/octet-stream')

  res.download(filePath)
})

appServer.post('/api/prompts', async (req, res) => {
  const { context, type } = req.body

  if (!context || !type) {
    return res.status(400).json({ log: "Dados incompletos" })
  }

  try {
    const snapshot = await db.collection("prompts")
      .where("context", "==", context)
      .where("type", "==", type)
      .limit(1)
      .get()

    if (snapshot.empty) {
      return res.status(200).json({ prompt: '' })
    }

    const doc = snapshot.docs[0].data()

    return res.status(200).json({ prompt: doc.prompt })

  } catch (error) {
    return res.status(500).json({ prompt: '' })
  }
})

const port = process.env.PORT || 8080
appServer.listen(port, () => {
  console.log("Servidor rodando na porta", port)
})
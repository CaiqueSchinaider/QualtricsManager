import express from 'express'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai';
import path from 'path'
import { fileURLToPath } from 'url'
import cors from "cors";
import PromptLinkLive from '../Prompts/LinkLivePrompt.ts';
import PromptTestesQa from '../Prompts/TestesQAPrompt.ts';
import PromptTranslate from '../Prompts/TranslatePrompt.ts';
import admin from 'firebase-admin'


dotenv.config()
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GOOGLEGEN });

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})
const db = admin.firestore();

try {
  const collections = await db.listCollections()
  console.log('🔥 CONECTADO AO FIREBASE:')
  
  collections.forEach(col => {
    console.log('📁', col.id)
  })

} catch (error) {
  console.error('💥 ERRO FIREBASE:', error)
}

const appServer = express()
appServer.use(cors({
  origin: ["https://qualtrics-manager.vercel.app","http://localhost:5174"]
}));
appServer.use(express.json())

const scriptEx = [
  {
  name: 'Script de Exemplo', 
  scriptImg: "percentage.webp",
  imgStyle: {filter: 'invert(45%)'},
  info: 'Exemplo de campo de informação',
  script: `let contador = 0;
    setInterval(() => {
      contador++;
      console.log(contador);
    }, 1000);`}
  ]

var usersSession = []



function CreateToken() {
  let min = 100000
  let max = 999999

  const createNumber = () => Math.floor(Math.random() * (max - min + 1 )) + min 
  let token;
  let tokenExist = true

  while(tokenExist) {
  token = createNumber()
  let tokenValidation = usersSession.find((tokens) => tokens.token === token) 
  tokenExist = tokenValidation
  }
  return token
}
 


// Tratamento de usuarios
appServer.post('/api/users', async (req, res) => {
  const {username, password} = req.body
  //////////////////////////////////////
  try { 
   
    let docsList = await db.collection('users').get()
    if (docsList.empty) {   
      res.status(200).json({signal: false, log: "Acesso negado"})
    }
    let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
    let validUser = docsFor.find((user) => user.username === username && user.password == password)
    if (validUser) {
      let formatToken = CreateToken()
      usersSession.push({token: formatToken, username: validUser.username})
      res.status(200).json({token: formatToken, signal: true, log: "Acesso permitido"})
    } else {
      res.status(200).json({signal: false, log: "Acesso negado"})
    }
  } catch {
    return res.status(500).json({signal: false, log: 'Erro ao acessar a lista de Usuarios'})
  }
  
          
        
})


// Acesso aos Scripts
appServer.post('/api/scripts', async (req, res) => {
    const {username, token} = req.body
    //////////////////////////////////////
    let authUser = usersSession.find((user) => user.username === username && user.token === token)
    if (authUser){
      try {
        
        let docsList = await db.collection('scripts').get()
        if (docsList.empty) {
          return res.status(200).json({log: 'Coleção de Layouts vazia'})
        }
        let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
        res.status(200).json(docsFor)
      } catch {
        return res.status(500).json({log: 'Erro ao acessar a coleção Scripts'})
      }
    } else {
      res.status(200).json(scriptEx)
    }
})


// Acesso aos Layouts
appServer.post('/api/layouts', async (req, res) => {
  try {
    let docsList = await db.collection('structures').get()
    if (docsList.empty) {
      return res.status(200).json({log: 'Coleção de Layouts vazia'})
    }
    let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
    res.status(200).json(docsFor)
  } catch {
    return res.status(500).json({log: 'Erro ao acessar a coleção Layouts'})
  }
})


appServer.post('/api/promptlive', async (req, res) => {
      const { obs, link, params, idioma, tipo, tom, text  } = req.body
    /////////////////////////////////////////////////////////////////
    let prompt

    switch (tipo) {
      case 'live' : {
        prompt = PromptLinkLive(obs, link, params, idioma)
      }
      break;

      case 'qa' : {
        prompt = PromptTestesQa(text, idioma)
      }
      break;

      case 'translate' : {
        prompt = PromptTranslate(text, tom, idioma)
      }
    }
    

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      res.status(200).json({text: response.candidates[0].content.parts[0].text, signal: true})
    } catch (error) {
      res.status(500).json({
        text: error,
        signal: false
      })
      
    }
  
})


appServer.post('/api/user/auth', async (req, res) => {
    const {username, token} = req.body
    //////////////////////////////////////
  let validUser = usersSession.find((user) => user.username === username && user.token === token)
  if (validUser) {
    res.status(200).json({authorized: true})
  } else {
    res.status(401).json({authorized: false})
  }
})


appServer.post('/api/download', async (req, res) => {
    const {username, token, id} = req.body
    //////////////////////////////////////
  let validUser = usersSession.find((user) => user.username === username && user.token === token)
  if (validUser) {
    let filePath
    let name
    switch(id) {
      case 1 : {
      filePath = path.join(process.cwd(), 'Private', 'BASE_SURVEY_NEW.qsf')
      name = 'BASE_SURVEY_NEW.qsf'
    }
    break
  }
  if (filePath) {

    res.download(filePath, name)     
  } else {
    res.status(404)
  }
  } else {
    res.status(401)
  }
})



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

appServer.use(express.static(path.join(__dirname, 'dist')))

appServer.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})


const port = process.env.PORT || 8080

appServer.listen(port, () => console.log('Server iniciado!'))
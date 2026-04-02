import express from 'express'
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()



const ai = new GoogleGenAI({ apiKey: process.env.API_KEY_GOOGLEGEN });
const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: "offer---snack.firebaseapp.com",
  projectId: "offer---snack",
  storageBucket: "offer---snack.firebasestorage.app",
  messagingSenderId: "98748482781",
  appId: "1:98748482781:web:41f116aef248017cecc734",
  measurementId: "G-HC3JRGNFSH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const appServer = express()

import cors from "cors";

app.use(cors({
  origin: "https://qualtrics-manager.vercel.app"
}));
appServer.use(express.json())

appServer.get('/api/scripts', async (req, res) => {
    let docsCompact = collection(db, 'scripts')
    let docsList = await getDocs(docsCompact)
    let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
    res.header('Content-Type','text/json')
    res.status(200).json(docsFor)
    

})
appServer.get('/api/layouts', async (req, res) => {''
    let docsCompact = collection(db, 'structures')
    let docsList = await getDocs(docsCompact)
    let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
    res.status(200).json(docsFor)
    

})

appServer.post('/api/promptlive', async (req, res) => {
      const {prompt} = req.body
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      res.header('Content-Type', 'text/plain')
      res.status(200).send(response.candidates[0].content.parts[0].text)
    } catch (error) {
      res.header('Content-Type', 'application/json')
      res.status(400).json({
        error: true
      })
      console.log(error)
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
import express from 'express'
import dotenv from 'dotenv'
import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

dotenv.config()

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

appServer.get('/scripts', async (req, res) => {{
    let docsCompact = collection(db, 'scripts')
    let docsList = await getDocs(docsCompact)
    let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
    res.header('Content-Type','text/json')
    res.status(200).json(docsFor)
    

}})
appServer.get('/layouts', async (req, res) => {{
    let docsCompact = collection(db, 'structures')
    let docsList = await getDocs(docsCompact)
    let docsFor = docsList.docs.map((docDB) => ({id: docDB.id, ...docDB.data()}))
    res.header('Content-Type','text/json')
    res.status(200).json(docsFor)
    

}})

const port = process.env.PORT || 8080

appServer.listen(port, () => console.log('Server iniciado!'))
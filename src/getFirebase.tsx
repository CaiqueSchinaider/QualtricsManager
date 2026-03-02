import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDIXc3Xk5u_SY3yy8sBcsPWt9lM1yWIuSw",
  authDomain: "offer---snack.firebaseapp.com",
  projectId: "offer---snack",
  storageBucket: "offer---snack.firebasestorage.app",
  messagingSenderId: "98748482781",
  appId: "1:98748482781:web:41f116aef248017cecc734",
  measurementId: "G-HC3JRGNFSH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getDataFirebase<T = any>(collectionDocs: string): Promise<T[]> {
  const collectionRef = collection(db, collectionDocs);

  try {
    const querySnapshot = await getDocs(collectionRef);

    const usersData = querySnapshot.docs.map((doc) => 
      doc.data() as T
    );

    return usersData;
  } catch (error) {
    console.error(
      'Erro ao pegar dados do firebase. Dados:' + collectionDocs,
      error
    );
    return [];
  }
}

export default getDataFirebase;
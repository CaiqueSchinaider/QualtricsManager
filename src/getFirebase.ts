import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';



async function getDataFirebase(collection: string) {
  

 return fetch(`http://localhost:8080/${collection}`).then(res => res.json()).then(data => data )
}

export default getDataFirebase;
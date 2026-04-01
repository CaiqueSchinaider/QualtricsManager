async function getDataFirebase(collection: string) {
  

 return fetch(`https://qualtricsmanager.onrender.com/api/${collection}`).then(res => res.json()).then(data => data )
}

export default getDataFirebase;
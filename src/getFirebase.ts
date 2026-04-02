async function getDataFirebase(collection: string) {
  

 return fetch(`http://localhost:8080/api/${collection}`).then(res => res.json()).then(data => data )
}

export default getDataFirebase;
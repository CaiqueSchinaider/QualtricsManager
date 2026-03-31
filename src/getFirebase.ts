async function getDataFirebase(collection: string) {
  

 return fetch(`/api/${collection}`).then(res => res.json()).then(data => data )
}

export default getDataFirebase;
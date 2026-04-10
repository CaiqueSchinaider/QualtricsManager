async function getDataFirebase(collection: string, token?: number | undefined, username?: string | undefined) {
  
    let response = await fetch(`http://localhost:8080/api/${collection}`, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({token: token, username: username  })
      } )

    let data = await response.json()

    return data

}

export default getDataFirebase;
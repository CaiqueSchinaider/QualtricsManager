async function getDataFirebase(collection: string, token?: number | undefined, username?: string | undefined) {
  
    let response = await fetch(`https://qualtricsmanager.onrender.com/api/${collection}`, {
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
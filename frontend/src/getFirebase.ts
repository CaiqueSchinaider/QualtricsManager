async function getDataFirebase(collection: string, token?: number | undefined, username?: string | undefined) {
  const API_URL = import.meta.env.VITE_API_URL
    let response = await fetch(`${API_URL}/api/${collection}`, {
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
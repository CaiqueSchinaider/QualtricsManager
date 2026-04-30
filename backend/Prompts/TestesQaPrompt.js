export default async function PromptTestesQa({ idioma, text, mode = 'full' }) {


  const response = await fetch(`https://qualtricsmanager.onrender.com/api/prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      context: 'qa',
      type: mode
    })
  })

  const data = await response.json()

  let template = data.prompt || ''

  let prompt = template
    .replaceAll('${idioma}', idioma || '')
    .replaceAll('${text}', text || '')

  return prompt
}
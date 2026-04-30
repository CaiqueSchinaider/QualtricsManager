export default async function PromptLinkLive({ obs, link, params, idioma, mode = 'full' }) {

  const response = await fetch('https://qualtricsmanager.onrender.com/api/prompts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      context: 'link',
      type: mode
    })
  })

  const data = await response.json()

  let template = data.prompt || ''

  let prompt = template
    .replaceAll('${obs}', obs || '')
    .replaceAll('${link}', link || '')
    .replaceAll('${params}', params || '')
    .replaceAll('${idioma}', idioma || '')

  return prompt
}
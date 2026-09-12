export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/hackaton-transparencia-fornecedores/backend-integrado'

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.mensagem || 'Não foi possível concluir a solicitação.')
  return data
}

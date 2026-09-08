// src/pages/Dashboard/mockData.js

export const suppliersData = [
  { 
    id: 1, 
    name: 'Fazenda Rio Negro', 
    status: 'irregular', 
    risk: 'ambiental', 
    score: 45,
    document: '12.345.678/0001-90'
  },
  { 
    id: 2, 
    name: 'Sementes Progresso', 
    status: 'atencao', 
    risk: 'ambiental', 
    score: 62,
    document: '98.765.432/0001-11'
  },
  { 
    id: 3, 
    name: 'Fazenda Jatobá', 
    status: 'atencao', 
    risk: 'ambiental', 
    score: 58,
    document: '45.678.912/0001-34'
  },
  { 
    id: 4, 
    name: 'Agropecuária Nova', 
    status: 'regular', 
    risk: 'trabalhista', 
    score: 85,
    document: '67.891.234/0001-56'
  },
  { 
    id: 5, 
    name: 'Frigorífico Sul', 
    status: 'regular', 
    risk: 'sanitario', 
    score: 92,
    document: '89.123.456/0001-78'
  },
  { 
    id: 6, 
    name: 'Transportadora Rápido', 
    status: 'irregular', 
    risk: 'ambiental', 
    score: 35,
    document: '23.456.789/0001-90'
  },
  { 
    id: 7, 
    name: 'Fazenda Boa Vista', 
    status: 'regular', 
    risk: 'trabalhista', 
    score: 78,
    document: '34.567.891/0001-12'
  },
  { 
    id: 8, 
    name: 'Fazenda Santa Clara', 
    status: 'regular', 
    risk: 'ambiental', 
    score: 88,
    document: '56.789.123/0001-45'
  },
  { 
    id: 9, 
    name: 'Cooperativa Agro', 
    status: 'atencao', 
    risk: 'sanitario', 
    score: 55,
    document: '78.912.345/0001-67'
  },
  { 
    id: 10, 
    name: 'Fazenda Esperança', 
    status: 'regular', 
    risk: 'ambiental', 
    score: 82,
    document: '91.234.567/0001-89'
  },
]

// Função para filtrar por tipo de risco
export const filterByRisk = (data, riskType) => {
  if (riskType === 'todos') return data
  return data.filter(item => item.risk === riskType)
}

// Função para calcular estatísticas
export const getStats = (data) => {
  const total = data.length
  const regular = data.filter(item => item.status === 'regular').length
  const atencao = data.filter(item => item.status === 'atencao').length
  const irregular = data.filter(item => item.status === 'irregular').length
  
  return {
    total,
    regular,
    atencao,
    irregular,
    regularPercentage: total > 0 ? Math.round((regular / total) * 100) : 0,
    atencaoPercentage: total > 0 ? Math.round((atencao / total) * 100) : 0,
    irregularPercentage: total > 0 ? Math.round((irregular / total) * 100) : 0,
  }
}

// Função para dados de risco ambiental (usada no filtro "ambiental")
export const getEnvironmentalData = (data) => {
  const environmental = data.filter(item => item.risk === 'ambiental')
  const total = environmental.length
  const regularizado = environmental.filter(item => item.status === 'regular').length
  const cadastroPendente = environmental.filter(item => item.status === 'atencao').length
  const embargoAtivo = environmental.filter(item => item.status === 'irregular').length
  
  return {
    total,
    regularizado,
    cadastroPendente,
    embargoAtivo,
    regularizadoPercentage: total > 0 ? Math.round((regularizado / total) * 100) : 0,
    cadastroPendentePercentage: total > 0 ? Math.round((cadastroPendente / total) * 100) : 0,
    embargoAtivoPercentage: total > 0 ? Math.round((embargoAtivo / total) * 100) : 0,
    list: environmental
  }
}
import { useMemo, useState } from 'react'
import './Dashboard.css'

const suppliersData = [
  { id: 1, name: 'Fazenda Rio Negro', status: 'irregular', risk: 'ambiental', score: 45 },
  { id: 2, name: 'Sementes Progresso', status: 'atencao', risk: 'ambiental', score: 62 },
  { id: 3, name: 'Fazenda Jatobá', status: 'atencao', risk: 'ambiental', score: 58 },
  { id: 4, name: 'Agropecuária Nova', status: 'regular', risk: 'trabalhista', score: 85 },
  { id: 5, name: 'Frigorífico Sul', status: 'regular', risk: 'sanitario', score: 92 },
  { id: 6, name: 'Transportadora Rápido', status: 'irregular', risk: 'ambiental', score: 35 },
  { id: 7, name: 'Fazenda Boa Vista', status: 'regular', risk: 'trabalhista', score: 78 },
  { id: 8, name: 'Fazenda Santa Clara', status: 'regular', risk: 'ambiental', score: 88 },
  { id: 9, name: 'Cooperativa Agro', status: 'atencao', risk: 'sanitario', score: 55 },
  { id: 10, name: 'Fazenda Esperança', status: 'regular', risk: 'ambiental', score: 82 },
]

const filters = [
  { id: 'todos', label: 'Visão Geral' },
  { id: 'ambiental', label: 'Ambiental' },
  { id: 'trabalhista', label: 'Trabalhista' },
  { id: 'sanitario', label: 'Sanitário' },
]

function Dashboard({ onSelecionarFornecedor }) {
  const [filterType, setFilterType] = useState('todos')

  const filteredData = useMemo(() => filterType === 'todos'
    ? suppliersData
    : suppliersData.filter((supplier) => supplier.risk === filterType), [filterType])
  const regular = filteredData.filter((supplier) => supplier.status === 'regular').length
  const attention = filteredData.filter((supplier) => supplier.status === 'atencao').length
  const irregular = filteredData.filter((supplier) => supplier.status === 'irregular').length
  const regularPercentage = filteredData.length ? Math.round((regular / filteredData.length) * 100) : 0
  const currentFilter = filters.find((filter) => filter.id === filterType)

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div><p className="dashboard-kicker">Visão de conformidade</p><h1 id="page-title">Dashboard de Compliance</h1><p>Visão geral da regularidade e riscos de fornecedores cadastrados</p></div>
        <label className="dashboard-filter">Tipo de risco<select value={filterType} onChange={(event) => setFilterType(event.target.value)}>{filters.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}</select></label>
      </header>

      <div className="dashboard-stats">
        <div className="dashboard-stat"><strong>{filteredData.length}</strong><span>Total Fornecedores</span></div>
        <div className="dashboard-stat"><strong>{regularPercentage}%</strong><span>% Regulares</span></div>
        <div className="dashboard-stat dashboard-stat-risk"><strong>{filteredData.filter((supplier) => supplier.risk === 'ambiental').length}</strong><span>Risco Ambiental</span></div>
        <div className="dashboard-stat dashboard-stat-risk"><strong>{filteredData.filter((supplier) => supplier.risk === 'trabalhista').length}</strong><span>Risco Trabalhista</span></div>
      </div>

      <section className="dashboard-panel" aria-labelledby="gravity-title">
        <div className="panel-heading"><div><h2 id="gravity-title">Proporção por Gravidade</h2><p>Distribuição dos fornecedores na {currentFilter.label.toLowerCase()}</p></div></div>
        <div className="gravity-layout">
          <div className="dashboard-donut" style={{ '--regular': `${regularPercentage}%`, '--attention': `${filteredData.length ? Math.round((attention / filteredData.length) * 100) : 0}%` }}><div><strong>{filteredData.length}</strong><span>casos</span></div></div>
          <div className="dashboard-legend"><div><i className="legend-green" />Regularizado <strong>{regular}</strong></div><div><i className="legend-yellow" />Cadastro Pendente <strong>{attention}</strong></div><div><i className="legend-red" />Embargo Ativo <strong>{irregular}</strong></div></div>
        </div>
      </section>

      <section className="dashboard-panel risk-list" aria-labelledby="risk-title">
        <div className="panel-heading"><div><h2 id="risk-title">Fornecedores com Risco</h2><p>Fornecedores que precisam de acompanhamento</p></div><span>{filteredData.length} registros</span></div>
        <ul>{filteredData.map((supplier) => <li key={supplier.id}><button type="button" className="dashboard-supplier-button" onClick={() => onSelecionarFornecedor(supplier)}><div><strong>{supplier.name}</strong><span className={`risk-tag risk-${supplier.risk}`}>{supplier.risk}</span></div><span className={`compliance-status status-${supplier.status}`}>{supplier.status === 'regular' ? 'Regular' : supplier.status === 'atencao' ? 'Atenção' : 'Irregular'}</span></button></li>)}</ul>
      </section>
    </div>
  )
}

export default Dashboard

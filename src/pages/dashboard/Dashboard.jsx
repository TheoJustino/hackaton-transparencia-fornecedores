import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../../config/api'
import './Dashboard.css'

const filters = [
  { id: 'todos', label: 'Visão Geral' },
  { id: 'REGULAR', label: 'Regulares' },
  { id: 'ATENCAO', label: 'Em Atenção' },
  { id: 'IRREGULAR', label: 'Irregulares' },
]

function Dashboard({ onSelecionarFornecedor }) {
  const [filterType, setFilterType] = useState('todos')
  const [dadosDashboard, setDadosDashboard] = useState({
    resumo: { total: 0, ativos: 0, inativos: 0, regulares: 0, atencao: 0, irregulares: 0 },
    fornecedores: [],
  })
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let cancelado = false
    apiRequest('dashboard.php')
      .then((resposta) => {
        if (!cancelado && resposta.sucesso) {
          setDadosDashboard({
            resumo: resposta.resumo || {},
            fornecedores: resposta.fornecedores || [],
          })
        }
      })
      .catch((erro) => console.error('Erro ao carregar dashboard:', erro))
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [])

  const { resumo, fornecedores } = dadosDashboard

  const fornecedoresFiltrados = useMemo(() => {
    if (filterType === 'todos') return fornecedores
    return fornecedores.filter((f) => f.status_geral === filterType)
  }, [filterType, fornecedores])

  const total = resumo.total || fornecedores.length || 0
  const regular = resumo.regulares || 0
  const atencao = resumo.atencao || 0
  const irregular = resumo.irregulares || 0
  const regularPercentage = total > 0 ? Math.round((regular / total) * 100) : 0
  const attentionPercentage = total > 0 ? Math.round((atencao / total) * 100) : 0
  const currentFilter = filters.find((filter) => filter.id === filterType) || filters[0]

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-kicker">Visão de conformidade</p>
          <h1 id="page-title">Dashboard de Compliance</h1>
          <p>Visão geral da regularidade e riscos de fornecedores cadastrados</p>
        </div>
        <label className="dashboard-filter">
          Filtro de status
          <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            {filters.map((filter) => <option key={filter.id} value={filter.id}>{filter.label}</option>)}
          </select>
        </label>
      </header>

      <div className="dashboard-stats">
        <div className="dashboard-stat"><strong>{total}</strong><span>Total Cadastrados</span></div>
        <div className="dashboard-stat"><strong>{regularPercentage}%</strong><span>% Regulares</span></div>
        <div className="dashboard-stat dashboard-stat-risk"><strong>{atencao}</strong><span>Em Atenção</span></div>
        <div className="dashboard-stat dashboard-stat-risk"><strong>{irregular}</strong><span>Irregulares</span></div>
      </div>

      <section className="dashboard-panel" aria-labelledby="gravity-title">
        <div className="panel-heading">
          <div>
            <h2 id="gravity-title">Proporção por Gravidade</h2>
            <p>Distribuição dos fornecedores ({currentFilter.label.toLowerCase()})</p>
          </div>
        </div>
        <div className="gravity-layout">
          <div className="dashboard-donut" style={{ '--regular': `${regularPercentage}%`, '--attention': `${attentionPercentage}%` }}>
            <div><strong>{total}</strong><span>registros</span></div>
          </div>
          <div className="dashboard-legend">
            <div><i className="legend-green" />Regularizado <strong>{regular}</strong></div>
            <div><i className="legend-yellow" />Atenção / Pendente <strong>{atencao}</strong></div>
            <div><i className="legend-red" />Irregular / Restrição <strong>{irregular}</strong></div>
          </div>
        </div>
      </section>

      <section className="dashboard-panel risk-list" aria-labelledby="risk-title">
        <div className="panel-heading">
          <div>
            <h2 id="risk-title">Fornecedores para Acompanhamento</h2>
            <p>Clique em um fornecedor para executar ou visualizar a verificação</p>
          </div>
          <span>{fornecedoresFiltrados.length} registros</span>
        </div>

        {carregando ? (
          <p style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Carregando dados...</p>
        ) : fornecedoresFiltrados.length === 0 ? (
          <p style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Nenhum fornecedor neste filtro.</p>
        ) : (
          <ul>
            {fornecedoresFiltrados.map((supplier) => {
              const statusClass = (supplier.status_geral || 'NAO_VERIFICADO').toLowerCase().replace('_', '-')
              const statusFormatado = supplier.status_geral === 'REGULAR'
                ? 'Regular'
                : supplier.status_geral === 'ATENCAO'
                  ? 'Atenção'
                  : supplier.status_geral === 'IRREGULAR'
                    ? 'Irregular'
                    : 'Não Verificado'

              return (
                <li key={supplier.id}>
                  <button type="button" className="dashboard-supplier-button" onClick={() => onSelecionarFornecedor(supplier)}>
                    <div>
                      <strong>{supplier.nome}</strong>
                      <span className="risk-tag">{supplier.cidade} - {supplier.uf}</span>
                    </div>
                    <span className={`compliance-status status-${statusClass}`}>{statusFormatado}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Dashboard

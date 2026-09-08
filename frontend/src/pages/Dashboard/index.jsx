import { useState } from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import Logo from '../../assets/logoFolhaVerde.svg'
import DropdownFilter from './components/DropdownFilter'
import DonutChart from './components/DonutChart'  // ✅ IMPORT CORRETO
import { 
  suppliersData,   // ✅ DESCOMENTADO
  filterByRisk,    // ✅ DESCOMENTADO
  getStats,        // ✅ DESCOMENTADO
  // getEnvironmentalData  // ← Pode remover se não for usado
} from './mockData'

function Dashboard() {
  const [filterType, setFilterType] = useState('todos')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  
  // Dados filtrados
  const filteredData = filterByRisk(suppliersData, filterType)
  const stats = getStats(filteredData)

  // Determina qual título mostrar
  const getTitle = () => {
    switch(filterType) {
      case 'todos': return 'Dashboard de Compliance'
      case 'ambiental': return 'Dashboard - Risco Ambiental'
      case 'trabalhista': return 'Dashboard - Risco Trabalhista'
      case 'sanitario': return 'Dashboard - Risco Sanitário'
      default: return 'Dashboard'
    }
  }

  const getSubtitle = () => {
    switch(filterType) {
      case 'todos': return 'Visão geral da regularidade e riscos de fornecedores cadastrados'
      case 'ambiental': return 'Visualizando dados filtrados por riscos ambientais e pendências'
      case 'trabalhista': return 'Visualizando dados filtrados por riscos trabalhistas e pendências'
      case 'sanitario': return 'Visualizando dados filtrados por riscos sanitários e pendências'
      default: return ''
    }
  }

  // Função getCardData
  const getCardData = () => {
    const totalFornecedores = suppliersData.length
    const regulares = suppliersData.filter(item => item.status === 'regular').length
    const regularesPercent = Math.round((regulares / totalFornecedores) * 100)
    
    const riscoAmbiental = suppliersData.filter(item => item.risk === 'ambiental').length
    const riscoTrabalhista = suppliersData.filter(item => item.risk === 'trabalhista').length

    if (filterType === 'todos') {
      return {
        card1: { number: totalFornecedores, label: 'Total Fornecedores' },
        card2: { number: `${regularesPercent}%`, label: '% Regulares' },
        card3: { number: riscoAmbiental, label: 'Risco Ambiental' },
        card4: { number: riscoTrabalhista, label: 'Risco Trabalhista' },
      }
    }

    const totalFiltrado = filteredData.length
    const riskLabel = filterType === 'ambiental' ? 'Ambiental' : 
                      filterType === 'trabalhista' ? 'Trabalhista' : 'Sanitário'
    
    return {
      card1: { number: totalFiltrado, label: `Total sob Risco ${riskLabel}` },
      card2: { number: stats.regular, label: 'Regularizados' },
      card3: { number: stats.irregular, label: 'Em Embargo Ativo' },
      card4: { number: stats.atencao, label: 'Atenção / Cadastro' },
    }
  }

  const cardData = getCardData()

  // ✅ REMOVIDA a função PieChart antiga

  // Menu items (sem ícones)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'fornecedores', label: 'Fornecedores' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'relatorios', label: 'Relatórios' },
    { id: 'configuracoes', label: 'Configurações' },
  ]

  return (
    <div className="dashboard-layout">
      {/* ===== SIDEBAR (MENU LATERAL) ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={Logo} alt="Logo" className="logo" />
          <h1>GestãoFornecedores</h1>
          <span className="company-subtitle">FRIGORÍFICO PORTAL</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {menuItems.map(item => (
              <li key={item.id}>
                <Link 
                  to={item.id === 'dashboard' ? '/dashboard' : '#'}
                  className={activeMenu === item.id ? 'active' : ''}
                  onClick={() => setActiveMenu(item.id)}
                >
                  <span className="menu-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="logout-btn">
            ← Sair
          </Link>
        </div>
      </aside>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="main-content">
        {/* Cabeçalho */}
        <header className="content-header">
          <div className="header-left">
            <h2>{getTitle()}</h2>
            <p>{getSubtitle()}</p>
          </div>
        </header>

        {/* Dropdown */}
        <div className="filter-section">
          <DropdownFilter 
            currentFilter={filterType}
            onFilterChange={setFilterType}
          />
        </div>

        {/* Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{cardData.card1.number}</span>
            <span className="stat-label">{cardData.card1.label}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{cardData.card2.number}</span>
            <span className="stat-label">{cardData.card2.label}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{cardData.card3.number}</span>
            <span className="stat-label">{cardData.card3.label}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{cardData.card4.number}</span>
            <span className="stat-label">{cardData.card4.label}</span>
          </div>
        </div>

        {/* ===== PROPORÇÃO POR GRAVIDADE COM GRÁFICO DE SETORES ===== */}
        <div className="gravity-section">
          <h3>Proporção por Gravidade</h3>
          
          <div className="gravity-chart">
            {/* ✅ GRÁFICO DE SETORES - SUBSTITUÍDO PELO DonutChart */}
            <div className="pie-chart-container">
              <DonutChart 
                title="Proporção por Gravidade"
                data={[
                  { label: 'Regularizado', value: stats.regular, color: '#22C55E' },
                  { label: 'Cadastro Pendente', value: stats.atencao, color: '#F59E0B' },
                  { label: 'Embargo Ativo', value: stats.irregular, color: '#EF4444' },
                ]}
                centerLabel={filterType === 'todos' ? 'empresas' : 'casos'}
              />
            </div>

            {/* ✅ LEGENDA - REMOVIDA (já vem no DonutChart) */}
          </div>
        </div>

        {/* Lista de Fornecedores */}
        <div className="supplier-list">
          <h3>Fornecedores com Risco</h3>
          {filteredData.length > 0 ? (
            <ul>
              {filteredData.map(supplier => (
                <li key={supplier.id}>
                  <div className="supplier-info">
                    <span className="supplier-name">{supplier.name}</span>
                    <span className={`risk-badge ${supplier.risk}`}>
                      {supplier.risk.charAt(0).toUpperCase() + supplier.risk.slice(1)}
                    </span>
                  </div>
                  <span className={`status-badge ${supplier.status}`}>
                    {supplier.status === 'regular' ? 'Regular' : 
                     supplier.status === 'atencao' ? 'Atenção' : 'Irregular'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Nenhum fornecedor encontrado para este filtro.</p>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
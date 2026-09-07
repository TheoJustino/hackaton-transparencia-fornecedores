import { useMemo, useState } from 'react'
import FornecedorTable from './FornecedorTable'
import './App.css'

const imgLeaf = 'https://www.figma.com/api/mcp/asset/16f9db94-d8cb-4299-846e-c38b20509dd7.svg'
const imgLayoutDashboard = 'https://www.figma.com/api/mcp/asset/4dfc7aaf-0e10-4333-82b7-be953d4dbd33.svg'
const imgUsers2 = 'https://www.figma.com/api/mcp/asset/7df5b0c7-ae40-4525-89da-c43f0f366eae.svg'
const imgShieldAlert = 'https://www.figma.com/api/mcp/asset/5d409674-9018-4e89-870d-da8392988c7d.svg'
const imgBarChart = 'https://www.figma.com/api/mcp/asset/025ec94f-ff7f-4156-8995-64bad026fc9e.svg'
const imgSettings = 'https://www.figma.com/api/mcp/asset/2736992a-292f-4556-b390-8891085fc36a.svg'
const imgPlus = 'https://www.figma.com/api/mcp/asset/df7827d0-5d3c-472b-91ab-e16f8daca91f.svg'
const imgSearch = 'https://www.figma.com/api/mcp/asset/9f93776a-547d-476f-a617-5050cf83c4bd.svg'

const fornecedoresMock = [
  { id: 1, nome: 'Agropecuária Vale Verde Ltda.', cnpj: '12.345.678/0001-90', car: 'MT-5103403-7A1F.4C2B.8D9E.6F20', tipo: 'Produtor rural', status: 'Ativo', municipio: 'Cuiabá' },
  { id: 2, nome: 'Fazenda Horizonte Novo', cnpj: '23.456.789/0001-01', car: 'MT-5107602-9B3E.7A10.5C4D.2F86', tipo: 'Produtor rural', status: 'Ativo', municipio: 'Sorriso' },
  { id: 3, nome: 'Transportes Rota do Cerrado S.A.', cnpj: '34.567.890/0001-12', car: 'Não informado', tipo: 'Transportadora', status: 'Ativo', municipio: 'Rondonópolis' },
  { id: 4, nome: 'Cooperativa Campo Forte', cnpj: '45.678.901/0001-23', car: 'MT-5108408-1D2C.3B4A.5E6F.7G80', tipo: 'Cooperativa', status: 'Inativo', municipio: 'Campo Verde' },
  { id: 5, nome: 'Sementes Nova Safra Ltda.', cnpj: '56.789.012/0001-34', car: 'MT-5103304-6F5E.4D3C.2B1A.9G87', tipo: 'Fornecedor de insumos', status: 'Ativo', municipio: 'Lucas do Rio Verde' },
]

function App() {
  const [termoBusca, setTermoBusca] = useState('')

  const fornecedoresFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase()
    if (!termo) return fornecedoresMock

    return fornecedoresMock.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(termo) || fornecedor.cnpj.includes(termo),
    )
  }, [termoBusca])

  const handleVisualizar = (fornecedor) => {
    const fornecedorSelecionado = fornecedor

    console.log('Fornecedor selecionado para visualização:', {
      id: fornecedorSelecionado.id,
      fornecedor: fornecedorSelecionado,
    })
  }
  const handleEditar = (fornecedor) => console.log('Editar fornecedor:', fornecedor)
  const handleInativar = (fornecedor) => console.log('Inativar fornecedor:', fornecedor)

  const handleExportar = () => {
    const colunas = ['Nome/Razão Social', 'CNPJ', 'CAR', 'Tipo', 'Status', 'Município']
    const escaparCampo = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`
    const linhas = fornecedoresMock.map((fornecedor) => [
      fornecedor.nome,
      fornecedor.cnpj,
      fornecedor.car,
      fornecedor.tipo,
      fornecedor.status,
      fornecedor.municipio,
    ].map(escaparCampo).join(','))
    const csv = `\uFEFF${colunas.map(escaparCampo).join(',')}\n${linhas.join('\n')}`
    const arquivo = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(arquivo)
    const link = document.createElement('a')

    link.href = url
    link.download = 'fornecedores.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="page-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark"><img src={imgLeaf} alt="" /></span>
          <div><p className="brand-name">GestãoFornecedores</p><p className="brand-subtitle">FRIGORÍFICO PORTAL</p></div>
        </div>
        <nav className="nav-list" aria-label="Navegação principal">
          <a className="nav-item" href="#dashboard"><img src={imgLayoutDashboard} alt="" />Dashboard</a>
          <a className="nav-item nav-item-active" href="#fornecedores"><img src={imgUsers2} alt="" />Fornecedores</a>
          <a className="nav-item" href="#compliance"><img src={imgShieldAlert} alt="" />Compliance</a>
          <a className="nav-item" href="#relatorios"><img src={imgBarChart} alt="" />Relatórios</a>
          <a className="nav-item" href="#configuracoes"><img src={imgSettings} alt="" />Configurações</a>
        </nav>
      </aside>

      <section className="content-area" aria-labelledby="page-title">
        <div className="title-row">
          <div><h1 id="page-title">Fornecedores</h1><p className="page-description">{fornecedoresMock.length} fornecedores cadastrados</p></div>
          <button type="button" className="primary-button" onClick={() => console.log('Novo fornecedor')}><img src={imgPlus} alt="" />Novo Fornecedor</button>
        </div>

        <div className="list-toolbar">
          <label className="search-field"><img src={imgSearch} alt="" /><span className="sr-only">Buscar por nome ou CNPJ...</span><input type="search" value={termoBusca} onChange={(event) => setTermoBusca(event.target.value)} placeholder="Buscar por nome ou CNPJ..." /></label>
          <button type="button" className="secondary-button" onClick={handleExportar}>Exportar CSV</button>
        </div>

        <div className="table-card">
          <div className="table-card-header"><div><h2 className="sr-only">Fornecedores cadastrados</h2><p>{fornecedoresFiltrados.length} {fornecedoresFiltrados.length === 1 ? 'registro encontrado' : 'registros encontrados'}</p></div></div>
          {fornecedoresFiltrados.length > 0 ? <FornecedorTable fornecedores={fornecedoresFiltrados} onVisualizar={handleVisualizar} onEditar={handleEditar} onInativar={handleInativar} /> : <div className="empty-state"><strong>Nenhum fornecedor encontrado</strong><p>Revise o nome ou CNPJ informado na busca.</p></div>}
        </div>
      </section>

    </main>
  )
}

export default App 
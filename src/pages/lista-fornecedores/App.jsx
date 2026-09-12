import { useCallback, useEffect, useMemo, useState } from 'react'
import FornecedorTable from './FornecedorTable'
import NovoFornecedor from '../novo-fornecedor/NovoFornecedor'
import SucessoCadastro from '../sucesso-cadastro/SucessoCadastro'
import DetalhesFornecedor from '../detalhes-fornecedor/DetalhesFornecedor'
import ModalEditar from '../modal-editar/ModalEditar'
import ConfirmacaoInativacao from '../confirmacao-inativacao/ConfirmacaoInativacao'
import Dashboard from '../dashboard/Dashboard'
import VerificacaoRiscos from '../verificacao-riscos/VerificacaoRiscos'
import Login from '../login/Login'
import Compliance from '../compliance/Compliance'
import RelatorioPdf from '../relatorio-pdf/RelatorioPdf'
import { apiRequest } from '../../config/api'
import './App.css'

const imgLeaf = 'https://www.figma.com/api/mcp/asset/16f9db94-d8cb-4299-846e-c38b20509dd7.svg'
const imgLayoutDashboard = 'https://www.figma.com/api/mcp/asset/4dfc7aaf-0e10-4333-82b7-be953d4dbd33.svg'
const imgUsers2 = 'https://www.figma.com/api/mcp/asset/7df5b0c7-ae40-4525-89da-c43f0f366eae.svg'
const imgShieldAlert = 'https://www.figma.com/api/mcp/asset/5d409674-9018-4e89-870d-da8392988c7d.svg'
const imgBarChart = 'https://www.figma.com/api/mcp/asset/025ec94f-ff7f-4156-8995-64bad026fc9e.svg'
const imgSettings = 'https://www.figma.com/api/mcp/asset/2736992a-292f-4556-b390-8891085fc36a.svg'
const imgPlus = 'https://www.figma.com/api/mcp/asset/df7827d0-5d3c-472b-91ab-e16f8daca91f.svg'
const imgSearch = 'https://www.figma.com/api/mcp/asset/9f93776a-547d-476f-a617-5050cf83c4bd.svg'

function normalizarFornecedor(f) {
  return {
    id: Number(f.id),
    nome: f.nome || '',
    cnpj: f.cnpj || '',
    tipo: f.tipo === 'TRANSPORTADOR' ? 'Transportadora' : 'Produtor rural',
    produto_servico: f.produto_servico || '',
    car: f.car || 'Não informado',
    municipio: f.cidade || '',
    cidade: f.cidade || '',
    estado: f.uf || '',
    uf: f.uf || '',
    status: Number(f.ativo) === 1 ? 'Ativo' : 'Inativo',
    status_geral: f.status_geral || 'NAO_VERIFICADO',
    ativo: Number(f.ativo) === 1,
    criado_em: f.criado_em,
    atualizado_em: f.atualizado_em,
  }
}

function SistemaFornecedores({ usuario, onLogout }) {
  const [termoBusca, setTermoBusca] = useState('')
  const [fornecedores, setFornecedores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [telaAtual, setTelaAtual] = useState('lista')
  const [fornecedorCadastrado, setFornecedorCadastrado] = useState(null)
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null)
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [fornecedorParaInativar, setFornecedorParaInativar] = useState(null)

  const carregarFornecedores = useCallback(async () => {
    try {
      const res = await apiRequest('fornecedores/listar.php?incluir_inativos=1')
      if (res.sucesso && Array.isArray(res.dados)) {
        setFornecedores(res.dados.map(normalizarFornecedor))
      }
    } catch (erro) {
      console.error('Erro ao carregar fornecedores:', erro)
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregarFornecedores()
  }, [carregarFornecedores])

  const fornecedoresFiltrados = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase()
    const fornecedoresAtivos = fornecedores.filter((fornecedor) => fornecedor.status === 'Ativo')
    if (!termo) return fornecedoresAtivos

    return fornecedoresAtivos.filter((fornecedor) =>
      fornecedor.nome.toLowerCase().includes(termo) || fornecedor.cnpj.includes(termo),
    )
  }, [fornecedores, termoBusca])

  const handleVisualizar = (fornecedor) => {
    setFornecedorSelecionado(fornecedor)
    setTelaAtual('detalhes')
  }
  const handleEditar = (fornecedor) => {
    setFornecedorSelecionado(fornecedor)
    setModalEditarAberto(true)
  }
  const handleInativar = (fornecedor) => {
    if (fornecedor.status === 'Inativo') return

    setFornecedorParaInativar(fornecedor)
  }

  const handleConfirmarInativacao = async () => {
    if (!fornecedorParaInativar) return

    try {
      await apiRequest('fornecedores/inativar.php', {
        method: 'POST',
        body: JSON.stringify({ id: fornecedorParaInativar.id }),
      })
      await carregarFornecedores()
      if (fornecedorSelecionado?.id === fornecedorParaInativar.id) {
        setFornecedorSelecionado((prev) => (prev ? { ...prev, status: 'Inativo', ativo: false } : null))
      }
    } catch (erro) {
      alert(erro.message || 'Erro ao inativar fornecedor.')
    } finally {
      setFornecedorParaInativar(null)
    }
  }

  const handleSalvarEdicao = async (fornecedorAtualizado) => {
    try {
      const payload = {
        id: fornecedorAtualizado.id,
        nome: fornecedorAtualizado.nome,
        cnpj: fornecedorAtualizado.cnpj,
        tipo: fornecedorAtualizado.tipo === 'Transportadora' ? 'TRANSPORTADOR' : 'PRODUTOR',
        produto_servico: fornecedorAtualizado.produto_servico,
        car: fornecedorAtualizado.tipo === 'Transportadora' ? null : (fornecedorAtualizado.car === 'Não informado' ? null : fornecedorAtualizado.car),
        cidade: fornecedorAtualizado.cidade || fornecedorAtualizado.municipio,
        uf: fornecedorAtualizado.uf || fornecedorAtualizado.estado,
      }
      await apiRequest('fornecedores/atualizar.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await carregarFornecedores()
      setFornecedorSelecionado(fornecedorAtualizado)
      setModalEditarAberto(false)
    } catch (erro) {
      alert(erro.message || 'Erro ao atualizar fornecedor.')
    }
  }

  const handleExportar = () => {
    const colunas = ['Nome/Razão Social', 'CNPJ', 'CAR', 'Tipo', 'Status', 'Município', 'UF']
    const escaparCampo = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`
    const linhas = fornecedores.map((fornecedor) => [
      fornecedor.nome,
      fornecedor.cnpj,
      fornecedor.car,
      fornecedor.tipo,
      fornecedor.status,
      fornecedor.cidade || fornecedor.municipio,
      fornecedor.uf || fornecedor.estado,
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

  const handleSalvarFornecedor = async (dadosFormulario) => {
    try {
      const payload = {
        nome: dadosFormulario.nome,
        cnpj: dadosFormulario.cnpj,
        tipo: dadosFormulario.tipo === 'Transportadora' ? 'TRANSPORTADOR' : 'PRODUTOR',
        produto_servico: dadosFormulario.produto_servico,
        car: dadosFormulario.tipo === 'Transportadora' ? null : (dadosFormulario.car === 'Não informado' ? null : dadosFormulario.car),
        cidade: dadosFormulario.cidade || dadosFormulario.municipio,
        uf: dadosFormulario.uf || dadosFormulario.estado,
      }
      const res = await apiRequest('fornecedores/cadastrar.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      await carregarFornecedores()
      setFornecedorCadastrado({ ...dadosFormulario, id: res.id })
      setTelaAtual('sucesso')
    } catch (erro) {
      alert(erro.message || 'Erro ao cadastrar fornecedor.')
    }
  }

  const handleCancelarCadastro = () => setTelaAtual('lista')
  const handleIrParaLista = () => setTelaAtual('lista')
  const handleIrParaDashboard = () => setTelaAtual('dashboard')
  const handleIrParaCompliance = () => setTelaAtual('compliance')
  const handleIrParaRelatorios = () => {
    const fornecedorAtivo = fornecedores.find((fornecedor) => fornecedor.status === 'Ativo') || fornecedores[0]
    setFornecedorSelecionado(fornecedorAtivo)
    setTelaAtual('relatorio')
  }
  const handleSelecionarFornecedorDashboard = (fornecedor) => {
    const fornecedorCompleto = fornecedores.find((f) => Number(f.id) === Number(fornecedor.id)) || fornecedor
    setFornecedorSelecionado(fornecedorCompleto)
    setTelaAtual('riscos')
  }

  const handleAtualizarStatusFornecedor = (fornecedorAtualizado) => {
    setFornecedores((lista) =>
      lista.map((f) => (Number(f.id) === Number(fornecedorAtualizado.id) ? { ...f, ...fornecedorAtualizado } : f))
    )
    setFornecedorSelecionado((prev) => (prev ? { ...prev, ...fornecedorAtualizado } : null))
  }

  return (
    <main className="page-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark"><img src={imgLeaf} alt="" /></span>
          <div><p className="brand-name">GestãoFornecedores</p><p className="brand-subtitle">FRIGORÍFICO PORTAL</p></div>
        </div>
        <nav className="nav-list" aria-label="Navegação principal">
          <a className={`nav-item ${telaAtual === 'dashboard' ? 'nav-item-active' : ''}`} href="#dashboard" onClick={(event) => { event.preventDefault(); handleIrParaDashboard() }}><img src={imgLayoutDashboard} alt="" />Dashboard</a>
          <a className={`nav-item ${telaAtual === 'lista' || telaAtual === 'novo' || telaAtual === 'sucesso' || telaAtual === 'detalhes' ? 'nav-item-active' : ''}`} href="#fornecedores" onClick={(event) => { event.preventDefault(); handleIrParaLista() }}><img src={imgUsers2} alt="" />Fornecedores</a>
          <a className={`nav-item ${telaAtual === 'compliance' || telaAtual === 'riscos' ? 'nav-item-active' : ''}`} href="#compliance" onClick={(event) => { event.preventDefault(); handleIrParaCompliance() }}><img src={imgShieldAlert} alt="" />Compliance</a>
          <a className={`nav-item ${telaAtual === 'relatorio' ? 'nav-item-active' : ''}`} href="#relatorios" onClick={(event) => { event.preventDefault(); handleIrParaRelatorios() }}><img src={imgBarChart} alt="" />Relatórios</a>
          <a className="nav-item" href="#configuracoes"><img src={imgSettings} alt="" />Configurações</a>
        </nav>
        <div className="sidebar-session"><span>{usuario?.nome || usuario?.email}</span><button type="button" onClick={onLogout}>Sair</button></div>
      </aside>

      <section className="content-area" aria-labelledby="page-title">
        {telaAtual === 'dashboard' ? (
          <Dashboard onSelecionarFornecedor={handleSelecionarFornecedorDashboard} />
        ) : telaAtual === 'compliance' ? (
          <Compliance fornecedores={fornecedores.filter((fornecedor) => fornecedor.status === 'Ativo')} onSelecionarFornecedor={handleSelecionarFornecedorDashboard} />
        ) : telaAtual === 'riscos' && fornecedorSelecionado ? (
          <VerificacaoRiscos fornecedor={fornecedorSelecionado} onVoltar={handleIrParaDashboard} onRelatorio={() => setTelaAtual('relatorio')} onAtualizarFornecedor={handleAtualizarStatusFornecedor} />
        ) : telaAtual === 'relatorio' && fornecedorSelecionado ? (
          <RelatorioPdf fornecedores={fornecedores.filter((fornecedor) => fornecedor.status === 'Ativo')} fornecedorSelecionado={fornecedorSelecionado} onSelecionarFornecedor={setFornecedorSelecionado} onVoltar={handleIrParaDashboard} />
        ) : telaAtual === 'novo' ? (
          <NovoFornecedor onSalvar={handleSalvarFornecedor} onCancelar={handleCancelarCadastro} />
        ) : telaAtual === 'sucesso' ? (
          <SucessoCadastro fornecedor={fornecedorCadastrado} onCadastrarOutro={() => setTelaAtual('novo')} onVerLista={() => setTelaAtual('lista')} />
        ) : telaAtual === 'detalhes' && fornecedorSelecionado ? (
          <DetalhesFornecedor fornecedor={fornecedorSelecionado} onVoltar={() => setTelaAtual('lista')} onEditar={handleEditar} onInativar={handleInativar} />
        ) : (
          <>
            <div className="title-row">
              <div><h1 id="page-title">Fornecedores</h1><p className="page-description">{fornecedores.length} fornecedores cadastrados</p></div>
              <button type="button" className="primary-button" onClick={() => setTelaAtual('novo')}><img src={imgPlus} alt="" />Novo Fornecedor</button>
            </div>

            <div className="list-toolbar">
              <label className="search-field"><img src={imgSearch} alt="" /><span className="sr-only">Buscar por nome ou CNPJ...</span><input type="search" value={termoBusca} onChange={(event) => setTermoBusca(event.target.value)} placeholder="Buscar por nome ou CNPJ..." /></label>
              <button type="button" className="secondary-button" onClick={handleExportar}>Exportar CSV</button>
            </div>

            <div className="table-card">
              <div className="table-card-header"><div><h2 className="sr-only">Fornecedores cadastrados</h2><p>{fornecedoresFiltrados.length} {fornecedoresFiltrados.length === 1 ? 'registro encontrado' : 'registros encontrados'}</p></div></div>
              {carregando ? (
                <p style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Carregando fornecedores do banco de dados...</p>
              ) : fornecedoresFiltrados.length > 0 ? (
                <FornecedorTable fornecedores={fornecedoresFiltrados} onVisualizar={handleVisualizar} onEditar={handleEditar} onInativar={handleInativar} />
              ) : (
                <div className="empty-state"><strong>Nenhum fornecedor encontrado</strong><p>Cadastre um fornecedor ou revise os termos de busca.</p></div>
              )}
            </div>
          </>
        )}
      </section>
      {modalEditarAberto && fornecedorSelecionado && (
        <ModalEditar key={fornecedorSelecionado.id} fornecedor={fornecedorSelecionado} onClose={() => setModalEditarAberto(false)} onSave={handleSalvarEdicao} />
      )}
      {fornecedorParaInativar && (
        <ConfirmacaoInativacao fornecedor={fornecedorParaInativar} onCancelar={() => setFornecedorParaInativar(null)} onConfirmar={handleConfirmarInativacao} />
      )}

    </main>
  )
}

function App() {
  const [autenticado, setAutenticado] = useState(false)
  const [usuario, setUsuario] = useState(null)
  const [verificandoSessao, setVerificandoSessao] = useState(true)

  useEffect(() => {
    apiRequest('auth/me.php')
      .then((res) => {
        if (res.sucesso && res.usuario) {
          setUsuario(res.usuario)
          setAutenticado(true)
        }
      })
      .catch(() => {})
      .finally(() => {
        setVerificandoSessao(false)
      })
  }, [])

  const handleLogin = (usuarioAutenticado) => {
    setUsuario(usuarioAutenticado)
    setAutenticado(true)
  }

  const handleLogout = async () => {
    try {
      await apiRequest('auth/logout.php', { method: 'POST' })
    } finally {
      setUsuario(null)
      setAutenticado(false)
    }
  }

  if (verificandoSessao) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#f8fafc', color: '#64748b', fontFamily: 'sans-serif' }}>
        <p>Carregando sessão...</p>
      </div>
    )
  }

  if (!autenticado) return <Login onLogin={handleLogin} />

  return <SistemaFornecedores usuario={usuario} onLogout={handleLogout} />
}

export default App
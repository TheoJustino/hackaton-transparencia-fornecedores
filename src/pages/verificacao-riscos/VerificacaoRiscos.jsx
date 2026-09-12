import { useEffect, useState } from 'react'
import { apiRequest } from '../../config/api'
import './VerificacaoRiscos.css'

function VerificacaoRiscos({ fornecedor, onVoltar, onRelatorio, onAtualizarFornecedor }) {
  const [verificacao, setVerificacao] = useState(null)
  const [executando, setExecutando] = useState(false)
  const [carregando, setCarregando] = useState(true)

  const nome = fornecedor.nome || fornecedor.name
  const cnpj = fornecedor.cnpj || fornecedor.document || 'Não informado'

  useEffect(() => {
    let cancelado = false
    if (!fornecedor.id) {
      setCarregando(false)
      return
    }

    apiRequest(`verificacoes/ultima.php?fornecedor_id=${fornecedor.id}`)
      .then((res) => {
        if (!cancelado && res.sucesso && res.dados) {
          setVerificacao(res.dados)
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [fornecedor.id])

  const handleExecutarVerificacao = async () => {
    if (!fornecedor.id || executando) return
    setExecutando(true)
    try {
      const res = await apiRequest('verificacoes/executar.php', {
        method: 'POST',
        body: JSON.stringify({ fornecedor_id: fornecedor.id }),
      })
      if (res.sucesso) {
        setVerificacao({
          status_cnpj: res.status_cnpj,
          status_car: res.status_car,
          status_ambiental: res.status_ambiental,
          status_trabalhista: res.status_trabalhista,
          resultado_geral: res.resultado_geral,
          criado_em: new Date().toISOString(),
        })
        if (onAtualizarFornecedor) {
          onAtualizarFornecedor({ ...fornecedor, status_geral: res.resultado_geral })
        }
      }
    } catch (erro) {
      alert(erro.message || 'Erro ao executar verificação de compliance.')
    } finally {
      setExecutando(false)
    }
  }

  const statusGeral = verificacao?.resultado_geral || fornecedor.status_geral || 'NAO_VERIFICADO'
  const badgeLabel = statusGeral === 'REGULAR' ? 'Regular' : statusGeral === 'ATENCAO' ? 'Atenção' : statusGeral === 'IRREGULAR' ? 'Irregular' : 'Pendente'
  const dataFormatada = verificacao?.criado_em ? new Date(verificacao.criado_em).toLocaleDateString('pt-BR') : 'Não realizada'

  const checks = [
    {
      titulo: 'CNPJ - Receita Federal (BrasilAPI)',
      situacao: verificacao?.status_cnpj === 'REGULAR'
        ? 'Regular - Situação Ativa'
        : verificacao?.status_cnpj === 'IRREGULAR'
          ? 'Irregular - Situação Não Ativa / Baixada'
          : 'Pendente - Aguardando verificação',
      descricao: 'Consulta direta em tempo real à base da Receita Federal.',
      risco: verificacao?.status_cnpj === 'IRREGULAR',
    },
    {
      titulo: 'CAR - Cadastro Ambiental Rural',
      situacao: fornecedor.car && fornecedor.car !== 'Não informado'
        ? (verificacao?.status_car === 'IRREGULAR' ? 'Irregular - CAR inconsistente' : 'Regular - Cadastro CAR informado')
        : 'Não se aplica / CAR não cadastrado',
      descricao: fornecedor.car && fornecedor.car !== 'Não informado'
        ? `Código CAR: ${fornecedor.car}`
        : 'Fornecedor sem registro de CAR associado.',
      risco: verificacao?.status_car === 'IRREGULAR',
    },
    {
      titulo: 'IBAMA - Embargos e Autuações',
      situacao: verificacao?.status_ambiental === 'COM_RESTRICAO'
        ? 'Irregular - Consta na lista de embargos'
        : 'Regular - Nenhuma restrição socioambiental ativa',
      descricao: 'Verificação em bases públicas de autuações e embargos ambientais.',
      risco: verificacao?.status_ambiental === 'COM_RESTRICAO',
    },
    {
      titulo: 'Trabalho Escravo - MTE',
      situacao: verificacao?.status_trabalhista === 'COM_ALERTA'
        ? 'Irregular - Consta no cadastro de empregadores'
        : 'Regular - Sem ocorrências no MTE',
      descricao: 'Consulta ao Cadastro de Empregadores que tenham submetido trabalhadores a condições análogas à escravidão.',
      risco: verificacao?.status_trabalhista === 'COM_ALERTA',
    },
  ]

  return (
    <div className="risk-page">
      <div className="risk-breadcrumb">Fornecedores <span aria-hidden="true">&gt;</span> {nome} <span aria-hidden="true">&gt;</span> <strong>Verificação de Riscos</strong></div>
      <div className="risk-heading">
        <div>
          <h1 id="page-title">Análise de Compliance</h1>
          <p>Última verificação: {dataFormatada}</p>
        </div>
        <div className="risk-heading-meta">
          <span className={`risk-attention-badge ${statusGeral === 'REGULAR' ? 'risk-badge-regular' : statusGeral === 'IRREGULAR' ? 'risk-badge-irregular' : ''}`}>{badgeLabel}</span>
          <button type="button" className="verify-button" onClick={handleExecutarVerificacao} disabled={executando}>
            {executando ? 'Consultando...' : '↻ Verificar Agora'}
          </button>
        </div>
      </div>
      <p className="risk-company">Fornecedor analisado: <strong>{nome}</strong> <span>•</span> CNPJ: {cnpj}</p>
      <div className="risk-grid">
        {checks.map((check) => (
          <article key={check.titulo} className={`risk-check-card ${check.risco ? 'risk-check-card-danger' : ''}`}>
            <div className="risk-card-title">
              <h2>{check.titulo}</h2>
              <span className={check.risco ? 'risk-icon risk-icon-danger' : 'risk-icon'} aria-label={check.risco ? 'Irregular' : 'Regular'}>
                {check.risco ? '×' : '✓'}
              </span>
            </div>
            <strong className={check.risco ? 'risk-result-danger' : 'risk-result'}>{check.situacao}</strong>
            <p>{check.descricao}</p>
          </article>
        ))}
      </div>
      <div className="risk-footer-actions">
        <button type="button" className="risk-back-button" onClick={onVoltar}>Voltar</button>
        <button type="button" className="risk-report-button" onClick={onRelatorio}>Ver relatório</button>
      </div>
    </div>
  )
}

export default VerificacaoRiscos

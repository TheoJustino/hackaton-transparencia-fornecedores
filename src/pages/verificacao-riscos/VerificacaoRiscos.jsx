import './VerificacaoRiscos.css'

function VerificacaoRiscos({ fornecedor, onVoltar, onRelatorio }) {
  const nome = fornecedor.nome || fornecedor.name
  const cnpj = fornecedor.cnpj || fornecedor.document || 'Não informado'

  const verificacoes = [
    { titulo: 'CNPJ - Receita Federal', situacao: 'Regular - Situação Ativa', descricao: 'CNPJ consultado diretamente na base do Governo Federal.', risco: false },
    { titulo: 'CAR - Cadastro Ambiental Rural', situacao: 'Regular - Cadastro Ativo', descricao: 'Área de reserva e preservação regularizada conforme CAR.', risco: false },
    { titulo: 'IBAMA - Embargos Ambientais', situacao: fornecedor.risk === 'ambiental' && fornecedor.status !== 'regular' ? 'Irregular - 1 embargo encontrado' : 'Regular - Nenhum embargo encontrado', descricao: fornecedor.risk === 'ambiental' && fornecedor.status !== 'regular' ? 'Desmatamento ilegal em área protegida - 15/03/2024' : 'Nenhuma ocorrência encontrada na consulta.', risco: fornecedor.risk === 'ambiental' && fornecedor.status !== 'regular' },
    { titulo: 'Lista Suja - Trabalho Escravo', situacao: fornecedor.risk === 'trabalhista' && fornecedor.status !== 'regular' ? 'Irregular - Registro encontrado' : 'Regular - Não consta na lista', descricao: 'Nenhum registro encontrado no cadastro do MTE.', risco: false },
  ]

  return (
    <div className="risk-page">
      <div className="risk-breadcrumb">Fornecedores <span aria-hidden="true">&gt;</span> {nome} <span aria-hidden="true">&gt;</span> <strong>Verificação de Riscos</strong></div>
      <div className="risk-heading">
        <div><h1 id="page-title">Análise de Compliance</h1><p>Última verificação: 20/08/2026</p></div>
        <div className="risk-heading-meta"><span className="risk-attention-badge">Atenção</span><button type="button" className="verify-button" onClick={() => window.alert('Verificação atualizada para este fornecedor.')}>↻ Verificar Agora</button></div>
      </div>
      <p className="risk-company">Fornecedor analisado: <strong>{nome}</strong> <span>•</span> CNPJ: {cnpj}</p>
      <div className="risk-grid">
        {verificacoes.map((verificacao) => (
          <article key={verificacao.titulo} className={`risk-check-card ${verificacao.risco ? 'risk-check-card-danger' : ''}`}>
            <div className="risk-card-title"><h2>{verificacao.titulo}</h2><span className={verificacao.risco ? 'risk-icon risk-icon-danger' : 'risk-icon'} aria-label={verificacao.risco ? 'Irregular' : 'Regular'}>{verificacao.risco ? '×' : '✓'}</span></div>
            <strong className={verificacao.risco ? 'risk-result-danger' : 'risk-result'}>{verificacao.situacao}</strong>
            <p>{verificacao.descricao}</p>
            {verificacao.risco && <div className="embargo-detail"><strong>Embargo nº 2847</strong><span>Desmatamento ilegal em área protegida - 15/03/2024</span></div>}
          </article>
        ))}
      </div>
      <div className="risk-footer-actions"><button type="button" className="risk-back-button" onClick={onVoltar}>Voltar para o Dashboard</button><button type="button" className="risk-report-button" onClick={onRelatorio}>Ver relatório</button></div>
    </div>
  )
}

export default VerificacaoRiscos

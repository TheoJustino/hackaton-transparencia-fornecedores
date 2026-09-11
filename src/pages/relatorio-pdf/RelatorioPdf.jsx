import './RelatorioPdf.css'

function RelatorioPdf({ fornecedores, fornecedorSelecionado, onSelecionarFornecedor, onVoltar }) {
  const fornecedor = fornecedorSelecionado || fornecedores[0]

  const handleEnviarEmail = () => {
    window.alert('O envio por e-mail será conectado posteriormente.')
  }

  if (!fornecedor) return null

  return (
    <div className="report-page">
      <div className="report-toolbar"><div className="report-breadcrumb">Fornecedores <span aria-hidden="true">&gt;</span> <strong>Relatório</strong></div><label>Fornecedor<select value={fornecedor.id} onChange={(event) => onSelecionarFornecedor(fornecedores.find((item) => String(item.id) === event.target.value))}>{fornecedores.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select></label></div>
      <div className="report-action-header"><div><h1 id="page-title">Relatório de Regularidade</h1><p>Visualize ou faça download do histórico completo de compliance.</p></div><div className="report-actions"><button type="button" className="report-email-button" onClick={handleEnviarEmail}>✉ Enviar por E-mail</button><button type="button" className="report-download-button" onClick={() => window.print()}>↓ Baixar PDF</button></div></div>
      <article className="report-paper">
        <header className="report-paper-header"><strong>GESTÃO FORNECEDORES</strong><span>Emitido em: {new Date().toLocaleDateString('pt-BR')}</span></header>
        <div className="report-paper-title"><h2>Relatório de Compliance e Regularidade</h2><p>Este documento atesta a situação cadastral e socioambiental do fornecedor listado abaixo.</p></div>
        <section className="report-section"><h3>DADOS DO FORNECEDOR</h3><div className="report-supplier-data"><div><span>Razão Social</span><strong>{fornecedor.nome}</strong></div><div><span>CNPJ</span><strong>{fornecedor.cnpj}</strong></div><div><span>Inscrição CAR</span><strong>{fornecedor.car}</strong></div></div></section>
        <section className="report-section"><h3>RESULTADOS DA VERIFICAÇÃO</h3><table className="report-results"><thead><tr><th>Fonte / Órgão</th><th>Status</th><th>Detalhes</th></tr></thead><tbody><tr><td>CNPJ - Situação Cadastral</td><td className="report-regular">Regular</td><td>Ativa</td></tr><tr><td>CAR - Cadastro Ambiental</td><td className="report-regular">Regular</td><td>Ativo</td></tr><tr><td>IBAMA - Embargos</td><td className={fornecedor.risk === 'ambiental' ? 'report-irregular' : 'report-regular'}>{fornecedor.risk === 'ambiental' ? 'Irregular' : 'Regular'}</td><td>{fornecedor.risk === 'ambiental' ? '1 Embargo' : 'Nenhum embargo'}</td></tr><tr><td>Trabalho Escravo - MTE</td><td className="report-regular">Regular</td><td>Sem ocorrências</td></tr></tbody></table></section>
        <footer className="report-paper-footer">Este relatório é gerado automaticamente pelo sistema de homologação.<br />GestãoFornecedores © 2026 - Frigorífico Portal</footer>
      </article>
      <button type="button" className="report-back-button" onClick={onVoltar}>Voltar</button>
    </div>
  )
}

export default RelatorioPdf

import './Compliance.css'

function Compliance({ fornecedores, onSelecionarFornecedor }) {
  return (
    <div className="compliance-page">
      <div className="compliance-heading"><div><p className="compliance-kicker">Homologação e auditoria</p><h1 id="page-title">Compliance</h1><p>Selecione um fornecedor para consultar a situação cadastral e os riscos socioambientais.</p></div></div>
      <div className="compliance-list" role="list">
        {fornecedores.map((fornecedor) => (
          <button type="button" className="compliance-supplier" key={fornecedor.id} onClick={() => onSelecionarFornecedor(fornecedor)}>
            <span className="compliance-supplier-info"><strong>{fornecedor.nome}</strong><span>CNPJ: {fornecedor.cnpj}</span></span>
            <span className="compliance-supplier-action">Verificar riscos <span aria-hidden="true">&gt;</span></span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Compliance

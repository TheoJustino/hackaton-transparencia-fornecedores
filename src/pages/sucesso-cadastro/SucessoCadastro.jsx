import './SucessoCadastro.css'

const imgCheckCircle = 'https://www.figma.com/api/mcp/asset/e5a606f1-438c-4287-80cb-a610cbae57e4.svg'

function SucessoCadastro({ fornecedor, onCadastrarOutro, onVerLista }) {
  return (
    <>
      <div className="success-toast" role="status">
        <img src={imgCheckCircle} alt="" />
        <strong>Fornecedor cadastrado com sucesso!</strong>
        <div className="success-actions">
          <button type="button" onClick={onCadastrarOutro}>Cadastrar outro</button>
          <button type="button" onClick={onVerLista}>Ver lista de fornecedores</button>
        </div>
      </div>

      <div className="success-breadcrumb">Fornecedores <span aria-hidden="true">&gt;</span> {fornecedor.nome}</div>
      <div className="success-card">
        <section className="success-section">
          <h2>Dados da Empresa</h2>
          <div className="success-fields success-fields-company">
            <div><span>Nome da Empresa</span><strong>{fornecedor.nome}</strong></div>
            <div><span>CNPJ</span><strong>{fornecedor.cnpj}</strong></div>
            <div><span>CAR - Cadastro Ambiental Rural</span><strong>{fornecedor.car}</strong></div>
          </div>
        </section>

        <section className="success-section">
          <h2>Localização</h2>
          <div className="success-fields success-fields-location">
            <div className="success-field-wide"><span>Endereço</span><strong>{fornecedor.endereco || 'Não informado'}</strong></div>
            <div><span>Cidade</span><strong>{fornecedor.municipio || 'Não informado'}</strong></div>
            <div><span>Estado</span><strong>{fornecedor.estado || 'Não informado'}</strong></div>
            <div><span>CEP</span><strong>{fornecedor.cep || 'Não informado'}</strong></div>
          </div>
        </section>

        <section className="success-section success-classification">
          <h2>Classificação</h2>
          <span className="success-label">Tipo de Fornecedor</span>
          <div className="success-type"><span className="selected-dot" aria-hidden="true" />{fornecedor.tipo === 'Transportadora' ? 'Transportador' : 'Produtor'}</div>
        </section>
      </div>
    </>
  )
}

export default SucessoCadastro

import StatusBadge from '../lista-fornecedores/StatusBadge'
import './DetalhesFornecedor.css'

const imgLeaf = 'https://www.figma.com/api/mcp/asset/2edaf505-bb37-4db4-9af4-154a6f0fc7c8.svg'
const imgEdit = 'https://www.figma.com/api/mcp/asset/9a8f174c-ede4-4731-8f32-559975d6f705.svg'

function DetalhesFornecedor({ fornecedor, onVoltar, onEditar, onInativar }) {
  const enderecoCompleto = fornecedor.endereco
    ? [fornecedor.endereco, fornecedor.municipio, fornecedor.estado, fornecedor.cep && `CEP: ${fornecedor.cep}`].filter(Boolean).join(', ')
    : 'Não informado'

  return (
    <>
      <div className="details-breadcrumb">
        Fornecedores <span aria-hidden="true">&gt;</span> <strong>{fornecedor.nome}</strong>
      </div>

      <div className="details-header">
        <div className="details-identity">
          <div className="details-logo"><img src={imgLeaf} alt="" /></div>
          <div>
            <div className="details-title-row"><h1 id="page-title">{fornecedor.nome}</h1><StatusBadge status={fornecedor.status} /></div>
            <p>CNPJ: {fornecedor.cnpj}</p>
          </div>
        </div>
        <div className="details-actions">
          <button type="button" className="details-inactivate-button" onClick={() => onInativar(fornecedor)}>Inativar</button>
          <button type="button" className="details-edit-button" onClick={() => onEditar(fornecedor)}><img src={imgEdit} alt="" />Editar</button>
        </div>
      </div>

      <div className="details-panels">
        <section className="details-panel" aria-labelledby="registration-title">
          <h2 id="registration-title">Dados Cadastrais</h2>
          <dl className="details-list">
            <div><dt>Nome da Empresa</dt><dd>{fornecedor.nome}</dd></div>
            <div><dt>CNPJ</dt><dd>{fornecedor.cnpj}</dd></div>
            <div><dt>CAR</dt><dd>{fornecedor.car}</dd></div>
            <div><dt>Tipo</dt><dd>{fornecedor.tipo === 'Transportadora' ? 'Transportador' : 'Produtor'}</dd></div>
            <div><dt>Endereço</dt><dd>{enderecoCompleto || 'Não informado'}</dd></div>
          </dl>
        </section>

        <section className="details-panel" aria-labelledby="history-title">
          <h2 id="history-title">Histórico de Alterações</h2>
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead><tr><th>Data</th><th>Campo</th><th>Valor Anterior</th><th>Valor Novo</th></tr></thead>
              <tbody><tr><td colSpan="4" className="history-empty">Nenhuma alteração registrada</td></tr></tbody>
            </table>
          </div>
        </section>
      </div>

      <button type="button" className="details-back-button" onClick={onVoltar}>Voltar para a lista</button>
    </>
  )
}

export default DetalhesFornecedor

import StatusBadge from './StatusBadge'

const imgEye = 'https://www.figma.com/api/mcp/asset/4f1f9228-0a08-4154-b250-a54e2bb631b6.svg'
const imgEdit = 'https://www.figma.com/api/mcp/asset/fb7aeff3-cf4a-4b85-8128-f11f46c2141c.svg'
const imgTrash = 'https://www.figma.com/api/mcp/asset/19d41790-fdd4-4514-831f-7fc3d0ac7843.svg'

function FornecedorTable({ fornecedores, onVisualizar, onEditar, onInativar }) {
  return (
    <div className="table-wrapper">
      <table className="supplier-table">
        <caption className="sr-only">Lista de fornecedores cadastrados</caption>
        <thead>
          <tr>
            <th scope="col">Nome/Razão Social</th>
            <th scope="col">CNPJ</th>
            <th scope="col">CAR</th>
            <th scope="col">Tipo</th>
            <th scope="col">Status</th>
            <th scope="col" className="actions-column">Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((fornecedor) => (
            <tr key={fornecedor.id}>
              <td>
                <strong className="supplier-name">{fornecedor.nome}</strong>
                <span className="supplier-location">{fornecedor.municipio} - MT</span>
              </td>
              <td>{fornecedor.cnpj}</td>
              <td>{fornecedor.car}</td>
              <td>{fornecedor.tipo}</td>
              <td><StatusBadge status={fornecedor.status} /></td>
              <td>
                <div className="row-actions">
                  <button type="button" className="action-button" aria-label={`Visualizar ${fornecedor.nome}`} onClick={() => onVisualizar(fornecedor)}>
                    <img src={imgEye} alt="" />
                  </button>
                  <button type="button" className="action-button" aria-label={`Editar ${fornecedor.nome}`} onClick={() => onEditar(fornecedor)}>
                    <img src={imgEdit} alt="" />
                  </button>
                  <button
                    type="button"
                    className="action-button action-button-danger"
                    aria-label={`Inativar ${fornecedor.nome}`}
                    onClick={() => onInativar(fornecedor)}
                    disabled={fornecedor.status === 'Inativo'}
                  >
                    <img src={imgTrash} alt="" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FornecedorTable

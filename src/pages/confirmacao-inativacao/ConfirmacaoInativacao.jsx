import './ConfirmacaoInativacao.css'

const imgAlertTriangle = 'https://www.figma.com/api/mcp/asset/500df137-cbfb-44c8-b4a7-d449f8794066.svg'

function ConfirmacaoInativacao({ fornecedor, onCancelar, onConfirmar }) {
  return (
    <div className="inactivation-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancelar()}>
      <div className="inactivation-modal" role="dialog" aria-modal="true" aria-labelledby="inactivation-title" aria-describedby="inactivation-description">
        <div className="inactivation-content">
          <div className="inactivation-icon"><img src={imgAlertTriangle} alt="" /></div>
          <div>
            <h2 id="inactivation-title">Inativar Fornecedor</h2>
            <p id="inactivation-description">Tem certeza que deseja inativar o fornecedor {fornecedor.nome}? O fornecedor não aparecerá mais na lista ativa, mas seus dados serão mantidos no sistema.</p>
          </div>
        </div>
        <div className="inactivation-actions">
          <button type="button" className="inactivation-cancel" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="inactivation-confirm" onClick={onConfirmar}>Confirmar Inativação</button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmacaoInativacao

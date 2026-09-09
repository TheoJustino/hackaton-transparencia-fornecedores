import { useState } from 'react'
import './ModalEditar.css'

const formularioInicial = {
  nome: '',
  cnpj: '',
  car: '',
  endereco: '',
  municipio: '',
  estado: '',
  cep: '',
  tipo: 'Produtor rural',
}

function validarCnpj(valor) {
  const numeros = valor.replace(/\D/g, '')
  if (numeros.length !== 14 || /^([0-9])\1+$/.test(numeros)) return false

  const calcularDigito = (tamanho) => {
    let soma = 0
    let peso = tamanho - 7

    for (let indice = 0; indice < tamanho; indice += 1) {
      soma += Number(numeros[indice]) * peso
      peso = peso === 2 ? 9 : peso - 1
    }

    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }

  return calcularDigito(12) === Number(numeros[12]) && calcularDigito(13) === Number(numeros[13])
}

function criarFormulario(fornecedor) {
  return {
    ...formularioInicial,
    ...fornecedor,
    car: fornecedor.car === 'Não informado' ? '' : fornecedor.car || '',
  }
}

function ModalEditar({ fornecedor, onClose, onSave }) {
  const [formulario, setFormulario] = useState(() => criarFormulario(fornecedor))
  const [erros, setErros] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((estadoAtual) => ({ ...estadoAtual, [name]: value }))
    setErros((errosAtuais) => {
      if (!errosAtuais[name]) return errosAtuais
      const novosErros = { ...errosAtuais }
      delete novosErros[name]
      return novosErros
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const novosErros = {}

    if (!formulario.nome.trim()) novosErros.nome = 'Campo obrigatório'
    if (!validarCnpj(formulario.cnpj)) novosErros.cnpj = 'CNPJ inválido. Verifique o formato e os dígitos.'

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    onSave({
      ...fornecedor,
      ...formulario,
      nome: formulario.nome.trim(),
      cnpj: formulario.cnpj.trim(),
      car: formulario.car.trim() || 'Não informado',
    })
  }

  const campoProps = (nome) => ({
    className: erros[nome] ? 'modal-input input-error' : 'modal-input',
    'aria-invalid': Boolean(erros[nome]),
    'aria-describedby': erros[nome] ? `${nome}-modal-error` : undefined,
  })

  const renderErro = (nome) => erros[nome] && <small id={`${nome}-modal-error`} className="modal-field-error">{erros[nome]}</small>

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
        <div className="modal-header">
          <h2 id="edit-modal-title">Editar Fornecedor</h2>
          <button type="button" className="modal-close" aria-label="Fechar edição" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-fields">
            <label className="modal-field modal-field-full">Nome da Empresa <span>*</span><input name="nome" value={formulario.nome} onChange={handleChange} {...campoProps('nome')} />{renderErro('nome')}</label>
            <div className="modal-form-row">
              <label className="modal-field">CNPJ <span>*</span><input name="cnpj" value={formulario.cnpj} onChange={handleChange} {...campoProps('cnpj')} />{renderErro('cnpj')}</label>
              <label className="modal-field">CAR - Cadastro Ambiental Rural<input name="car" value={formulario.car} onChange={handleChange} {...campoProps('car')} /></label>
            </div>
            <label className="modal-field modal-field-full">Endereço<input name="endereco" value={formulario.endereco || ''} onChange={handleChange} className="modal-input" /></label>
            <div className="modal-form-row modal-location-row">
              <label className="modal-field">Cidade<input name="municipio" value={formulario.municipio || ''} onChange={handleChange} className="modal-input" /></label>
              <label className="modal-field modal-state-field">Estado<select name="estado" value={formulario.estado || ''} onChange={handleChange} className="modal-input"><option value="">Selecione...</option><option value="MT">Mato Grosso (MT)</option><option value="GO">Goiás (GO)</option><option value="MS">Mato Grosso do Sul (MS)</option><option value="SP">São Paulo (SP)</option></select></label>
              <label className="modal-field">CEP<input name="cep" value={formulario.cep || ''} onChange={handleChange} className="modal-input" /></label>
            </div>
            <fieldset className="modal-type-field">
              <legend>Tipo de Fornecedor</legend>
              <div className="modal-radio-group">
                <label><input type="radio" name="tipo" value="Produtor rural" checked={formulario.tipo === 'Produtor rural'} onChange={handleChange} />Produtor</label>
                <label><input type="radio" name="tipo" value="Transportadora" checked={formulario.tipo === 'Transportadora'} onChange={handleChange} />Transportador</label>
              </div>
            </fieldset>
          </div>
          <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>Cancelar</button><button type="submit" className="modal-save">Salvar Alterações</button></div>
        </form>
      </div>
    </div>
  )
}

export default ModalEditar

import { useState } from 'react'
import './NovoFornecedor.css'

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

const validarCnpj = (valor) => {
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

const validarFormulario = (formulario) => {
  const erros = {}

  if (!formulario.nome.trim()) erros.nome = 'Campo obrigatório'
  if (!validarCnpj(formulario.cnpj)) erros.cnpj = 'CNPJ inválido. Verifique o formato e os dígitos.'
  if (formulario.car && !/^[A-Z]{2}-\d{7}-[A-Z0-9.]{4,}$/.test(formulario.car.trim().toUpperCase())) {
    erros.car = 'CAR inválido. Informe UF-0000000-XXXXXXXX.'
  }
  if (!formulario.endereco.trim()) erros.endereco = 'Campo obrigatório'
  if (!formulario.municipio.trim()) erros.municipio = 'Campo obrigatório'
  if (!formulario.estado) erros.estado = 'Selecione um estado'
  if (formulario.cep && !/^\d{5}-?\d{3}$/.test(formulario.cep.trim())) erros.cep = 'CEP inválido.'

  return erros
}

function NovoFornecedor({ onSalvar, onCancelar }) {
  const [formulario, setFormulario] = useState(formularioInicial)
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
    const novosErros = validarFormulario(formulario)
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    onSalvar({
      id: Date.now(),
      nome: formulario.nome,
      cnpj: formulario.cnpj,
      car: formulario.car || 'Não informado',
      tipo: formulario.tipo,
      status: 'Ativo',
      municipio: formulario.municipio,
      endereco: formulario.endereco,
      estado: formulario.estado,
      cep: formulario.cep,
    })
    setFormulario(formularioInicial)
    setErros({})
  }

  const handleCancelar = () => {
    setFormulario(formularioInicial)
    setErros({})
    onCancelar()
  }

  const obterPropsCampo = (nome) => ({
    className: erros[nome] ? 'input-error' : '',
    'aria-invalid': Boolean(erros[nome]),
    'aria-describedby': erros[nome] ? `${nome}-erro` : undefined,
  })

  const renderErro = (nome) => erros[nome] && <small id={`${nome}-erro`} className="field-error">{erros[nome]}</small>

  return (
    <>
      <div className="breadcrumb-group">
        <p>Fornecedores <span aria-hidden="true">&gt;</span> <strong>Novo Fornecedor</strong></p>
        <h1 id="page-title">Novo Fornecedor</h1>
      </div>
      <form className="form-card" onSubmit={handleSubmit}>
        <fieldset className="form-section">
          <legend>Dados da Empresa</legend>
          <div className="form-grid form-grid-company">
                  <label className="form-field form-field-company">Nome da Empresa <span>*</span><input name="nome" value={formulario.nome} onChange={handleChange} placeholder="Razão Social ou Nome Fantasia" {...obterPropsCampo('nome')} />{renderErro('nome')}</label>
                  <label className="form-field">CNPJ <span>*</span><input name="cnpj" value={formulario.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" {...obterPropsCampo('cnpj')} />{renderErro('cnpj')}</label>
                  <label className="form-field">CAR - Cadastro Ambiental Rural<input name="car" value={formulario.car} onChange={handleChange} placeholder="UF-0000000-XXXXXXXX" {...obterPropsCampo('car')} />{renderErro('car')}</label>
          </div>
        </fieldset>

        <fieldset className="form-section">
          <legend>Localização</legend>
          <div className="form-grid form-grid-location">
                  <label className="form-field form-field-full">Endereço<input name="endereco" value={formulario.endereco} onChange={handleChange} placeholder="Rua, Avenida, Número, Fazenda" {...obterPropsCampo('endereco')} />{renderErro('endereco')}</label>
                  <label className="form-field form-field-city">Cidade<input name="municipio" value={formulario.municipio} onChange={handleChange} placeholder="Cidade" {...obterPropsCampo('municipio')} />{renderErro('municipio')}</label>
                  <label className="form-field">Estado<select name="estado" value={formulario.estado} onChange={handleChange} {...obterPropsCampo('estado')}><option value="">Selecione...</option><option value="MT">Mato Grosso</option><option value="GO">Goiás</option><option value="MS">Mato Grosso do Sul</option><option value="SP">São Paulo</option></select>{renderErro('estado')}</label>
                  <label className="form-field">CEP<input name="cep" value={formulario.cep} onChange={handleChange} placeholder="00000-000" {...obterPropsCampo('cep')} />{renderErro('cep')}</label>
          </div>
        </fieldset>

        <fieldset className="form-section form-section-classification">
          <legend>Classificação</legend>
          <span className="field-label">Tipo de Fornecedor</span>
          <div className="radio-group">
            <label><input type="radio" name="tipo" value="Produtor rural" checked={formulario.tipo === 'Produtor rural'} onChange={handleChange} />Produtor</label>
            <label><input type="radio" name="tipo" value="Transportadora" checked={formulario.tipo === 'Transportadora'} onChange={handleChange} />Transportador</label>
          </div>
        </fieldset>

        <div className="form-actions"><button type="button" className="cancel-button" onClick={handleCancelar}>Cancelar</button><button type="submit" className="save-button">Salvar Fornecedor</button></div>
      </form>
    </>
  )
}

export default NovoFornecedor

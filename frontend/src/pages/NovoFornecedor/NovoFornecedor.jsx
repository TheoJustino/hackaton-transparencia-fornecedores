import React, { useState, useCallback } from 'react';
import './NovoFornecedor.scss';

const INITIAL_FORM_STATE = {
  // Dados da Empresa
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  inscricaoEstadual: '',
  inscricaoMunicipal: '',
  ramoAtividade: '',
  // Endereço
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  // Contato
  telefone: '',
  celular: '',
  email: '',
  website: '',
  nomeContato: '',
  cargoContato: '',
  // Dados Bancários
  banco: '',
  agencia: '',
  conta: '',
  tipoConta: '',
  chavePix: '',
  // Observações
  observacoes: '',
};

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
];

const RAMOS_ATIVIDADE = [
  'Alimentício',
  'Automotivo',
  'Construção Civil',
  'Eletrônicos',
  'Farmacêutico',
  'Logística',
  'Matéria-prima',
  'Papelaria',
  'Químico',
  'Serviços',
  'Tecnologia',
  'Têxtil',
  'Outro',
];

const TIPOS_CONTA = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' },
  { value: 'pagamento', label: 'Conta Pagamento' },
];

function formatCNPJ(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function formatCEP(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, '$1-$2');
}

function formatTelefone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

function validateEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCNPJ(cnpj) {
  const digits = cnpj.replace(/\D/g, '');
  return digits.length === 0 || digits.length === 14;
}

const NovoFornecedor = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const sections = [
    { id: 'empresa', label: 'Dados da Empresa', icon: 'business' },
    { id: 'endereco', label: 'Endereço', icon: 'location' },
    { id: 'contato', label: 'Contato', icon: 'contact' },
    { id: 'bancario', label: 'Dados Bancários', icon: 'bank' },
    { id: 'observacoes', label: 'Observações', icon: 'notes' },
  ];

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    switch (name) {
      case 'cnpj':
        formattedValue = formatCNPJ(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
      case 'telefone':
      case 'celular':
        formattedValue = formatTelefone(value);
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.razaoSocial.trim()) {
      newErrors.razaoSocial = 'Razão Social é obrigatória';
    }
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else if (!validateCNPJ(formData.cnpj)) {
      newErrors.cnpj = 'CNPJ inválido';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    if (!formData.telefone.trim() && !formData.celular.trim()) {
      newErrors.telefone = 'Informe ao menos um telefone';
    }
    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    }
    if (!formData.logradouro.trim()) {
      newErrors.logradouro = 'Logradouro é obrigatório';
    }
    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    }
    if (!formData.estado) {
      newErrors.estado = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0];
      const sectionMap = {
        razaoSocial: 0, nomeFantasia: 0, cnpj: 0,
        inscricaoEstadual: 0, inscricaoMunicipal: 0, ramoAtividade: 0,
        cep: 1, logradouro: 1, numero: 1, bairro: 1, cidade: 1, estado: 1,
        telefone: 2, celular: 2, email: 2, nomeContato: 2,
      };
      if (firstErrorField && sectionMap[firstErrorField] !== undefined) {
        setActiveSection(sectionMap[firstErrorField]);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 4000);
      setFormData(INITIAL_FORM_STATE);
      setActiveSection(0);
    } catch {
      setErrors({ form: 'Erro ao cadastrar fornecedor. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, errors]);

  const handleCancel = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setActiveSection(0);
  }, []);

  const renderInput = (label, name, options = {}) => {
    const {
      type = 'text',
      placeholder = '',
      required = false,
      disabled = false,
      maxLength,
      colSpan,
    } = options;

    return (
      <div className={`form-field ${colSpan ? `col-span-${colSpan}` : ''} ${errors[name] ? 'has-error' : ''}`}>
        <label htmlFor={name}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled || isSubmitting}
          maxLength={maxLength}
          className={errors[name] ? 'input-error' : ''}
          autoComplete="off"
        />
        {errors[name] && <span className="error-message">{errors[name]}</span>}
      </div>
    );
  };

  const renderSelect = (label, name, selectOptions, options = {}) => {
    const { required = false, placeholder = 'Selecione...' } = options;
    return (
      <div className={`form-field ${errors[name] ? 'has-error' : ''}`}>
        <label htmlFor={name}>
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          disabled={isSubmitting}
          className={errors[name] ? 'input-error' : ''}
        >
          <option value="">{placeholder}</option>
          {selectOptions.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
        {errors[name] && <span className="error-message">{errors[name]}</span>}
      </div>
    );
  };

  const renderTextarea = (label, name, options = {}) => {
    const { placeholder = '', rows = 4, colSpan } = options;
    return (
      <div className={`form-field ${colSpan ? `col-span-${colSpan}` : ''}`}>
        <label htmlFor={name}>{label}</label>
        <textarea
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          disabled={isSubmitting}
        />
      </div>
    );
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 0:
        return (
          <div className="section-content">
            <h3 className="section-title">
              <span className="section-icon section-icon--business" />
              Dados da Empresa
            </h3>
            <div className="form-grid">
              {renderInput('Razão Social', 'razaoSocial', { required: true, placeholder: 'Ex: Empresa LTDA', colSpan: 2 })}
              {renderInput('Nome Fantasia', 'nomeFantasia', { placeholder: 'Nome comercial' })}
              {renderInput('CNPJ', 'cnpj', { required: true, placeholder: '00.000.000/0000-00' })}
              {renderInput('Inscrição Estadual', 'inscricaoEstadual', { placeholder: 'Número da IE' })}
              {renderInput('Inscrição Municipal', 'inscricaoMunicipal', { placeholder: 'Número da IM' })}
              {renderSelect('Ramo de Atividade', 'ramoAtividade', RAMOS_ATIVIDADE)}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="section-content">
            <h3 className="section-title">
              <span className="section-icon section-icon--location" />
              Endereço
            </h3>
            <div className="form-grid">
              {renderInput('CEP', 'cep', { required: true, placeholder: '00000-000' })}
              {renderInput('Logradouro', 'logradouro', { required: true, placeholder: 'Rua, Avenida...', colSpan: 2 })}
              {renderInput('Número', 'numero', { placeholder: 'Nº' })}
              {renderInput('Complemento', 'complemento', { placeholder: 'Sala, Andar...' })}
              {renderInput('Bairro', 'bairro', { placeholder: 'Nome do bairro' })}
              {renderInput('Cidade', 'cidade', { required: true, placeholder: 'Nome da cidade' })}
              {renderSelect('Estado', 'estado', ESTADOS_BR, { required: true, placeholder: 'UF' })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="section-content">
            <h3 className="section-title">
              <span className="section-icon section-icon--contact" />
              Contato
            </h3>
            <div className="form-grid">
              {renderInput('Telefone', 'telefone', { placeholder: '(00) 0000-0000', type: 'tel' })}
              {renderInput('Celular', 'celular', { placeholder: '(00) 00000-0000', type: 'tel' })}
              {renderInput('E-mail', 'email', { required: true, placeholder: 'email@empresa.com', type: 'email', colSpan: 2 })}
              {renderInput('Website', 'website', { placeholder: 'www.empresa.com.br', type: 'url' })}
              {renderInput('Nome do Contato', 'nomeContato', { placeholder: 'Pessoa responsável' })}
              {renderInput('Cargo do Contato', 'cargoContato', { placeholder: 'Ex: Gerente Comercial' })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="section-content">
            <h3 className="section-title">
              <span className="section-icon section-icon--bank" />
              Dados Bancários
            </h3>
            <div className="form-grid">
              {renderInput('Banco', 'banco', { placeholder: 'Nome do banco' })}
              {renderInput('Agência', 'agencia', { placeholder: 'Número da agência' })}
              {renderInput('Conta', 'conta', { placeholder: 'Número da conta' })}
              {renderSelect('Tipo de Conta', 'tipoConta', TIPOS_CONTA)}
              {renderInput('Chave PIX', 'chavePix', { placeholder: 'CPF, CNPJ, e-mail, telefone ou aleatória', colSpan: 2 })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="section-content">
            <h3 className="section-title">
              <span className="section-icon section-icon--notes" />
              Observações
            </h3>
            <div className="form-grid">
              {renderTextarea('Observações Gerais', 'observacoes', {
                placeholder: 'Informações adicionais sobre o fornecedor...',
                rows: 6,
                colSpan: 3,
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="novo-fornecedor">
      <header className="novo-fornecedor__header">
        <div className="header-content">
          <div className="header-title-group">
            <h1 className="header-title">Novo Fornecedor</h1>
            <p className="header-subtitle">
              Preencha os dados abaixo para cadastrar um novo fornecedor
            </p>
          </div>
          <div className="header-badge">
            <span className="badge badge--new">Novo Cadastro</span>
          </div>
        </div>
      </header>

      {submitSuccess && (
        <div className="toast toast--success">
          <span className="toast-icon">&#10003;</span>
          Fornecedor cadastrado com sucesso!
        </div>
      )}

      {errors.form && (
        <div className="toast toast--error">
          <span className="toast-icon">!</span>
          {errors.form}
        </div>
      )}

      <form className="novo-fornecedor__form" onSubmit={handleSubmit} noValidate>
        <nav className="section-nav">
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              className={`section-nav__item ${activeSection === index ? 'active' : ''} ${
                index < activeSection ? 'completed' : ''
              }`}
              onClick={() => setActiveSection(index)}
              disabled={isSubmitting}
            >
              <span className="section-nav__step">{index + 1}</span>
              <span className="section-nav__label">{section.label}</span>
            </button>
          ))}
        </nav>

        <div className="form-panel">
          {renderSectionContent()}
        </div>

        <div className="form-actions">
          <div className="form-actions__nav">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setActiveSection((prev) => Math.max(0, prev - 1))}
              disabled={activeSection === 0 || isSubmitting}
            >
              &#8592; Anterior
            </button>
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => setActiveSection((prev) => Math.min(sections.length - 1, prev + 1))}
              disabled={activeSection === sections.length - 1 || isSubmitting}
            >
              Próximo &#8594;
            </button>
          </div>

          <div className="form-actions__submit">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner" />
                  Cadastrando...
                </>
              ) : (
                'Cadastrar Fornecedor'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovoFornecedor;

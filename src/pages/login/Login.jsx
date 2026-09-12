import { useState } from 'react'
import { apiRequest } from '../../config/api'
import './Login.css'

const formularioInicial = {
  nome: '',
  email: '',
  senha: '',
  confirmarSenha: '',
}

function Login({ onLogin }) {
  const [modo, setModo] = useState('login') // 'login' | 'cadastro'
  const [formulario, setFormulario] = useState(formularioInicial)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((estadoAtual) => ({ ...estadoAtual, [name]: value }))
    setErro('')
    setSucesso('')
  }

  const alternarModo = (novoModo) => {
    setModo(novoModo)
    setErro('')
    setSucesso('')
  }

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    if (!formulario.email.trim() || !formulario.senha.trim()) {
      setErro('Informe seu e-mail e sua senha para acessar.')
      return
    }
    setCarregando(true)
    try {
      const resposta = await apiRequest('auth/login.php', {
        method: 'POST',
        body: JSON.stringify({
          email: formulario.email.trim(),
          senha: formulario.senha,
        }),
      })
      onLogin(resposta.usuario)
    } catch (error) {
      setErro(error.message || 'Não foi possível realizar o login.')
    } finally {
      setCarregando(false)
    }
  }

  const handleCadastroSubmit = async (event) => {
    event.preventDefault()
    const { nome, email, senha, confirmarSenha } = formulario

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      setErro('Preencha todos os campos do formulário.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve conter no mínimo 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas digitadas não conferem.')
      return
    }

    setCarregando(true)
    try {
      const resposta = await apiRequest('auth/cadastrar.php', {
        method: 'POST',
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          confirmar_senha: confirmarSenha,
        }),
      })

      if (resposta.sucesso && resposta.usuario) {
        onLogin(resposta.usuario)
      }
    } catch (error) {
      setErro(error.message || 'Não foi possível cadastrar o usuário.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-presentation">
        <div>
          <div className="login-brand">
            <span className="login-brand-mark" aria-hidden="true">G</span>
            <div><strong>GestãoFornecedores</strong><span>FRIGORÍFICO PORTAL</span></div>
          </div>
          <div className="login-introduction">
            <p className="login-kicker">Governança e transparência</p>
            <h1>Controle absoluto sobre sua cadeia de suprimentos.</h1>
            <p>Monitore a conformidade ambiental, consulte dados do CAR e certifique seus produtores e transportadores parceiros em um único ecossistema corporativo.</p>
          </div>
          <div className="login-highlights">
            <div><strong>100%</strong><span>Conformidade com CAR e órgãos ambientais</span></div>
            <div><strong>Ativo</strong><span>Monitoramento contínuo em tempo real</span></div>
          </div>
        </div>
        <p className="login-footer">GestãoFornecedores <span aria-hidden="true">•</span> Frigorífico Portal</p>
      </section>

      <section className="login-form-area" aria-labelledby="login-title">
        <div className="login-card">
          {modo === 'login' ? (
            <>
              <p className="login-kicker">Acesso seguro</p>
              <h2 id="login-title">Entrar na sua conta</h2>
              <p className="login-subtitle">Acesse o sistema de gestão de fornecedores.</p>
              <form onSubmit={handleLoginSubmit} noValidate>
                <label className="login-field">
                  E-mail
                  <input
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    autoComplete="email"
                  />
                </label>
                <label className="login-field">
                  Senha
                  <input
                    name="senha"
                    type="password"
                    value={formulario.senha}
                    onChange={handleChange}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                  />
                </label>
                <div className="login-options">
                  <label><input type="checkbox" />Lembrar-me</label>
                  <button type="button" onClick={() => setErro('A recuperação de senha será conectada posteriormente.')}>
                    Esqueceu sua senha?
                  </button>
                </div>
                {erro && <p className="login-error" role="alert">{erro}</p>}
                {sucesso && <p className="login-success" role="status">{sucesso}</p>}
                <button type="submit" className="login-submit" disabled={carregando}>
                  {carregando ? 'Entrando...' : 'Acessar'}
                </button>
                <div className="login-divider"><span>ou</span></div>
                <button
                  type="button"
                  className="login-register"
                  onClick={() => alternarModo('cadastro')}
                >
                  Criar conta
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="login-kicker">Novo cadastro</p>
              <h2 id="login-title">Criar nova conta</h2>
              <p className="login-subtitle">Preencha seus dados para acessar o sistema.</p>
              <form onSubmit={handleCadastroSubmit} noValidate>
                <label className="login-field">
                  Nome Completo
                  <input
                    name="nome"
                    type="text"
                    value={formulario.nome}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                    autoComplete="name"
                  />
                </label>
                <label className="login-field">
                  E-mail
                  <input
                    name="email"
                    type="email"
                    value={formulario.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    autoComplete="email"
                  />
                </label>
                <label className="login-field">
                  Senha (mínimo 6 caracteres)
                  <input
                    name="senha"
                    type="password"
                    value={formulario.senha}
                    onChange={handleChange}
                    placeholder="Crie uma senha forte"
                    autoComplete="new-password"
                  />
                </label>
                <label className="login-field">
                  Confirmar Senha
                  <input
                    name="confirmarSenha"
                    type="password"
                    value={formulario.confirmarSenha}
                    onChange={handleChange}
                    placeholder="Repita sua senha"
                    autoComplete="new-password"
                  />
                </label>
                {erro && <p className="login-error" role="alert">{erro}</p>}
                {sucesso && <p className="login-success" role="status">{sucesso}</p>}
                <button type="submit" className="login-submit" disabled={carregando}>
                  {carregando ? 'Cadastrando...' : 'Criar minha conta'}
                </button>
                <div className="login-divider"><span>ou</span></div>
                <button
                  type="button"
                  className="login-register"
                  onClick={() => alternarModo('login')}
                >
                  Já tenho uma conta (Entrar)
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Login

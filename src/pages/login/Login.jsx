import { useState } from 'react'
import './Login.css'

const formularioInicial = { email: '', senha: '' }

function Login({ onLogin }) {
  const [formulario, setFormulario] = useState(formularioInicial)
  const [erro, setErro] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((estadoAtual) => ({ ...estadoAtual, [name]: value }))
    setErro('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formulario.email.trim() || !formulario.senha.trim()) {
      setErro('Informe seu e-mail e sua senha para acessar.')
      return
    }
    onLogin()
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
          <div className="login-highlights"><div><strong>100%</strong><span>Conformidade com CAR e órgãos ambientais</span></div><div><strong>Ativo</strong><span>Monitoramento contínuo em tempo real</span></div></div>
        </div>
        <p className="login-footer">GestãoFornecedores <span aria-hidden="true">•</span> Frigorífico Portal</p>
      </section>

      <section className="login-form-area" aria-labelledby="login-title">
        <div className="login-card">
          <p className="login-kicker">Acesso seguro</p>
          <h2 id="login-title">Entrar na sua conta</h2>
          <p className="login-subtitle">Acesse o sistema de gestão de fornecedores.</p>
          <form onSubmit={handleSubmit} noValidate>
            <label className="login-field">E-mail<input name="email" type="email" value={formulario.email} onChange={handleChange} placeholder="seu@email.com" autoComplete="email" /></label>
            <label className="login-field">Senha<input name="senha" type="password" value={formulario.senha} onChange={handleChange} placeholder="Sua senha" autoComplete="current-password" /></label>
            <div className="login-options"><label><input type="checkbox" />Lembrar-me</label><button type="button" onClick={() => setErro('A recuperação de senha será conectada posteriormente.')}>Esqueceu sua senha?</button></div>
            {erro && <p className="login-error" role="alert">{erro}</p>}
            <button type="submit" className="login-submit">Acessar</button>
            <div className="login-divider"><span>ou</span></div>
            <button type="button" className="login-register" onClick={() => setErro('O cadastro de usuário será disponibilizado posteriormente.')}>Criar conta</button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login

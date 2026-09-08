import {useState} from 'react'
import { Link } from 'react-router-dom'
import './style.scss'
import Logo from '../../assets/logoFolhaVerde.svg'

function Register() {

  console.log('Página REGISTER (Cadastro) renderizada')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erroSenha, setErroSenha] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (senha !== confirmarSenha) {
      setErroSenha('As senhas não coincidem!')
      return
    }

    setErroSenha('')
    console.log('Cadastro realizado com sucesso!')
  }

  return (
    <div className='container'>
      {/*lado esquerdo - apresentação da empresa*/}
      <div className='secao-esquerda'>
        <div className='brand'>
          <img src={Logo} alt='Logo' className = 'logo'/>
          <h1 className='nomeEmpresa'> GestãoFornecedores </h1>
          <h2 className='subtituloEmpresa'>FRIGORÍFICO PORTAL</h2>
        </div>

        <div className='sinopse'>
          <h3>Comece a certificar seus parceiros comerciais hoje.</h3>
          <p>
              Cadastre-se na plataforma do Frigorífico Portal para iniciar
              os fluxos de homologação ambiental de seus fornecedores de gado 
              e parceiros logísticos.
          </p>

        </div>

        <div className='stats'>
          <div className='stat-item'>
            <span className='stat-number'>100%</span>
            <span className='stat-label'>Conformidade com CAR e órgãos
              ambientais
            </span>
          </div>
          <div className='stat-item'>
            <span className='stat-number'>Ativo</span>
            <span className='stat-label'>Monitoramento de prontidão
            </span>
          </div>
        </div>

        <footer className='footer'>
          <p>© 2024 GestãoFornecedores. Frigorífico Portal.</p>
        </footer>
      </div>

      {/* LADO DIREITO - Formulário de Login. */}

      <div className='secao-direita'>
        <div className='cadastro-container'>
          <h2> Crie sua conta </h2>
          <p className='subtitulo-cadastro'>
            Preencha os dados para acessar o sistema.
          </p>


          <form onSubmit={handleSubmit}>

            <div className='form-group'>
              <label>Nome Completo</label>
              <input
                type='text'
                placeholder='Ex.: João Pereira' />
            </div>

            <div className='form-group'>
              <label>E-mail</label>
              <input
                type='email'
                placeholder='seu@email.com' />

            </div>

            <div className='form-group'>
              <label>Senha</label>
              <input
                type='password'
                placeholder='********'
                value={senha}
                onChange={(e) => setSenha(e.target.value)} />

            </div>


            <div className='form-group'>
              <label>Confirmar Senha</label>
              <input
                type='password'
                placeholder='********'
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}/>

              {erroSenha && (
                <span className='error-message'>{erroSenha}</span>
              )}
            </div>

            <div className='opcoes-formulario'>
              <label className='checkbox-label'>
                <input type='checkbox' /> Li e aceito os Termos de Uso e Política de Privacidade

              </label>

            </div>

            <button type='submit' className='botaoCriarConta'>Criar conta e Acessar

            </button>

            <div className='login-link'>
              <p>Já tem uma conta?</p>
              <Link to='/' className='botaoEntrar'>
                Entrar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

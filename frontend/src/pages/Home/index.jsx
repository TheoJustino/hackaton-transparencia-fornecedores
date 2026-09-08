import {Link} from 'react-router-dom'
import './style.scss'
import Logo from '../../assets/logoFolhaVerde.svg'

function Home() {
  console.log('Página Home (Login) renderizada')

  return (
      <div className = 'container'>
        {/*lado esquerdo - apresentação da empresa*/}
      <div className='secao-esquerda'>
        <div className='brand'>
          <h1 className='nomeEmpresa'> GestãoFornecedores </h1>
          <h2 className='subtituloEmpresa'>FRIGORÍFICO PORTAL</h2>
        </div>

        <div className='sinopse'>
          <h3>Controle absoluto sobre sua cadeia de suprimentos.</h3>
          <p>
            Monitore a conformidade ambiental, consulte dados do CAR e
            certifique seus produtores e transportadores parceiros em
            um único ecossistema corporativo.
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
            <span className='stat-label'>Monitoramento contínuo em tempo
              real
              </span>
          </div>
        </div>

        <footer className='footer'>
          <p>© 2024 GestãoFornecedores. Frigorífico Portal.</p>
        </footer>
        </div>

        {/* LADO DIREITO - Formulário de Login. */}

        <div className='secao-direita'>
          <div className='login-container'>
            <h2> Entrar na sua conta </h2>
            <p className='subtituloLogin'>Acesse o sistema de 
              gestão de fornecedores
            </p>
    

            <form>
              <div className='form-group'>
                <label>E-mail</label>
                <input
                  type='email'
                  placeholder='seu@email.com'
                  defaultValue='seu@email.com'/>
                  
                </div>

                <div className='form-group'>
                  <label>Senha</label>
                  <input 
                    type='password'
                    placeholder='******'
                    defaultValue='******'/>
                </div>

                <div className='opcoes-formulario'>
                  <label className='checkbox-label'>
                      <input type='checkbox' /> Lembrar-me

                  </label>
                  <a href='#' className='esqueciASenha'>Esqueceu sua senha?
                  </a>


                </div>

                <button type='submit' className='botao-login'>Acessar

                </button>

                <div className='divisor'>
                  <span>ou</span>
                </div>

                  <Link to='/register' className='criarContaBotao'>
                  Criar conta
                  </Link>
              
            </form>
          </div>
        </div>
        </div>
  )
}

export default Home

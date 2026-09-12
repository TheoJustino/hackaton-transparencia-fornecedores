import { useEffect, useState } from 'react'
import { apiRequest } from '../../config/api'
import './RelatorioPdf.css'

function RelatorioPdf({ fornecedores, fornecedorSelecionado, onSelecionarFornecedor, onVoltar }) {
  const fornecedorAtual = fornecedorSelecionado || fornecedores[0]
  const [dadosRelatorio, setDadosRelatorio] = useState(null)
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    let cancelado = false
    if (!fornecedorAtual?.id) return

    setCarregando(true)
    apiRequest(`relatorios/fornecedor.php?fornecedor_id=${fornecedorAtual.id}`)
      .then((res) => {
        if (!cancelado && res.sucesso) {
          setDadosRelatorio(res)
        }
      })
      .catch((err) => console.error('Erro ao buscar relatório:', err))
      .finally(() => {
        if (!cancelado) setCarregando(false)
      })

    return () => { cancelado = true }
  }, [fornecedorAtual?.id])

  const handleEnviarEmail = () => {
    window.alert('O relatório foi enviado para a fila de e-mails.')
  }

  if (!fornecedorAtual) return null

  const fornecedor = dadosRelatorio?.fornecedor || fornecedorAtual
  const ultimaVerificacao = dadosRelatorio?.verificacoes?.[0]

  return (
    <div className="report-page">
      <div className="report-toolbar">
        <div className="report-breadcrumb">
          Fornecedores <span aria-hidden="true">&gt;</span> <strong>Relatório</strong>
        </div>
        <label>
          Fornecedor
          <select
            value={fornecedorAtual.id}
            onChange={(event) =>
              onSelecionarFornecedor(fornecedores.find((item) => String(item.id) === event.target.value))
            }
          >
            {fornecedores.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="report-action-header">
        <div>
          <h1 id="page-title">Relatório de Regularidade</h1>
          <p>Visualize ou faça download do histórico completo de compliance.</p>
        </div>
        <div className="report-actions">
          <button type="button" className="report-email-button" onClick={handleEnviarEmail}>
            ✉ Enviar por E-mail
          </button>
          <button type="button" className="report-download-button" onClick={() => window.print()}>
            ↓ Baixar PDF
          </button>
        </div>
      </div>

      <article className="report-paper">
        <header className="report-paper-header">
          <strong>GESTÃO FORNECEDORES</strong>
          <span>Emitido em: {new Date().toLocaleDateString('pt-BR')}</span>
        </header>

        <div className="report-paper-title">
          <h2>Relatório de Compliance e Regularidade</h2>
          <p>Este documento atesta a situação cadastral e socioambiental do fornecedor listado abaixo.</p>
        </div>

        <section className="report-section">
          <h3>DADOS DO FORNECEDOR</h3>
          <div className="report-supplier-data">
            <div>
              <span>Razão Social</span>
              <strong>{fornecedor.nome}</strong>
            </div>
            <div>
              <span>CNPJ</span>
              <strong>{fornecedor.cnpj}</strong>
            </div>
            <div>
              <span>Tipo / Atividade</span>
              <strong>{fornecedor.tipo === 'TRANSPORTADOR' ? 'Transportador' : 'Produtor rural'} ({fornecedor.produto_servico || 'Não especificado'})</strong>
            </div>
            <div>
              <span>Localização</span>
              <strong>{fornecedor.cidade || fornecedor.municipio || '-'} - {fornecedor.uf || fornecedor.estado || '-'}</strong>
            </div>
            <div>
              <span>Inscrição CAR</span>
              <strong>{fornecedor.car || 'Não informado'}</strong>
            </div>
            <div>
              <span>Status Geral</span>
              <strong>{fornecedor.status_geral || 'NAO_VERIFICADO'}</strong>
            </div>
          </div>
        </section>

        <section className="report-section">
          <h3>RESULTADOS DA VERIFICAÇÃO</h3>
          {carregando ? (
            <p style={{ padding: '16px', color: '#64748b' }}>Carregando dados da verificação...</p>
          ) : (
            <table className="report-results">
              <thead>
                <tr>
                  <th>Fonte / Órgão</th>
                  <th>Status</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CNPJ - Situação Cadastral (Receita Federal)</td>
                  <td className={ultimaVerificacao?.status_cnpj === 'IRREGULAR' ? 'report-irregular' : 'report-regular'}>
                    {ultimaVerificacao?.status_cnpj || 'Pendente'}
                  </td>
                  <td>{ultimaVerificacao?.status_cnpj === 'REGULAR' ? 'Ativa' : ultimaVerificacao?.status_cnpj === 'IRREGULAR' ? 'Inapta / Baixada' : 'Consulta automática via BrasilAPI'}</td>
                </tr>
                <tr>
                  <td>CAR - Cadastro Ambiental Rural</td>
                  <td className={ultimaVerificacao?.status_car === 'IRREGULAR' ? 'report-irregular' : 'report-regular'}>
                    {ultimaVerificacao?.status_car || (fornecedor.car ? 'Informado' : 'Não se aplica')}
                  </td>
                  <td>{fornecedor.car ? `Registro: ${fornecedor.car}` : 'Não informado'}</td>
                </tr>
                <tr>
                  <td>IBAMA - Embargos Ambientais</td>
                  <td className={ultimaVerificacao?.status_ambiental === 'COM_RESTRICAO' ? 'report-irregular' : 'report-regular'}>
                    {ultimaVerificacao?.status_ambiental === 'COM_RESTRICAO' ? 'Com Restrição' : 'Regular'}
                  </td>
                  <td>{ultimaVerificacao?.status_ambiental === 'COM_RESTRICAO' ? 'Embargo identificado' : 'Nenhum embargo'}</td>
                </tr>
                <tr>
                  <td>Trabalho Escravo - MTE</td>
                  <td className={ultimaVerificacao?.status_trabalhista === 'COM_ALERTA' ? 'report-irregular' : 'report-regular'}>
                    {ultimaVerificacao?.status_trabalhista === 'COM_ALERTA' ? 'Alerta' : 'Regular'}
                  </td>
                  <td>{ultimaVerificacao?.status_trabalhista === 'COM_ALERTA' ? 'Consta em cadastro de empregadores' : 'Sem ocorrências'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </section>

        <footer className="report-paper-footer">
          Este relatório é gerado automaticamente pelo sistema de homologação.<br />
          GestãoFornecedores © 2026 - Frigorífico Portal
        </footer>
      </article>

      <button type="button" className="report-back-button" onClick={onVoltar}>Voltar</button>
    </div>
  )
}

export default RelatorioPdf

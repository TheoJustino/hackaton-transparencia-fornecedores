<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../funcoes/esg.php';

exigirMetodo(['POST']);
$usuarioId = exigirAutenticado();
$dados = lerJson();
$fornecedorId = filter_var($dados['fornecedor_id'] ?? $dados['id'] ?? null, FILTER_VALIDATE_INT);
if (!$fornecedorId) responder(['sucesso' => false, 'mensagem' => 'ID do fornecedor não informado.'], 400);

$stmt = $pdo->prepare('SELECT id, nome, cnpj, car, ativo FROM fornecedores WHERE id = :id');
$stmt->execute([':id' => $fornecedorId]);
$fornecedor = $stmt->fetch();
if (!$fornecedor) responder(['sucesso' => false, 'mensagem' => 'Fornecedor não encontrado.'], 404);

$statusCnpj = 'PENDENTE';
$cnpjLimpo = limparDocumento($fornecedor['cnpj']);
if ($cnpjLimpo !== '') {
    $url = "https://brasilapi.com.br/api/cnpj/v1/{$cnpjLimpo}";
    $contexto = stream_context_create(['http' => ['timeout' => 10]]);
    $resposta = @file_get_contents($url, false, $contexto);
    if ($resposta !== false) {
        $dadosCnpj = json_decode($resposta, true);
        $statusCnpj = ($dadosCnpj['descricao_situacao_cadastral'] ?? '') === 'ATIVA' ? 'REGULAR' : 'IRREGULAR';
    }
}

$statusCar = $fornecedor['car'] ? 'PENDENTE' : 'NAO_SE_APLICA';
$statusAmbiental = $dados['status_ambiental'] ?? 'PENDENTE';
$statusTrabalhista = $dados['status_trabalhista'] ?? 'PENDENTE';
$resultadoGeral = calcularResultadoGeral($statusCnpj, $statusCar, $statusAmbiental, $statusTrabalhista);

try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare('INSERT INTO verificacoes (fornecedor_id, usuario_id, status_cnpj, status_car, status_ambiental, status_trabalhista, resultado_geral, observacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([$fornecedorId, $usuarioId, $statusCnpj, $statusCar, $statusAmbiental, $statusTrabalhista, $resultadoGeral, 'Verificação automática de CNPJ via BrasilAPI.']);
    $stmt = $pdo->prepare('UPDATE fornecedores SET status_geral = :status WHERE id = :id');
    $stmt->execute([':status' => $resultadoGeral, ':id' => $fornecedorId]);
    $stmt = $pdo->prepare('INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, detalhes) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([$usuarioId, 'VERIFICACAO_COMPLIANCE', 'fornecedores', $fornecedorId, "Resultado: {$resultadoGeral}"]);
    $pdo->commit();
    responder(['sucesso' => true, 'fornecedor' => $fornecedor['nome'], 'status_cnpj' => $statusCnpj, 'status_car' => $statusCar, 'status_ambiental' => $statusAmbiental, 'status_trabalhista' => $statusTrabalhista, 'resultado_geral' => $resultadoGeral]);
} catch (PDOException $erro) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    responder(['sucesso' => false, 'mensagem' => 'Erro ao salvar a verificação.'], 500);
}

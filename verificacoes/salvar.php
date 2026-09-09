<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../funcoes/esg.php';

$fornecedorId = $_GET['id'] ?? null;
if (!$fornecedorId) {
    http_response_code(400);
    echo json_encode(['ID do fornecedor não informado']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, nome, cnpj, car, ativo FROM fornecedores WHERE id = :id');
$stmt->execute(['id' => $fornecedorId]);
$fornecedor = $stmt->fetch();

if (!$fornecedor) {
    http_response_code(404);
    echo json_encode(['Fornecedor não encontrado']);
    exit;
}

$cnpjLimpo = preg_replace('/\D/', '', $fornecedor['cnpj']);

$url = "https://brasilapi.com.br/api/cnpj/v1/{$cnpjLimpo}";
$contexto = stream_context_create(['http' => ['timeout' => 10]]);
$resposta = @file_get_contents($url, false, $contexto);

if ($resposta !== false) {
    $dadosCnpj = json_decode($resposta, true);

    if (isset($dadosCnpj['descricao_situacao_cadastral'])) {
        $statusCnpj = ($dadosCnpj['descricao_situacao_cadastral'] === 'ATIVA')
            ? 'REGULAR'
            : 'IRREGULAR';
    } else {
        $statusCnpj = 'PENDENTE';
    }
} else {
    $statusCnpj = 'PENDENTE';
}

$statusCar = $fornecedor['car'] ? 'PENDENTE' : 'NAO_SE_APLICA';
$statusAmbiental = 'PENDENTE';
$statusTrabalhista = 'PENDENTE';

$resultadoGeral = calcularResultadoGeral(
    $statusCnpj,
    $statusCar,
    $statusAmbiental,
    $statusTrabalhista
);

if ($statusCnpj === 'IRREGULAR') {
    $resultadoGeral = 'IRREGULAR';
} elseif ($statusCnpj === 'PENDENTE' || $statusCar === 'PENDENTE') {
    $resultadoGeral = 'ATENCAO';
} else {
    $resultadoGeral = 'REGULAR';
}

$usuarioId = 1;

// Módulo 9/11 - grava histórico da verificação
$stmtInsere = $pdo->prepare('
    INSERT INTO verificacoes 
        (fornecedor_id, usuario_id, status_cnpj, status_car, status_ambiental, status_trabalhista, resultado_geral, observacao)
    VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?)
');

$stmtInsere->execute([
    $fornecedorId,
    $usuarioId,
    $statusCnpj,
    'PENDENTE',
    'PENDENTE',
    'PENDENTE',
    $statusCnpj === 'REGULAR' ? 'REGULAR' : 'IRREGULAR',
    'Verificação automática de CNPJ via BrasilAPI'
]);

// Módulo 12 - registra na auditoria
$stmtAuditoria = $pdo->prepare('
    INSERT INTO auditoria 
        (usuario_id, acao, entidade, entidade_id, detalhes)
    VALUES 
        (?, ?, ?, ?, ?)
');

$stmtAuditoria->execute([
    $usuarioId,
    'VERIFICACAO_CNPJ',
    'fornecedor',
    $fornecedorId,
    "CNPJ verificado via BrasilAPI, resultado: {$statusCnpj}"
]);

// >>> BLOCO NOVO: atualiza o status_geral do fornecedor <<<
$stmtAtualiza = $pdo->prepare('UPDATE fornecedores SET status_geral = ? WHERE id = ?');
$stmtAtualiza->execute([$resultadoGeral, $fornecedorId]);
// >>> FIM DO BLOCO NOVO <<<

echo json_encode([
    'sucesso' => true,
    'fornecedor' => $fornecedor['nome'],
    'status_cnpj' => $statusCnpj,
    'status_car' => $statusCar,
    'resultado_geral' => $resultadoGeral
]);
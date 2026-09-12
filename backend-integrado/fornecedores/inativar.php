<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['POST', 'PUT']);
$usuarioId = exigirAutenticado();
$dados = lerJson();
$id = filter_var($dados['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) responder(['sucesso' => false, 'mensagem' => 'ID inválido.'], 400);

try {
    $stmt = $pdo->prepare('UPDATE fornecedores SET ativo = 0 WHERE id = :id AND ativo = 1');
    $stmt->execute([':id' => $id]);
    if ($stmt->rowCount() === 0) responder(['sucesso' => false, 'mensagem' => 'Fornecedor não encontrado ou já inativo.'], 404);
    $auditoria = $pdo->prepare('INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, detalhes) VALUES (?, ?, ?, ?, ?)');
    $auditoria->execute([$usuarioId, 'INATIVACAO_FORNECEDOR', 'fornecedores', $id, 'Fornecedor inativado logicamente.']);
    responder(['sucesso' => true, 'mensagem' => 'Fornecedor inativado com sucesso.']);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao inativar fornecedor.'], 500);
}

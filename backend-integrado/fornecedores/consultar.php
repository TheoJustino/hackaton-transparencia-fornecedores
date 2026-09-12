<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['GET']);
$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) responder(['sucesso' => false, 'mensagem' => 'ID inválido.'], 400);

try {
    $stmt = $pdo->prepare('SELECT id, nome, cnpj, tipo, produto_servico, car, cidade, uf, status_geral, ativo, criado_em, atualizado_em FROM fornecedores WHERE id = :id');
    $stmt->execute([':id' => $id]);
    $fornecedor = $stmt->fetch();
    if (!$fornecedor) responder(['sucesso' => false, 'mensagem' => 'Fornecedor não encontrado.'], 404);

    $stmtAudit = $pdo->prepare('SELECT a.id, a.acao, a.detalhes, a.criado_em, u.nome as usuario_nome FROM auditoria a LEFT JOIN usuarios u ON u.id = a.usuario_id WHERE a.entidade = "fornecedores" AND a.entidade_id = :id ORDER BY a.criado_em DESC, a.id DESC');
    $stmtAudit->execute([':id' => $id]);
    $historico = $stmtAudit->fetchAll();

    responder(['sucesso' => true, 'dados' => $fornecedor, 'historico' => $historico]);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao buscar fornecedor.'], 500);
}

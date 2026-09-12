<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['GET']);
$fornecedorId = filter_var($_GET['fornecedor_id'] ?? $_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$fornecedorId) responder(['sucesso' => false, 'mensagem' => 'ID do fornecedor não informado.'], 400);

try {
    $stmt = $pdo->prepare('SELECT id, nome, cnpj, tipo, produto_servico, car, cidade, uf, status_geral, ativo, criado_em, atualizado_em FROM fornecedores WHERE id = :id');
    $stmt->execute([':id' => $fornecedorId]);
    $fornecedor = $stmt->fetch();
    if (!$fornecedor) responder(['sucesso' => false, 'mensagem' => 'Fornecedor não encontrado.'], 404);

    $stmt = $pdo->prepare('SELECT id, status_cnpj, status_car, status_ambiental, status_trabalhista, resultado_geral, observacao, criado_em FROM verificacoes WHERE fornecedor_id = :id ORDER BY criado_em DESC, id DESC');
    $stmt->execute([':id' => $fornecedorId]);
    responder(['sucesso' => true, 'fornecedor' => $fornecedor, 'verificacoes' => $stmt->fetchAll()]);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao montar o relatório.'], 500);
}

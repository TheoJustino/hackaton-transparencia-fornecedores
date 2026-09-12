<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['GET']);

try {
    $incluirInativos = filter_var($_GET['incluir_inativos'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $sql = 'SELECT id, nome, cnpj, tipo, produto_servico, car, cidade, uf, status_geral, ativo, criado_em, atualizado_em FROM fornecedores';
    if (!$incluirInativos) $sql .= ' WHERE ativo = 1';
    $sql .= ' ORDER BY nome ASC';

    $fornecedores = $pdo->query($sql)->fetchAll();
    responder(['sucesso' => true, 'total' => count($fornecedores), 'dados' => $fornecedores]);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao buscar fornecedores.'], 500);
}

<?php
require_once __DIR__ . '/config/bootstrap.php';
require_once __DIR__ . '/config/conexao.php';

exigirMetodo(['GET']);

try {
    $sql = 'SELECT COUNT(*) total, SUM(status_geral = "REGULAR") regulares, SUM(status_geral = "ATENCAO") atencao, SUM(status_geral = "IRREGULAR") irregulares, SUM(ativo = 1) ativos, SUM(ativo = 0) inativos FROM fornecedores';
    $resumo = $pdo->query($sql)->fetch();
    $total = (int) ($resumo['total'] ?? 0);
    $ativos = (int) ($resumo['ativos'] ?? 0);
    $fornecedores = $pdo->query('SELECT id, nome, cnpj, tipo, cidade, uf, status_geral, ativo FROM fornecedores WHERE ativo = 1 ORDER BY nome ASC')->fetchAll();
    responder(['sucesso' => true, 'resumo' => ['total' => $total, 'ativos' => $ativos, 'inativos' => (int) ($resumo['inativos'] ?? 0), 'regulares' => (int) ($resumo['regulares'] ?? 0), 'atencao' => (int) ($resumo['atencao'] ?? 0), 'irregulares' => (int) ($resumo['irregulares'] ?? 0)], 'fornecedores' => $fornecedores]);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao buscar indicadores.'], 500);
}

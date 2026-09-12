<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['GET']);
$fornecedorId = filter_var($_GET['fornecedor_id'] ?? $_GET['id'] ?? null, FILTER_VALIDATE_INT);
if (!$fornecedorId) responder(['sucesso' => false, 'mensagem' => 'ID do fornecedor não informado.'], 400);

try {
    $stmt = $pdo->prepare('SELECT v.*, f.nome, f.cnpj, f.car, f.cidade, f.uf FROM verificacoes v INNER JOIN fornecedores f ON f.id = v.fornecedor_id WHERE v.fornecedor_id = :id ORDER BY v.criado_em DESC, v.id DESC LIMIT 1');
    $stmt->execute([':id' => $fornecedorId]);
    $verificacao = $stmt->fetch();
    if (!$verificacao) responder(['sucesso' => false, 'mensagem' => 'Nenhuma verificação encontrada.'], 404);
    responder(['sucesso' => true, 'dados' => $verificacao]);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao buscar a verificação.'], 500);
}

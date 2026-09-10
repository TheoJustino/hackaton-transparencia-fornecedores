<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/conexao.php';

try {
    $sql = "
        SELECT
            id,
            nome,
            cnpj,
            tipo,
            produto_servico,
            car,
            cidade,
            uf,
            status_geral,
            ativo,
            criado_em,
            atualizado_em
        FROM fornecedores
        WHERE ativo = TRUE
        ORDER BY nome ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $fornecedores = $stmt->fetchAll();

    echo json_encode([
        'sucesso' => true,
        'total' => count($fornecedores),
        'dados' => $fornecedores
    ]);

} catch (PDOException $erro) {
    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao buscar fornecedores.'
    ]);
}
<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once '../config/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Método não permitido.'
    ]);

    exit;
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'ID do fornecedor inválido.'
    ]);

    exit;
}

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
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $id
    ]);

    $fornecedor = $stmt->fetch();

    if (!$fornecedor) {
        http_response_code(404);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Fornecedor não encontrado.'
        ]);

        exit;
    }

    echo json_encode([
        'sucesso' => true,
        'dados' => $fornecedor
    ]);

} catch (PDOException $erro) {

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao buscar fornecedor.'
    ]);
}
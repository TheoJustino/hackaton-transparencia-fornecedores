<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/conexao.php';

if (!in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT'])) {
    http_response_code(405);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Método não permitido.'
    ]);

    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$id = filter_var($dados['id'] ?? null, FILTER_VALIDATE_INT);

if (!$id) {
    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'ID inválido.'
    ]);

    exit;
}

try {

    $sql = "
        UPDATE fornecedores
        SET ativo = FALSE
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':id' => $id
    ]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Fornecedor não encontrado ou já inativo.'
        ]);

        exit;
    }

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Fornecedor inativado com sucesso.'
    ]);

} catch (PDOException $erro) {

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao inativar fornecedor.'
    ]);
}
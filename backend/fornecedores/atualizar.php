<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/conexao.php';

if (!in_array($_SERVER['REQUEST_METHOD'], ['PUT', 'POST'])) {
    http_response_code(405);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Método não permitido.'
    ]);

    exit;
}

$dados = json_decode(file_get_contents('php://input'), true);

$id = filter_var($dados['id'] ?? null, FILTER_VALIDATE_INT);

$nome = trim($dados['nome'] ?? '');
$cnpj = trim($dados['cnpj'] ?? '');
$tipo = trim($dados['tipo'] ?? '');
$produto_servico = trim($dados['produto_servico'] ?? '');
$car = isset($dados['car']) ? trim($dados['car']) : null;
$cidade = trim($dados['cidade'] ?? '');
$uf = strtoupper(trim($dados['uf'] ?? ''));

if (!$id) {
    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'ID inválido.'
    ]);

    exit;
}

if (
    $nome === '' ||
    $cnpj === '' ||
    $tipo === '' ||
    $produto_servico === '' ||
    $cidade === '' ||
    $uf === ''
) {
    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Preencha todos os campos obrigatórios.'
    ]);

    exit;
}

if (!in_array($tipo, ['PRODUTOR', 'TRANSPORTADOR'])) {
    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Tipo inválido.'
    ]);

    exit;
}

if ($tipo === 'TRANSPORTADOR') {
    $car = null;
}

try {

    $sql = "
        UPDATE fornecedores
        SET
            nome = :nome,
            cnpj = :cnpj,
            tipo = :tipo,
            produto_servico = :produto_servico,
            car = :car,
            cidade = :cidade,
            uf = :uf
        WHERE id = :id
    ";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':nome' => $nome,
        ':cnpj' => $cnpj,
        ':tipo' => $tipo,
        ':produto_servico' => $produto_servico,
        ':car' => $car,
        ':cidade' => $cidade,
        ':uf' => $uf,
        ':id' => $id
    ]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Fornecedor atualizado com sucesso.'
    ]);

} catch (PDOException $erro) {

    if ($erro->getCode() === '23000') {
        http_response_code(409);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Já existe outro fornecedor com esse CNPJ.'
        ]);

        exit;
    }

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao atualizar fornecedor.'
    ]);
}
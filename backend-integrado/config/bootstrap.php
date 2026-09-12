<?php

session_start();

$origensPermitidas = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];
$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origem, $origensPermitidas, true)) {
    header("Access-Control-Allow-Origin: {$origem}");
    header('Access-Control-Allow-Credentials: true');
}
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function responder(array $dados, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function lerJson(): array
{
    $dados = json_decode(file_get_contents('php://input'), true);
    return is_array($dados) ? $dados : [];
}

function exigirMetodo(array $metodos): void
{
    if (!in_array($_SERVER['REQUEST_METHOD'], $metodos, true)) {
        responder(['sucesso' => false, 'mensagem' => 'Método não permitido.'], 405);
    }
}

function exigirAutenticado(): int
{
    if (empty($_SESSION['usuario_id'])) {
        responder(['sucesso' => false, 'mensagem' => 'Usuário não autenticado.'], 401);
    }

    return (int) $_SESSION['usuario_id'];
}

function limparDocumento(string $valor): string
{
    return preg_replace('/\D/', '', $valor);
}

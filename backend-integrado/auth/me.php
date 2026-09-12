<?php
require_once __DIR__ . '/../config/bootstrap.php';

exigirMetodo(['GET']);
if (empty($_SESSION['usuario_id'])) responder(['sucesso' => false, 'mensagem' => 'Usuário não autenticado.'], 401);

responder([
    'sucesso' => true,
    'usuario' => [
        'id' => (int) $_SESSION['usuario_id'],
        'nome' => $_SESSION['usuario_nome'] ?? '',
        'email' => $_SESSION['usuario_email'] ?? '',
    ],
]);

<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['POST']);
$dados = lerJson();
$email = trim($dados['email'] ?? '');
$senha = (string) ($dados['senha'] ?? '');

if ($email === '' || $senha === '') responder(['sucesso' => false, 'mensagem' => 'Informe e-mail e senha.'], 400);

try {
    $stmt = $pdo->prepare('SELECT id, nome, email, senha_hash, ativo FROM usuarios WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $usuario = $stmt->fetch();

    if (!$usuario || !(bool) $usuario['ativo'] || !password_verify($senha, $usuario['senha_hash'])) {
        responder(['sucesso' => false, 'mensagem' => 'E-mail ou senha inválidos.'], 401);
    }

    session_regenerate_id(true);
    $_SESSION['usuario_id'] = (int) $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];
    $_SESSION['usuario_email'] = $usuario['email'];

    responder([
        'sucesso' => true,
        'usuario' => [
            'id' => (int) $usuario['id'],
            'nome' => $usuario['nome'],
            'email' => $usuario['email'],
        ],
    ]);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao realizar login.'], 500);
}

<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['POST']);
$dados = lerJson();

$nome = trim($dados['nome'] ?? '');
$email = strtolower(trim($dados['email'] ?? ''));
$senha = (string) ($dados['senha'] ?? '');
$confirmarSenha = (string) ($dados['confirmar_senha'] ?? $dados['confirmarSenha'] ?? '');

if ($nome === '' || $email === '' || $senha === '') {
    responder(['sucesso' => false, 'mensagem' => 'Preencha todos os campos obrigatórios.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(['sucesso' => false, 'mensagem' => 'Formato de e-mail inválido.'], 400);
}

if (strlen($senha) < 6) {
    responder(['sucesso' => false, 'mensagem' => 'A senha deve conter no mínimo 6 caracteres.'], 400);
}

if ($confirmarSenha !== '' && $senha !== $confirmarSenha) {
    responder(['sucesso' => false, 'mensagem' => 'As senhas informadas não conferem.'], 400);
}

try {
    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        responder(['sucesso' => false, 'mensagem' => 'Já existe um usuário cadastrado com este e-mail.'], 409);
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
    $stmtInsert = $pdo->prepare('INSERT INTO usuarios (nome, email, senha_hash, ativo) VALUES (:nome, :email, :senha_hash, 1)');
    $stmtInsert->execute([
        ':nome' => $nome,
        ':email' => $email,
        ':senha_hash' => $senhaHash,
    ]);

    $novoId = (int) $pdo->lastInsertId();

    try {
        $auditoria = $pdo->prepare('INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, detalhes) VALUES (?, ?, ?, ?, ?)');
        $auditoria->execute([$novoId, 'CADASTRO_USUARIO', 'usuarios', $novoId, "Usuário {$nome} ({$email}) cadastrado com sucesso."]);
    } catch (Exception $e) {
        // Auditoria opcional em caso de restrição
    }

    session_regenerate_id(true);
    $_SESSION['usuario_id'] = $novoId;
    $_SESSION['usuario_nome'] = $nome;
    $_SESSION['usuario_email'] = $email;

    responder([
        'sucesso' => true,
        'mensagem' => 'Usuário cadastrado com sucesso.',
        'usuario' => [
            'id' => $novoId,
            'nome' => $nome,
            'email' => $email,
        ],
    ], 201);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => 'Erro ao cadastrar usuário: ' . $erro->getMessage()], 500);
}

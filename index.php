<?php
session_start();

require_once __DIR__ . '/config/conexao.php';

$erro = '';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = trim($_POST['email'] ?? '');
    $senha = trim($_POST['senha'] ?? '');

    if(empty($email) || empty($senha)){
        $erro = 'Preencha e-mail e senha';
    } else{
        $stmt = $pdo -> prepare ('SELECT id, nome, senha_hash, ativo FROM usuarios WHERE email = ?');
        $stmt -> execute([$email]);
        $usuario = $stmt -> fetch();

        if(!$usuario){
            $erro = 'E-mail ou senha inválidos.';
        } elseif (!$usuario['ativo']){
            $erro = 'Este usuário esta inativo.';
        } elseif (!password_verify($senha, $usuario['senha_hash'])) {
            $erro = 'E-mail ou senha inválidos.';
        }else{
            //Login correto: guarda os dados
            $_SESSION['usuario_id'] = $usuario['id'];
            $_SESSION['usuario_nome'] = $usuario['nome'];

            header('Location: dashboard.php');
            exit;
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Login - Compliance</title>
</head>
<body>
    <h1>Login</h1>

<?php if (!empty($erro)): ?>
    <p style="color: red;"><?= htmlspecialchars($erro) ?></p>
<?php endif; ?>

<form method="POST" action="index.php">
    <label>E-mail:</label><br>
    <input type="email" name="email" required> <br><br>

    <label>Senha:</label><br>
    <input type="password" name="senha" required><br><br>

    <button type="submit">Entrar</button>
</form>
</body>
</html>
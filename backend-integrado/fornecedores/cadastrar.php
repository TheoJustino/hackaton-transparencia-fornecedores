<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['POST']);
$usuarioId = exigirAutenticado();
$dados = lerJson();

$nome = trim($dados['nome'] ?? '');
$cnpj = trim($dados['cnpj'] ?? '');
$tipo = strtoupper(trim($dados['tipo'] ?? ''));
$produtoServico = trim($dados['produto_servico'] ?? '');
$car = trim($dados['car'] ?? '') ?: null;
$cidade = trim($dados['cidade'] ?? '');
$uf = strtoupper(trim($dados['uf'] ?? ''));

if ($nome === '' || $cnpj === '' || $tipo === '' || $produtoServico === '' || $cidade === '' || $uf === '') {
    responder(['sucesso' => false, 'mensagem' => 'Preencha os campos obrigatórios.'], 400);
}
if (!in_array($tipo, ['PRODUTOR', 'TRANSPORTADOR'], true)) {
    responder(['sucesso' => false, 'mensagem' => 'Tipo de fornecedor inválido.'], 400);
}
if ($tipo === 'TRANSPORTADOR') $car = null;

try {
    $stmt = $pdo->prepare('INSERT INTO fornecedores (nome, cnpj, tipo, produto_servico, car, cidade, uf, status_geral, ativo) VALUES (:nome, :cnpj, :tipo, :produto_servico, :car, :cidade, :uf, :status_geral, 1)');
    $stmt->execute([
        ':nome' => $nome,
        ':cnpj' => $cnpj,
        ':tipo' => $tipo,
        ':produto_servico' => $produtoServico,
        ':car' => $car,
        ':cidade' => $cidade,
        ':uf' => $uf,
        ':status_geral' => 'NAO_VERIFICADO',
    ]);
    $novoId = (int) $pdo->lastInsertId();
    $auditoria = $pdo->prepare('INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, detalhes) VALUES (?, ?, ?, ?, ?)');
    $auditoria->execute([$usuarioId, 'CADASTRO_FORNECEDOR', 'fornecedores', $novoId, "Fornecedor {$nome} cadastrado com sucesso."]);
    responder(['sucesso' => true, 'mensagem' => 'Fornecedor cadastrado com sucesso.', 'id' => $novoId], 201);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => $erro->getCode() === '23000' ? 'Já existe um fornecedor com esse CNPJ.' : 'Erro ao cadastrar fornecedor.'], $erro->getCode() === '23000' ? 409 : 500);
}

<?php
require_once __DIR__ . '/../config/bootstrap.php';
require_once __DIR__ . '/../config/conexao.php';

exigirMetodo(['PUT', 'POST']);
$usuarioId = exigirAutenticado();
$dados = lerJson();
$id = filter_var($dados['id'] ?? null, FILTER_VALIDATE_INT);
if (!$id) responder(['sucesso' => false, 'mensagem' => 'ID inválido.'], 400);

$nome = trim($dados['nome'] ?? '');
$cnpj = trim($dados['cnpj'] ?? '');
$tipo = strtoupper(trim($dados['tipo'] ?? ''));
$produtoServico = trim($dados['produto_servico'] ?? '');
$car = trim($dados['car'] ?? '') ?: null;
$cidade = trim($dados['cidade'] ?? '');
$uf = strtoupper(trim($dados['uf'] ?? ''));

if ($nome === '' || $cnpj === '' || $tipo === '' || $produtoServico === '' || $cidade === '' || $uf === '') responder(['sucesso' => false, 'mensagem' => 'Preencha os campos obrigatórios.'], 400);
if (!in_array($tipo, ['PRODUTOR', 'TRANSPORTADOR'], true)) responder(['sucesso' => false, 'mensagem' => 'Tipo de fornecedor inválido.'], 400);
if ($tipo === 'TRANSPORTADOR') $car = null;

try {
    $stmt = $pdo->prepare('UPDATE fornecedores SET nome = :nome, cnpj = :cnpj, tipo = :tipo, produto_servico = :produto_servico, car = :car, cidade = :cidade, uf = :uf WHERE id = :id');
    $stmt->execute([':nome' => $nome, ':cnpj' => $cnpj, ':tipo' => $tipo, ':produto_servico' => $produtoServico, ':car' => $car, ':cidade' => $cidade, ':uf' => $uf, ':id' => $id]);
    if ($stmt->rowCount() === 0) responder(['sucesso' => false, 'mensagem' => 'Fornecedor não encontrado ou sem alterações.'], 404);
    $auditoria = $pdo->prepare('INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, detalhes) VALUES (?, ?, ?, ?, ?)');
    $auditoria->execute([$usuarioId, 'ATUALIZACAO_FORNECEDOR', 'fornecedores', $id, "Fornecedor {$nome} atualizado com sucesso."]);
    responder(['sucesso' => true, 'mensagem' => 'Fornecedor atualizado com sucesso.']);
} catch (PDOException $erro) {
    responder(['sucesso' => false, 'mensagem' => $erro->getCode() === '23000' ? 'Já existe outro fornecedor com esse CNPJ.' : 'Erro ao atualizar fornecedor.'], $erro->getCode() === '23000' ? 409 : 500);
}

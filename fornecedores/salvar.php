<?php
//Esse arquivo recebe dados que vem do formulario, valida as informações,
//verifica o CNPJ para nao ter duplicidades.

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../funcoes/esg.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Metodo nao permitido. Utilize POST']);
    exit;
}

$dadosRecebidos = json_decode(file_get_contents('php://input'), true);
$dados = is_array($dadosRecebidos) ? $dadosRecebidos : $_POST;

// remove espacos desnecessarios, verifica se e null "??" caso for deixe vazio.
$nome = trim($dados['nome'] ?? '');
$cnpjCru = trim($dados['cnpj'] ?? '');
$tipo = trim($dados['tipo'] ?? 'PRODUTOR');
$produtoServico = trim($dados['produto_servico'] ?? '');
$car = trim($dados['car'] ?? '');
$cidade = trim($dados['cidade'] ?? '');
$uf = strtoupper(trim($dados['uf'] ?? 'MT'));

if (empty($nome) || empty($cnpjCru) || empty($produtoServico) || empty($cidade)) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Preencha todos os campos obrigatorios (Nome, CNPJ, Produto/Serviço e Cidade).']);
    exit;
}

$cnpjLimpo = limparDocumento($cnpjCru);
if (strlen($cnpjLimpo) !== 14) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'CNPJ invalido. Deve conter 14 digitos numéricos.']);
    exit;
}

if (!in_array($tipo, ['PRODUTOR', 'TRANSPORTADOR'])) {
    http_response_code(400);
    echo json_encode(['sucesso' => false, 'mensagem' => 'Tipo invalido. Escolha PRODUTOR ou TRANSPORTADOR.']);
    exit;
}

try {
    $stmtChecaCnpj = $pdo->prepare('SELECT id FROM fornecedores WHERE cnpj = ?');
    $stmtChecaCnpj->execute([$cnpjLimpo]);

    if ($stmtChecaCnpj->fetch()) {
        http_response_code(409); // conflito
        echo json_encode(['sucesso' => false, 'mensagem' => 'Este CNPJ ja esta cadastrado no sistema.']);
        exit;
    }

    $stmtInsere = $pdo->prepare('
        INSERT INTO fornecedores
        (nome, cnpj, tipo, produto_servico, car, cidade, uf, status_geral, ativo)
        VALUES
        (?, ?, ?, ?, ?, ?, ?, "NAO_VERIFICADO", 1)
    ');

    $stmtInsere->execute([
        $nome,
        $cnpjLimpo,
        $tipo,
        $produtoServico,
        !empty($car) ? $car : null,
        $cidade,
        $uf
    ]);

    $novoId = $pdo->lastInsertId();

    // registra acao na tabela de auditoria (governança)
    $usuarioId = 1; // temporario ate o login estiver ativo
    $stmtAuditoria = $pdo->prepare('
        INSERT INTO auditoria (usuario_id, acao, entidade, entidade_id, detalhes)
        VALUES (?, "CADASTRO_FORNECEDOR", "fornecedores", ?, ?)
    ');

    $stmtAuditoria->execute([
        $usuarioId,
        $novoId,
        "Fornecedor {$nome} cadastrado com sucesso."
    ]);

    http_response_code(201); // Criado
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Fornecedor cadastrado com sucesso!',
        'id' => $novoId
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao salvar fornecedor: ' . $e->getMessage()
    ]);
}
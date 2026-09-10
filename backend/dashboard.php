<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'config/conexao.php';

try {

    $sql = "
        SELECT
            COUNT(*) AS total_fornecedores,

            SUM(tipo = 'PRODUTOR') AS produtores,
            SUM(tipo = 'TRANSPORTADOR') AS transportadores,

            SUM(status_geral = 'REGULAR') AS regulares,
            SUM(status_geral = 'ATENCAO') AS atencao,
            SUM(status_geral = 'IRREGULAR') AS irregulares,
            SUM(status_geral = 'NAO_VERIFICADO') AS nao_verificados

        FROM fornecedores
        WHERE ativo = TRUE
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();

    $dados = $stmt->fetch();

    echo json_encode([
        'sucesso' => true,
        'dados' => [
            'total_fornecedores' => (int) $dados['total_fornecedores'],
            'produtores' => (int) $dados['produtores'],
            'transportadores' => (int) $dados['transportadores'],
            'regulares' => (int) $dados['regulares'],
            'atencao' => (int) $dados['atencao'],
            'irregulares' => (int) $dados['irregulares'],
            'nao_verificados' => (int) $dados['nao_verificados']
        ]
    ]);

} catch (PDOException $erro) {

    http_response_code(500);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro ao carregar os dados do dashboard.'
    ]);
}
<?php
$host = 'localhost';
$nomeBanco = "hackaton-transparencia-fornecedores"; 
$usuario = 'root';
$senha = '';
try{
    $pdo = new PDO(
        "mysql:host=$host;dbname=$nomeBanco;charset=utf8mb4",
        $usuario,
        $senha,
    
        [
            /*
            '::' => ACESSAR PERTENCENTE A UMA CLASSE "PDO"
            '=>' OPERADOR ASSOCIANDO CHAVE A UM VALOR DENTRO DE UMA ARRAY

            */
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // EXIBE ERRO COMO EXCEÇÕES
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // RETORNA NOME DAS COLUNAS
            PDO::ATTR_EMULATE_PREPARES => false //
        ]
    );
    
} catch (PDOException $e){
        http_response_code(500);
        echo json_encode([
            'sucesso' => false,
            'erro' => 'Não foi possível conectar ao banco de dados'
        ]);
        exit;
    }
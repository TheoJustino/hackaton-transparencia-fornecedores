<?php
$host = 'localhost';
$nomeBanco = "projetodesegunda"; 
$usuario = 'root';
$senha = '';
try{
    $pdo = new PDO(
        "mysql:host=$host;dbname=$nomeBanco;charset=utf8mb4",
        $usuario,
        $senha,
    
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
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
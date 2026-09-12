CREATE TABLE fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(180) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    tipo ENUM('PRODUTOR', 'TRANSPORTADOR') NOT NULL,
    produto_servico VARCHAR(180) NOT NULL,
    car VARCHAR(80) NULL,
    cidade VARCHAR(120) NOT NULL,
    uf CHAR(2) NOT NULL,
    status_geral ENUM('NAO_VERIFICADO', 'REGULAR', 'ATENCAO', 'IRREGULAR') NOT NULL DEFAULT 'NAO_VERIFICADO',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE verificacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fornecedor_id INT NOT NULL,
    usuario_id INT NULL,
    status_cnpj VARCHAR(30) NOT NULL,
    status_car VARCHAR(30) NOT NULL,
    status_ambiental VARCHAR(30) NOT NULL,
    status_trabalhista VARCHAR(30) NOT NULL,
    resultado_geral VARCHAR(30) NOT NULL,
    observacao TEXT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_verificacoes_fornecedor FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
);

CREATE TABLE auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL,
    acao VARCHAR(80) NOT NULL,
    entidade VARCHAR(80) NOT NULL,
    entidade_id INT NOT NULL,
    detalhes TEXT NULL,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Usuário inicial padrão para testes (senha: admin123)
INSERT INTO usuarios (nome, email, senha_hash, ativo)
VALUES (
    'Administrador',
    'admin@transparencia.com',
    '$2y$10$tPFIycmZ0rPdu6i6piBpwO8ccY4rMiZIdByIi2cKZWokbd7cWGFUa',
    1
);


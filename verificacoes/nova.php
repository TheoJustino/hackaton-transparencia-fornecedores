<?php
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../includes/cabecalho.php';
require_once __DIR__ . '/../includes/menu.php';

// Busca fornecedores ativos para preencher o select
$stmt = $pdo->query('SELECT id, nome, cnpj FROM fornecedores WHERE ativo = 1 ORDER BY nome ASC');
$fornecedores = $stmt->fetchAll();
?>

<h2>Nova Verificação de Compliance</h2>

<p>Selecione um fornecedor cadastrado para consultar a situação cadastral e calcular o status ESG.</p>

<form method="GET" action="salvar.php">
    <label for="id"><strong>Fornecedor:</strong></label><br><br>
    
    <select name="id" id="id" required style="padding: 8px; width: 350px;">
        <option value="">-- Selecione um fornecedor --</option>
        <?php foreach ($fornecedores as $f): ?>
            <option value="<​?= $f['id'] ?>">
                <?= htmlspecialchars($f['nome']) ?> (CNPJ: <?= htmlspecialchars($f['cnpj']) ?>)
            </option>
        <?php endforeach; ?>
    </select>
    
    <br><br>
    <button type="submit" style="padding: 10px 20px; background-color: #2e7d32; color: white; border: none; cursor: pointer; border-radius: 4px;">
        🔍 Iniciar Verificação
    </button>
</form>

<?php require_once __DIR__ . '/../includes/rodape.php'; ?>
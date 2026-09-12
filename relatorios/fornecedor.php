<?php
require_once __DIR__ . '/../config/conexao.php';
require_once __DIR__ . '/../includes/cabecalho.php';
require_once __DIR__ . '/../includes/menu.php';

$fornecedorId = $_GET['id'] ?? null;
$fornecedor = null;
$historico = [];

// Lista todos fornecedores para o dropdown de busca
$stmtTodos = $pdo->query('SELECT id, nome, cnpj FROM fornecedores ORDER BY nome ASC');
$todosFornecedores = $stmtTodos->fetchAll();

// Se o usuário selecionou um fornecedor, busca dados e histórico
if ($fornecedorId) {
    $stmtForn = $pdo->prepare('SELECT * FROM fornecedores WHERE id = ?');
    $stmtForn->execute([$fornecedorId]);
    $fornecedor = $stmtForn->fetch();

    if ($fornecedor) {
        $stmtHist = $pdo->prepare('
            SELECT v.*, u.nome AS usuario_nome 
            FROM verificacoes v
            LEFT JOIN usuarios u ON u.id = v.usuario_id
            WHERE v.fornecedor_id = ?
            ORDER BY v.verificado_em DESC
        ');
        $stmtHist->execute([$fornecedorId]);
        $historico = $stmtHist->fetchAll();
    }
}
?>

<h2>Relatório de Compliance do Fornecedor</h2>

<form method="GET" action="fornecedor.php">
    <label for="id"><strong>Selecione o Fornecedor:</strong></label><br><br>
    <select name="id" id="id" required style="padding: 8px; width: 350px;">
        <option value="">-- Escolha um fornecedor --</option>
        <?php foreach ($todosFornecedores as $f): ?>
            <option value="<​?= $f['id'] ?>" <?= ($fornecedorId == $f['id']) ? 'selected' : '' ?>>
                <?= htmlspecialchars($f['nome']) ?> (CNPJ: <?= htmlspecialchars($f['cnpj']) ?>)
            </option>
        <?php endforeach; ?>
    </select>
    <button type="submit" style="padding: 8px 16px;">Visualizar</button>
</form>

<hr style="margin: 20px 0;">

<?php if ($fornecedor): ?>
    <h3>Dados do Fornecedor</h3>
    <p><strong>Nome:</strong> <?= htmlspecialchars($fornecedor['nome']) ?></p>
    <p><strong>CNPJ:</strong> <?= htmlspecialchars($fornecedor['cnpj']) ?></p>
    <p><strong>Tipo:</strong> <?= htmlspecialchars($fornecedor['tipo']) ?></p>
    <p><strong>Cidade/UF:</strong> <?= htmlspecialchars($fornecedor['cidade']) ?> / <?= htmlspecialchars($fornecedor['uf']) ?></p>
    <p><strong>Status Geral Atual:</strong> 
        <span style="padding: 4px 8px; background: #eee; font-weight: bold;">
            <?= htmlspecialchars($fornecedor['status_geral']) ?>
        </span>
    </p>

    <h3>Histórico de Verificações</h3>
    <?php if (empty($historico)): ?>
        <p>Nenhuma verificação realizada para este fornecedor até o momento.</p>
    <?php else: ?>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f0f0f0;">
                <th>Data</th>
                <th>Status CNPJ</th>
                <th>Status CAR</th>
                <th>Status Ambiental</th>
                <th>Status Trabalhista</th>
                <th>Resultado Geral</th>
                <th>Observação</th>
            </tr>
            <?php foreach ($historico as $h): ?>
                <tr>
                    <td><?= date('d/m/Y H:i', strtotime($h['verificado_em'])) ?></td>
                    <td><?= htmlspecialchars($h['status_cnpj']) ?></td>
                    <td><?= htmlspecialchars($h['status_car']) ?></td>
                    <td><?= htmlspecialchars($h['status_ambiental']) ?></td>
                    <td><?= htmlspecialchars($h['status_trabalhista']) ?></td>
                    <td><strong><?= htmlspecialchars($h['resultado_geral']) ?></strong></td>
                    <td><?= htmlspecialchars($h['observacao'] ?? '-') ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>

<?php elseif ($fornecedorId): ?>
    <p style="color: red;">Fornecedor não encontrado.</p>
<?php endif; ?>

<?php require_once __DIR__ . '/../includes/rodape.php'; ?>
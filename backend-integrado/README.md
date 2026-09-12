# Backend integrado

API PHP JSON criada como ponto de convergencia entre o backend-pessoa2 e o backend de compliance.

## Estrutura

- `config/conexao.example.php`: modelo de conexao. Copie para `config/conexao.php` e preencha as credenciais localmente.
- `config/bootstrap.php`: respostas JSON, CORS e leitura do corpo da requisicao.
- `funcoes/esg.php`: regra de resultado geral de compliance.
- `fornecedores/`: consulta, listagem, cadastro, atualizacao e inativacao logica.
- `dashboard.php`: indicadores gerais.
- `verificacoes/executar.php`: executa uma verificacao e grava historico/auditoria.
- `verificacoes/ultima.php`: retorna a ultima verificacao de um fornecedor.
- `relatorios/fornecedor.php`: retorna os dados necessarios para o relatorio.
- `schema.sql`: referencia inicial das tabelas esperadas.

## Configuracao

1. Crie `config/conexao.php` a partir de `config/conexao.example.php`.
2. Use o mesmo banco definido pelo grupo para fornecedores e compliance.
3. Garanta que as tabelas `fornecedores`, `verificacoes` e `auditoria` existam.
4. Sirva esta pasta por Apache/PHP ou pelo ambiente local equivalente.

## XAMPP e autenticacao

Para usar com XAMPP, copie `backend-integrado` para dentro de `htdocs`. Por exemplo:

```text
C:\xampp\htdocs\hackaton-transparencia-fornecedores\backend-integrado
```

Nesse caso, a URL base esperada pelo frontend e:

```text
http://localhost/hackaton-transparencia-fornecedores/backend-integrado
```

O login usa a tabela `usuarios` com as colunas `id`, `nome`, `email`, `senha_hash` e `ativo`. As senhas devem ter sido criadas com `password_hash`. A sessao PHP e usada para preencher `usuario_id` automaticamente nas tabelas `verificacoes` e `auditoria`.

O frontend aceita uma URL diferente pela variavel Vite `VITE_API_URL`.

Os endpoints de autenticacao sao:

- `POST auth/login.php`
- `POST auth/cadastrar.php`
- `GET auth/me.php`
- `POST auth/logout.php`

Os endpoints retornam JSON e foram preparados para consumo pelo frontend React. O login e a sessao ja estao integrados; ainda faltam a protecao completa de todos os endpoints de leitura e a configuracao de HTTPS para producao.

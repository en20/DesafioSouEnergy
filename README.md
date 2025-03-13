# DesafioSouEnergy

## Configuração

Este projeto não requer arquivos .env para funcionar localmente, pois usa valores padrão para desenvolvimento.

### Em produção

Para ambientes de produção, configure as seguintes variáveis de ambiente:

- `PORT`: Porta onde o servidor será executado
- `JWT_SECRET`: Chave secreta para assinar tokens JWT
- `DB_NAME`: Nome do banco de dados
- `DB_USER`: Usuário do banco de dados
- `DB_PASSWORD`: Senha do banco de dados
- `DB_HOST`: Host do banco de dados

### Configuração local (opcional)

Se precisar substituir os valores padrão localmente, você pode:

1. Configurar variáveis de ambiente no seu sistema
2. Usar ferramentas como o Docker com variáveis de ambiente

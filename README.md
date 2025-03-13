

# Módulo de Notificação de Política de Privacidade - Sou Energy

![Sou Energy](https://img.shields.io/badge/Sou%20Energy-Sistema%20de%20Gestão-orange)
![Next.js](https://img.shields.io/badge/Next.js-15.2.2-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)

## Visão Geral

Este projeto implementa um sistema completo de notificação de política de privacidade para a plataforma Sou Energy. O módulo oferece um fluxo intuitivo que permite informar os usuários sobre atualizações nas políticas de privacidade da empresa, garantindo conformidade legal e transparência com os clientes.

### Funcionalidades Principais

- Modal de notificação exibido após login do usuário
- Painel administrativo para gerenciar notificações de privacidade
- Controle de status (ativação/desativação) das notificações
- Personalização do texto da notificação
- Rastreamento de quais usuários aceitaram a política atualizada
- Visualização em grid de clientes que aceitaram os termos
- Persistência das informações de aceitação dos termos

## Concepção e Implementação

### Arquitetura

O projeto foi desenvolvido como uma aplicação full-stack, com:

- **Frontend**: Aplicação Next.js com React 19, utilizando o padrão de design Context API para gerenciamento do estado de autenticação e notificações de privacidade
- **Backend**: API REST em Node.js com Express, utilizando Sequelize como ORM e SQLite como banco de dados

### Fluxo de Funcionamento

1. Quando um administrador atualiza a política de privacidade, ele pode ativar a notificação no painel administrativo
2. Ao fazer login, o sistema verifica se o usuário já aceitou a versão mais recente da política de privacidade
3. Se necessário, um modal é exibido para o usuário com a mensagem personalizada e opções para aceitar ou rejeitar
4. A aceitação do usuário é registrada no banco de dados com timestamp
5. Administradores podem visualizar quais usuários aceitaram os termos no painel administrativo

## Instalação e Configuração

### Pré-requisitos

- Node.js (v14 ou superior)
- npm ou yarn

### Configuração do Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/en20/DesafioSouEnergy.git
   cd DesafioSouEnergy
   ```


2. Baixe o sqlite (banco de dados) :
   ```bash
   npm install sqlite3@5.0.2
   ```

3. Instale as dependências do backend:
   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   
   O servidor estará disponível em `http://localhost:5000`

### Configuração do Frontend



1. Instale as dependências do frontend:
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   
   A aplicação estará disponível em `http://localhost:3000`

## Guia de Uso

### Acesso Administrativo

1. Acesse `http://localhost:3000/login` e entre com credenciais de administrador
```bash
   email: admin@exemplo.com
   senha: senha123
   ```
2. Navegue até o Dashboard Administrativo
3. Na seção "Configuração da Notificação de Privacidade", você pode:
   - Ativar/desativar a exibição da notificação
   - Personalizar a mensagem exibida no modal
   - Visualizar quando a configuração foi atualizada pela última vez

### Visualização de Status dos Clientes

No painel administrativo, a seção "Clientes" exibe:
- Lista de todos os usuários cadastrados
- Status de aceitação dos termos de privacidade para cada cliente (Sim/Não)
- Data e hora em que o cliente aceitou os termos (quando aplicável)

### Experiência do Usuário
1. Voce pode fazer o registro pela pagina de "register" que esta no bloco de login, logo abaixo do login, ou usar o seguinte usuario para entrar: 
```bash
   email: enzo@enzo.com
   senha: 123456
   ```
2. Ao fazer login, se houver uma atualização na política de privacidade, o usuário verá um modal
3. O usuário pode escolher aceitar os termos (registrando seu consentimento) ou rejeitar temporariamente
4. Caso rejeite, um indicador permanecerá visível para lembrar o usuário de revisar os termos

## Validação e Testes

### Testes Manuais

Para validar o funcionamento da funcionalidade, siga estes passos:

1. **Teste da ativação da notificação:**
   - Faça login como administrador
   - Acesse o painel administrativo
   - Ative a notificação de privacidade
   - Atualize a mensagem da notificação

2. **Teste do fluxo de usuário:**
   - Faça logout e crie uma nova conta de usuário
   - Faça login com a nova conta
   - Verifique se o modal de notificação é exibido
   - Aceite os termos e confirme que o modal não aparece no próximo login

3. **Teste de visualização de status:**
   - Faça login como administrador
   - Acesse o painel administrativo
   - Verifique se o usuário que aceitou aparece com status "Sim" na grid de clientes

## Estrutura do Código

### Frontend (Next.js)

```
sou-energy/
├── app/                 # Organização por rotas (App Router do Next.js)
│   ├── admin/           # Páginas administrativas
│   ├── dashboard/       # Dashboard do usuário comum
│   ├── login/           # Página de login
│   ├── register/        # Página de registro
│   └── privacy-policy/  # Página da política de privacidade
├── components/          # Componentes reutilizáveis
│   ├── DashboardLayout.tsx      # Layout para dashboards
│   ├── PrivacyPolicyModal.tsx   # Modal de notificação de privacidade
│   └── PrivacyNotificationBadge.tsx # Badge para lembrar usuários que não aceitaram
├── contexts/            # Contextos React para gerenciamento de estado
│   └── AuthContext.tsx  # Contexto de autenticação e privacidade
├── services/            # Serviços de comunicação com a API
│   └── api.ts           # Cliente Axios e serviços
└── types/               # Tipos TypeScript
    └── index.ts         # Definições de tipos
```

### Backend (Node.js)

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/ # Controladores
│   │   ├── models/      # Modelos de dados
│   │   └── services/    # Lógica de negócios
│   ├── config/          # Configurações
│   ├── loaders/         # Inicializadores
│   ├── middlewares/     # Middlewares Express
│   ├── routes/          # Definição de rotas
│   └── index.js         # Ponto de entrada
└── 
```

## Principais Componentes da Solução

### Backend

1. **Modelo PrivacyNotification**
   - Armazena configuração global da notificação
   - Controla status ativo/inativo, mensagem personalizada e data da última atualização

2. **Serviço AuthService**
   - Integra verificação de aceitação da política no fluxo de login
   - Gerencia o registro da aceitação dos termos pelo usuário

3. **Controlador PrivacyController**
   - Fornece endpoints para administradores gerenciarem as configurações de notificação
   - Permite ativar/desativar e personalizar a mensagem

### Frontend

1. **AuthContext**
   - Gerencia o estado de autenticação e notificações de privacidade
   - Integra o fluxo de aceitação da política no login

2. **PrivacyPolicyModal**
   - Exibe o modal com a mensagem personalizada
   - Oferece opções para aceitar ou rejeitar os termos

3. **Dashboard Administrativo**
   - Interface para gerenciamento das notificações
   - Visualização do status de aceitação dos usuários

## Melhorias Futuras

- Implementação de versionamento de políticas de privacidade
- Suporte a múltiplos idiomas para notificações
- Sistema de agendamento para ativação/desativação automática
- Relatórios analíticos sobre taxas de aceitação
- Melhorias na interface do usuário e experiência móvel

## Considerações de Segurança

- Autenticação JWT para proteger endpoints sensíveis
- Middlewares de autorização para garantir acesso apenas a usuários autorizados
- Validação de entradas para prevenir injeção de SQL e XSS

## Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados à Enzo Lozano.



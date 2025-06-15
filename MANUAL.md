# Manual do Aplicativo Bater Ponto

## Visão Geral

O **Bater Ponto** é um aplicativo móvel desenvolvido com Ionic + Angular (Standalone) que oferece funcionalidades completas de controle de ponto eletrônico com reconhecimento facial, operação offline e geração de relatórios em PDF.

## Funcionalidades Principais

### ✅ Funcionalidades Implementadas

- **Navegação por Tabs**: Home, Ponto, Folha, RH e Gestor
- **Registro de Ponto**: Captura de foto com localização GPS
- **Reconhecimento Facial**: Sistema simulado de verificação facial
- **Operação Offline**: Armazenamento local com sincronização automática
- **Geração de PDFs**: Relatórios mensais e comprovantes individuais
- **Histórico de Batidas**: Visualização completa dos registros
- **Status de Sincronização**: Controle de dados sincronizados/pendentes

### 📱 Páginas Disponíveis

1. **Home** (`/tabs/home`)
   - Saudação personalizada com dados do usuário
   - Foto do usuário e informações básicas
   - Saldo de banco de horas (crédito/débito)
   - Menu de navegação rápida

2. **Ponto** (`/tabs/ponto`)
   - Acesso rápido ao registro de ponto
   - Últimas batidas registradas
   - Status dos registros

3. **Folha** (`/tabs/folha`)
   - Informações da folha de pagamento
   - Estrutura preparada para expansão

4. **RH** (`/tabs/rh`)
   - Área de recursos humanos
   - Estrutura preparada para funcionalidades de RH

5. **Gestor** (`/tabs/gestor`)
   - Área administrativa (opcional)
   - Funcionalidades de gestão

### 🔧 Páginas Específicas

- **Registrar Ponto** (`/registrar-ponto`)
  - Verificação automática de GPS
  - Captura de foto obrigatória
  - Reconhecimento facial automático
  - Determinação automática do tipo de registro

- **Batidas do Mês** (`/batidas-do-mes`)
  - Histórico completo de registros
  - Estatísticas de sincronização
  - Geração de relatório PDF mensal
  - Comprovantes individuais

- **Folha do Mês** (`/folha-do-mes`)
  - Detalhes da folha de pagamento mensal

- **QR Batida** (`/qr-batida`)
  - Estrutura para implementação de QR Code

- **Dados Pessoais** (`/dados-pessoais`)
  - Informações completas do funcionário

- **Termos e Condições** (`/termos-condicoes`)
  - Documentação legal do aplicativo

- **Cadastro Facial** (`/cadastro-rosto`)
  - Registro inicial do rosto do usuário
  - Análise e validação facial
  - Armazenamento seguro do descritor facial

## Tecnologias Utilizadas

- **Ionic 8** - Framework híbrido
- **Angular 18** - Framework frontend (Standalone Components)
- **Capacitor** - Runtime nativo
- **TypeScript** - Linguagem de programação
- **jsPDF** - Geração de documentos PDF
- **Leaflet** - Mapas e geolocalização
- **LocalStorage** - Armazenamento offline

## Dependências Principais

```json
{
  "@capacitor/android": "^7.0.1",
  "@capacitor/app": "^7.0.1",
  "@capacitor/camera": "^7.0.1",
  "@capacitor/core": "^7.0.1",
  "@capacitor/geolocation": "^7.1.2",
  "@capacitor/haptics": "^7.0.1",
  "@capacitor/keyboard": "^7.0.1",
  "@capacitor/status-bar": "^7.0.1",
  "jspdf": "^2.5.2",
  "leaflet": "^1.9.4"
}
```



## Pré-requisitos

### Ambiente de Desenvolvimento

1. **Node.js** (versão 18 ou superior)
   ```bash
   # Verificar versão
   node --version
   npm --version
   ```

2. **Ionic CLI**
   ```bash
   npm install -g @ionic/cli
   ```

3. **Android Studio** (para desenvolvimento Android)
   - Baixar e instalar do site oficial
   - Configurar Android SDK
   - Configurar emulador ou dispositivo físico

4. **Java Development Kit (JDK)**
   - JDK 11 ou superior
   - Configurar variável JAVA_HOME

### Configuração do Ambiente

1. **Variáveis de Ambiente**
   ```bash
   # Android
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   
   # Java
   export JAVA_HOME=/path/to/jdk
   ```

## Instalação e Configuração

### 1. Extrair o Projeto

```bash
# Extrair o arquivo do projeto
unzip bater-ponto.zip
cd bater-ponto
```

### 2. Instalar Dependências

```bash
# Instalar dependências do Node.js
npm install

# Verificar se todas as dependências foram instaladas
npm list
```

### 3. Configurar Capacitor

```bash
# Sincronizar com Capacitor
npx cap sync

# Adicionar plataforma Android (se necessário)
npx cap add android
```

### 4. Build do Projeto

```bash
# Build para produção
ionic build

# Build para desenvolvimento
ionic build --dev
```

## Executando o Aplicativo

### Desenvolvimento Web

```bash
# Servidor de desenvolvimento
ionic serve

# Servidor com porta específica
ionic serve --port=8100

# Servidor com live reload
ionic serve --livereload
```

### Emulação Android

```bash
# Abrir no Android Studio
npx cap open android

# Build e executar no emulador
ionic cap run android

# Build e executar no dispositivo
ionic cap run android --target=device
```

### Build para Produção Android

```bash
# Build otimizado
ionic build --prod

# Sincronizar
npx cap sync android

# Gerar APK
cd android
./gradlew assembleRelease

# APK estará em: android/app/build/outputs/apk/release/
```

## Configuração do Emulador

### Android Studio - Pixel 5

1. **Abrir AVD Manager**
   - Tools → AVD Manager

2. **Criar Novo Dispositivo Virtual**
   - Create Virtual Device
   - Selecionar "Pixel 5"
   - Escolher API Level 30 ou superior
   - Configurar RAM: 2GB ou mais

3. **Configurações Recomendadas**
   - Graphics: Hardware - GLES 2.0
   - Memory: RAM 2048MB, Heap 512MB
   - Internal Storage: 6GB
   - SD Card: 1GB

4. **Iniciar Emulador**
   ```bash
   # Via linha de comando
   emulator -avd Pixel_5_API_30
   
   # Via Android Studio
   # Clicar no botão Play no AVD Manager
   ```

## Estrutura do Projeto

```
bater-ponto/
├── src/
│   ├── app/
│   │   ├── home/                 # Página inicial
│   │   ├── ponto/                # Página de ponto
│   │   ├── folha/                # Página de folha
│   │   ├── rh/                   # Página de RH
│   │   ├── gestor/               # Página do gestor
│   │   ├── registrar-ponto/      # Registro de ponto
│   │   ├── batidas-do-mes/       # Histórico mensal
│   │   ├── folha-do-mes/         # Folha mensal
│   │   ├── qr-batida/            # QR Code
│   │   ├── dados-pessoais/       # Dados do usuário
│   │   ├── termos-condicoes/     # Termos legais
│   │   ├── cadastro-rosto/       # Cadastro facial
│   │   ├── services/             # Serviços
│   │   │   ├── offline-storage.service.ts
│   │   │   ├── face-recognition.service.ts
│   │   │   └── pdf-generator.service.ts
│   │   └── tabs/                 # Navegação por tabs
│   └── assets/                   # Recursos estáticos
├── android/                      # Projeto Android nativo
├── capacitor.config.ts           # Configuração Capacitor
├── ionic.config.json             # Configuração Ionic
└── package.json                  # Dependências
```


## Como Usar o Aplicativo

### Primeiro Uso

1. **Cadastro Facial**
   - Acesse "Cadastro Facial" no menu
   - Capture uma foto clara do seu rosto
   - Aguarde a confirmação de detecção
   - Salve o cadastro facial

2. **Configuração de Dados**
   - Acesse "Dados Pessoais"
   - Verifique as informações do usuário
   - Os dados podem ser editados conforme necessário

### Registrando Ponto

1. **Acesso Rápido**
   - Toque em "Registrar Ponto" na página inicial
   - Ou acesse via tab "Ponto" → "Bater Ponto Agora"

2. **Processo de Registro**
   - Verifique se o GPS está ativo
   - Capture uma foto (obrigatório)
   - O sistema detectará automaticamente o tipo de registro
   - Confirme o registro

3. **Tipos de Registro**
   - **Entrada**: Primeiro registro do dia
   - **Saída Almoço**: Segundo registro do dia
   - **Volta Almoço**: Terceiro registro do dia
   - **Saída**: Quarto registro do dia

### Visualizando Histórico

1. **Batidas do Mês**
   - Acesse via menu ou tab "Ponto"
   - Visualize todos os registros do mês atual
   - Verifique status de sincronização

2. **Gerando Relatórios**
   - Toque em "Gerar Relatório PDF" para relatório mensal
   - Toque no ícone de documento em cada registro para comprovante individual

### Funcionalidades Offline

- **Armazenamento Local**: Todos os dados são salvos localmente
- **Sincronização Automática**: Quando online, dados são sincronizados
- **Indicadores de Status**: Verde = sincronizado, Amarelo = pendente

## Solução de Problemas

### Problemas Comuns

#### GPS Não Funciona
```
Problema: "GPS Inativo" ou localização imprecisa
Soluções:
1. Verificar permissões de localização
2. Ativar GPS nas configurações do dispositivo
3. Aguardar alguns segundos para obter sinal
4. Sair ao ar livre se estiver em ambiente fechado
```

#### Câmera Não Funciona
```
Problema: Erro ao capturar foto
Soluções:
1. Verificar permissões de câmera
2. Fechar outros apps que usam câmera
3. Reiniciar o aplicativo
4. Verificar se há espaço de armazenamento
```

#### Erro de Build
```
Problema: Falha na compilação
Soluções:
1. Limpar cache: npm cache clean --force
2. Reinstalar dependências: rm -rf node_modules && npm install
3. Verificar versões do Node.js e Ionic CLI
4. Executar: npx cap sync
```

#### Problemas de Sincronização
```
Problema: Dados não sincronizam
Soluções:
1. Verificar conexão com internet
2. Aguardar tentativa automática
3. Reiniciar aplicativo
4. Verificar logs no console do navegador
```

### Logs e Depuração

#### Desenvolvimento Web
```bash
# Abrir console do navegador (F12)
# Verificar aba Console para erros
# Verificar aba Network para requisições
# Verificar aba Application → Local Storage
```

#### Android Debug
```bash
# Conectar dispositivo via USB
adb logcat | grep -i ionic

# Ou usar Chrome DevTools
# chrome://inspect/#devices
```

### Limpeza de Dados

#### Resetar Aplicativo
```javascript
// No console do navegador
localStorage.clear();
location.reload();
```

#### Limpar Cache de Build
```bash
# Limpar cache Ionic
ionic cache clear

# Limpar cache npm
npm cache clean --force

# Limpar build Android
cd android && ./gradlew clean
```

## Personalização

### Modificando Dados do Usuário

Edite o arquivo `src/app/home/home.page.ts`:

```typescript
usuario = {
  nome: 'Seu Nome',
  matricula: 'Sua Matrícula',
  cargo: 'Seu Cargo',
  foto: 'assets/images/sua-foto.png'
};
```

### Configurando Empresa

Edite `capacitor.config.ts`:

```typescript
const config: CapacitorConfig = {
  appId: 'com.suaempresa.baterponto',
  appName: 'Ponto - Sua Empresa',
  // ...
};
```

### Adicionando Ícones

1. Substitua os ícones em `android/app/src/main/res/`
2. Use ferramenta de geração de ícones:
   ```bash
   npm install -g cordova-res
   cordova-res android --skip-config --copy
   ```

## Manutenção

### Atualizações

```bash
# Atualizar Ionic
npm update @ionic/angular

# Atualizar Capacitor
npm update @capacitor/core @capacitor/cli

# Verificar atualizações disponíveis
npm outdated
```

### Backup de Dados

```bash
# Exportar dados do localStorage
# Execute no console do navegador:
const dados = {
  registros: JSON.parse(localStorage.getItem('registros_ponto') || '[]'),
  configuracoes: JSON.parse(localStorage.getItem('app_configuracoes') || '{}'),
  usuario: JSON.parse(localStorage.getItem('usuario_dados') || '{}')
};
console.log(JSON.stringify(dados, null, 2));
```

## Suporte

### Contato
- **Desenvolvedor**: Equipe de Desenvolvimento
- **Email**: suporte@empresa.com
- **Versão**: 1.0.0
- **Data**: Janeiro 2024

### Recursos Adicionais
- [Documentação Ionic](https://ionicframework.com/docs)
- [Documentação Angular](https://angular.dev)
- [Documentação Capacitor](https://capacitorjs.com/docs)

---

**Nota**: Este aplicativo foi desenvolvido como uma solução completa de ponto eletrônico. Para uso em produção, recomenda-se implementar autenticação robusta, criptografia de dados e integração com sistemas de backend corporativos.


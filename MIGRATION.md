# Requisitos para utilizar o bundler VITE

## Compatibility Note

Vite requires Node.js version 18+ or 20+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.

## Principais atualizações de dependência no projeto:

**Antes**:

```
"react": "^17.0.1",
"react-dom": "17.0.2",
"typescript": "^4.2.3",
```

**Agora**:

```
"react": "^18.3.1",
"react-dom": "^18.3.1",
"typescript": "^5.2.2"
```

Removi a dependência do node_sass não achei nenhum arquivo .SCSS então acho que vocês não estavam usando, por favor confirme. Caso vocês usem teremos que atualizar a versão para ter compatibilidade com o Node 20V.

## Melhorias comparadas entre o CRA e VITE

**Tempo de build**:

Código antigo CRA = 80 segundos para buildar
Código com VITE = 12 segundos para buildar

**Uma melhoria de 85% na velocidade do build.**

**Tamanho do bundle**:

Tamanho do build gerado CRA: 7,9 MB

Tamanho do build gerado VITE: novo 6,0 MB

**Uma redução de 24% na velocidade do build.**

## Novos comandos do projeto:

**Antes**:

```
"start": "react-scripts start",
"build": "set NODE_OPTIONS=--max_old_space_size=4192 && npx webpack ",

```

**Depois**:

```
"dev": "vite", //Inicia o servidor de local
"build": "tsc --noEmit && vite build",
```

# ---- Etapa 1: Build do frontend ----
FROM node:20-alpine AS build

# Criar diretório da aplicação
WORKDIR /app

# Copiar package.json e instalar dependências
COPY face-detection/package.json face-detection/package-lock.json ./

RUN npm install

# Copiar o restante do código
COPY face-detection/ .

# Gerar build otimizado
RUN npm run build


# ---- Etapa 2: Servir com NGINX ----
FROM nginx:alpine

# Remover configuração padrão
RUN rm -rf /usr/share/nginx/html/*

# Copiar build final para o NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Comando para iniciar servidor
CMD ["nginx", "-g", "daemon off;"]

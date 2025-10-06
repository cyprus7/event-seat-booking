# Установка этапа сборки
FROM node:22-alpine AS builder
WORKDIR /app
# Копируем файлы с зависимостями и устанавливаем их
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
# Копируем исходники и собираем приложение
COPY . .
RUN npm run build

# Этап запуска
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 3001
CMD ["node", "dist/main"]

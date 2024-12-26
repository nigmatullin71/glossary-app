# Используем Node.js для фронтенда
FROM node:16

# Устанавливаем зависимости
WORKDIR /app
COPY /package.json .
RUN npm install

# Копируем исходный код фронтенда
COPY . /app

# Устанавливаем команду для запуска сервера
CMD ["npm", "start"]

EXPOSE 8080
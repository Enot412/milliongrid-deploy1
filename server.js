const express = require('express');
const path = require('path');
const app = express();

// Порт, который задаёт Render
const PORT = process.env.PORT || 10000;

// Обслуживаем папку public как статическую
app.use(express.static(path.join(__dirname, 'public')));

// Отдаём index.html по умолчанию на любые маршруты
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

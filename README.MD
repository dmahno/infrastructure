## Описание работы

Версия Node JS - 11.6.0

Билд-сервер умеет:

- Запрос из api настройки репозитория, а также список билдов
- Ожидание build-agents на ручке /notify
- Регистрация build-agent и отправка задание на ручку /build

Билд-агент умеет:

- Отправка запросов к build-server на ручку notify
- Получение build на ручку /build

## Начало работы

Для запуска:

- В папке [build-server](build-server) создать файл конфигурации `config.json` (содержимое - по аналогии с файлом [config.example.json](build-server/config.example.json):

- Запустить билд-сервер:

```bash
cd build-server && npm ci && npm start
```

- Запустить билд-агент:

```bash
cd build-agent && npm ci && npm start
```

Используемые порты (9000, 9001, 8000 и т.д.)

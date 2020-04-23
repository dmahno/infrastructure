## Описание работы

Версия Node JS - 11.6.0

Билд-сервер умеет:

- Запрос из api настройки репозитория, а также список билдов
- Ожидание build-agents на /notify
- Регистрация build-agent и отправка задание на ручку /build
- Ожидание build-agent на /notify и проводить регистрацию при обращении
- Назначение build-agent задачи (если build-agent не отвечает - искать следующего)
- Отправление build-agent задачи на /build, добавлять информацию в БД через /start
- Получение результата работы от build-agent, обновлять информацию в БД через /finish

Билд-агент умеет:

- Отправка запросов к build-server на ручку notify
- Получение build на /build
- Обращаться build-server /notify (при ошибках - повторять запросы)
- Делать clone репозитория, делать build

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

## Структура репрозитория

#### build-server

- app.js
- config.js - настройки
- build-server/router - маршрутизатор зарпросов
- build-server/api - api для обращения из вне (к api БД )
- build-server/controllers - обработчики обращений к сторонним api
- build-server/utils - утилиты
- build-server/storage - хранилище (мусор - не смотреть)

#### build-agent

- app.js
- config.js - настройки
- build-server/router - маршрутизатор зарпросов
- build-server/api - api для обращения из вне (к /build-server )
- build-server/controllers - обработчики обращений к сторонним api
- build-server/utils - утилиты

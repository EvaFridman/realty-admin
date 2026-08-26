## Требования к окружению

### Service Worker

Service Worker работает только с HTTPS. Исключение - localhost.
В production нужно использовать HTTPS, без него SW не зарегистрируется, а фотографии не смогут загружаться через посредник с заголовком `Authorization`.
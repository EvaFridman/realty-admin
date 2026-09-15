# Отчёт сборки

## Таблица показывает фактический режим сборки маршрутов и размер загрузки по результатам сборки.

### Загрузка в начале

| Маршрут               | Способ сборки | Размер загрузки (без сжатия) |
|-----------------------|---------------|-----------------------------:|
| `/`                   | Dynamic       | 474.6 KB                     |
| `/_not-found`         | Static        | 455.8 KB                     |
| `/about`              | Static        | 455.8 KB                     |
| `/districts`          | Dynamic       | 456.7 KB                     |
| `/districts/[slug]`   | Dynamic       | 485.1 KB                     |
| `/help`               | Static        | 455.8 KB                     |
| `/listings`           | Dynamic       | 485.1 KB                     |
| `/listings/[id]`      | Dynamic       | 482.7 KB                     |
| `/ui-kit`             | Static        | 468.2 KB                     |

Размер взят по `firstLoadUncompressedJsBytes` из `.next/diagnostics/route-bundle-stats.json`.

<!-- ### Загрузка в конце

| Маршрут               | Способ сборки | Размер загрузки (без сжатия) |
|-----------------------|---------------|-----------------------------:|
| `/`                   | Dynamic       | 474.6 KB                     |
| `/_not-found`         | Static        | 455.8 KB                     |
| `/about`              | Static        | 455.8 KB                     |
| `/districts`          | Dynamic       | 456.7 KB                     |
| `/districts/[slug]`   | Dynamic       | 485.1 KB                     |
| `/help`               | Static        | 455.8 KB                     |
| `/listings`           | Dynamic       | 485.1 KB                     |
| `/listings/[id]`      | Dynamic       | 482.7 KB                     |
| `/ui-kit`             | Static        | 468.2 KB                     |

Размер взят по `firstLoadUncompressedJsBytes` из `.next/diagnostics/route-bundle-stats.json`. -->
# dsh-locale-ru

**Русский** · [English](#english)

Русский язык для веб-интерфейса **DeepSeek Harness (DSH)** — клиент-плагин,
который добавляет в штатный переключатель языков пункт «Русский» и подставляет
русские строки во все неймспейсы UI.

Russian language pack for the **DeepSeek Harness (DSH)** web GUI: a client plugin
that registers a `ru` locale and Russian dictionaries for every UI namespace.

- **2 834 строки** в **61 неймспейсе** — 100% ключей словарей DSH 0.2.1-rc.5.
- `app.asar` и собранный фронтенд не изменяются — используется публичный
  механизм локализации `@deepseek-ai/dsh-client-locale`.
- Работает поверх английского: непереведённая строка покажет оригинал, а не
  пустое место.

---

## Русский

### Как это устроено

Ядро локализации хранит каталог языков и реестр словарей. Внешний клиент-плагин
добавляет язык двумя вызовами:

```js
export const inject = ['locale']

export function apply(ctx) {
  ctx.effect(() => ctx.locale.addLanguage({ id: 'ru', label: 'Русский', fallback: 'en' }), 'ru: language')
  ctx.effect(() => ctx.locale.register('chat', 'ru', { /* ключ: перевод */ }), 'ru: chat')
}
```

Хост сканирует включённые Loader-записи, находит `dsh.client` в `package.json`
пакета и отдаёт `lib/client.js` по маршруту `/plugins/...`; браузер загружает
бандл лениво и регистрирует словари. Селектор языков, сохранение выбора и
переключение `<html lang>` берёт на себя ядро.

### Состав

| Файл | Роль |
|---|---|
| `package.json` | манифест пакета и объявление `dsh.client` (`platform: web`) |
| `lib/index.js` | host-половина: пустой cordis-плагин, нужен, чтобы запись монтировалась |
| `lib/client.js` | **сгенерированный** браузерный бандл со словарями |
| `translations/ru.json` | исходник перевода: `{ неймспейс: { ключ: текст } }` |
| `build_locale.cjs` | сборка `lib/client.js` из `translations/ru.json` |

`lib/client.js` руками не правится — только через сборку.

### Установка

1. Скопировать или склонировать пакет в любое постоянное место.
2. Сделать ссылку в `node_modules` профиля:

   ```powershell
   New-Item -ItemType Junction `
     -Path "$env:USERPROFILE\.dsh\profiles\desktop\node_modules\dsh-locale-ru" `
     -Target "C:\путь\к\dsh-locale-ru"
   ```

3. Добавить запись в `%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml`:

   ```yaml
   - insert:
       - id: locale-ru
         name: dsh-locale-ru
   ```

4. Перезапустить приложение (HMR подхватывает изменения и без перезапуска, но
   при первом подключении надёжнее перезапустить).
5. Настройки → Основные → Язык → **Русский**.

Выбор сохраняется в профиле (`locale.preference`) и переживает перезапуск.

### Пересборка

Правки — в `translations/ru.json`, затем:

```powershell
node build_locale.cjs
```

Скрипт проверяет структуру и пересобирает `lib/client.js`.

### Отключение

1. Убрать блок `insert` с `locale-ru` из `cordis.patch.yml`.
2. Удалить junction `node_modules\dsh-locale-ru`.
3. Перезапустить приложение.

### Что осталось по-английски

Осознанно не переводятся:

- названия продуктов и сервисов — DeepSeek, VS Code, GitHub Desktop, Zed,
  OpenAI Chat Completions и т. п.;
- технические шаблоны — `Cron {expression}`, `{percent}%`, `+{count}`,
  `{from}–{to}`;
- строки, которые DSH фиксирует в момент регистрации (например, описания
  слэш-команд), — обновляются при перезагрузке страницы.

### Ограничения

Схема словарей различает только формы «1» и «не 1», поэтому для единиц времени
использованы сокращения («мин», «ч», «дн»), корректные при любом числе: полные
слова давали бы «2 дней». Русские формы для 2–4 в этой схеме невыразимы без
изменения самого DSH.

### Обновление под новую версию DSH

Строки извлекаются из `app.asar` (пакеты `@deepseek-ai/dsh-client-*`), затем
переводятся и вливаются в `translations/ru.json`. Если после обновления DSH
какая-то часть интерфейса осталась английской — значит появились новые ключи,
которых нет в пакете.

---

## English

### How it works

The locale core owns the language catalog and the dictionary registry. An external
client plugin adds a language with two calls:

```js
export const inject = ['locale']

export function apply(ctx) {
  ctx.effect(() => ctx.locale.addLanguage({ id: 'ru', label: 'Русский', fallback: 'en' }), 'ru: language')
  ctx.effect(() => ctx.locale.register('chat', 'ru', { /* key: translation */ }), 'ru: chat')
}
```

The host scans enabled Loader entries, finds `dsh.client` in the package manifest
and serves `lib/client.js` under `/plugins/...`; the browser loads the bundle
lazily and registers the dictionaries. The language selector, preference
persistence and `<html lang>` switch are handled by the core.

### Contents

| File | Role |
|---|---|
| `package.json` | package manifest and the `dsh.client` declaration (`platform: web`) |
| `lib/index.js` | host half: an empty cordis plugin that only makes the row mountable |
| `lib/client.js` | **generated** browser bundle carrying the dictionaries |
| `translations/ru.json` | translation source: `{ namespace: { key: text } }` |
| `build_locale.cjs` | builds `lib/client.js` from `translations/ru.json` |

Never edit `lib/client.js` by hand — rebuild it instead.

### Installation

1. Clone or copy the package to a permanent location.
2. Link it into the profile's `node_modules`:

   ```powershell
   New-Item -ItemType Junction `
     -Path "$env:USERPROFILE\.dsh\profiles\desktop\node_modules\dsh-locale-ru" `
     -Target "C:\path\to\dsh-locale-ru"
   ```

3. Add the row to `%USERPROFILE%\.dsh\profiles\desktop\cordis.patch.yml`:

   ```yaml
   - insert:
       - id: locale-ru
         name: dsh-locale-ru
   ```

4. Restart the application (HMR also picks the change up live, but a restart is
   safer for the first mount).
5. Settings → General → Language → **Русский**.

The choice is stored in the profile (`locale.preference`) and survives restarts.

### Rebuilding

Edit `translations/ru.json`, then:

```powershell
node build_locale.cjs
```

The script validates the structure and rebuilds `lib/client.js`.

### Removal

1. Remove the `locale-ru` `insert` block from `cordis.patch.yml`.
2. Delete the `node_modules\dsh-locale-ru` junction.
3. Restart the application.

### What stays in English

Intentionally left untranslated:

- product and service names — DeepSeek, VS Code, GitHub Desktop, Zed,
  OpenAI Chat Completions and similar;
- technical templates — `Cron {expression}`, `{percent}%`, `+{count}`,
  `{from}–{to}`;
- strings the host captures at registration time (for example slash-command
  descriptions) — they refresh on page reload.

### Limitations

The dictionary schema distinguishes only the "1" and "not 1" forms, so time units
use abbreviations («мин», «ч», «дн») that stay grammatical for any number: full
words would produce «2 дней». Russian 2–4 forms are not expressible without
changing DSH itself.

### Keeping up with DSH updates

Strings are extracted from `app.asar` (the `@deepseek-ai/dsh-client-*` packages),
translated and merged into `translations/ru.json`. If part of the UI stays English
after a DSH update, new keys appeared that the pack does not cover yet.

### Compatibility

Built against DSH `0.2.1-rc.5`. Untranslated keys fall back to English through the
`ru → en` chain, so a newer DSH still works.

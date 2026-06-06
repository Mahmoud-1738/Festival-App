# Festival CMS — MySQL + PHP setup (XAMPP)

The schedule now lives in a **MySQL database** and is served by a small **PHP API**.
No Node server needed anymore for the live site.

## 1. Import the database (once)

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Open phpMyAdmin: <http://localhost/phpmyadmin>
3. Click the **Import** tab (top).
4. Choose the file **`database/schedule.sql`** from this project.
5. Click **Go / Import**.

This creates a database called **`festival`** with two tables (`stages`, `acts`)
and fills in the full line-up (4 stages, 51 acts).

## 2. Put the app in XAMPP

1. Copy everything inside the **`dist/`** folder into
   **`C:\xampp\htdocs\festivalapp\`**
   (so you end up with `htdocs\festivalapp\index.html`, `htdocs\festivalapp\api\…`, etc.)
2. Open the app:  <http://localhost/festivalapp/>
   CMS:           <http://localhost/festivalapp/admin.html>  (password: `festival2026`)

> The build is configured for the sub-folder `/festivalapp/`. If you serve it from a
> different folder, change `base` in `vite.config.js` and run `npm run build` again.

## 3. Database connection settings

The API reads its settings from **`dist/api/db.php`** (source: `public/api/db.php`).
The defaults already match a standard XAMPP install:

```php
const DB_HOST = '127.0.0.1';
const DB_NAME = 'festival';
const DB_USER = 'root';
const DB_PASS = '';            // XAMPP has no MySQL password by default
const ADMIN_PASSWORD = 'festival2026';
```

If your MySQL has a password, or you deploy to the school host, edit these values.

## How it works

- **Database** `festival`: `stages` (4 rows) and `acts` (the line-up).
- **PHP API** in `api/`:
  - `GET  api/schedule.php` — public; returns stages + schedule (used by the app).
  - `POST api/login.php` — checks the password, returns a signed token.
  - `api/acts.php` — create (POST), update (PUT `?id=`), delete (DELETE `?id=`); needs the token.
- **App** reads `api/schedule.php` on load, with an offline fallback to its built-in copy.
- **CMS** (`admin.html`) logs in, then adds/edits/deletes acts — saved straight to MySQL.

## Putting it on the school host (gluwebsite.nl) later

DirectAdmin also has PHP + MySQL, so the same code works there:
1. In DirectAdmin → **MySQL Management**, create a database + user. Note the name/user/password
   (they’ll look like `u240407_festival`).
2. Edit `db.php` with those values and rebuild (or edit the copy already uploaded).
3. In the host’s phpMyAdmin, **Import** `database/schedule.sql` (or just the two `CREATE TABLE`
   + `INSERT` parts if the database already exists).
4. Upload the `dist/` contents to the `festivalapp` folder.

## Regenerating the seed

If you change the bundled line-up in `src/data.js`, regenerate the SQL with:

```
node gen_sql.cjs
```

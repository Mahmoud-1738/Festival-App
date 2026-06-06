// Generates database/schedule.sql from src/data.js so the seed always
// matches the bundled lineup.
const fs = require('fs');
const path = require('path');

(async () => {
  const data = await import('./src/data.js');
  const { SCHEDULE, STAGES } = data;
  const esc = (s) => String(s).replace(/'/g, "''");
  const sub = (i) => (i === 0 ? 'Main' : i === 1 ? 'Talent' : i === 2 ? 'Theater' : 'Dance');

  const lines = [];
  lines.push('-- =====================================================');
  lines.push('-- ❤U Festival — schedule database');
  lines.push('-- Import this file in phpMyAdmin (XAMPP). It creates the');
  lines.push('-- `festival` database, the tables, and the full line-up.');
  lines.push('-- =====================================================');
  lines.push('');
  lines.push('CREATE DATABASE IF NOT EXISTS `festival` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  lines.push('USE `festival`;');
  lines.push('');
  lines.push('DROP TABLE IF EXISTS `acts`;');
  lines.push('DROP TABLE IF EXISTS `stages`;');
  lines.push('');
  lines.push('CREATE TABLE `stages` (');
  lines.push('  `idx`  INT          NOT NULL PRIMARY KEY,   -- 0..3');
  lines.push('  `name` VARCHAR(80)  NOT NULL,');
  lines.push('  `sub`  VARCHAR(80)  NOT NULL');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');
  lines.push('');
  lines.push('CREATE TABLE `acts` (');
  lines.push('  `id`         VARCHAR(24)  NOT NULL PRIMARY KEY,');
  lines.push('  `day_num`    TINYINT      NOT NULL,            -- 1 or 2');
  lines.push('  `s`          TINYINT      NOT NULL,            -- stage index');
  lines.push('  `k`          VARCHAR(16)  NOT NULL,            -- main/talent/club/dj');
  lines.push('  `name`       VARCHAR(120) NOT NULL,');
  lines.push('  `start_time` CHAR(5)      NOT NULL,            -- HH:MM');
  lines.push('  `end_time`   CHAR(5)      NOT NULL,            -- HH:MM');
  lines.push('  `genre`      VARCHAR(80)  NULL,');
  lines.push('  `bio`        TEXT         NULL,');
  lines.push('  KEY `by_day` (`day_num`, `s`)');
  lines.push(') ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;');
  lines.push('');
  lines.push('-- ---- Stages ----');
  STAGES.forEach((name, i) => {
    lines.push(`INSERT INTO \`stages\` (\`idx\`,\`name\`,\`sub\`) VALUES (${i}, '${esc(name)}', '${esc(sub(i))}');`);
  });
  lines.push('');
  lines.push('-- ---- Acts ----');
  for (const day of Object.keys(SCHEDULE)) {
    for (const a of SCHEDULE[day]) {
      lines.push(
        `INSERT INTO \`acts\` (\`id\`,\`day_num\`,\`s\`,\`k\`,\`name\`,\`start_time\`,\`end_time\`) VALUES ` +
        `('${esc(a.id)}', ${day}, ${a.s}, '${esc(a.k)}', '${esc(a.name)}', '${esc(a.start)}', '${esc(a.end)}');`
      );
    }
  }
  lines.push('');

  const dir = path.join(__dirname, 'database');
  fs.mkdirSync(dir, { recursive: true });

  // Full file (XAMPP / local): creates the `festival` database too.
  const full = path.join(dir, 'schedule.sql');
  fs.writeFileSync(full, lines.join('\n'), 'utf8');
  console.log('Wrote', full, '—', lines.length, 'lines');

  // Tables-only (shared hosting / DirectAdmin): import INTO an
  // already-created database, so drop the CREATE DATABASE / USE lines.
  const tablesOnly = lines.filter(l =>
    !l.startsWith('CREATE DATABASE') && !l.startsWith('USE `festival`'));
  const hostHeader = [
    '-- =====================================================',
    '-- ❤U Festival — TABLES ONLY (for shared hosting)',
    '-- First create a database in DirectAdmin (MySQL Management),',
    '-- open it in phpMyAdmin, then Import THIS file into it.',
    '-- =====================================================',
    '',
  ];
  const hostOut = path.join(dir, 'schedule_tables_only.sql');
  fs.writeFileSync(hostOut, hostHeader.concat(tablesOnly).join('\n'), 'utf8');
  console.log('Wrote', hostOut);
})();

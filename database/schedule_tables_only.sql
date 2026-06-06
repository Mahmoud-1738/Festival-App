-- =====================================================
-- ❤U Festival — TABLES ONLY (for shared hosting)
-- First create a database in DirectAdmin (MySQL Management),
-- open it in phpMyAdmin, then Import THIS file into it.
-- =====================================================

-- =====================================================
-- ❤U Festival — schedule database
-- Import this file in phpMyAdmin (XAMPP). It creates the
-- `festival` database, the tables, and the full line-up.
-- =====================================================


DROP TABLE IF EXISTS `acts`;
DROP TABLE IF EXISTS `stages`;

CREATE TABLE `stages` (
  `idx`  INT          NOT NULL PRIMARY KEY,   -- 0..3
  `name` VARCHAR(80)  NOT NULL,
  `sub`  VARCHAR(80)  NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `acts` (
  `id`         VARCHAR(24)  NOT NULL PRIMARY KEY,
  `day_num`    TINYINT      NOT NULL,            -- 1 or 2
  `s`          TINYINT      NOT NULL,            -- stage index
  `k`          VARCHAR(16)  NOT NULL,            -- main/talent/club/dj
  `name`       VARCHAR(120) NOT NULL,
  `start_time` CHAR(5)      NOT NULL,            -- HH:MM
  `end_time`   CHAR(5)      NOT NULL,            -- HH:MM
  `genre`      VARCHAR(80)  NULL,
  `bio`        TEXT         NULL,
  KEY `by_day` (`day_num`, `s`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Stages ----
INSERT INTO `stages` (`idx`,`name`,`sub`) VALUES (0, 'Ponton', 'Main');
INSERT INTO `stages` (`idx`,`name`,`sub`) VALUES (1, 'The Lake', 'Talent');
INSERT INTO `stages` (`idx`,`name`,`sub`) VALUES (2, 'The Club', 'Theater');
INSERT INTO `stages` (`idx`,`name`,`sub`) VALUES (3, 'Hangaar', 'Dance');

-- ---- Acts ----
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1a1', 1, 0, 'main', 'Armin van Buuren', '10:30', '12:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1a2', 1, 0, 'main', 'Kensington', '12:30', '14:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1a3', 1, 0, 'main', 'De Staat', '14:30', '16:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1a4', 1, 0, 'main', 'Navarone', '17:00', '18:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1a5', 1, 0, 'main', 'Dotan', '19:15', '21:15');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1a6', 1, 0, 'main', 'Froukje', '22:00', '24:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b1', 1, 1, 'talent', 'Talent set 1', '10:00', '11:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b2', 1, 1, 'talent', 'Talent set 2', '11:30', '13:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b3', 1, 1, 'talent', 'Talent set 3', '13:30', '15:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b4', 1, 1, 'talent', 'Talent set 4', '15:30', '17:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b5', 1, 1, 'talent', 'Talent set 5', '17:30', '18:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b6', 1, 1, 'talent', 'Talent set 6', '19:15', '20:45');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1b7', 1, 1, 'talent', 'Talent set 7', '21:30', '23:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1c1', 1, 2, 'club', 'Comedy', '12:15', '13:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1c2', 1, 2, 'club', 'Lecture', '13:45', '14:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1c3', 1, 2, 'club', 'Theater', '15:15', '16:45');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1c4', 1, 2, 'club', 'Movie', '17:30', '19:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1c5', 1, 2, 'club', 'Performance', '20:15', '21:15');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1c6', 1, 2, 'club', 'Illusionist', '22:00', '23:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d1', 1, 3, 'dj', 'DJ set 1', '10:00', '11:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d2', 1, 3, 'dj', 'DJ set 2', '11:00', '12:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d3', 1, 3, 'dj', 'DJ set 3', '12:30', '14:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d4', 1, 3, 'dj', 'DJ set 4', '14:00', '15:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d5', 1, 3, 'dj', 'DJ set 5', '15:30', '17:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d6', 1, 3, 'dj', 'DJ set 6', '17:30', '19:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d7', 1, 3, 'dj', 'DJ set 7', '19:30', '21:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s1d8', 1, 3, 'dj', 'DJ set 8', '21:30', '24:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2a1', 2, 0, 'main', 'Martin Garrix', '11:00', '13:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2a2', 2, 0, 'main', 'Within Temptation', '13:45', '15:45');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2a3', 2, 0, 'main', 'Chef''Special', '16:30', '18:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2a4', 2, 0, 'main', 'Eefje de Visser', '19:15', '21:15');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2a5', 2, 0, 'main', 'Spinvis', '22:00', '24:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2b1', 2, 1, 'talent', 'Talent set 1', '10:00', '11:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2b2', 2, 1, 'talent', 'Talent set 2', '11:30', '13:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2b3', 2, 1, 'talent', 'Talent set 3', '13:30', '15:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2b4', 2, 1, 'talent', 'Talent set 4', '15:30', '17:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2b5', 2, 1, 'talent', 'Talent set 5', '18:15', '19:45');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2b6', 2, 1, 'talent', 'Talent set 6', '20:30', '22:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2c1', 2, 2, 'club', 'Comedy', '12:00', '12:45');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2c2', 2, 2, 'club', 'Lecture', '13:30', '14:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2c3', 2, 2, 'club', 'Theater', '15:30', '16:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2c4', 2, 2, 'club', 'Movie', '17:30', '19:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2c5', 2, 2, 'club', 'Magic Show', '20:15', '21:45');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d1', 2, 3, 'dj', 'DJ set 1', '10:00', '10:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d2', 2, 3, 'dj', 'DJ set 2', '10:30', '12:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d3', 2, 3, 'dj', 'DJ set 3', '12:30', '13:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d4', 2, 3, 'dj', 'DJ set 4', '13:30', '15:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d5', 2, 3, 'dj', 'DJ set 5', '15:30', '17:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d6', 2, 3, 'dj', 'DJ set 6', '17:00', '18:30');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d7', 2, 3, 'dj', 'DJ set 7', '18:30', '21:00');
INSERT INTO `acts` (`id`,`day_num`,`s`,`k`,`name`,`start_time`,`end_time`) VALUES ('s2d8', 2, 3, 'dj', 'DJ set 8', '21:00', '24:00');

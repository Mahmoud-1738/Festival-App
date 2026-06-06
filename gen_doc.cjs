const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, TableOfContents, PageNumber, Footer,
} = require('docx');

const BRAND = '9B1830';
const ACCENT = '247BA0';
const GREY = '555555';

const P = (text, opts = {}) => new Paragraph({ spacing: { after: 140, line: 276 }, children: [new TextRun({ text, ...opts })] });
const runs = (children, after = 140) => new Paragraph({ spacing: { after, line: 276 }, children });
const b = (t) => new TextRun({ text: t, bold: true });
const code = (t) => new TextRun({ text: t, font: 'Consolas', size: 20, color: BRAND });
function bullet(children, level = 0) {
  const kids = Array.isArray(children) ? children : [new TextRun(children)];
  return new Paragraph({ numbering: { reference: 'bullets', level }, spacing: { after: 80, line: 270 }, children: kids });
}
function num(children) {
  const kids = Array.isArray(children) ? children : [new TextRun(children)];
  return new Paragraph({ numbering: { reference: 'steps', level: 0 }, spacing: { after: 90, line: 270 }, children: kids });
}
function codeBlock(lines) {
  return new Paragraph({
    spacing: { before: 60, after: 160 },
    shading: { fill: 'F4F4F2', type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
    children: lines.map((l, i) => new TextRun({ text: l, font: 'Consolas', size: 20, break: i === 0 ? 0 : 1 })),
  });
}
const cb = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const cbs = { top: cb, bottom: cb, left: cb, right: cb };
function tcell(text, width, head) {
  return new TableCell({
    borders: cbs, width: { size: width, type: WidthType.DXA },
    shading: { fill: head ? BRAND : 'FFFFFF', type: ShadingType.CLEAR },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [new TextRun({ text, bold: !!head, color: head ? 'FFFFFF' : '000000', size: 20 })] })],
  });
}
function table(widths, header, body) {
  const mk = (cells, head) => new TableRow({ children: cells.map((t, i) => tcell(t, widths[i], head)) });
  return new Table({ width: { size: widths.reduce((a, c) => a + c, 0), type: WidthType.DXA }, columnWidths: widths,
    rows: [mk(header, true), ...body.map((r) => mk(r, false))] });
}
const spacer = (h = 80) => new Paragraph({ spacing: { after: h }, children: [] });
const H1 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const H2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const H3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });

const doc = new Document({
  creator: 'Festival App',
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, color: BRAND, font: 'Calibri' }, paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, color: ACCENT, font: 'Calibri' }, paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 23, bold: true, color: '222222', font: 'Calibri' }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 280 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1040, hanging: 280 } } } },
      ] },
      { reference: 'steps', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } },
      ] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: '❤U Festival App  ·  ', size: 18, color: GREY }),
      new TextRun({ text: 'Page ', size: 18, color: GREY }),
      new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GREY }),
    ] })] }) },
    children: [
      spacer(600),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '❤U Festival App', bold: true, size: 64, color: BRAND })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: 'How It Works — Presentation Guide', size: 32, color: ACCENT })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'Utrecht 2026  ·  Interactive GPS map + database-driven schedule (CMS)', italics: true, size: 22, color: GREY })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'A plain-language explanation of every part of the project', size: 20, color: GREY })] }),
      spacer(300),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND, space: 1 } }, children: [] }),
      spacer(200),
      H2('What’s in this guide'),
      new TableOfContents('Table of Contents', { hyperlink: true, headingStyleRange: '1-2' }),
      new Paragraph({ children: [new PageBreak()] }),

      // 1
      H1('1. The big picture'),
      P('The project is a Progressive Web App (PWA) — a website that behaves like a phone app. A visitor opens it in their browser (or installs it to the home screen) and gets four screens: Home, Info, Schedule and Map.'),
      P('It is made of three cooperating parts:'),
      table([3000, 3300, 3060],
        ['Part', 'What it is', 'What it does'],
        [
          ['The app (front-end)', 'React + Vite, runs in the browser', 'Shows the four screens to the visitor'],
          ['The API (back-end)', 'PHP scripts on the web server', 'Reads and writes the schedule'],
          ['The database', 'MySQL (managed in phpMyAdmin)', 'Stores the schedule permanently'],
        ]),
      spacer(),
      runs([b('Plus the CMS: '), new TextRun('a separate, password-protected admin page (admin.html) that organisers use to edit the schedule. It talks to the same PHP API.')]),
      runs([b('One-line summary: '), new TextRun('the app shows things, the database remembers things, the PHP API is the messenger between them, and the CMS lets an organiser change things.')]),

      H2('The technology, in one table'),
      table([2700, 6660],
        ['Tool', 'Why it’s used'],
        [
          ['React', 'Builds the screens from reusable pieces (“components”)'],
          ['Vite', 'Runs the app while developing and bundles it for release'],
          ['PHP', 'The server language (runs on XAMPP / the school host) that answers requests'],
          ['MySQL', 'The database that stores the stages and acts'],
          ['phpMyAdmin', 'The web tool used to create/import the database'],
          ['Geolocation Web API', 'The browser feature that reads the visitor’s real GPS position'],
          ['SVG', 'The festival map drawn as sharp, zoomable vector shapes'],
          ['PWA / Service Worker', 'Makes it installable and able to work offline'],
        ]),
      new Paragraph({ children: [new PageBreak()] }),

      // 2 MAP
      H1('2. How the map works'),
      P('Usually the best part to demo live. Three ideas: the picture, the markers, and the GPS dot.'),
      H2('2.1  The map is a vector drawing (SVG)'),
      P('The map (kaart_festival_markers.svg) is not a photo. It is a vector file: grass, water, paths and markers are described with maths, not pixels. That is why it stays perfectly sharp at any zoom.'),
      runs([new TextRun('Inside it there is a coordinate grid called a '), b('viewBox'), new TextRun(' of 2330 × 1353 units — like graph paper. Every shape and marker has an (x, y) position on it. Top-left is (0, 0); x grows right, y grows down.')]),
      H3('“Use the whole map, don’t cut it”'),
      P('The picture sits in an <svg> with one setting that decides how it fits the screen:'),
      bullet([b('meet'), new TextRun(' = fit the whole image inside the box — nothing is cut off (what we use).')]),
      bullet([b('slice'), new TextRun(' = fill the box and crop the overflow (this is why the old map looked cut off).')]),
      runs([new TextRun('So that fix was essentially changing '), code('slice'), new TextRun(' to '), code('meet'), new TextRun(' and using the full artwork.')]),
      H2('2.2  The stage markers and tapping'),
      P('The coloured markers (numbered stages 1–4, toilets, food, bars…) are drawn into the SVG by the designer. On top of the four stages we place four invisible, clickable circles at their exact coordinates.'),
      num('React remembers which stage you tapped.'),
      num('That makes the bottom detail sheet slide up with the stage name, description and LIVE badge.'),
      runs([new TextRun('Stage 1 = Ponton, 2 = The Lake, 3 = The Club, 4 = Hangaar — the same numbering the designer used, so the tap-zones line up.')]),
      H2('2.3  The GPS dot — the “real web API” part'),
      H3('Step A — Ask the browser for the location'),
      runs([new TextRun('The browser has a built-in '), b('Geolocation API'), new TextRun('. We call '), code('navigator.geolocation.watchPosition(...)'), new TextRun(', which keeps reporting the visitor’s position as they move. It returns a real-world '), b('latitude and longitude'), new TextRun(' (e.g. 52.073, 5.047) — not pixels.')]),
      H3('Step B — Convert GPS into a spot on the picture'),
      P('GPS numbers mean nothing to the drawing, so we translate them using the map’s known edge coordinates (north, south, east, west) and simple proportion maths:'),
      codeBlock([
        'x = (longitude − westEdge) / (eastEdge − westEdge) × 2330',
        'y = (northEdge − latitude)  / (northEdge − southEdge) × 1353',
      ]),
      runs([new TextRun('In plain words: “you are 40% of the way from the west edge to the east edge → put the dot 40% across the map.”')]),
      H3('Step C — Draw the dot'),
      P('A pulsing blue dot is drawn at that (x, y), with a ring whose size reflects the GPS accuracy. Outside the four edges, the dot hides and a “you’re outside the festival grounds” banner shows.'),
      runs([b('For questions: '), new TextRun('the four edge coordinates are estimates; plugging in the real corner GPS values makes the dot pixel-accurate. This is called calibration.')]),
      H2('2.4  Zoom and pan'),
      runs([new TextRun('The map sits in a box with a CSS '), code('transform'), new TextRun('. Zoom changes '), code('scale(...)'), new TextRun('; dragging changes '), code('translate(x, y)'), new TextRun('. It never reloads, so it feels instant.')]),
      new Paragraph({ children: [new PageBreak()] }),

      // 3 DB + PHP + CMS
      H1('3. The schedule, the database, the PHP API and the CMS'),
      P('The schedule (who plays, where and when) is not hard-coded into the app. It lives in a MySQL database, and an organiser edits it through the admin page. Here is the journey of the data.'),
      H2('3.1  The database (MySQL)'),
      P('A database is an organised store of data, made of tables (like spreadsheets). Ours has two:'),
      table([2600, 6760],
        ['Table', 'What it holds'],
        [
          ['stages', '4 rows: Ponton, The Lake, The Club, Hangaar (name + type)'],
          ['acts', 'Every performance: which day, which stage, name, start/end time, optional genre & bio'],
        ]),
      spacer(),
      runs([new TextRun('We create it by importing the file '), code('database/schedule.sql'), new TextRun(' into phpMyAdmin. That one file builds the tables and fills them with the full line-up (4 stages, 51 acts).')]),
      H2('3.2  The PHP API — the messenger'),
      P('The browser cannot talk to a database directly (that would be insecure). Instead it calls small PHP scripts — the API — which talk to MySQL and return the data as JSON. An API is just a set of web addresses (endpoints). Ours:'),
      table([3400, 5960],
        ['Endpoint', 'What it does'],
        [
          ['GET  api/schedule.php', 'Public. Returns the whole schedule. The app calls this on startup.'],
          ['POST api/login.php', 'Checks the admin password, returns a token (a temporary key).'],
          ['POST api/acts.php', 'Adds an act. Requires the token.'],
          ['PUT  api/acts.php?id=…', 'Edits an act. Requires the token.'],
          ['DELETE api/acts.php?id=…', 'Removes an act. Requires the token.'],
        ]),
      spacer(),
      runs([b('The token / security idea: '), new TextRun('anyone may read the schedule, but only someone who knows the admin password may change it. After logging in, every edit must carry the token — like a wristband that proves you’re allowed backstage. Edits use PDO prepared statements, which protect the database from injection attacks.')]),
      H2('3.3  The data flow, end to end'),
      num('An organiser opens the CMS and logs in → login.php checks the password and returns a token.'),
      num('They add or edit an act and press Save → the CMS sends it to acts.php with the token.'),
      num('The PHP checks the token, runs an INSERT / UPDATE / DELETE on MySQL, and confirms.'),
      num('Any visitor who opens or refreshes the app calls schedule.php and sees the new line-up.'),
      runs([new TextRun('So one edit in the CMS reaches everyone’s app — that is what “content-managed” means.')]),
      H2('3.4  Offline safety net'),
      P('If the server can’t be reached, the app quietly falls back to a copy of the schedule bundled inside it and shows a small “showing saved schedule” note — so it never breaks in front of an audience.'),
      H2('3.5  Bonus: rich act details'),
      runs([new TextRun('Tapping an act opens a sheet with the artist’s '), b('photo'), new TextRun(', a full '), b('bio'), new TextRun(', and a '), b('YouTube video'), new TextRun(' that plays inside the app. Photos live in the project’s assets folder; videos load only when you press play, so the app stays fast.')]),
      new Paragraph({ children: [new PageBreak()] }),

      // 4 running / deploy
      H1('4. Running and hosting it'),
      H2('4.1  Locally with XAMPP'),
      num('Start Apache + MySQL in the XAMPP Control Panel.'),
      num('In phpMyAdmin, Import the file database/schedule.sql (creates the “festival” database).'),
      num('Copy the contents of the dist folder into C:\\xampp\\htdocs\\festivalapp\\'),
      runs([new TextRun('Then open: '), code('http://localhost/festivalapp/'), new TextRun('  and the CMS at  '), code('http://localhost/festivalapp/admin.html'), new TextRun('  (password festival2026).')]),
      H2('4.2  Why the “black screen” happened on the school host'),
      runs([new TextRun('The app was hosted in a sub-folder ('), code('/festivalapp/'), new TextRun('), but it was built expecting the domain root, so every file 404’d. The fix was telling the build where it lives — '), code("base: '/festivalapp/'"), new TextRun(' in vite.config.js — then rebuilding.')]),
      H2('4.3  Database settings'),
      runs([new TextRun('The API reads its settings from '), code('api/db.php'), new TextRun('. Defaults match XAMPP (host 127.0.0.1, user root, empty password, database “festival”). On the school host you create a MySQL database in DirectAdmin and put those details here instead.')]),
      new Paragraph({ children: [new PageBreak()] }),

      // 5 cheat sheet
      H1('5. Presentation cheat-sheet'),
      H2('A 60-second pitch'),
      P('“❤U Festival is a phone-friendly web app for a two-day festival in Utrecht. Visitors get live updates, practical info, a full schedule, and an interactive map that shows where they are using real GPS. The schedule isn’t fixed in code — it lives in a MySQL database, and organisers edit it through a password-protected admin page. A small PHP API connects the app to the database, so any change appears for everyone instantly. The front-end is built with React; the back-end is PHP + MySQL running on the web server.”'),
      H2('A suggested demo order'),
      num('Open the app on the Map — show the full map; pan and zoom.'),
      num('Tap a stage — show the detail sheet and the LIVE badge.'),
      num('Open an act in the Schedule — show the photo, bio and playing video.'),
      num('Open the CMS, log in, edit an act, Save.'),
      num('Refresh the app’s Schedule — the change is there. That’s the “wow” moment.'),
      num('(Optional) Show the data in phpMyAdmin to prove it’s a real database.'),
      H2('Likely questions — short answers'),
      H3('“Is it a real app from the App Store?”'),
      P('It’s a PWA — a website that can be installed to the home screen and works offline. No app store needed; it runs on any phone.'),
      H3('“How does it know where I am?”'),
      P('The browser’s Geolocation API gives real GPS coordinates; we convert those into a position on the map using proportions between the map’s known corner coordinates.'),
      H3('“Where is the schedule stored?”'),
      P('In a MySQL database with two tables (stages and acts). The app reads it through a PHP API; the CMS writes to it. Anyone can read; only an admin with the password can change it.'),
      H3('“Why did you use a database instead of a file?”'),
      P('A database handles edits safely, is the standard tool the hosting provides (MySQL), and makes the CMS robust. It’s also easy to query and back up.'),
      H3('“Is it secure?”'),
      P('Editing needs a password that returns a temporary signed token; every change must carry it. Database queries use prepared statements to prevent SQL injection. For a public launch you’d add HTTPS and stronger accounts.'),
      H3('“What happens with no internet?”'),
      P('The app falls back to a built-in copy of the schedule and keeps working, showing a small “saved schedule” note.'),
      H2('Words you can drop to sound sharp'),
      table([2600, 6760],
        ['Term', 'Say it like this'],
        [
          ['Front-end / back-end', '“The part you see” vs “the part that stores data”'],
          ['API', '“Web addresses programs use to exchange data”'],
          ['Endpoint', '“One specific API address, like api/schedule.php”'],
          ['MySQL / database', '“Where the schedule is stored, in tables”'],
          ['PHP', '“The server code that talks to the database”'],
          ['Geolocation API', '“The browser feature that reads real GPS”'],
          ['Prepared statement', '“A safe way to run database queries”'],
          ['PWA', '“An installable website that works offline”'],
          ['Token', '“A temporary key proving you’re allowed to edit”'],
        ]),
      spacer(160),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'You’ve got this — good luck tomorrow! ❤', italics: true, color: BRAND, size: 24 })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(process.argv[2], buf); console.log('written', process.argv[2], buf.length, 'bytes'); });

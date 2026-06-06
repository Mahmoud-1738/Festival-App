const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel,
  BorderStyle, ShadingType, PageBreak, LevelFormat, Footer, PageNumber,
  Table, TableRow, TableCell, WidthType, TableOfContents,
} = require('docx');

const BRAND = '9B1830', ACCENT = '247BA0', GREY = '555555';
const AR = 'Arial';

// Arabic (RTL) paragraph
const ar = (text, opts = {}) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 140, line: 312 },
  children: [new TextRun({ text, rightToLeft: true, font: AR, ...opts })],
});
// Arabic paragraph with mixed runs (pass array of TextRun)
const arRuns = (children, after = 140) => new Paragraph({
  bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after, line: 312 }, children,
});
const t = (text, opts = {}) => new TextRun({ text, rightToLeft: true, font: AR, ...opts });   // arabic run
const code = (text) => new TextRun({ text, font: 'Consolas', size: 20, color: BRAND });        // inline code (LTR)
const bold = (text) => new TextRun({ text, rightToLeft: true, font: AR, bold: true });

const H1 = (txt) => new Paragraph({ heading: HeadingLevel.HEADING_1, bidirectional: true, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: txt, rightToLeft: true, font: AR })] });
const H2 = (txt) => new Paragraph({ heading: HeadingLevel.HEADING_2, bidirectional: true, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: txt, rightToLeft: true, font: AR })] });
const H3 = (txt) => new Paragraph({ heading: HeadingLevel.HEADING_3, bidirectional: true, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: txt, rightToLeft: true, font: AR })] });

const arNum = (text) => new Paragraph({ numbering: { reference: 'steps', level: 0 }, bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 90, line: 300 }, children: [new TextRun({ text, rightToLeft: true, font: AR })] });
const arNumRuns = (children) => new Paragraph({ numbering: { reference: 'steps', level: 0 }, bidirectional: true, alignment: AlignmentType.RIGHT, spacing: { after: 90, line: 300 }, children });

// Code block (LTR, left aligned)
function codeBlock(lines) {
  return new Paragraph({
    spacing: { before: 60, after: 160 }, alignment: AlignmentType.LEFT,
    shading: { fill: 'F4F4F2', type: ShadingType.CLEAR },
    border: { left: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 8 } },
    children: lines.map((l, i) => new TextRun({ text: l, font: 'Consolas', size: 19, break: i === 0 ? 0 : 1 })),
  });
}
const spacer = (h = 80) => new Paragraph({ spacing: { after: h }, children: [] });

// RTL table (header on the right)
const cb = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const cbs = { top: cb, bottom: cb, left: cb, right: cb };
function tcell(text, width, head) {
  return new TableCell({ borders: cbs, width: { size: width, type: WidthType.DXA },
    shading: { fill: head ? BRAND : 'FFFFFF', type: ShadingType.CLEAR },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: [new Paragraph({ bidirectional: true, alignment: AlignmentType.RIGHT, children: [new TextRun({ text, rightToLeft: true, font: AR, bold: !!head, color: head ? 'FFFFFF' : '000000', size: 20 })] })] });
}
function table(widths, header, body) {
  const mk = (cells, head) => new TableRow({ children: cells.map((c, i) => tcell(c, widths[i], head)) });
  return new Table({ visuallyRightToLeft: true, width: { size: widths.reduce((a, c) => a + c, 0), type: WidthType.DXA }, columnWidths: widths, rows: [mk(header, true), ...body.map((r) => mk(r, false))] });
}

const doc = new Document({
  creator: 'Festival App',
  styles: {
    default: { document: { run: { font: AR, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 32, bold: true, color: BRAND, font: AR }, paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 27, bold: true, color: ACCENT, font: AR }, paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { size: 23, bold: true, color: '222222', font: AR }, paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [
    { reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.RIGHT, style: { paragraph: { indent: { right: 540, hanging: 300 } } } }] },
  ] },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '❤U Festival — شرح الخريطة  ·  ', size: 18, color: GREY, font: AR, rightToLeft: true }), new TextRun({ text: 'صفحة ', size: 18, color: GREY, font: AR, rightToLeft: true }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GREY })] })] }) },
    children: [
      spacer(500),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'كيف تعمل الخريطة', bold: true, size: 60, color: BRAND, font: AR, rightToLeft: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 160 }, children: [new TextRun({ text: 'شرح تفصيلي خطوة بخطوة — ❤U Festival', size: 28, color: ACCENT, font: AR, rightToLeft: true })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'الصورة (SVG)  ·  الماركرز  ·  نقطة الـ GPS الحقيقية', italics: true, size: 22, color: GREY, font: AR, rightToLeft: true })] }),
      spacer(260),
      new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: BRAND, space: 1 } }, children: [] }),
      spacer(180),
      H2('المحتويات'),
      new TableOfContents('المحتويات', { hyperlink: true, headingStyleRange: '1-2' }),
      new Paragraph({ children: [new PageBreak()] }),

      // 1
      H1('1. الفكرة العامة'),
      ar('الخريطة مكوّنة من ثلاث طبقات فوق بعض:'),
      arNum('صورة الخريطة (ملف SVG) — الخلفية اللي فيها العشب والماء والمسارات والبوديوم.'),
      arNum('الماركرز — نقاط لمس شفافة فوق البوديوم عشان لما تضغط يطلع تفاصيل المنصّة.'),
      arNum('نقطة الـ GPS — دائرة زرقاء تبيّن موقعك الحقيقي على الخريطة.'),
      ar('رح نشرح كل طبقة لحالها، وبالآخر نجمعها بالكود الكامل.'),

      // 2
      H1('2. ليش SVG؟ ونظام الإحداثيات (viewBox)'),
      arRuns([t('ملف الخريطة '), code('kaart_festival_markers.svg'), t(' مو صورة عادية (بكسلات)، هو ملف '), bold('متّجهي (vector)'), t(': العشب والماء والأشكال كلها معرّفة برياضيات. عشان كذا تبقى واضحة عند أي تكبير.')]),
      arRuns([t('جوّا الملف في شبكة إحداثيات اسمها '), bold('viewBox'), t(' مقاسها 2330 × 1353 وحدة — تخيّلها ورقة رسم بياني. كل شكل وكل ماركر له موقع '), code('(x, y)'), t(' على هذي الشبكة. الزاوية العليا اليسرى هي '), code('(0, 0)'), t('، و x يكبر لليمين، و y يكبر للأسفل.')]),
      H2('القيم بالكود'),
      codeBlock(['const MAP_W = 2330.58;  // عرض الخريطة', 'const MAP_H = 1353.19;  // ارتفاع الخريطة']),

      // 3
      H1('3. عرض الخريطة كاملة: meet مقابل slice'),
      ar('الصورة موضوعة جوّا عنصر <svg> فيه إعداد واحد مهم يقرّر كيف تتوزّع على الشاشة:'),
      arRuns([code('meet'), t('  =  تظهر الخريطة كاملة جوّا الإطار، بدون أي قص (هذا اللي نستخدمه الآن).')]),
      arRuns([code('slice'), t('  =  تملأ الإطار وتقص الزايد (هذا اللي كان يخلّي الخريطة "مقصوصة" قبل).')]),
      H2('الكود'),
      codeBlock([
        '<svg viewBox={`0 0 ${MAP_W} ${MAP_H}`}',
        '     preserveAspectRatio="xMidYMid meet">',
        '  <image href="assets/kaart_festival_markers.svg"',
        '         x="0" y="0" width={MAP_W} height={MAP_H}',
        '         preserveAspectRatio="xMidYMid meet" />',
        '</svg>',
      ]),
      arRuns([bold('xMidYMid'), t('  تعني: وسّط الصورة أفقياً (Mid-X) وعمودياً (Mid-Y). عشان كذا الخريطة تطلع بالنص.')]),

      // 4
      H1('4. الماركرز (نقاط اللمس على البوديوم)'),
      ar('الماركرز الملوّنة (أرقام البوديوم 1–4، الحمّامات، الأكل…) مرسومة جوّا ملف الـ SVG من المصمّم. إحنا نحط فوق البوديوم الأربعة دوائر شفافة قابلة للضغط، بنفس إحداثيات المصمّم.'),
      H2('قائمة البوديوم بالإحداثيات'),
      codeBlock([
        'const STAGE_HOTSPOTS = [',
        "  { id:'ponton',  x:496.9,   y:849.15, tKey:'markerPonton'  },",
        "  { id:'lake',    x:1256.98, y:615.25, tKey:'markerLake'    },",
        "  { id:'club',    x:1614.31, y:528.68, tKey:'markerClub'    },",
        "  { id:'hangaar', x:2102.13, y:231.18, tKey:'markerHangaar' },",
        '];',
      ]),
      ar('1 = Ponton ، 2 = The Lake ، 3 = The Club ، 4 = Hangaar — نفس ترقيم المصمّم عشان نقاط اللمس تنطبق تماماً فوق الماركرز.'),
      H2('كيف يشتغل الضغط'),
      arNum('تضغط على البوديوم → React يحفظ أي بوديوم ضغطت (setSelected).'),
      arNum('تطلع لوحة التفاصيل من تحت فيها اسم المنصّة ووصفها وشارة LIVE.'),
      H2('الكود (مبسّط)'),
      codeBlock([
        '{STAGE_HOTSPOTS.map(m => (',
        '  <g key={m.id} onClick={() => setSelected(m.id)}>',
        '    {/* دائرة شفافة = منطقة اللمس */}',
        '    <circle cx={m.x} cy={m.y} r={60} fill="#fff" opacity={0} />',
        '    {/* اسم المنصّة تحت الماركر */}',
        '    <text x={m.x} y={m.y+71} textAnchor="middle">{name}</text>',
        '  </g>',
        '))}',
      ]),

      // 5
      H1('5. نقطة الـ GPS — الجزء الأهم'),
      ar('هذي تبيّن للزائر وين هو على الخريطة. تشتغل بثلاث خطوات.'),

      H2('الخطوة A: نطلب الموقع من المتصفح'),
      arRuns([t('المتصفح فيه خاصية جاهزة اسمها '), bold('Geolocation API'), t('. نستدعي '), code('watchPosition'), t(' اللي يضل يعطينا موقعك كل ما تتحرّك. يرجّع '), bold('خط عرض و خط طول (lat/lng)'), t(' حقيقي — مو بكسلات.')]),
      codeBlock([
        'navigator.geolocation.watchPosition(',
        '  (pos) => {',
        '    const lat = pos.coords.latitude;   // مثال: 52.0768',
        '    const lng = pos.coords.longitude;  // مثال: 5.1061',
        '    const accuracy = pos.coords.accuracy; // الدقة بالأمتار',
        '  },',
        '  (err) => { /* رفض الإذن أو خطأ */ },',
        '  { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }',
        ');',
      ]),

      H2('الخطوة B: نحوّل lat/lng إلى نقطة على الصورة'),
      ar('أرقام الـ GPS ما تعني شي للرسمة، فنترجمها. عرّفنا إحداثيات حواف الخريطة الأربعة (شمال/جنوب/شرق/غرب)، وبعدها نسبة وتناسب بسيطة:'),
      H3('حدود الخريطة (MAP_BOUNDS)'),
      codeBlock([
        'const MAP_BOUNDS = {',
        '  north: 52.078653, // الحافة العليا  (y = 0)',
        '  south: 52.075053, // الحافة السفلى  (y = MAP_H)',
        '  west:  5.101143,  // الحافة اليسرى  (x = 0)',
        '  east:  5.111213,  // الحافة اليمنى  (x = MAP_W)',
        '};',
      ]),
      H3('معادلة التحويل'),
      codeBlock([
        'function gpsToXY(lat, lng) {',
        '  const x = ((lng - MAP_BOUNDS.west)  /',
        '             (MAP_BOUNDS.east - MAP_BOUNDS.west))  * MAP_W;',
        '  const y = ((MAP_BOUNDS.north - lat) /',
        '             (MAP_BOUNDS.north - MAP_BOUNDS.south)) * MAP_H;',
        '  return { x, y };',
        '}',
      ]),
      arRuns([t('بالعربي البسيط: "إنت قاطع 40% من الحافة الغربية للشرقية → حط النقطة عند 40% من عرض الخريطة." ونفس الفكرة من فوق لتحت. لاحظ إننا نستخدم '), code('north - lat'), t(' لأن y يكبر للأسفل بينما خط العرض يكبر للأعلى.')]),

      H2('الخطوة C: نرسم النقطة'),
      ar('نرسم دائرة زرقاء نابضة عند (x, y)، وحولها حلقة حجمها حسب دقة الإشارة. إذا طلع موقعك برّا الحواف الأربعة، نخفي النقطة ونطلّع رسالة "إنت برا أرض المهرجان".'),
      codeBlock([
        'const userXY = gpsToXY(coords.lat, coords.lng);',
        'const inside = userXY.x >= 0 && userXY.x <= MAP_W &&',
        '               userXY.y >= 0 && userXY.y <= MAP_H;',
        '',
        '{inside && (',
        '  <circle cx={userXY.x} cy={userXY.y} r={24}',
        '          fill="#247BA0" stroke="#fff" strokeWidth={9} />',
        ')}',
      ]),

      // 6
      H1('6. التكبير والتحريك (Zoom & Pan)'),
      arRuns([t('الخريطة موضوعة جوّا صندوق فيه خاصية CSS اسمها '), code('transform'), t('. التكبير يغيّر '), code('scale(...)'), t('، والسحب بالإصبع يغيّر '), code('translate(x, y)'), t('. الخريطة ما تتحمّل من جديد، عشان كذا الحركة تكون فورية وسلسة.')]),
      codeBlock([
        'transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`',
      ]),

      // 7
      H1('7. المعايرة — تضبط الخريطة لأي مكان'),
      ar('الأرقام الأربعة في MAP_BOUNDS هي السر. لو كانت غلط، النقطة تطلع بمكان غلط. لتضبطها لأي مكان (مثلاً المدرسة للعرض، أو أرض المهرجان الحقيقية):'),
      arNum('افتح Google Maps واضغط مطوّلاً على الزاوية العليا-اليسرى للمنطقة → خذ خط العرض (north) وخط الطول (west).'),
      arNum('سوِّ نفس الشي للزاوية السفلى-اليمنى → خذ (south) و (east).'),
      arNum('حطّهم في MAP_BOUNDS، واعمل npm run build من جديد.'),
      arRuns([bold('ملاحظة: '), t('الـ GPS بالمتصفح يشتغل بس على HTTPS، ولازم المستخدم يضغط "السماح/Allow" لما يُطلب إذن الموقع.')]),

      // 8
      H1('8. ملخص المصطلحات'),
      table([2600, 6760],
        ['المصطلح', 'المعنى المبسّط'],
        [
          ['SVG', 'صورة متّجهية (رياضية) تبقى واضحة عند أي تكبير'],
          ['viewBox', 'شبكة الإحداثيات الداخلية للخريطة (2330×1353)'],
          ['preserveAspectRatio', 'يقرّر هل تُعرض الخريطة كاملة (meet) أو مقصوصة (slice)'],
          ['Geolocation API', 'خاصية المتصفح اللي تقرأ موقع الـ GPS الحقيقي'],
          ['watchPosition', 'يتابع موقعك ويحدّثه كل ما تتحرّك'],
          ['lat / lng', 'خط العرض وخط الطول — إحداثيات العالم الحقيقي'],
          ['MAP_BOUNDS', 'إحداثيات حواف الخريطة الأربعة (للمعايرة)'],
          ['transform', 'خاصية CSS للتكبير (scale) والتحريك (translate)'],
        ]),
      spacer(160),
      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'بالتوفيق — صرت تفهم الخريطة من الألف للياء ❤', italics: true, color: BRAND, size: 24, font: AR, rightToLeft: true })] }),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(process.argv[2], buf); console.log('written', process.argv[2], buf.length, 'bytes'); });

// 강령탈춤 정기공연 초대장: index.html을 만들고 PDF(누르면 열리는 QR)와 PNG(공유용)로 렌더링
const fs = require('fs'), path = require('path');
const QR = require(path.resolve(__dirname, '../node_modules/qrcode'));
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const URL_BOOK = 'https://thehanfilm-code.github.io/panorama-viewer/onki-2026/';
const OUT = __dirname, F = path.resolve(__dirname, '../node_modules/@fontsource');

(async () => {
  const qr = (await QR.toString(URL_BOOK, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#121010', light: '#ffffff' } })).replace('<svg ', '<svg class="qr" aria-hidden="true" ');
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>온기 : 불씨를 품다 초대장</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap">
<style>
  /* 100 × 150 mm 초대장. 어두운 무대 위에 탈이 떠오르고, 아래에 날짜·장소와 누르면 열리는 QR */
  @page { size: 100mm 150mm; margin: 0; }
  :root {
    --stage: #0b0908; --on-dark: #f3ece4; --muted: #a99e94; --red: #e3141f; --ember: #f26a21; --gold: #f6b23c;
    --f-display: 'Black Han Sans', 'Noto Sans KR', sans-serif; --f-sans: 'Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100mm; height: 150mm; background: var(--stage); color: var(--on-dark); font-family: var(--f-sans); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  a { color: inherit; text-decoration: none; }
  .card { position: relative; width: 100mm; height: 150mm; overflow: hidden; display: flex; flex-direction: column; align-items: center; text-align: center;
          background: radial-gradient(120% 60% at 50% 22%, #3a170b 0%, #1a110d 40%, var(--stage) 72%); }
  .embers { position: absolute; inset: 0; pointer-events: none; }
  .mask { position: relative; width: 46mm; margin-top: -3mm; -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 24%); mask-image: linear-gradient(to bottom, transparent 0, #000 24%); filter: drop-shadow(0 0 6mm rgba(242,106,33,.35)); }
  .logo { position: relative; width: 64mm; margin-top: .5mm; filter: drop-shadow(0 0 2mm rgba(242,106,33,.35)); }
  .band { position: relative; width: 100%; margin-top: 3.2mm; padding-block: 1.6mm; background: #000; font-size: 7.4pt; font-weight: 700; letter-spacing: .02em; }
  .band span { color: var(--muted); font-weight: 500; margin-left: 2mm; }
  .title { position: relative; margin-top: 3.4mm; font-family: var(--f-display); line-height: 1; }
  .title .onki { display: block; color: var(--ember); font-size: 10pt; margin-bottom: 1.4mm; }
  .title .onki small { font-family: var(--f-sans); font-weight: 900; font-size: 7pt; color: var(--gold); margin-left: 1mm; }
  .title .big { font-size: 34pt; letter-spacing: -0.01em; }
  .title .fire { color: var(--red); text-shadow: 0 0 3mm rgba(227,20,31,.55); }
  .title .eul { font-size: .45em; vertical-align: .8em; }
  .mt { position: relative; margin-top: 3mm; display: grid; justify-items: center; line-height: 1; }
  .mt-onki { font-family: var(--f-display); font-size: 52pt; line-height: .92; letter-spacing: -0.02em;
    background: linear-gradient(180deg, #ffe0a3 0%, #f6b23c 28%, #f26a21 60%, #e3141f 100%); -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 0 2.5mm rgba(242,106,33,.5)); }
  .mt-lock { display: flex; align-items: center; gap: 1.6mm; }
  .mt-han { display: grid; justify-items: center; line-height: 1; font-size: 21pt; color: #f7941d; filter: drop-shadow(0 0 1.2mm rgba(242,106,33,.45)); }
  .mt-han span { font-family: var(--f-display); }
  .mt-han .han { font-family: var(--f-sans); font-weight: 900; font-size: 1.04em; margin-top: .4mm; }
  .mt-sub { margin-top: 1.4mm; font-family: var(--f-display); font-size: 15pt; }
  .mt-sub .fire { color: var(--red); text-shadow: 0 0 2mm rgba(227,20,31,.5); }
  .when { position: relative; margin-top: 3mm; display: grid; gap: .8mm; }
  .when .date { font-family: var(--f-display); font-size: 13pt; color: var(--gold); }
  .when .venue { font-family: var(--f-display); font-size: 17pt; }
  .when .addr { font-size: 6pt; color: var(--muted); }
  .go { position: relative; margin-top: auto; margin-bottom: 4mm; width: 86mm; display: grid; grid-template-columns: 24mm 1fr; gap: 3.5mm; align-items: center; text-align: left;
        padding: 3mm; border: .25mm solid #3a302a; background: #0c0a09; }
  .qrbox { background: #fff; padding: 1.6mm; display: block; }
  .qr { display: block; width: 100%; height: auto; }
  .go b { display: block; font-family: var(--f-display); font-weight: 400; font-size: 11pt; line-height: 1.25; }
  .go b .fire { color: var(--red); }
  .go p { margin-top: 1mm; font-size: 6.2pt; line-height: 1.55; color: var(--muted); word-break: keep-all; }
  .go .url { margin-top: 1.2mm; font-size: 5.6pt; color: var(--on-dark); line-height: 1.45; }
  .foot { position: relative; margin-bottom: 4.5mm; font-size: 5.4pt; line-height: 1.6; color: var(--muted); padding-inline: 6mm; word-break: keep-all; }
  .foot b { color: var(--on-dark); font-weight: 500; }
</style>
</head>
<body>
<article class="card">
  <svg class="embers" viewBox="0 0 100 150" aria-hidden="true">${Array.from({ length: 38 }, (_, i) => {
    const r = (n) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x); };
    const top = r(6) < 0.6;
    const cx = (top ? r(1) * 100 : (r(1) < 0.5 ? r(7) * 9 : 91 + r(7) * 9)).toFixed(1);
    const cy = (top ? 2 + r(2) * 52 : 60 + r(2) * 54).toFixed(1), rad = (0.25 + r(3) * 0.55).toFixed(2), o = (0.25 + r(4) * 0.6).toFixed(2);
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${r(5) > 0.7 ? '#ffd28a' : '#f26a21'}" opacity="${o}"/>`;
  }).join('')}</svg>
  <img class="mask" src="mask-dark.png" alt="강령탈춤 탈 그림">
  <img class="logo" src="logo-dark.png" alt="강령탈춤연구회 中天舞">
  <p class="band">국가무형유산 강령탈춤 <span>2026년 정기공연</span></p>
  <div class="mt"><div class="mt-lock"><p class="mt-onki">온기</p><p class="mt-han"><span>ON</span><span class="han">氣</span></p></div><p class="mt-sub"><span class="fire">불씨</span>를 품다</p></div>
  <div class="when">
    <p class="date">2026년 11월 14일(토) 오후 2시</p>
    <p class="venue">민속극장 풍류</p>
    <p class="addr">서울특별시 강남구 봉은사로 406 (삼성동, 서울중요무형문화재전수회관)</p>
  </div>
  <a class="go" href="${URL_BOOK}">
    <span class="qrbox">${qr}</span>
    <span><b>프로그램북 <span class="fire">열기</span></b>
      <p>QR을 누르거나 휴대폰 카메라로 찍으면 과장 소개와 출연진이 담긴 프로그램북이 열립니다.</p></span>
  </a>
  <p class="foot"><b>주최</b> 강령탈춤연구회 · <b>주관</b> 우리문화전문연희단체 꾼 · 전통연희놀이연구소 · 탈무브먼트 · 예움회</p>
</article>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);

  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 378, height: 567 }, deviceScaleFactor: 1181 / 378 });
  const p = await ctx.newPage();
  await p.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await p.goto('file://' + path.join(OUT, 'index.html'));
  for (const f of ['black-han-sans/korean-400.css', 'black-han-sans/latin-400.css', 'noto-sans-kr/korean-400.css', 'noto-sans-kr/korean-500.css', 'noto-sans-kr/korean-700.css', 'noto-sans-kr/korean-900.css', 'noto-sans-kr/latin-400.css', 'noto-sans-kr/latin-500.css', 'noto-sans-kr/latin-700.css', 'noto-sans-kr/latin-900.css', 'noto-sans-kr/900.css'])
    await p.addStyleTag({ url: 'file://' + path.join(F, f) });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const over = await p.evaluate(() => { const c = document.querySelector('.card'); return c.scrollHeight - c.clientHeight; });
  console.log('card overflow px:', over);
  await p.screenshot({ path: path.join(OUT, 'invite.png') });
  await p.pdf({ path: path.join(OUT, 'invite.pdf'), width: '100mm', height: '150mm', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();

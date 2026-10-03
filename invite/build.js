// 초대장 HTML을 만들고 PDF(인쇄용)와 PNG(공유용)로 렌더링한다.
const QR = require('qrcode');
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');

const BASE = 'https://thehanfilm-code.github.io/panorama-viewer';
const OUT = __dirname;
const FONTS = path.resolve(__dirname, '../node_modules/@fontsource');

async function qrSvg(url) {
  const svg = await QR.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#141414', light: '#0000' } });
  return svg.replace('<svg ', '<svg class="qr" aria-hidden="true" ');
}

(async () => {
  const qrBook = await qrSvg(`${BASE}/book/`);
  const qrAr = await qrSvg(`${BASE}/ar/`);

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>이태량 AR 전시 초대장</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@300;400;600&family=Nanum+Myeongjo:wght@700;800&display=swap">
<style>
  /* 100 × 150 mm 엽서. 위는 갤러리 벽에 걸린 그림, 아래는 흰 종이에 이름·소개·QR 두 개 */
  @page { size: 100mm 150mm; margin: 0; }
  :root {
    --white: #ffffff; --wall: #efefec; --ink: #141414; --muted: #6f6f68; --rule: #dcdcd6;
    --f-serif: 'Nanum Myeongjo', 'AppleMyungjo', 'Batang', serif;
    --f-sans: 'Gothic A1', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100mm; height: 150mm; background: var(--white); color: var(--ink); font-family: var(--f-sans); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .card { width: 100mm; height: 150mm; display: flex; flex-direction: column; overflow: hidden; }

  .wall { background: var(--wall); padding: 6mm 7mm 5mm; display: grid; gap: 4.2mm; }
  .top { display: flex; justify-content: space-between; align-items: baseline; font-size: 6.2pt; letter-spacing: .22em; text-transform: uppercase; color: var(--muted); }
  .top b { font-weight: 600; color: var(--ink); }
  .art { display: grid; justify-items: center; gap: 2.4mm; }
  .art img { height: 64mm; width: auto; display: block; box-shadow: 0 .3mm .6mm rgba(0,0,0,.18), 0 2.2mm 4mm rgba(0,0,0,.14); }
  .art figcaption { font-size: 5.6pt; color: var(--muted); letter-spacing: .02em; }

  .paper { flex: 1; padding: 5mm 7mm 5.5mm; display: flex; flex-direction: column; }
  .name { display: flex; align-items: baseline; gap: 3mm; }
  .name h1 { font-family: var(--f-serif); font-weight: 800; font-size: 25pt; letter-spacing: -0.03em; line-height: 1; }
  .name span { font-size: 6.4pt; letter-spacing: .3em; color: var(--muted); }
  .title { margin-top: 1.6mm; font-size: 7.4pt; letter-spacing: .02em; }
  .title em { font-style: normal; color: var(--muted); }
  .bio { margin-top: 2.6mm; font-size: 6.6pt; line-height: 1.75; font-weight: 300; word-break: keep-all; }

  .qrs { margin-top: auto; padding-top: 3mm; border-top: .2mm solid var(--rule); display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
  .qrs > div { display: grid; grid-template-columns: 17mm 1fr; gap: 2.4mm; align-items: center; }
  .qr { width: 17mm; height: 17mm; display: block; }
  .qrs b { display: block; font-family: var(--f-serif); font-weight: 700; font-size: 8pt; letter-spacing: -0.01em; }
  .qrs small { display: block; margin-top: .8mm; font-size: 5.6pt; line-height: 1.5; color: var(--muted); word-break: keep-all; }
  .foot { margin-top: 3mm; font-size: 5.8pt; color: var(--muted); letter-spacing: .02em; }
  .foot b { color: var(--ink); font-weight: 600; }
</style>
</head>
<body>
<article class="card">
  <section class="wall">
    <p class="top"><span><b>AR Exhibition</b> · 이달의 전시</span><span>2026. 10</span></p>
    <figure class="art">
      <img src="w3.jpg" alt="이태량, 순간의 함몰, 2026, 캔버스에 유채, 130.3 × 162.2 cm">
      <figcaption>순간의 함몰 depression of the moment, 2026, oil on canvas, 130.3 × 162.2 cm</figcaption>
    </figure>
  </section>
  <section class="paper">
    <div class="name"><h1>이태량</h1><span>TAERYANG LEE</span></div>
    <p class="title">Paintings 2025–2026 <em>· 유화 8점</em></p>
    <p class="bio">낙서처럼 보이는 자유로운 선으로 ‘그림’의 본질과 언어의 한계를 묻는 추상화가. 문자와 부호를 긋고 지우고 덧칠하며 「존재와 사고」, 「명제형식」, 「헤르메틱」 연작을 이어 왔습니다.</p>
    <div class="qrs">
      <div>${qrAr}<p><b>AR 전시</b><small>우리 집 벽에 실제 크기로 걸어 보기</small></p></div>
      <div>${qrBook}<p><b>전자책 작품집</b><small>작가 소개와 작품 8점을 책처럼 넘겨 보기</small></p></div>
    </div>
    <p class="foot">전시장은 <b>당신의 벽</b>입니다. QR을 찍고 휴대폰을 벽에 비춰 보세요.</p>
  </section>
</article>
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, 'index.html'), html);

  // 렌더링: 이 컨테이너에서는 Google Fonts가 막혀 있어 같은 서체를 로컬 패키지로 넣는다
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 378, height: 567 }, deviceScaleFactor: 1181 / 378 });
  const page = await ctx.newPage();
  await page.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  await page.goto('file://' + path.join(OUT, 'index.html'));
  for (const f of ['gothic-a1/korean-300.css', 'gothic-a1/korean-400.css', 'gothic-a1/korean-600.css', 'gothic-a1/latin-300.css', 'gothic-a1/latin-400.css', 'gothic-a1/latin-600.css',
                   'nanum-myeongjo/korean-700.css', 'nanum-myeongjo/korean-800.css', 'nanum-myeongjo/latin-700.css', 'nanum-myeongjo/latin-800.css']) {
    await page.addStyleTag({ url: 'file://' + path.join(FONTS, f) });
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight));
  console.log('loaded fonts:', [...new Set(fonts)].join(', '));
  const overflow = await page.evaluate(() => { const c = document.querySelector('.paper'); return c.scrollHeight - c.clientHeight; });
  console.log('paper overflow px:', overflow);
  await page.screenshot({ path: path.join(OUT, 'invite.png') });
  await page.pdf({ path: path.join(OUT, 'invite.pdf'), width: '100mm', height: '150mm', printBackground: true, preferCSSPageSize: true });
  await browser.close();
})();

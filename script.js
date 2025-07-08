// ========== script.js ==========

// ① DOM が準備できたら各種機能を初期化
document.addEventListener('DOMContentLoaded', () => {
  initGalleryScroll();
  initCopyTemplate();
  loadAndRenderData();
});

// ② 画像ギャラリーの横スクロール機能
function initGalleryScroll() {
  const track      = document.getElementById('gallery-track');
  const leftArrow  = document.getElementById('gallery-left');
  const rightArrow = document.getElementById('gallery-right');

  if (!track || !leftArrow || !rightArrow) return;

  leftArrow.addEventListener('click', () => {
    track.scrollBy({ left: -280, behavior: 'smooth' });
  });
  rightArrow.addEventListener('click', () => {
    track.scrollBy({ left:  280, behavior: 'smooth' });
  });
}

// ③ お問い合わせテンプレートをコピーする機能
function initCopyTemplate() {
  const copyButton      = document.querySelector('.cta-btn');
  const contactTemplate = document.getElementById('contact-template');
  const copyAlert       = document.getElementById('copy-alert');

  if (!copyButton || !contactTemplate || !copyAlert) return;

  copyButton.addEventListener('click', () => {
    const text = contactTemplate.value;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(showCopyAlert.bind(null, copyAlert))
        .catch(() => fallbackCopy(text, copyAlert));
    } else {
      fallbackCopy(text, copyAlert);
    }
  });
}

// フォールバック用コピー
function fallbackCopy(text, alertElement) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showCopyAlert(alertElement);
  } catch {
    alert('コピーに失敗しました。手動でコピーしてください。');
  }
  document.body.removeChild(ta);
}

// コピー成功時のアラート表示
function showCopyAlert(alertElement) {
  alertElement.style.display = 'block';
  setTimeout(() => {
    alertElement.style.display = 'none';
  }, 1700);
}

// ④ JSONデータを読み込んでページに反映
function loadAndRenderData() {
  const JSON_URL = 'https://prodarts.github.io/player_hal/player_hal.json';

  fetch(JSON_URL)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      renderHeader(data);
      renderProfile(data);
      renderStrengths(data);
      renderGallery(data);
      renderMenu(data);
      renderAchievements(data);
      renderPrices(data);
      renderOkNg(data);
      renderSponsors(data);
      renderFaq(data);
      renderRecommend(data);
      renderContact(data);
      renderFooter(data);
      updateMetaTags(data);
      updateJsonLd(data);
    })
    .catch(err => {
      console.error('JSON 読み込み失敗:', err);
    });
}

// --- 各セクションのレンダリング関数（抜粋版） ---

function renderHeader(d) {
  const img = document.getElementById('player-image');
  if (img) {
    img.src = `/player_hal/${d.profile.profileImage}`;
    img.alt = `女子プロダーツプレイヤー ${d.profile.nameJP}`;
  }
  setHTML('player-catch',   d.profile.catch);
  setHTML('player-subcatch', d.profile.subcatch);
  setText('page-catch', d.meta.pageCatch);
}

function renderProfile(d) {
  setHTML('player-name',     `${d.profile.nameJP}<br>（${d.profile.nameEN}）`);
  setText('player-nickname', d.profile.nickname);
  setText('player-feature',  d.profile.feature);
  setText('player-birth',    d.profile.pref);
  setText('player-area',     d.profile.area);
  setHTML('player-org',      d.profile.org.join('<br>'));
  setText('player-rating',   d.profile.rating);
  setAttr('player-instagram', 'href', d.sns.instagram.url);
  setAttr('player-x',         'href', d.sns.x.url);
}

function renderStrengths(d) {
  const ul = document.getElementById('player-strengths');
  if (!ul) return;
  ul.innerHTML = '';
  d.strengths.forEach(s => {
    const li = document.createElement('li');
    const stars = '★'.repeat(s.score) + '☆'.repeat(5 - s.score);
    li.innerHTML = `<span class="stars">${stars}</span> <span>${s.label}</span>`;
    ul.appendChild(li);
  });
  setHTML('player-strength-description', d.strengthDescription);
}

function renderGallery(d) {
  const track = document.getElementById('gallery-track');
  if (!track) return;
  track.innerHTML = '';
  d.gallery.forEach(g => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `<img src="/player_hal/${g.src}" alt="${g.alt}">`;
    track.appendChild(div);
  });
}

// 他セクションも同様に renderMenu, renderAchievements, renderPrices,
// renderOkNg, renderSponsors, renderFaq, renderRecommend, renderContact,
// renderFooter, updateMetaTags, updateJsonLd を実装してください。
// ※実装例は前のメッセージを参考に、ID とデータ構造を対応させてください。

// ======= ユーティリティ関数 =======

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html.replace(/\n/g, '<br>');
}

function setAttr(id, attr, value) {
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, value);
}

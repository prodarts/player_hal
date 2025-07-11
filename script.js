document.addEventListener('DOMContentLoaded', () => {

  // 画像ギャラリーの横スクロール機能
  const track = document.getElementById('gallery-track');
  const leftArrow = document.getElementById('gallery-left');
  const rightArrow = document.getElementById('gallery-right');

  if (track && leftArrow && rightArrow) {
    // CSSで設定した画像サイズ（200px）とマージン（15px）に合わせてスクロール量を調整
    const scrollAmount = 215; 
    leftArrow.addEventListener('click', () => { track.scrollBy({ left: -scrollAmount, behavior: 'smooth' }); });
    rightArrow.addEventListener('click', () => { track.scrollBy({ left: scrollAmount, behavior: 'smooth' }); });
  }

  // ***** ヘッダー背景画像とコンテンツアニメーション制御 *****
  const header = document.querySelector('header');
  const headerContent = document.querySelector('.header-content');
  
  // ギャラリーで使用する画像のリスト（モバイルのヘッダー背景で使用）
  const galleryImages = ['img_1.jpg', 'img_2.jpg', 'img_3.jpg', 'img_4.jpg', 'img_5.jpg'];
  let currentMobileBgIndex = 0; 
  let mobileBgInterval = null;

  function updateHeaderBackground() {
    // PC表示（幅が768pxより大きい場合）
    if (window.innerWidth > 768) {
      if (mobileBgInterval) {
        clearInterval(mobileBgInterval); // モバイル用スライダーを停止
        mobileBgInterval = null;
      }
      header.classList.add('pc-bg-image'); // PC用背景クラスを付与
      header.style.backgroundImage = `url('ogp.jpg')`; // PC用背景画像を設定
      header.style.backgroundAttachment = 'fixed'; // PC用パララックス効果
    } 
    // モバイル表示
    else {
      header.classList.remove('pc-bg-image'); // PC用背景クラスを削除
      header.style.backgroundAttachment = 'scroll'; // モバイルでスクロールに固定

      if (!mobileBgInterval) { // スライダーが動いていない場合のみ開始
        // 初回設定
        header.style.backgroundImage = `url('${galleryImages[currentMobileBgIndex]}')`;
        mobileBgInterval = setInterval(() => {
          currentMobileBgIndex = (currentMobileBgIndex + 1) % galleryImages.length;
          header.style.backgroundImage = `url('${galleryImages[currentMobileBgIndex]}')`;
        }, 3000); // 3秒ごとに画像を切り替え
      }
    }
  }

  // ページ読み込み時とリサイズ時にヘッダー背景を更新
  updateHeaderBackground();
  window.addEventListener('resize', updateHeaderBackground);

  // ヘッダーコンテンツのアニメーションをトリガー
  if (headerContent) {
    setTimeout(() => {
      headerContent.classList.add('is-visible');
    }, 100);
  }

  // ***** スクロールアニメーション機能 *****
  const sections = document.querySelectorAll('.section');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        section.classList.add('is-visible'); // セクション全体をふわっと表示

        const title = section.querySelector('.section-title');
        if (title) {
          title.classList.add('is-visible'); // タイトルを左からスライドイン
        }

        // セクション内のテキスト要素に時間差でアニメーションを適用
        const textElements = section.querySelectorAll('.anim-text');
        textElements.forEach((el, index) => {
          el.style.transitionDelay = `${0.2 + (index * 0.05)}s`;
          el.classList.add('is-visible');
        });
        
        observer.unobserve(section); // 一度表示したら監視を解除
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    // アニメーションさせたいテキスト要素にクラスを付与
    section.querySelectorAll('p, span:not(.hearts), li, b, a.sponsor-btn, .item-label, .item-detail, .contact-description, .contact-note, .store-testimonial, .stats-summary, .price-note, .ok-list h3, .ng-list h3, ul.faq-list b, ul.faq-list li, .catch, .subcatch').forEach(el => {
      el.classList.add('anim-text');
    });
    observer.observe(section);
  });
});

// お問い合わせテンプレートをコピーする機能
function copyContactTemplate() {
  const contactTemplate = document.getElementById('contact-template');
  const copyAlert = document.getElementById('copy-alert');

  contactTemplate.select();
  contactTemplate.setSelectionRange(0, 99999);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(contactTemplate.value).then(() => {
      copyAlert.style.display = 'block';
      setTimeout(() => { copyAlert.style.display = 'none'; }, 1700);
    }).catch(err => {
      console.error('クリップボードへの書き込みに失敗:', err);
      // フォールバック
      try {
        document.execCommand('copy');
        copyAlert.style.display = 'block';
        setTimeout(() => { copyAlert.style.display = 'none'; }, 1700);
      } catch (e) {
        alert('コピーに失敗しました。手動でコピーしてください。');
      }
    });
  } else {
    // 古いブラウザ用のフォールバック
    try {
      document.execCommand('copy');
      copyAlert.style.display = 'block';
      setTimeout(() => { copyAlert.style.display = 'none'; }, 1700);
    } catch (e) {
      alert('コピーに失敗しました。手動でコピーしてください。');
    }
  }
}

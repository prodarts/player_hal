// 画像ギャラリーの横スクロール機能
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('gallery-track');
  const leftArrow = document.getElementById('gallery-left');
  const rightArrow = document.getElementById('gallery-right');

  if (track && leftArrow && rightArrow) {
    leftArrow.addEventListener('click', () => {
      // スクロール量を画像1枚分 + margin に調整 (250px + 15px = 265px, または安全を見て280px)
      track.scrollBy({ left: -280, behavior: 'smooth' });
    });

    rightArrow.addEventListener('click', () => {
      track.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  // お問い合わせテンプレートをコピーする機能
  // DOMContentLoaded内に関数を定義することで、HTML要素が確実に存在してからイベントリスナーが設定される
  const contactTemplate = document.getElementById('contact-template');
  const copyAlert = document.getElementById('copy-alert');
  const copyButton = document.querySelector('.cta-btn'); // コピーボタンのセレクタ

  if (copyButton && contactTemplate && copyAlert) {
    copyButton.addEventListener('click', () => {
      contactTemplate.select();
      contactTemplate.setSelectionRange(0, 99999); // モバイルデバイス用

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(contactTemplate.value).then(() => {
          copyAlert.style.display = 'block';
          setTimeout(() => {
            copyAlert.style.display = 'none';
          }, 1700);
        }).catch(err => {
          console.error('クリップボードへの書き込みに失敗しました:', err);
          fallbackCopyTextToClipboard(contactTemplate.value, copyAlert);
        });
      } else {
        fallbackCopyTextToClipboard(contactTemplate.value, copyAlert);
      }
    });
  }

  function fallbackCopyTextToClipboard(text, alertElement) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // 画面外に配置
    textArea.style.left = "-9999px";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      alertElement.style.display = 'block';
      setTimeout(() => {
        alertElement.style.display = 'none';
      }, 1700);
    } catch (errExec) {
      console.error('execCommandでのコピーにも失敗しました:', errExec);
      alert('コピーに失敗しました。お手数ですが手動でコピーしてください。');
    }
    document.body.removeChild(textArea);
  }


  // JSONデータを読み込んでページに反映
  // GitHub Pagesでは、相対パスが正しく解決されない場合があるため、絶対パスを推奨します。
  // player_hal.json が 'https://prodarts.github.io/player_hal/' の直下にあると仮定します。
  fetch('https://prodarts.github.io/player_hal/player_hal.json') // ★ここを絶対パスに修正★
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status} - JSONファイルが見つからないか、読み込めません。`);
      }
      return res.json();
    })
    .then(data => {
      // Header
      // 画像パスも必要に応じて絶対パスまたはルートからの相対パスに修正
      document.getElementById('player-image').src = `/player_hal/${data.profile.profileImage}`; // ★画像パスも修正★
      document.getElementById('player-image').alt = `女子プロダーツプレイヤー${data.profile.nameJP}｜イベント出演依頼`;
      document.getElementById('player-catch').innerHTML = data.profile.catch.replace(/\n/g, '<br>');
      document.getElementById('player-subcatch').innerHTML = data.profile.subcatch.replace(/\n/g, '<br>');

      // Main Catch
      document.getElementById('page-catch').textContent = data.meta.pageCatch;

      // 1. プロフィール
      document.getElementById('player-name').innerHTML = `${data.profile.nameJP}<br>（${data.profile.nameEN}）`;
      document.getElementById('player-nickname').textContent = data.profile.nickname;
      document.getElementById('player-feature').textContent = data.profile.feature;
      document.getElementById('player-birth').textContent = data.profile.pref;
      document.getElementById('player-area').textContent = data.profile.area;
      document.getElementById('player-org').innerHTML = data.profile.org.join('<br>'); // 配列を改行で結合
      document.getElementById('player-rating').textContent = data.profile.rating;
      document.getElementById('player-instagram').href = data.sns.instagram.url;
      document.getElementById('player-x').href = data.sns.x.url;
      // SNSアイコン画像はHTMLに直接記述されているため、ここではURL設定のみ

      // 2. 強み
      const strengthsList = document.getElementById('player-strengths');
      strengthsList.innerHTML = ''; // 既存の内容をクリア
      data.strengths.forEach(strength => {
        const li = document.createElement('li');
        li.classList.add('strength-item');
        const scoreDisplay = '⭐️'.repeat(strength.score) + '☆'.repeat(5 - strength.score);
        li.innerHTML = `<span class="hearts">${scoreDisplay}</span><span class="strength-text">${strength.label}</span>`;
        strengthsList.appendChild(li);
      });
      document.getElementById('player-strength-description').innerHTML = data.strengthDescription.replace(/\n/g, '<br>');

      // 3. ギャラリー
      const galleryTrack = document.getElementById('gallery-track');
      galleryTrack.innerHTML = ''; // 既存の内容をクリア
      data.gallery.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('gallery-item');
        // 画像パスも必要に応じて絶対パスまたはルートからの相対パスに修正
        div.innerHTML = `<img src="/player_hal/${item.src}" alt="${item.alt}" title="${item.title || item.alt}">`; // ★画像パスも修正★
        galleryTrack.appendChild(div);
      });

      // 4. イベントメニュー
      const eventMenu = document.getElementById('event-menu');
      eventMenu.innerHTML = ''; // 既存の内容をクリア
      data.menu.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        eventMenu.appendChild(li);
      });

      // 5. 実績・評価
      const achievementTitles = document.getElementById('achievement-titles');
      achievementTitles.innerHTML = ''; // 既存の内容をクリア
      data.achievements.titles.forEach(title => {
        const div = document.createElement('div');
        div.classList.add('stats-summary'); // HTML構造に合わせる
        div.innerHTML = `・${title}<br>`;
        achievementTitles.appendChild(div);
      });
      const achievementTestimonial = document.getElementById('achievement-testimonial');
      achievementTestimonial.innerHTML = ''; // 既存の内容をクリア
      const testimonialDiv = document.createElement('div');
      testimonialDiv.classList.add('store-testimonial'); // HTML構造に合わせる
      testimonialDiv.innerHTML = `<b>${data.achievements.testimonial.author}</b><br>${data.achievements.testimonial.comment.replace(/\n/g, '<br>')}`;
      achievementTestimonial.appendChild(testimonialDiv);

      // 6. 価格・条件
      const priceItems = document.getElementById('price-items');
      priceItems.innerHTML = ''; // 既存の内容をクリア
      data.prices.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('price-item');
        div.innerHTML = `<div class="item-label">${item.label}</div><div class="item-detail">${item.detail}</div>`;
        priceItems.appendChild(div);
      });
      document.getElementById('price-note').innerHTML = data.priceNote.replace(/\n/g, '<br>');

      // 7. OK / NG
      const okList = document.getElementById('ok-list');
      okList.innerHTML = '';
      data.ok.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        okList.appendChild(li);
      });
      const ngList = document.getElementById('ng-list');
      ngList.innerHTML = '';
      data.ng.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ngList.appendChild(li);
      });

      // 8. スポンサー
      const sponsorList = document.getElementById('sponsor-list');
      sponsorList.innerHTML = '';
      data.sponsors.forEach(sponsor => {
        const li = document.createElement('li');
        li.classList.add('sponsor-item');
        let sponsorHtml = `<span class="sponsor-name">${sponsor.name}</span><span class="sponsor-desc">${sponsor.desc.replace(/\n/g, '<br>')}</span>`;
        if (sponsor.url) { // URLがある場合のみボタンを追加
          sponsorHtml += `<a href="${sponsor.url}" class="sponsor-btn" target="_blank" rel="noopener">ここをタップ</a>`;
        }
        li.innerHTML = sponsorHtml;
        sponsorList.appendChild(li);
      });

      // 9. FAQ
      const faqList = document.getElementById('faq-list');
      faqList.innerHTML = '';
      data.faq.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<b>Q: ${item.q}</b><br>A: →「${item.a}」`;
        faqList.appendChild(li);
      });

      // 10. 推薦ターゲット
      const recommendList = document.getElementById('recommend-list');
      recommendList.innerHTML = '';
      data.recommend.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        recommendList.appendChild(li);
      });

      // 11. お問い合わせ
      document.getElementById('contact-desc').textContent = data.contact.desc;
      document.getElementById('contact-template').value = data.contact.template;
      document.getElementById('contact-instagram').href = data.sns.instagram.url;
      document.getElementById('contact-x').href = data.sns.x.url;
      document.getElementById('contact-note').innerHTML = data.contact.note.replace(/\n/g, '<br>');

      // Footer
      document.getElementById('copyright-name').textContent = data.profile.nameJP;

      // メタタグの動的更新 (HTMLに直接書かれたものも上書き可能)
      document.title = data.meta.siteTitle;
      document.querySelector('meta[name="description"]').content = data.meta.description;
      document.querySelector('meta[property="og:title"]').content = data.meta.og.title;
      document.querySelector('meta[property="og:description"]').content = data.meta.og.description;
      document.querySelector('meta[property="og:url"]').content = data.meta.og.url;
      document.querySelector('meta[property="og:image"]').content = data.meta.og.image;
      document.querySelector('meta[property="og:image:secure_url"]').content = data.meta.og.image;
      document.querySelector('meta[property="og:image:alt"]').content = data.meta.og.imageAlt;
      document.querySelector('meta[property="og:site_name"]').content = data.meta.og.siteName;
      document.querySelector('meta[name="twitter:title"]').content = data.meta.og.title;
      document.querySelector('meta[name="twitter:description"]').content = data.meta.og.description;
      document.querySelector('meta[name="twitter:image"]').content = data.meta.og.image;
      document.querySelector('meta[name="twitter:image:alt"]').content = data.meta.og.imageAlt;

      // JSON-LDの動的更新 (既存のスクリプトを更新)
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (jsonLdScript) {
          const jsonLdData = JSON.parse(jsonLdScript.textContent);
          jsonLdData.name = data.profile.nameJP;
          jsonLdData.alternateName = data.profile.nameEN;
          jsonLdData.image = data.meta.og.image;
          jsonLdData.description = data.meta.description;
          jsonLdData.url = data.meta.og.url;
          if (jsonLdData.sameAs && jsonLdData.sameAs.length > 0) {
              jsonLdData.sameAs[0] = data.sns.instagram.url;
              jsonLdData.sameAs[1] = data.sns.x.url;
          }
          if (jsonLdData.memberOf && jsonLdData.memberOf.length > 0) {
              jsonLdData.memberOf[0].name = data.profile.org[0];
              jsonLdData.memberOf[1].name = data.profile.org[1];
          }
          if (jsonLdData.homeLocation && jsonLdData.homeLocation.address) {
              jsonLdData.homeLocation.address.addressLocality = data.profile.pref;
              jsonLdData.homeLocation.address.addressRegion = data.category.areaGroup;
          }
          jsonLdData.award = data.achievements.titles; // 例として実績タイトルをawardに
          // alumniOfなどの固定値はJSONにない場合、手動更新または削除を検討
          jsonLdScript.textContent = JSON.stringify(jsonLdData, null, 2);
      }

    })
    .catch(err => {
      console.error('JSON 読み込み失敗:', err);
      // エラー時のユーザーへのフィードバック（例：一部コンテンツがロードされなかった旨を伝える）
      // document.getElementById('error-message').textContent = 'コンテンツの読み込みに失敗しました。';
    });
});

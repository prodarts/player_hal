// 画像ギャラリーの横スクロール機能
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('gallery-track');
  const leftArrow = document.getElementById('gallery-left');
  const rightArrow = document.getElementById('gallery-right');

  // 要素が存在するか確認してからイベントリスナーを設定
  if (track && leftArrow && rightArrow) {
    leftArrow.addEventListener('click', () => {
      // track.clientWidth で現在のトラックの表示幅を取得し、その約90%をスクロール量とする
      // または、画像1枚分の幅(250px) + margin(15px) = 265px に調整しても良い
      track.scrollBy({ left: -280, behavior: 'smooth' }); // 左にスクロール
    });

    rightArrow.addEventListener('click', () => {
      // track.clientWidth で現在のトラックの表示幅を取得し、その約90%をスクロール量とする
      // または、画像1枚分の幅(250px) + margin(15px) = 265px に調整しても良い
      track.scrollBy({ left: 280, behavior: 'smooth' }); // 右にスクロール
    });
  }
});

// お問い合わせテンプレートをコピーする機能
function copyContactTemplate() {
  const contactTemplate = document.getElementById('contact-template');
  const copyAlert = document.getElementById('copy-alert');

  // テキストエリアのテキストを選択し、クリップボードにコピー
  contactTemplate.select();
  contactTemplate.setSelectionRange(0, 99999); // モバイルデバイス用

  // navigator.clipboard API を優先 (より新しいブラウザで推奨)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(contactTemplate.value).then(() => {
      copyAlert.style.display = 'block';
      setTimeout(() => {
        copyAlert.style.display = 'none';
      }, 1700); // 1.7秒後に非表示
    }).catch(err => {
      // フォールバック (execCommand)
      console.error('クリップボードへの書き込みに失敗しました:', err);
      try {
        document.execCommand('copy');
        copyAlert.style.display = 'block';
        setTimeout(() => {
          copyAlert.style.display = 'none';
        }, 1700);
      } catch (errExec) {
        console.error('execCommandでのコピーにも失敗しました:', errExec);
        alert('コピーに失敗しました。お手数ですが手動でコピーしてください。');
      }
    });
  } else {
    // navigator.clipboard がサポートされていない場合のフォールバック
    try {
      document.execCommand('copy');
      copyAlert.style.display = 'block';
      setTimeout(() => {
        copyAlert.style.display = 'none';
      }, 1700);
    } catch (errExec) {
      console.error('execCommandでのコピーにも失敗しました:', errExec);
      alert('コピーに失敗しました。お手数ですが手動でコピーしてください。');
    }
  }
}


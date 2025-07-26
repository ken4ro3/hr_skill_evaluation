let currentPage = 1;
const totalPages = 6;  // 質問ページの数（例: 6ページ）

window.onload = function() {
  // Google Sheets APIのURL（Google Apps Scriptで公開したURL）
  const apiUrl = 'https://script.google.com/macros/s/AKfycby4ixRhudAC7nd6E9pktFT1JMC3CSeGni0aRZDbikGWgUPkBubC-CVGye62d6_FLwMDQw/exec';  // GASのWebアプリケーションのURLを貼り付け

  fetch(apiUrl)
    .then(response => response.json()) // Google SheetsからのデータをJSONとして取得
    .then(data => {
      const surveyPagesContainer = document.getElementById('surveyPages');
      let currentPage = '';

      data.forEach((question, index) => {
        // 新しいページが始まるとき（ページ名が変わったら）
        if (currentPage !== question.page_name) {
          if (currentPage !== '') {
            surveyPagesContainer.appendChild(document.createElement('hr')); // ページ間の区切り
          }
          currentPage = question.page_name;
          const pageTitle = document.createElement('h2');
          pageTitle.textContent = currentPage;
          surveyPagesContainer.appendChild(pageTitle);
        }

        // 質問をフォームに追加
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question');

        const label = document.createElement('label');
        label.setAttribute('for', question.question_name);
        label.textContent = question.question_text;
        questionContainer.appendChild(label);

        const optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options');
        
        const yesLabel = document.createElement('label');
        yesLabel.innerHTML = `<input type="radio" name="${question.question_name}" value="1"> Yes`;
        const noLabel = document.createElement('label');
        noLabel.innerHTML = `<input type="radio" name="${question.question_name}" value="0"> No`;
        optionsContainer.appendChild(yesLabel);
        optionsContainer.appendChild(noLabel);
        
        questionContainer.appendChild(optionsContainer);
        surveyPagesContainer.appendChild(questionContainer);

        // 次へボタン（最後のページ以外）
        if (index < data.length - 1) {
          const nextButton = document.createElement('button');
          nextButton.type = 'button';
          nextButton.classList.add('next-btn');
          nextButton.textContent = '次へ';
          nextButton.addEventListener('click', () => changePage(1)); // ページ遷移を行う
          surveyPagesContainer.appendChild(nextButton);
        }
      });

      // 最後のページに結果表示ボタンを追加
      const submitButton = document.createElement('button');
      submitButton.type = 'submit';
      submitButton.classList.add('submit-btn');
      submitButton.textContent = '結果を表示';
      surveyPagesContainer.appendChild(submitButton);
    })
    .catch(err => {
      console.error("データ取得に失敗しました:", err);
    });
};

// ページ遷移のための関数
function changePage(offset) {
  const currentPageElement = document.getElementById(`page${currentPage}`);
  
  // ページが見つからない場合はエラーメッセージを表示
  if (!currentPageElement) {
    console.error(`Page ${currentPage} not found!`);
    return;
  }

  currentPageElement.style.display = "none"; // 現在のページを非表示

  currentPage += offset;

  if (currentPage > totalPages) currentPage = totalPages; // 最後のページ
  if (currentPage < 1) currentPage = 1; // 最初のページ

  const nextPageElement = document.getElementById(`page${currentPage}`);
  
  // 次のページが見つからない場合のエラーチェック
  if (!nextPageElement) {
    console.error(`Page ${currentPage} not found!`);
    return;
  }

  nextPageElement.style.display = "block"; // 次のページを表示
}

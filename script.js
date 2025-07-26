const apiUrl = 'https://raw.githubusercontent.com/yourusername/repository-name/main/survey-data.json';  // JSONファイルのURL

let currentPage = 1;
let totalPages = 0;

window.onload = function() {
  fetch(apiUrl)
    .then(response => response.json())  // GitHub PagesからのJSONデータを取得
    .then(data => {
      const surveyPagesContainer = document.getElementById('surveyPages');
      let currentPageName = '';
      
      totalPages = data.length;

      data.forEach((question, index) => {
        // 新しいページが始まるとき（ページ名が変わったら）
        if (currentPageName !== question.page_name) {
          if (currentPageName !== '') {
            surveyPagesContainer.appendChild(document.createElement('hr')); // ページ間の区切り
          }
          currentPageName = question.page_name;
          const pageTitle = document.createElement('h2');
          pageTitle.textContent = currentPageName;
          surveyPagesContainer.appendChild(pageTitle);
        }

        // 質問をフォームに追加
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question');
        questionContainer.setAttribute('id', `page${currentPage}`); // ページIDを設定
        if (currentPage !== 1) {
          questionContainer.style.display = 'none'; // 最初のページ以外は非表示に
        }

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
  
  if (!currentPageElement) {
    console.error(`Page ${currentPage} not found!`);
    return;
  }

  currentPageElement.style.display = "none"; // 現在のページを非表示

  currentPage += offset;

  // ページの範囲チェック
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const nextPageElement = document.getElementById(`page${currentPage}`);
  
  if (!nextPageElement) {
    console.error(`Page ${currentPage} not found!`);
    return;
  }

  nextPageElement.style.display = "block"; // 次のページを表示
}

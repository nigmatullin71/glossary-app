document.addEventListener('DOMContentLoaded', () => {
  const glossaryPage = document.getElementById('glossary-page');
  const graphPage = document.getElementById('graph-page');
  const glossaryBtn = document.getElementById('glossary-btn');
  const graphBtn = document.getElementById('graph-btn');
  const scrollUpBtn = document.getElementById('scroll-up-btn');
  const glossaryContainer = document.getElementById('glossary');

  // Функция для загрузки данных глоссария с бэкенда
  // Функция для загрузки всех терминов
  async function fetchGlossaryTerms() {
    try {
      const response = await fetch('/terms');
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const terms = await response.json();
      glossaryContainer.innerHTML = terms
        .map(term => `
          <div class="term-block">
            <h3>${term.term}</h3>
            <p>${term.definition}</p>
            <button onclick="editTerm('${term.term}')">Изменить</button>
            <button onclick="deleteTerm('${term.term}')">Удалить</button>
          </div>
        `)
        .join('');
    } catch (error) {
      console.error('Ошибка при загрузке глоссария:', error);
    }
  }

  // Добавление нового термина
  document.getElementById('add-term-form').onsubmit = async event => {
    event.preventDefault();
    const term = document.getElementById('term-input').value;
    const definition = document.getElementById('definition-input').value;

    try {
      const response = await fetch('/terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term, definition }),
      });
      if (!response.ok) throw new Error('Ошибка добавления термина');
      await fetchGlossaryTerms();
    } catch (error) {
      console.error('Ошибка при добавлении термина:', error);
    }
  };

  // Удаление термина
  window.deleteTerm = async term => {
    try {
      const response = await fetch(`/terms/${term}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ошибка удаления термина');
      await fetchGlossaryTerms();
    } catch (error) {
      console.error('Ошибка при удалении термина:', error);
    }
  };

  // Переключение между страницами
  glossaryBtn.addEventListener('click', () => {
    glossaryPage.classList.add('active');
    graphPage.classList.remove('active');
  });

  graphBtn.addEventListener('click', () => {
    graphPage.classList.add('active');
    glossaryPage.classList.remove('active');
  });

  // Прокрутка страницы наверх
  scrollUpBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Инициализация глоссария при загрузке страницы
  fetchGlossaryTerms();

  // Инициализация графа с помощью Vis.js
  const graphContainer = document.getElementById('graph-container');

  if (graphContainer) {
    const nodes = new vis.DataSet([
      { id: 1, label: 'Блокчейн Blockchain' },
      { id: 2, label: 'Технология распределённого реестра' },
      { id: 3, label: 'Смарт-контракт Smart Contract' },
      { id: 4, label: 'Ethereum' },
      { id: 5, label: 'Hardhat' },
      { id: 6, label: 'Truffle Suite' },
      { id: 7, label: 'Web3.js' },
      { id: 8, label: 'IPFS InterPlanetary File System' },
      { id: 9, label: 'Decentralized Finance DeFi' },
      { id: 10, label: 'Тестирование смарт-контрактов' },
      { id: 11, label: 'Node.js' },
      { id: 12, label: 'TypeScript' },
      { id: 13, label: 'Хранение данных' }
    ]);

    const edges = new vis.DataSet([
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
      { from: 4, to: 6 },
      { from: 4, to: 7 },
      { from: 1, to: 8 },
      { from: 1, to: 9 },
      { from: 3, to: 9 },
      { from: 3, to: 10 },
      { from: 11, to: 7 },
      { from: 12, to: 11 },
      { from: 12, to: 7 },
      { from: 8, to: 13 }
    ]);

    const data = { nodes, edges };

    const options = {
      layout: {
        randomSeed: 2,
        improvedLayout: true
      },
      physics: {
        enabled: true
      }
    };

    new vis.Network(graphContainer, data, options);
  }
});

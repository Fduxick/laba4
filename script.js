document.addEventListener('DOMContentLoaded', function() {
    // получаем ссылки на нужные элементы DOM
    const notesContainer = document.getElementById('notes-container');
    const addNoteButton = document.getElementById('add-note');
    let notes = [];
  
    // проверяем, есть ли уже сохраненные заметки в LocalStorage
    if (localStorage.getItem('notes')) {
      // если есть, парсим их из JSON и сохраняем в переменную notes
      notes = JSON.parse(localStorage.getItem('notes'));
      // вызываем функцию для отрисовки заметок на странице
      renderNotes();
    }
  
    // добавляем обработчик клика на кнопку "Добавить заметку"
    addNoteButton.addEventListener('click', function() {
      // создаем новый объект заметки
      const note = {
        id: Date.now(), // генерируем уникальный идентификатор для заметки
        text: '', // устанавливаем пустой текст
        left: '8px',  // начальные координаты для новой заметки
        top: '30px'
      };
      // добавляем новую заметку в массив notes
      notes.push(note);
      // сохраняем заметки в LocalStorage
      saveNotes();
      // вызываем функцию для отрисовки заметок на странице
      renderNotes();
    });
  
    // функция для отрисовки заметок на странице
    function renderNotes() {
      // очищаем контейнер для заметок
      notesContainer.innerHTML = '';
      // проходимся по каждой заметке в массиве notes
      notes.forEach(function(note) {
        // создаем новый элемент div для заметки
        const noteElement = document.createElement('div');
        noteElement.className = 'note'; // устанавливаем класс для стилизации заметки
        noteElement.id = note.id; // устанавливаем идентификатор заметки
        noteElement.innerHTML = '<textarea>' + note.text + '</textarea>'; // создаем textarea для текста заметки
        noteElement.style.left = note.left; // устанавливаем сохраненные координаты
        noteElement.style.top = note.top;
        // добавляем заметку в контейнер
        notesContainer.appendChild(noteElement);
  
        // добавляем обработчики для перетаскивания заметок
        noteElement.addEventListener('mousedown', function(event) {
          if (event.target.tagName === 'TEXTAREA') {
            return;
          }
          
          const startX = event.clientX;
          const startY = event.clientY;
          const startLeft = parseInt(noteElement.style.left); // используем parseInt для получения числового значения
          const startTop = parseInt(noteElement.style.top);
  
          // функция для обработки события движения мыши
          function handleMouseMove(event) {
            const diffX = event.clientX - startX;
            const diffY = event.clientY - startY;
            noteElement.style.left = startLeft + diffX + 'px'; // изменяем координаты
            noteElement.style.top = startTop + diffY + 'px';
          }
  
          // функция для обработки события отпускания кнопки мыши
          function handleMouseUp() {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
  
            // сохраняем новую позицию заметки
            note.left = noteElement.style.left;
            note.top = noteElement.style.top;
            saveNotes();
          }
  
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
        });
  
        // добавляем обработчик для сохранения текста заметки
        const textarea = noteElement.querySelector('textarea');
        textarea.addEventListener('input', function() {
          note.text = textarea.value;
          saveNotes();
        });
      });
    }
  
    function saveNotes() {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  });
  
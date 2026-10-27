var form = document.getElementById("task-form");
var input = document.getElementById('task-input');
var categorySelect = document.getElementById('task-category');
var importantCheckbox = document.getElementById('task-important');
var dateInput = document.getElementById('task-date');
var list = document.getElementById('task-list');
var counter = document.getElementById('counter');
var activeCounter = document.getElementById('active-counter');
var clearBtn = document.getElementById('clear-btn');
var filterBtns = document.querySelectorAll('.filter-btn');
var themeBtn = document.getElementById('theme-btn');
var searchInput = document.getElementById('search-input');
var progressBar = document.getElementById('progress-bar');
var exportBtn = document.getElementById('export-btn');
var importInput = document.getElementById('import-input');

// Загружаем задачи из памяти или создаем пустой массив
var tasks = JSON.parse(localStorage.getItem('tasks')) || [];
var currentFilter = "all";
var searchText = "";

// Проверяем тему
var currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme == 'dark') {
    document.body.classList.add('dark-theme');
    themeBtn.innerHTML = '☀️';
}

// Переключение темы
themeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
        themeBtn.innerHTML = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeBtn.innerHTML = '🌙';
    }
});

// Функция сохранения
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Обновление счетчиков и прогресс-бара
function updateCounter() {
    counter.innerHTML = "Всего задач: " + tasks.length;
    
    var activeCount = 0;
    var doneCount = 0;
    
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].done == false) {
            activeCount = activeCount + 1;
        } else {
            doneCount = doneCount + 1;
        }
    }
    
    activeCounter.innerHTML = "Активных задач: " + activeCount;

    // Считаем проценты для полоски
    if (tasks.length == 0) {
        progressBar.style.width = '0%';
    } else {
        var percent = (doneCount / tasks.length) * 100;
        progressBar.style.width = percent + '%';
    }
}

// Перевод времени в красивую дату
function getDateString(timestamp) {
    if (!timestamp) return "";
    
    var date = new Date(timestamp);
    var today = new Date();
    
    if (date.toDateString() == today.toDateString()) {
        return "Сегодня, " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    }
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

// Конфетти
function showConfetti() {
    for (var i = 0; i < 30; i++) {
        var confetti = document.createElement('div');
        confetti.className = 'confetti';
        var colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        
        // Рандомный цвет
        var randomIndex = Math.floor(Math.random() * colors.length);
        confetti.style.backgroundColor = colors[randomIndex];
        
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(function() { 
            confetti.remove(); 
        }, 2000);
    }
}

// Функция, которая угадывает категорию по словам
function guessCategory(text) {
    var txt = text.toLowerCase();
    
    // Если есть эти слова, то это учеба
    if (txt.indexOf('урок') != -1 || txt.indexOf('учеб') != -1 || txt.indexOf('дз') != -1 || txt.indexOf('домашк') != -1 || txt.indexOf('экзамен') != -1 || txt.indexOf('тест') != -1 || txt.indexOf('читать') != -1 || txt.indexOf('книг') != -1) {
        return 'study';
    }
    
    // Слова для работы
    if (txt.indexOf('работ') != -1 || txt.indexOf('офис') != -1 || txt.indexOf('начальник') != -1 || txt.indexOf('проект') != -1 || txt.indexOf('отчет') != -1 || txt.indexOf('встреч') != -1 || txt.indexOf('звонок') != -1 || txt.indexOf('клиент') != -1) {
        return 'work';
    }
    
    // Слова для дома
    if (txt.indexOf('дом') != -1 || txt.indexOf('уборк') != -1 || txt.indexOf('готовить') != -1 || txt.indexOf('магазин') != -1 || txt.indexOf('купить') != -1 || txt.indexOf('продукт') != -1 || txt.indexOf('мыть') != -1 || txt.indexOf('обед') != -1 || txt.indexOf('ужин') != -1) {
        return 'home';
    }
    
    return 'none'; // Если ничего не подошло
}

// Главная функция отрисовки задач
function renderTasks() {
    list.innerHTML = ''; 
    var filteredTasks = tasks;
    
    // Фильтр по кнопкам
    if (currentFilter == 'active') {
        filteredTasks = filteredTasks.filter(function(task) { 
            return !task.done; 
        });
    } else if (currentFilter == 'done') {
        filteredTasks = filteredTasks.filter(function(task) { 
            return task.done; 
        });
    }

    // Фильтр по поиску
    if (searchText != "") {
        filteredTasks = filteredTasks.filter(function(task) {
            var textMatch = task.text.toLowerCase().indexOf(searchText.toLowerCase()) != -1;
            
            var catName = "";
            if (task.category == 'study') catName = 'учеба';
            if (task.category == 'work') catName = 'работа';
            if (task.category == 'home') catName = 'дом';
            
            var categoryMatch = catName.indexOf(searchText.toLowerCase()) != -1;
            
            return textMatch || categoryMatch;
        });
    }

    filteredTasks.forEach(function(task) {
        var originalIndex = tasks.indexOf(task);
        
        var li = document.createElement('li');
        li.className = 'task-item';
        if (task.done) li.className += ' done';
        if (task.important) li.className += ' important';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', function() {
            tasks[originalIndex].done = checkbox.checked;
            saveTasks();
            renderTasks();
            if (checkbox.checked == true) {
                showConfetti();
            }
        });

        var textBlock = document.createElement('div');
        textBlock.className = 'task-text-block';

        var span = document.createElement('span');
        span.className = 'task-text';
        span.innerHTML = task.text;
        if (task.important) span.innerHTML = "⭐ " + span.innerHTML;

        // Редактирование по двойному клику
        span.addEventListener('dblclick', function() {
            var newText = prompt("Изменить задачу:", task.text);
            if (newText == null) return; // Если нажали отмену
            
            newText = newText.trim();
            if (newText == "") return; // Если пусто
            
            tasks[originalIndex].text = newText;
            saveTasks();
            renderTasks();
        });

        // Вывод тега
        var tagSpan = document.createElement('span');
        if (task.category && task.category != 'none') {
            tagSpan.className = 'task-tag tag-' + task.category;
            if (task.category == 'study') tagSpan.innerHTML = "Учеба";
            if (task.category == 'work') tagSpan.innerHTML = "Работа";
            if (task.category == 'home') tagSpan.innerHTML = "Дом";
        }

        // Вывод даты
        var dateSpan = document.createElement('span');
        dateSpan.className = 'task-date';
        
        if (task.deadline) {
            var dDate = new Date(task.deadline);
            var today = new Date();
            today.setHours(0,0,0,0); 
            
            var dateStr = dDate.getDate() + "." + (dDate.getMonth() + 1) + "." + dDate.getFullYear();
            
            if (dDate <= today && !task.done) {
                dateSpan.className += ' deadline-warning';
                dateSpan.innerHTML = "⏰ До: " + dateStr;
            } else {
                dateSpan.innerHTML = "📅 До: " + dateStr;
            }
        } else {
            dateSpan.innerHTML = getDateString(task.date);
        }

        textBlock.appendChild(span);
        
        var metaRow = document.createElement('div');
        metaRow.className = 'task-meta';
        if (tagSpan.className != "") metaRow.appendChild(tagSpan);
        metaRow.appendChild(dateSpan);
        textBlock.appendChild(metaRow);

        var btn = document.createElement('button');
        btn.className = 'delete-btn';
        btn.innerHTML = "Удалить";
        btn.addEventListener('click', function() {
            tasks.splice(originalIndex, 1);
            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(textBlock); 
        li.appendChild(btn);
        list.appendChild(li);
    });

    updateCounter();
    
    // Проверяем, есть ли выполненные задачи, чтобы показать кнопку очистки
    var hasDone = false;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].done) { 
            hasDone = true; 
            break; 
        }
    }
    
    if (hasDone == true) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
}

// Добавление новой задачи
form.addEventListener('submit', function(e) {
    e.preventDefault();
    var text = input.value.trim();
    
    if (!text || text == "") return;

    // Получаем категорию
    var finalCat = categorySelect.value;
    
    // Если стоит "Авто", пытаемся угадать
    if (finalCat == 'none') {
        finalCat = guessCategory(text);
    }

    // Записываем в массив
    tasks.push({ 
        text: text, 
        done: false, 
        important: importantCheckbox.checked,
        category: finalCat,
        date: Date.now(),
        deadline: dateInput.value 
    });
    
    saveTasks();
    
    // Очищаем поля
    input.value = '';
    importantCheckbox.checked = false;
    categorySelect.value = 'none';
    dateInput.value = ''; 
    
    renderTasks();
});

// Поиск
searchInput.addEventListener('input', function() {
    searchText = searchInput.value;
    renderTasks();
});

// Очистка выполненных
clearBtn.addEventListener('click', function() {
    var newTasks = [];
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].done == false) {
            newTasks.push(tasks[i]);
        }
    }
    tasks = newTasks;
    saveTasks();
    renderTasks();
});

// Фильтры
for (var i = 0; i < filterBtns.length; i++) {
    filterBtns[i].addEventListener('click', function() {
        for (var j = 0; j < filterBtns.length; j++) {
            filterBtns[j].classList.remove('active');
        }
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderTasks();
    });
}

// Экспорт
exportBtn.addEventListener('click', function() {
    var dataStr = JSON.stringify(tasks, null, 2);
    var blob = new Blob([dataStr], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = "my_tasks_backup.json";
    a.click();
    URL.revokeObjectURL(url);
});

// Импорт
importInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var importedTasks = JSON.parse(e.target.result);
            if (Array.isArray(importedTasks)) {
                tasks = tasks.concat(importedTasks);
                saveTasks();
                renderTasks();
                alert("Задачи успешно загружены!");
            } else {
                alert("Ошибка: неверный формат файла.");
            }
        } catch (err) {
            alert("Ошибка чтения файла.");
        }
    };
    reader.readAsText(file);
    importInput.value = '';
});

// Горячие клавиши
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key == '/') {
        e.preventDefault();
        searchInput.focus();
    }
    if (e.key == 'Escape') {
        searchInput.value = '';
        searchText = '';
        renderTasks();
    }
});

renderTasks();
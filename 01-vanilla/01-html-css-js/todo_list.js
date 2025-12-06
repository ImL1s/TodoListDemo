
window.onload = function () {
  const STORAGE_KEY = 'vanilla-todos'
  const defaultTodos = [
    { id: '1', text: '七點半起床', completed: false },
    { id: '2', text: '洗漱', completed: true },
    { id: '3', text: '去上班', completed: false },
    { id: '4', text: '完成報表', completed: false },
    { id: '5', text: '和小明吃午飯', completed: false },
    { id: '6', text: '去超市', completed: false },
  ]

  const listEl = document.getElementById('myUL')
  const inputEl = document.getElementById('myInput')
  const addButton = document.getElementById('addButton')
  const statsEl = document.getElementById('stats')
  const clearCompletedBtn = document.getElementById('clearCompleted')
  const filterButtons = document.querySelectorAll('[data-filter]')

  let todos = []
  let currentFilter = 'all'

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (Array.isArray(saved) && saved.length) {
        todos = saved
        return
      }
    } catch (e) {
      console.warn('無法讀取 localStorage，使用預設任務')
    }
    todos = defaultTodos
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }

  function setActiveFilterButton() {
    filterButtons.forEach(btn => {
      if (btn.dataset.filter === currentFilter) {
        btn.classList.add('active')
      } else {
        btn.classList.remove('active')
      }
    })
  }

  function renderStats() {
    const completed = todos.filter(todo => todo.completed).length
    const active = todos.length - completed
    statsEl.textContent = `全部 ${todos.length} · 進行中 ${active} · 已完成 ${completed}`
    clearCompletedBtn.disabled = completed === 0
    setActiveFilterButton()
  }

  function getFilteredTodos() {
    if (currentFilter === 'active') return todos.filter(todo => !todo.completed)
    if (currentFilter === 'completed') return todos.filter(todo => todo.completed)
    return todos
  }

  function renderList() {
    listEl.innerHTML = ''
    const filtered = getFilteredTodos()

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li')
      emptyLi.className = 'empty-state'
      emptyLi.textContent = '還沒有任務，添加一個吧！'
      listEl.appendChild(emptyLi)
      renderStats()
      return
    }

    filtered.forEach(todo => {
      const li = document.createElement('li')
      li.className = todo.completed ? 'checked' : ''

      const textSpan = document.createElement('span')
      textSpan.className = 'todo-text'
      textSpan.textContent = todo.text
      textSpan.ondblclick = function (e) {
        e.stopPropagation()
        const next = prompt('編輯任務', todo.text)
        if (next === null) return
        const trimmed = next.trim()
        if (!trimmed) {
          alert('內容不能為空')
          return
        }
        updateTodo(todo.id, trimmed)
      }

      const closeSpan = document.createElement('span')
      closeSpan.className = 'close'
      closeSpan.textContent = '×'
      closeSpan.onclick = function (e) {
        e.stopPropagation()
        deleteTodo(todo.id)
      }

      li.onclick = function () {
        toggleTodo(todo.id)
      }

      li.appendChild(textSpan)
      li.appendChild(closeSpan)
      listEl.appendChild(li)
    })

    renderStats()
  }

  function addTodo(text) {
    todos = [...todos, { id: Date.now().toString(), text, completed: false }]
    save()
    renderList()
  }

  function toggleTodo(id) {
    todos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo)
    save()
    renderList()
  }

  function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id)
    save()
    renderList()
  }

  function updateTodo(id, text) {
    todos = todos.map(todo => todo.id === id ? { ...todo, text } : todo)
    save()
    renderList()
  }

  function clearCompleted() {
    todos = todos.filter(todo => !todo.completed)
    save()
    renderList()
  }

  function setFilter(filter) {
    currentFilter = filter
    renderList()
  }

  function handleAdd() {
    const trimmedValue = inputEl.value.trim()
    if (!trimmedValue) {
      alert('請先輸入一個具體任務。')
      return
    }
    addTodo(trimmedValue)
    inputEl.value = ''
  }

  function bindEvents() {
    addButton.onclick = handleAdd
    inputEl.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        handleAdd()
      }
    })

    filterButtons.forEach(btn => {
      btn.onclick = function () {
        setFilter(btn.dataset.filter)
      }
    })

    clearCompletedBtn.onclick = clearCompleted
  }

  function init() {
    load()
    bindEvents()
    renderList()
  }

  init()
}
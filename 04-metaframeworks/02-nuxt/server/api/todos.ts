import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// 定义 Todo 类型
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

// 数据文件路径
const DATA_DIR = join(process.cwd(), 'data')
const DATA_FILE = join(DATA_DIR, 'todos.json')

// 确保数据目录和文件存在
async function ensureDataFile(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }

  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, JSON.stringify([], null, 2))
  }
}

// 读取 todos
async function readTodos(): Promise<Todo[]> {
  await ensureDataFile()
  const data = await readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
}

// 写入 todos
async function writeTodos(todos: Todo[]): Promise<void> {
  await ensureDataFile()
  await writeFile(DATA_FILE, JSON.stringify(todos, null, 2))
}

// GET /api/todos - 获取所有 todos
export default defineEventHandler(async (event) => {
  const method = event.method

  // GET - 获取所有 todos
  if (method === 'GET') {
    try {
      const todos = await readTodos()
      return todos
    } catch (error) {
      console.error('读取 todos 失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '读取数据失败'
      })
    }
  }

  // POST - 创建新 todo
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { text } = body

      if (!text || typeof text !== 'string' || !text.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: '文本内容不能为空'
        })
      }

      const todos = await readTodos()

      // 创建新 todo
      const newTodo: Todo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      }

      todos.unshift(newTodo)
      await writeTodos(todos)

      // 设置状态码为 201
      setResponseStatus(event, 201)
      return newTodo
    } catch (error: any) {
      if (error.statusCode) {
        throw error
      }
      console.error('创建 todo 失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '创建失败'
      })
    }
  }

  // PATCH - 切换 todo 完成状态
  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const { id } = body

      if (!id || typeof id !== 'number') {
        throw createError({
          statusCode: 400,
          statusMessage: '无效的 ID'
        })
      }

      const todos = await readTodos()
      const todo = todos.find(t => t.id === id)

      if (!todo) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Todo 不存在'
        })
      }

      // 切换完成状态
      todo.completed = !todo.completed
      await writeTodos(todos)

      return todo
    } catch (error: any) {
      if (error.statusCode) {
        throw error
      }
      console.error('更新 todo 失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '更新失败'
      })
    }
  }

  // DELETE - 删除 todo
  if (method === 'DELETE') {
    try {
      const query = getQuery(event)
      const id = Number(query.id)

      if (!id || isNaN(id)) {
        throw createError({
          statusCode: 400,
          statusMessage: '无效的 ID'
        })
      }

      const todos = await readTodos()
      const index = todos.findIndex(t => t.id === id)

      if (index === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Todo 不存在'
        })
      }

      todos.splice(index, 1)
      await writeTodos(todos)

      // 返回 204 No Content
      setResponseStatus(event, 204)
      return null
    } catch (error: any) {
      if (error.statusCode) {
        throw error
      }
      console.error('删除 todo 失败:', error)
      throw createError({
        statusCode: 500,
        statusMessage: '删除失败'
      })
    }
  }

  // 不支持的方法
  throw createError({
    statusCode: 405,
    statusMessage: '方法不允许'
  })
})

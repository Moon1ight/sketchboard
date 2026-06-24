import './App.css'
// import Editor from '@/features/board/board.page'
// import BoardsPage from '@/features/boards-list/boards-list.page'
// import AuthPage from '@/features/auth'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className='h-[100vh]'>
      <Outlet />

      {/* <AuthPage /> */}
      {/* <BoardsPage /> */}

      {/* <Editor /> */}
    </div>
  )
}

export default App

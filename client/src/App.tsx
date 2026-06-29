import { Toaster } from "sonner"
import { Header } from "./components/header"
import { useTasks } from "./hooks/useTasks"

export function App() {
  const { stats } = useTasks()

  return (
    <div className="min-h-screen px-6 py-8 pb-20">
      <div className="mx-auto max-w-6xl">
        <Header stats={stats} />

        <Toaster richColors position="bottom-right" />
      </div>
    </div>
  )
}

export default App

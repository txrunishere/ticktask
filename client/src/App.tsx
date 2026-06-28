import { Button } from "./components/ui/button"
import { useTasks } from "./hooks/useTasks"

export function App() {
  const { fetchTasks } = useTasks()

  return (
    <div className="p-10">
      <Button onClick={fetchTasks}>Fetch Tasks</Button>
    </div>
  )
}

export default App

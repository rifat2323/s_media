import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface RefreshButtonProps {
  onClick: () => void
  isLoading?: boolean
  color?:string
}

export default function RefreshButton({ onClick, isLoading = false,color }: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={isLoading}
      className="h-10 w-10 rounded-full"
    >
      <RefreshCw
        className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
        aria-hidden="true"
        color={color}
      />
      <span className="sr-only">Refresh</span>
    </Button>
  )
}
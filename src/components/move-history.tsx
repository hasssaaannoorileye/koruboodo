import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MoveHistoryProps {
  moves: string[]
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] px-4">
          {moves.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No moves yet</p>
          ) : (
            <ul className="space-y-1">
              {moves.map((move, index) => (
                <li key={index} className="text-sm py-1 border-b border-border last:border-0">
                  <span className="font-mono text-xs mr-2 text-muted-foreground">{index + 1}.</span>
                  {move}
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default MoveHistory


"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings } from "lucide-react"
import { GameMode } from "@/types/types"

interface GameControlsProps {
  onRestart: () => void
  onSettings: () => void
  timer: number
  gameMode: GameMode
}

const GameControls: React.FC<GameControlsProps> = ({ onRestart, onSettings, timer, gameMode }) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-lg">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {gameMode === "standard" && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Game Time</p>
            <p className="text-2xl font-mono">{formatTime(timer)}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Restart
          </Button>
          <Button variant="outline" className="flex-1" onClick={onSettings}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default GameControls
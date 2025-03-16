"use client"

import type React from "react"

import type { Player } from "@/types/player"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Circle, Trophy, Clock, User, Bot } from "lucide-react"

interface PlayerCardProps {
  player: Player
  isActive: boolean
  remainingTime: number | null
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isActive, remainingTime }) => {
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Calculate time warning levels
  const getTimeColor = (seconds: number): string => {
    if (seconds <= 10) return "text-red-500"
    if (seconds <= 30) return "text-orange-500"
    if (seconds <= 60) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${isActive ? "ring-2 ring-primary" : ""}`}>
      <motion.div
        className={`h-2 bg-primary ${isActive ? "opacity-100" : "opacity-0"}`}
        initial={{ width: "0%" }}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0 }}
      />
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {player.avatar ? (
              <img
                src={player.avatar || "/placeholder.svg"}
                alt={player.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${player.color === "black" ? "bg-black" : "bg-white border border-gray-300"}`}
              >
                <Circle className={`w-5 h-5 ${player.color === "black" ? "text-white" : "text-black"}`} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold">{player.name}</h3>
                {player.isAI && <Bot className="h-3 w-3 text-muted-foreground" />}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Captures: {player.score}</span>
                {player.stats?.gamesWon ? (
                  <span className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" /> {player.stats.gamesWon}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {remainingTime !== null && (
            <div className={`text-xl font-mono font-bold ${getTimeColor(remainingTime)}`}>
              {formatTime(remainingTime)}
            </div>
          )}

          {isActive && (
            <motion.div
              className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
            />
          )}
        </div>

        {player.stats && (
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Moves: {player.stats.movesMade}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Avg: {player.stats.averageMoveTime.toFixed(1)}s</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PlayerCard
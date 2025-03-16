"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Player, DEFAULT_PLAYERS } from "@/types/player"
import type { GameMode } from "@/types/types"
import { motion } from "framer-motion"
import { User, Bot, Clock } from "lucide-react"

type AutoDifficulty = "easy" | "medium" | "hard"

interface GameSettingsProps {
    players: Player[]
    firstPlayer: number
    onSubmit: (
        player1: Player,
        player2: Player,
        firstPlayer: number,
        gameMode: GameMode,
        timeLimit: number,
        autoDifficulty?: AutoDifficulty,
    ) => void
    gameMode: GameMode
    timeLimit: number
}

const GameSettings: React.FC<GameSettingsProps> = ({
    players,
    firstPlayer,
    onSubmit,
    gameMode: initialGameMode,
    timeLimit: initialTimeLimit,
}) => {
    const [player1, setPlayer1] = useState<Player>({
        ...DEFAULT_PLAYERS[0],
        ...players[0],
    })
    const [player2, setPlayer2] = useState<Player>({
        ...DEFAULT_PLAYERS[1],
        ...players[1],
    })
    const [selectedFirstPlayer, setSelectedFirstPlayer] = useState(firstPlayer.toString())
    const [gameMode, setGameMode] = useState<GameMode>(initialGameMode)
    const [timeLimit, setTimeLimit] = useState(initialTimeLimit)
    const [autoDifficulty, setAutoDifficulty] = useState<AutoDifficulty>("medium")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Update player 2 for AI mode
        const updatedPlayer2 =
            gameMode === "auto"
                ? { ...player2, name: `Auto (${autoDifficulty})`, isAI: true, autoDifficulty }
                : { ...player2, isAI: false }

        onSubmit(player1, updatedPlayer2, Number.parseInt(selectedFirstPlayer), gameMode, timeLimit, autoDifficulty)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
        >
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Game Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Tabs defaultValue={gameMode} onValueChange={(value) => setGameMode(value as GameMode)}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="standard" className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:inline">Standard</span>
                                </TabsTrigger>
                                <TabsTrigger value="timed" className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="hidden sm:inline">Timed</span>
                                </TabsTrigger>
                                <TabsTrigger value="auto" className="flex items-center gap-1">
                                    <Bot className="h-4 w-4" />
                                    <span className="hidden sm:inline">vs AI</span>
                                </TabsTrigger>
                            </TabsList>

                            {/* Standard Mode */}
                            <TabsContent value="standard" className="pt-4">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Play without time limits. The game continues until a player wins.
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="player1">Player 1 (Black)</Label>
                                        <Input
                                            id="player1"
                                            value={player1.name}
                                            onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
                                            placeholder="Enter player name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="player2">Player 2 (White)</Label>
                                        <Input
                                            id="player2"
                                            value={player2.name}
                                            onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
                                            placeholder="Enter player name"
                                            required
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Timed Mode */}
                            <TabsContent value="timed" className="pt-4 space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Each player has a limited amount of time to make all their moves.
                                </p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="player1Timed">Player 1 (Black)</Label>
                                        <Input
                                            id="player1Timed"
                                            value={player1.name}
                                            onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
                                            placeholder="Enter player name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="player2Timed">Player 2 (White)</Label>
                                        <Input
                                            id="player2Timed"
                                            value={player2.name}
                                            onChange={(e) => setPlayer2({ ...player2, name: e.target.value })}
                                            placeholder="Enter player name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                                        <div className="flex items-center space-x-2">
                                            <Input
                                                id="timeLimit"
                                                type="number"
                                                min={60}
                                                max={3600}
                                                value={timeLimit}
                                                onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {Math.floor(timeLimit / 60)}:{timeLimit % 60 < 10 ? `0${timeLimit % 60}` : timeLimit % 60}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* AI Mode */}
                            <TabsContent value="auto" className="pt-4 space-y-4">
                                <p className="text-sm text-muted-foreground">Play against the computer with adjustable difficulty.</p>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="playerAI">Your Name (Black)</Label>
                                        <Input
                                            id="playerAI"
                                            value={player1.name}
                                            onChange={(e) => setPlayer1({ ...player1, name: e.target.value })}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Auto Difficulty</Label>
                                        <RadioGroup
                                            value={autoDifficulty}
                                            onValueChange={(value) => setAutoDifficulty(value as "easy" | "medium" | "hard")}
                                            className="flex space-x-4"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="easy" id="auto-easy" />
                                                <Label htmlFor="auto-easy">Easy</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="medium" id="auto-medium" />
                                                <Label htmlFor="auto-medium">Medium</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="hard" id="auto-hard" />
                                                <Label htmlFor="auto-hard">Hard</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="bg-muted p-3 rounded-md">
                                        <h3 className="font-medium mb-2 flex items-center gap-2">
                                            <Bot className="h-4 w-4" />
                                            Auto Difficulty Levels
                                        </h3>
                                        <ul className="text-xs space-y-1 text-muted-foreground">
                                            <li>
                                                <span className="font-medium">Easy:</span> Makes random moves, suitable for beginners
                                            </li>
                                            <li>
                                                <span className="font-medium">Medium:</span> Evaluates 2 moves ahead, occasionally makes
                                                mistakes
                                            </li>
                                            <li>
                                                <span className="font-medium">Hard:</span> Evaluates 4 moves ahead, plays strategically
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="space-y-2">
                            <Label>First Player</Label>
                            <RadioGroup value={selectedFirstPlayer} onValueChange={setSelectedFirstPlayer} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="1" id="player1-first" />
                                    <Label htmlFor="player1-first">Player 1</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="2" id="player2-first" />
                                    <Label htmlFor="player2-first">Player 2</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <Button type="submit" className="w-full hover:bg-blue-100 active:bg-blue-200">
                            Start Game
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default GameSettings


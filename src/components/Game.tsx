"use client"

import { useState, useEffect, useCallback } from "react"
import type { Board, Position, GameMode } from "@/types/types"
import { type Player, DEFAULT_PLAYERS, updatePlayerStats } from "@/types/player"
import BoardComponent from "@/components/Board"
import PlayerCard from "@/components/player-card"
import MoveHistory from "@/components/move-history"
import GameSettings from "@/components/game-settings"
import GameControls from "@/components/game-controls"
import GameOverModal from "@/components/game-over-modal"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"
import { useToast } from "./hooks/use-toast"

// Initial board setup
const initialBoard: Board = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 0, 2, 2],
  [2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2],
]

// AI difficulty levels
type AutoDifficulty = "easy" | "medium" | "hard"

// Move type for AI evaluation
type Move = {
  from: Position
  to: Position
  score: number
  isCapture: boolean
  capturedPosition?: Position
}

const Game = () => {
  const [board, setBoard] = useState<Board>(initialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<number>(1)
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [winner, setWinner] = useState<number | null>(null)
  const [scores, setScores] = useState<{ [key: number]: number }>({ 1: 0, 2: 0 })
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const [timer, setTimer] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false)
  const [showSettings, setShowSettings] = useState<boolean>(true)
  const [players, setPlayers] = useState<Player[]>([DEFAULT_PLAYERS[0], DEFAULT_PLAYERS[1]])
  const [firstPlayer, setFirstPlayer] = useState<number>(1)
  const [validMoves, setValidMoves] = useState<Position[]>([])
  const [capturablePositions, setCapturablePositions] = useState<Position[]>([])
  const [showGameOver, setShowGameOver] = useState<boolean>(false)
  const [canContinueCapturing, setCanContinueCapturing] = useState<boolean>(false)
  const [lastMove, setLastMove] = useState<Position[]>([])
  const [gameMode, setGameMode] = useState<GameMode>("standard")
  const [timeLimit, setTimeLimit] = useState<number>(300) // 5 minutes in seconds
  const [playerTime, setPlayerTime] = useState<{ [key: number]: number }>({ 1: 300, 2: 300 })
  const [moveStartTime, setMoveStartTime] = useState<number>(Date.now())
  const [botPlayer, setBotPlayer] = useState<number | null>(null)
  const [autoDifficulty, setAutoDifficulty] = useState<AutoDifficulty>("medium")
  const [isAutoThinking, setIsAutoThinking] = useState<boolean>(false)

  const { toast } = useToast()

  // Sound effects
  const playSound = (sound: string) => {
    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.volume = 0.5
    audio.play().catch((e) => console.error("Error playing sound:", e))
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        if (gameMode === "timed") {
          setPlayerTime((prev) => {
            const newTime = { ...prev }
            newTime[currentPlayer] = Math.max(0, newTime[currentPlayer] - 1)

            // Check for time out
            if (newTime[currentPlayer] === 0) {
              setWinner(currentPlayer === 1 ? 2 : 1)
              setShowGameOver(true)
              setIsTimerRunning(false)
              playSound("win")
              clearInterval(interval)
            }

            return newTime
          })
        } else {
          setTimer((prev) => prev + 1)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, currentPlayer, gameMode])

  // Calculate remaining pieces
  const player1Pieces = board.flat().filter((cell) => cell === 1).length
  const player2Pieces = board.flat().filter((cell) => cell === 2).length

  // Check for valid moves
  useEffect(() => {
    const { validMoves, capturablePositions } = getValidMoves(board, currentPlayer)
    setValidMoves(validMoves)
    setCapturablePositions(capturablePositions)

    // Check for game over conditions
    if (!winner && !showSettings && !validMoves.length && !capturablePositions.length) {
      setWinner(currentPlayer === 1 ? 2 : 1)
      setShowGameOver(true)
      setIsTimerRunning(false)
      playSound("win")
    }
  }, [board, currentPlayer, winner, showSettings])

  // Set move start time when player changes
  useEffect(() => {
    setMoveStartTime(Date.now())
  }, [currentPlayer])

  // Check if a move is valid
  const isValidMove = (
    board: Board,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    player: number,
  ): boolean => {
    if (board[toRow][toCol] !== 0) return false

    const rowDiff = Math.abs(toRow - fromRow)
    const colDiff = Math.abs(toCol - fromCol)

    // Regular move (one space)
    if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
      return !canContinueCapturing // Only allow regular moves if not in a capturing sequence
    }

    // Capture move (two spaces with opponent in between)
    if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
      const midRow = (fromRow + toRow) / 2
      const midCol = (fromCol + toCol) / 2
      const midPiece = board[midRow][midCol]

      return midPiece !== 0 && midPiece !== player
    }

    return false
  }

  // Check if player has valid moves
  const hasValidMoves = (board: Board, player: number): boolean => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === player) {
          const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1], // Down, Up, Right, Left
          ]

          for (const [dx, dy] of directions) {
            // Check regular move
            const newRow = row + dx
            const newCol = col + dy

            if (
              newRow >= 0 &&
              newRow < board.length &&
              newCol >= 0 &&
              newCol < board[row].length &&
              board[newRow][newCol] === 0
            ) {
              return true
            }

            // Check capture move
            const jumpRow = row + 2 * dx
            const jumpCol = col + 2 * dy

            if (
              jumpRow >= 0 &&
              jumpRow < board.length &&
              jumpCol >= 0 &&
              jumpCol < board[row].length &&
              board[jumpRow][jumpCol] === 0
            ) {
              const midRow = row + dx
              const midCol = col + dy

              if (
                midRow >= 0 &&
                midRow < board.length &&
                midCol >= 0 &&
                midCol < board[row].length &&
                board[midRow][midCol] !== 0 &&
                board[midRow][midCol] !== player
              ) {
                return true
              }
            }
          }
        }
      }
    }
    return false
  }

  // Check if a piece can make a jump move
  const hasValidJumpMoves = (board: Board, row: number, col: number, player: number): boolean => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1], // Down, Up, Right, Left
    ]

    for (const [dx, dy] of directions) {
      const jumpRow = row + 2 * dx
      const jumpCol = col + 2 * dy

      if (
        jumpRow >= 0 &&
        jumpRow < board.length &&
        jumpCol >= 0 &&
        jumpCol < board[0].length &&
        board[jumpRow][jumpCol] === 0
      ) {
        const midRow = row + dx
        const midCol = col + dy

        if (board[midRow][midCol] !== 0 && board[midRow][midCol] !== player) {
          return true
        }
      }
    }

    return false
  }

  // Get all valid moves for current player
  const getValidMoves = (board: Board, player: number): { validMoves: Position[]; capturablePositions: Position[] } => {
    const validMoves: Position[] = []
    const capturablePositions: Position[] = []

    // If we're in a capturing sequence, only the selected piece can move
    if (canContinueCapturing && selectedPiece) {
      if (hasValidJumpMoves(board, selectedPiece[0], selectedPiece[1], player)) {
        capturablePositions.push(selectedPiece)
      }
      return { validMoves, capturablePositions }
    }

    // Check all pieces
    board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === player) {
          const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1], // Down, Up, Right, Left
          ]

          // First check for captures (prioritize these)
          let hasCapture = false

          for (const [dx, dy] of directions) {
            const jumpRow = rowIndex + 2 * dx
            const jumpCol = colIndex + 2 * dy

            if (
              jumpRow >= 0 &&
              jumpRow < board.length &&
              jumpCol >= 0 &&
              jumpCol < row.length &&
              board[jumpRow][jumpCol] === 0
            ) {
              const midRow = rowIndex + dx
              const midCol = colIndex + dy

              if (board[midRow][midCol] !== 0 && board[midRow][midCol] !== player) {
                capturablePositions.push([rowIndex, colIndex])
                hasCapture = true
              }
            }
          }

          // If no captures are available, check for regular moves
          if (!hasCapture && capturablePositions.length === 0) {
            for (const [dx, dy] of directions) {
              const newRow = rowIndex + dx
              const newCol = colIndex + dy

              if (
                newRow >= 0 &&
                newRow < board.length &&
                newCol >= 0 &&
                newCol < row.length &&
                board[newRow][newCol] === 0
              ) {
                validMoves.push([rowIndex, colIndex])
                break // Once we know this piece can move, we don't need to check other directions
              }
            }
          }
        }
      })
    })

    return { validMoves, capturablePositions }
  }

  // Get all possible moves for a specific piece
  const getPossibleMovesForPiece = (board: Board, row: number, col: number, player: number): Move[] => {
    const possibleMoves: Move[] = []
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1], // Down, Up, Right, Left
    ]

    // Check for capture moves first
    for (const [dx, dy] of directions) {
      const jumpRow = row + 2 * dx
      const jumpCol = col + 2 * dy

      if (
        jumpRow >= 0 &&
        jumpRow < board.length &&
        jumpCol >= 0 &&
        jumpCol < board[0].length &&
        board[jumpRow][jumpCol] === 0
      ) {
        const midRow = row + dx
        const midCol = col + dy

        if (board[midRow][midCol] !== 0 && board[midRow][midCol] !== player) {
          // This is a capture move
          possibleMoves.push({
            from: [row, col],
            to: [jumpRow, jumpCol],
            score: 10, // Base score for capture
            isCapture: true,
            capturedPosition: [midRow, midCol],
          })
        }
      }
    }

    // If no captures, check for regular moves
    if (possibleMoves.length === 0) {
      for (const [dx, dy] of directions) {
        const newRow = row + dx
        const newCol = col + dy

        if (
          newRow >= 0 &&
          newRow < board.length &&
          newCol >= 0 &&
          newCol < board[0].length &&
          board[newRow][newCol] === 0
        ) {
          // This is a regular move
          possibleMoves.push({
            from: [row, col],
            to: [newRow, newCol],
            score: 1, // Base score for regular move
            isCapture: false,
          })
        }
      }
    }

    return possibleMoves
  }

  // Get all possible moves for a player
  const getAllPossibleMoves = (board: Board, player: number): Move[] => {
    const allMoves: Move[] = []

    // If we're in a capturing sequence, only the selected piece can move
    if (canContinueCapturing && selectedPiece) {
      return getPossibleMovesForPiece(board, selectedPiece[0], selectedPiece[1], player)
    }

    // Check all pieces
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === player) {
          const pieceMoves = getPossibleMovesForPiece(board, row, col, player)
          allMoves.push(...pieceMoves)
        }
      }
    }

    // If there are capture moves, filter out regular moves
    const captureMoves = allMoves.filter((move) => move.isCapture)
    return captureMoves.length > 0 ? captureMoves : allMoves
  }

  // Evaluate the board state for a player
  const evaluateBoard = (board: Board, player: number): number => {
    const opponent = player === 1 ? 2 : 1

    // Count pieces
    let playerPieces = 0
    let opponentPieces = 0

    // Count pieces and evaluate positions
    let score = 0

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === player) {
          playerPieces++

          // Bonus for pieces in the opponent's territory
          if (player === 1 && row >= 3) {
            score += 2
          } else if (player === 2 && row <= 1) {
            score += 2
          }

          // Bonus for center control
          if ((row === 2 && col === 2) || (row === 2 && col === 1) || (row === 2 && col === 3)) {
            score += 1
          }

          // Check if this piece can capture
          if (hasValidJumpMoves(board, row, col, player)) {
            score += 3
          }
        } else if (board[row][col] === opponent) {
          opponentPieces++
        }
      }
    }

    // Major bonus for having more pieces
    score += (playerPieces - opponentPieces) * 5

    // Check mobility (number of possible moves)
    const { validMoves, capturablePositions } = getValidMoves(board, player)
    score += validMoves.length + capturablePositions.length * 2

    return score
  }

  // Simulate a move and return the new board state
  const simulateMove = (board: Board, move: Move): Board => {
    const newBoard = board.map((row) => [...row])
    const [fromRow, fromCol] = move.from
    const [toRow, toCol] = move.to

    // Move the piece
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol]
    newBoard[fromRow][fromCol] = 0

    // If it's a capture, remove the captured piece
    if (move.isCapture && move.capturedPosition) {
      const [capturedRow, capturedCol] = move.capturedPosition
      newBoard[capturedRow][capturedCol] = 0
    }

    return newBoard
  }

  // Minimax algorithm with alpha-beta pruning
  const minimax = (
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean,
    player: number,
  ): number => {
    // Base case: if we've reached the maximum depth or the game is over
    if (depth === 0) {
      return evaluateBoard(board, player)
    }

    const opponent = player === 1 ? 2 : 1
    const currentPlayer = isMaximizingPlayer ? player : opponent

    const possibleMoves = getAllPossibleMoves(board, currentPlayer)

    // If no moves are available, this is a terminal state
    if (possibleMoves.length === 0) {
      return isMaximizingPlayer ? -1000 : 1000
    }

    if (isMaximizingPlayer) {
      let maxEval = Number.NEGATIVE_INFINITY

      for (const move of possibleMoves) {
        const newBoard = simulateMove(board, move)
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, player)
        maxEval = Math.max(maxEval, evaluation)
        alpha = Math.max(alpha, evaluation)
        if (beta <= alpha) break // Alpha-beta pruning
      }

      return maxEval
    } else {
      let minEval = Number.POSITIVE_INFINITY

      for (const move of possibleMoves) {
        const newBoard = simulateMove(board, move)
        const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, player)
        minEval = Math.min(minEval, evaluation)
        beta = Math.min(beta, evaluation)
        if (beta <= alpha) break // Alpha-beta pruning
      }

      return minEval
    }
  }

  // Find the best move for the AI
  const findBestMove = (board: Board, player: number, difficulty: AutoDifficulty): Move | null => {
    const possibleMoves = getAllPossibleMoves(board, player)

    if (possibleMoves.length === 0) {
      return null
    }

    // For easy difficulty, just return a random move
    if (difficulty === "easy") {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length)
      return possibleMoves[randomIndex]
    }

    // For medium and hard difficulties, use minimax with different depths
    const depth = difficulty === "medium" ? 2 : 4
    let bestMove: Move | null = null
    let bestScore = Number.NEGATIVE_INFINITY

    for (const move of possibleMoves) {
      const newBoard = simulateMove(board, move)
      const moveScore = minimax(newBoard, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, player)

      // Update best move if this one is better
      if (moveScore > bestScore) {
        bestScore = moveScore
        bestMove = move
      }
    }

    // For medium difficulty, occasionally make a random move instead
    if (difficulty === "medium" && Math.random() < 0.3) {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length)
      return possibleMoves[randomIndex]
    }

    return bestMove
  }

  // Make a move on the board
  const makeMove = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    // First select the piece
    setSelectedPiece([fromRow, fromCol])

    // Then simulate a click on the destination
    setTimeout(() => {
      handleCellClick(toRow, toCol)
    }, 300)
  }, [])

  // AI move logic
  const makeAIMove = useCallback(() => {
    if (currentPlayer !== botPlayer || winner || showSettings || isAutoThinking) return

    setIsAutoThinking(true)

    // Add a delay to simulate thinking
    setTimeout(() => {
      const bestMove = findBestMove(board, botPlayer, autoDifficulty)

      if (bestMove) {
        const [fromRow, fromCol] = bestMove.from
        const [toRow, toCol] = bestMove.to

        // Make the move
        makeMove(fromRow, fromCol, toRow, toCol)
      }

      setIsAutoThinking(false)
    }, 1000)
  }, [board, botPlayer, currentPlayer, winner, showSettings, autoDifficulty, isAutoThinking, makeMove])

  // Trigger AI move when it's the bot's turn
  useEffect(() => {
    if (currentPlayer === botPlayer && !winner && !showSettings && !isAutoThinking) {
      makeAIMove()
    }
  }, [currentPlayer, botPlayer, winner, showSettings, isAutoThinking, makeAIMove])

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (winner || showSettings) return

    // If it's the AI's turn, don't allow human clicks
    if (currentPlayer === botPlayer) return

    const newBoard = board.map((row) => [...row])

    // If a piece is already selected
    if (selectedPiece) {
      const [fromRow, fromCol] = selectedPiece

      // Check if the move is valid
      if (isValidMove(newBoard, fromRow, fromCol, row, col, currentPlayer)) {
        // Calculate move time
        const moveTime = (Date.now() - moveStartTime) / 1000

        // Move the piece
        newBoard[row][col] = currentPlayer
        newBoard[fromRow][fromCol] = 0

        // Check if it's a capture move
        const rowDiff = Math.abs(row - fromRow)
        const colDiff = Math.abs(col - fromCol)
        let captured = false

        if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
          const midRow = (fromRow + row) / 2
          const midCol = (fromCol + col) / 2
          const capturedPiece = newBoard[midRow][midCol]
          newBoard[midRow][midCol] = 0
          captured = true

          // Update score
          setScores((prev) => ({
            ...prev,
            [currentPlayer]: prev[currentPlayer] + 1,
          }))

          // Update player stats
          setPlayers((prev) =>
            prev.map((player, index) =>
              player.id === currentPlayer ? updatePlayerStats(player, moveTime, true) : player,
            ),
          )

          playSound("capture")

          toast({
            title: "Piece captured!",
            description: `${players[currentPlayer - 1].name} captured a piece.`,
          })
        } else {
          // Update player stats for regular move
          setPlayers((prev) =>
            prev.map((player, index) =>
              player.id === currentPlayer ? updatePlayerStats(player, moveTime, false) : player,
            ),
          )

          playSound("move")
        }

        // Update the board
        setBoard(newBoard)
        setLastMove([
          [fromRow, fromCol],
          [row, col],
        ])

        // Add to move history
        setMoveHistory((prev) => [
          ...prev,
          `${players[currentPlayer - 1].name} moved from (${fromRow + 1}, ${fromCol + 1}) to (${row + 1}, ${col + 1})${captured ? " and captured a piece" : ""}`,
        ])

        // Check for winner
        if (player1Pieces === 0 || player2Pieces === 0) {
          const gameWinner = player1Pieces === 0 ? 2 : 1
          setWinner(gameWinner)
          setShowGameOver(true)
          setIsTimerRunning(false)
          playSound("win")
        } else {
          // Check if another capture is possible
          if (captured && hasValidJumpMoves(newBoard, row, col, currentPlayer)) {
            setSelectedPiece([row, col]) // Keep the same piece selected
            setCanContinueCapturing(true)
            toast({
              title: "Multiple capture!",
              description: "You can capture another piece with the same piece.",
            })
          } else {
            // End turn
            setSelectedPiece(null)
            setCanContinueCapturing(false)

            // Switch to next player
            const nextPlayer = currentPlayer === 1 ? 2 : 1
            setMoveStartTime(Date.now())

            // Check if next player has valid moves
            if (!hasValidMoves(newBoard, nextPlayer)) {
              setWinner(currentPlayer)
              setShowGameOver(true)
              setIsTimerRunning(false)
              playSound("win")
            } else {
              setCurrentPlayer(nextPlayer)
            }
          }
        }
      } else {
        // Invalid move, deselect the piece
        if (newBoard[row][col] === currentPlayer) {
          // Select a different piece of the same player
          setSelectedPiece([row, col])
        } else {
          // Deselect if clicking elsewhere
          setSelectedPiece(null)
          setCanContinueCapturing(false)
        }
      }
    } else {
      // No piece selected yet, select one if it belongs to current player
      if (newBoard[row][col] === currentPlayer) {
        setSelectedPiece([row, col])
        setIsTimerRunning(true)
      }
    }
  }

  // Restart the game
  const restartGame = () => {
    setBoard(initialBoard)
    setCurrentPlayer(firstPlayer)
    setSelectedPiece(null)
    setWinner(null)
    setScores({ 1: 0, 2: 0 })
    setMoveHistory([])
    setTimer(0)
    setIsTimerRunning(false)
    setShowGameOver(false)
    setCanContinueCapturing(false)
    setLastMove([])
    setPlayerTime({ 1: timeLimit, 2: timeLimit })
    setMoveStartTime(Date.now())
    setIsAutoThinking(false)

    // Reset player scores and stats
    setPlayers(
      players.map((player) => ({
        ...player,
        score: 0,
        stats: {
          movesMade: 0,
          capturesMade: 0,
          averageMoveTime: 0,
          gamesWon: player.stats?.gamesWon || 0,
        },
      })),
    )
  }

  // Handle settings submission
  const handleSettingsSubmit = (
    player1: Player,
    player2: Player,
    firstPlayer: number,
    gameMode: GameMode,
    timeLimit: number,
    difficulty?: AutoDifficulty,
  ) => {
    setPlayers([player1, player2])
    setFirstPlayer(firstPlayer)
    setCurrentPlayer(firstPlayer)
    setGameMode(gameMode)
    setTimeLimit(timeLimit)
    setPlayerTime({ 1: timeLimit, 2: timeLimit })

    // Set AI settings if in auto mode
    if (gameMode === "auto") {
      setBotPlayer(2) // AI plays as player 2
      setAutoDifficulty(difficulty || "medium")

      // Update player 2 name to indicate it's an AI
      setPlayers([
        player1,
        {
          ...player2,
          name: `Auto (${difficulty || "medium"})`,
          isAI: true,
          aiDifficulty: difficulty || "medium",
        },
      ])
    } else {
      setBotPlayer(null)
    }

    setShowSettings(false)
    setMoveStartTime(Date.now())
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Kor-u-Boodo Shax
      </motion.h1>

      {showSettings ? (
        <GameSettings
          players={players}
          firstPlayer={firstPlayer}
          onSubmit={handleSettingsSubmit}
          gameMode={gameMode}
          timeLimit={timeLimit}
        />
      ) : (
        <motion.div
          className="w-full max-w-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <PlayerCard
                player={players[0]}
                isActive={currentPlayer === 1}
                remainingTime={gameMode === "timed" ? playerTime[1] : null}
              />

              <MoveHistory moves={moveHistory} />

              <GameControls
                onRestart={restartGame}
                onSettings={() => setShowSettings(true)}
                timer={timer}
                gameMode={gameMode}
              />

              {gameMode === "auto" && (
                <div className="bg-card rounded-lg p-4 shadow-md">
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    AI Settings
                  </h2>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Difficulty:</span>
                      <span className="font-medium">{autoDifficulty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Player:</span>
                      <span className="font-medium">{players[1].name}</span>
                    </div>
                    {isAutoThinking && (
                      <div className="flex items-center gap-2 text-primary">
                        <span className="animate-pulse">AI is thinking...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Game board */}
            <div className="lg:col-span-1">
              <BoardComponent
                board={board}
                validMoves={validMoves}
                capturablePositions={capturablePositions}
                onCellClick={handleCellClick}
                selectedPiece={selectedPiece}
                lastMove={lastMove}
              />
            </div>

            {/* Right sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <PlayerCard
                player={players[1]}
                isActive={currentPlayer === 2}
                remainingTime={gameMode === "timed" ? playerTime[2] : null}
              />

              <div className="bg-card rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-semibold mb-3">Game Rules</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Move one space horizontally or vertically to an empty space</li>
                  <li>Capture opponent pieces by jumping over them to an empty space</li>
                  <li>Multiple captures in one turn are allowed with the same piece</li>
                  <li>Win by capturing all opponent pieces or blocking all their moves</li>
                </ul>
              </div>

              <div className="bg-card rounded-lg p-4 shadow-md">
                <h2 className="text-xl font-semibold mb-3">Game Stats</h2>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm">Black pieces:</div>
                  <div className="text-sm font-medium">{player1Pieces}</div>
                  <div className="text-sm">White pieces:</div>
                  <div className="text-sm font-medium">{player2Pieces}</div>
                  <div className="text-sm">Captures (Black):</div>
                  <div className="text-sm font-medium">{scores[1]}</div>
                  <div className="text-sm">Captures (White):</div>
                  <div className="text-sm font-medium">{scores[2]}</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {showGameOver && (
        <GameOverModal
          winner={players[winner! - 1]}
          onRestart={restartGame}
          onDismiss={() => {
            setShowGameOver(false)
            restartGame();
          }}
          onSettings={() => {
            setShowGameOver(false)
            setShowSettings(true)
          }}
        />
      )}
    </div>
  )
}

export default Game
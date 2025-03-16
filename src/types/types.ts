import type { Player } from "./player"

export type Board = number[][]
export type Position = [number, number] // [row, col]

export type GameMode = "standard" | "timed" | "auto" | "online"

export type GameState = {
  board: Board
  currentPlayer: number
  selectedPiece: Position | null
  winner: number | null
  scores: { [key: number]: number }
  moveHistory: string[]
  timer: number
  isTimerRunning: boolean
  players: Player[]
  firstPlayer: number
  validMoves: Position[]
  capturablePositions: Position[]
  lastMove: Position[]
  canContinueCapturing: boolean
  gameMode: GameMode
  timeLimit: number
  playerTime: { [key: number]: number }
}

export type GameAction =
  | { type: "SELECT_PIECE"; position: Position }
  | { type: "MOVE_PIECE"; from: Position; to: Position }
  | { type: "CAPTURE_PIECE"; from: Position; to: Position; captured: Position }
  | { type: "SWITCH_PLAYER" }
  | { type: "RESTART_GAME" }
  | { type: "SET_WINNER"; winner: number }
  | { type: "UPDATE_TIMER"; time: number }
  | { type: "SET_GAME_MODE"; mode: GameMode }
  | { type: "UPDATE_SETTINGS"; players: Player[]; firstPlayer: number; timeLimit: number }


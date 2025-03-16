/**
 * Represents a player in the Kor-u-Boodo Shax game
 */
export type Player = {
    /**
     * Unique identifier for the player (1 or 2)
     */
    id: number

    /**
     * Display name of the player
     */
    name: string

    /**
     * The color of the player's pieces
     */
    color: "black" | "white" | string

    /**
     * Number of opponent pieces captured
     */
    score: number

    /**
     * Optional avatar URL for the player
     */
    avatar?: string

    /**
     * Whether the player is AI-controlled
     */
    isAI?: boolean

    /**
     * AI difficulty level if the player is AI-controlled
     */
    aiDifficulty?: "easy" | "medium" | "hard"

    /**
     * Time remaining for the player in timed games (in seconds)
     */
    timeRemaining?: number

    /**
     * Statistics for the current game session
     */
    stats?: {
        /**
         * Number of moves made
         */
        movesMade: number

        /**
         * Number of captures made
         */
        capturesMade: number

        /**
         * Average time per move (in seconds)
         */
        averageMoveTime: number

        /**
         * Number of games won in the current session
         */
        gamesWon: number
    }
}

/**
 * Default player configurations
 */
export const DEFAULT_PLAYERS: [Player, Player] = [
    {
        id: 1,
        name: "Player 1",
        color: "black",
        score: 0,
        stats: {
            movesMade: 0,
            capturesMade: 0,
            averageMoveTime: 0,
            gamesWon: 0,
        },
    },
    {
        id: 2,
        name: "Player 2",
        color: "white",
        score: 0,
        stats: {
            movesMade: 0,
            capturesMade: 0,
            averageMoveTime: 0,
            gamesWon: 0,
        },
    },
]

/**
 * Updates a player's statistics after a move
 */
export function updatePlayerStats(player: Player, moveTime: number, didCapture = false): Player {
    const stats = player.stats || {
        movesMade: 0,
        capturesMade: 0,
        averageMoveTime: 0,
        gamesWon: 0,
    }

    const newMovesMade = stats.movesMade + 1
    const newCapturesMade = didCapture ? stats.capturesMade + 1 : stats.capturesMade

    // Calculate new average move time
    const totalPreviousTime = stats.averageMoveTime * stats.movesMade
    const newAverageMoveTime = (totalPreviousTime + moveTime) / newMovesMade

    return {
        ...player,
        score: didCapture ? player.score + 1 : player.score,
        stats: {
            ...stats,
            movesMade: newMovesMade,
            capturesMade: newCapturesMade,
            averageMoveTime: newAverageMoveTime,
        },
    }
}

/**
 * Updates a player's statistics after winning a game
 */
export function updatePlayerAfterWin(player: Player): Player {
    const stats = player.stats || {
        movesMade: 0,
        capturesMade: 0,
        averageMoveTime: 0,
        gamesWon: 0,
    }

    return {
        ...player,
        stats: {
            ...stats,
            gamesWon: stats.gamesWon + 1,
        },
    }
}


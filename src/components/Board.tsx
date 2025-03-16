"use client";

import type React from "react";
import type { Board, Position } from "@/types/types";
import { motion } from "framer-motion";

interface BoardProps {
  board: Board;
  onCellClick: (row: number, col: number) => void;
  selectedPiece: Position | null;
  validMoves: Position[];
  capturablePositions: Position[];
  lastMove: Position[];
}

const BoardComponent: React.FC<BoardProps> = ({
  board,
  onCellClick,
  selectedPiece,
  validMoves,
  capturablePositions,
  lastMove,
}) => {
  // Helper function to check if a position is in an array of positions
  const isPositionIn = (pos: [number, number], positions: Position[]): boolean => {
    return positions.some(([r, c]) => r === pos[0] && c === pos[1]);
  };

  // Helper function to check if a position is part of the last move
  const isLastMove = (row: number, col: number): boolean => {
    return lastMove.some(([r, c]) => r === row && c === col);
  };

  return (
    <div className="relative mx-auto">
      {/* Board Grid */}
      <div className="grid grid-cols-5 gap-2 w-full max-w-[500px] aspect-square mx-auto rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4  ring-1 ring-gray-200 dark:ring-gray-700">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex;
            const isValidMoveOrigin = isPositionIn([rowIndex, colIndex], validMoves);
            const isCapturableOrigin = isPositionIn([rowIndex, colIndex], capturablePositions);
            const isPartOfLastMove = isLastMove(rowIndex, colIndex);

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative flex items-center justify-center aspect-square rounded-lg cursor-pointer transition-all duration-200
                  ${cell === 0
                    ? "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : cell === 1
                    ? "bg-black hover:bg-gray-900"
                    : "bg-white hover:bg-gray-100"
                  }
                  ${isSelected ? "ring-2 ring-blue-500 dark:ring-blue-400 z-10" : ""}
                  ${isValidMoveOrigin ? "ring-2 ring-yellow-400 dark:ring-yellow-300" : ""}
                  ${isCapturableOrigin ? "ring-2 ring-red-500 dark:ring-red-400" : ""}
                  ${isPartOfLastMove ? "ring-2 ring-green-500 dark:ring-green-400" : ""}
                `}
                onClick={() => onCellClick(rowIndex, colIndex)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={isPartOfLastMove ? { scale: 1.1 } : { scale: 1 }}
                animate={isPartOfLastMove ? { scale: 1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {cell !== 0 && (
                  <motion.div
                    className={`
                      w-3/4 h-3/4 rounded-full flex items-center justify-center
                      ${cell === 1 ? "bg-black border-2 border-gray-700" : "bg-white border-2 border-gray-300"}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div
                      className={`
                        w-1/2 h-1/2 rounded-full 
                        ${cell === 1 ? "bg-gray-700 border border-gray-600" : "bg-gray-300 border border-gray-400"}
                      `}
                    />
                  </motion.div>
                )}

                {/* Coordinate labels */}
                <div className="absolute bottom-1 right-1 text-[8px] md:text-xs opacity-50">
                  {rowIndex + 1},{colIndex + 1}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400 ring-1 ring-yellow-500"></div>
          <span>Valid Move</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 ring-1 ring-red-600"></div>
          <span>Capture Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500 ring-1 ring-blue-600"></div>
          <span>Selected Piece</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 ring-1 ring-green-600"></div>
          <span>Last Move</span>
        </div>
      </div>
    </div>
  );
};

export default BoardComponent;
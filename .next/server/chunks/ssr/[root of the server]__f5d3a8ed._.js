module.exports = {

"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/components/Board.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const BoardComponent = ({ board, onCellClick, selectedPiece })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-5 gap-2 w-96 h-96 mx-auto",
        children: board.map((row, rowIndex)=>row.map((cell, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `flex items-center justify-center w-16 h-16 rounded-lg cursor-pointer ${cell === 1 ? "bg-black" : cell === 2 ? "bg-white" : "bg-gray-300"} ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex ? "border-4 border-blue-500" : ""}`,
                    onClick: ()=>onCellClick(rowIndex, colIndex)
                }, `${rowIndex}-${colIndex}`, false, {
                    fileName: "[project]/src/components/Board.tsx",
                    lineNumber: 14,
                    columnNumber: 11
                }, this)))
    }, void 0, false, {
        fileName: "[project]/src/components/Board.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = BoardComponent;
}}),
"[project]/src/components/Game.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Board$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Board.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
const initialBoard = [
    [
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        1,
        1,
        1,
        1
    ],
    [
        1,
        1,
        0,
        2,
        2
    ],
    [
        2,
        2,
        2,
        2,
        2
    ],
    [
        2,
        2,
        2,
        2,
        2
    ]
];
const Game = ()=>{
    const [board, setBoard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialBoard);
    const [currentPlayer, setCurrentPlayer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [selectedPiece, setSelectedPiece] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isValidMove = (board, fromRow, fromCol, toRow, toCol, player)=>{
        if (board[toRow][toCol] !== 0) return false; // Must move to an empty space
        /* 
  // Allow moving one step in up, down, left, or right directions
  if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
    return true; // Simple horizontal or vertical move
  }

  // Capture move: two steps in up, down, left, or right
  if ((rowDiff === 2 && colDiff === 0) || (rowDiff === 0 && colDiff === 2)) {
    const midRow = (fromRow + toRow) / 2;
    const midCol = (fromCol + toCol) / 2;
    const midPiece = board[midRow][midCol];

    return midPiece !== 0 && midPiece !== player; // Capture opponent's piece
  }
    */ const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        if (rowDiff === 1 && colDiff === 0 || rowDiff === 0 && colDiff === 1) {
            return true; // Simple diagonal move
        }
        if (rowDiff === 2 && colDiff === 0 || rowDiff === 0 && colDiff === 2) {
            const midRow = (fromRow + toRow) / 2;
            const midCol = (fromCol + toCol) / 2;
            const midPiece = board[midRow][midCol];
            return midPiece !== 0 && midPiece !== player; // Capture move
        }
        return false;
    };
    const handleCellClick = (row, col)=>{
        const newBoard = board.map((row)=>[
                ...row
            ]);
        if (selectedPiece) {
            const [fromRow, fromCol] = selectedPiece;
            if (isValidMove(newBoard, fromRow, fromCol, row, col, currentPlayer)) {
                newBoard[row][col] = currentPlayer; // Move piece
                newBoard[fromRow][fromCol] = 0; // Clear old position
                const rowDiff = Math.abs(row - fromRow);
                const colDiff = Math.abs(col - fromCol);
                if (rowDiff === 2 && colDiff === 0 || rowDiff === 0 && colDiff === 2) {
                    const midRow = (fromRow + row) / 2;
                    const midCol = (fromCol + col) / 2;
                    newBoard[midRow][midCol] = 0; // Remove captured piece
                }
                setBoard(newBoard);
                setSelectedPiece(null);
                setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
                const winner = checkWinner(newBoard);
                if (winner) {
                    alert(`Player ${winner} wins!`);
                    setBoard(initialBoard);
                    setCurrentPlayer(1);
                }
            } else {
                setSelectedPiece(null);
            }
        } else {
            if (newBoard[row][col] === currentPlayer) {
                setSelectedPiece([
                    row,
                    col
                ]);
            }
        }
    };
    const checkWinner = (board)=>{
        const player1Pieces = board.flat().filter((cell)=>cell === 1).length;
        const player2Pieces = board.flat().filter((cell)=>cell === 2).length;
        if (player1Pieces === 0) return 2;
        if (player2Pieces === 0) return 1;
        return null;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center min-h-screen bg-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-4",
                children: "Kor-u-Boodo Shax"
            }, void 0, false, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 114,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-lg mb-4",
                children: [
                    "Current Player: ",
                    currentPlayer === 1 ? 'Black' : 'White'
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Board$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                board: board,
                onCellClick: handleCellClick,
                selectedPiece: selectedPiece
            }, void 0, false, {
                fileName: "[project]/src/components/Game.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Game.tsx",
        lineNumber: 113,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = Game;
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__f5d3a8ed._.js.map
import { useCallback, useEffect, useRef, useState } from "react";
import { PROTOTYPE_SPEAKERS, REVEAL_STORAGE_KEY } from "@/lib/speakers";

const COLS = 19;
const ROWS = 11;
const LAYOUT = [
  "###################",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o...............o#",
  "###.#.##.#.##.#.###",
  "#.....#..P..#.....#",
  "###.#.##G#.##.#.###",
  "#o...............o#",
  "#.##.###.#.###.##.#",
  "#........#........#",
  "###################",
];

type Cell = "#" | "." | "o" | " ";
type Dir = { x: number; y: number };

const DIRS: Dir[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function parseMaze() {
  const grid: Cell[][] = [];
  let player = { x: 9, y: 5 };
  let ghost = { x: 9, y: 6 };
  let pellets = 0;
  for (let y = 0; y < ROWS; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < COLS; x++) {
      const ch = LAYOUT[y][x];
      if (ch === "P") {
        player = { x, y };
        row.push(" ");
      } else if (ch === "G") {
        ghost = { x, y };
        row.push(" ");
      } else {
        if (ch === "." || ch === "o") pellets += 1;
        row.push(ch as Cell);
      }
    }
    grid.push(row);
  }
  return { grid, player, ghost, pellets };
}

function persistUnlocks(count: number) {
  if (typeof sessionStorage === "undefined") return;
  const current = Number(sessionStorage.getItem(REVEAL_STORAGE_KEY) ?? "0");
  sessionStorage.setItem(REVEAL_STORAGE_KEY, String(Math.max(current, count)));
}

export function SparkMaze({ onUnlock }: { onUnlock: (count: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(createState());
  const [status, setStatus] = useState("Collect sparks. Reveal speakers.");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [unlocked, setUnlocked] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function createState() {
    const parsed = parseMaze();
    return {
      grid: parsed.grid.map((row) => [...row]),
      player: { ...parsed.player },
      ghost: { ...parsed.ghost },
      dir: { x: 0, y: 0 } as Dir,
      nextDir: { x: 0, y: 0 } as Dir,
      ghostDir: { x: 1, y: 0 } as Dir,
      remaining: parsed.pellets,
      total: parsed.pellets,
      frightened: 0,
      tick: 0,
      mouth: 0,
      over: false,
      won: false,
      score: 0,
      lives: 3,
    };
  }

  const syncUnlocks = useCallback(
    (remaining: number, total: number) => {
      const collected = total - remaining;
      const count = Math.min(
        PROTOTYPE_SPEAKERS.length,
        Math.floor((collected / Math.max(1, total)) * PROTOTYPE_SPEAKERS.length + 0.0001),
      );
      persistUnlocks(count);
      setUnlocked(count);
      onUnlock(count);
    },
    [onUnlock],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      if (time - last < 70) return;
      last = time;
      const s = stateRef.current;
      s.tick += 1;
      s.mouth = (s.mouth + 1) % 10;
      if (!s.over && !s.won) {
        stepPlayer(s);
        if (s.tick % 2 === 0) stepGhost(s);
        if (s.frightened > 0) s.frightened -= 1;
        checkCollision(s);
        syncUnlocks(s.remaining, s.total);
        setScore(s.score);
        setLives(s.lives);
        if (s.remaining === 0) {
          s.won = true;
          persistUnlocks(PROTOTYPE_SPEAKERS.length);
          onUnlock(PROTOTYPE_SPEAKERS.length);
          setUnlocked(PROTOTYPE_SPEAKERS.length);
          setStatus("All sparks collected. Lineup unlocked.");
        } else if (s.over) {
          setStatus("Caught. Press restart to try again.");
        } else {
          setStatus("Arrows or swipe to move.");
        }
      }
      draw(ctx, canvas, s);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [onUnlock, syncUnlocks]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
      };
      const dir = map[event.key];
      if (!dir) return;
      event.preventDefault();
      stateRef.current.nextDir = dir;
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const restart = () => {
    stateRef.current = createState();
    setScore(0);
    setLives(3);
    setStatus("Collect sparks. Reveal speakers.");
  };

  return (
    <div className="maze-shell">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">Play to reveal</p>
          <p className="mt-1 text-sm text-muted-foreground">{status}</p>
        </div>
        <div className="flex items-center gap-5 font-display text-sm font-semibold tabular-nums">
          <span>Score {String(score).padStart(4, "0")}</span>
          <span>Lives {lives}</span>
          <span className="text-primary">{unlocked}/{PROTOTYPE_SPEAKERS.length} unlocked</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={570}
        height={330}
        className="maze-canvas h-auto w-full max-w-[570px] bg-black"
        aria-label="Spark chase maze. Use arrow keys or swipe."
        onTouchStart={(event) => {
          const touch = event.changedTouches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return;
          const touch = event.changedTouches[0];
          const dx = touch.clientX - touchStart.current.x;
          const dy = touch.clientY - touchStart.current.y;
          if (Math.abs(dx) + Math.abs(dy) < 18) return;
          stateRef.current.nextDir =
            Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
          touchStart.current = null;
        }}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {(["Left", "Up", "Down", "Right"] as const).map((label) => (
          <button
            key={label}
            type="button"
            className="h-10 min-w-16 rounded-none border border-border bg-secondary px-3 text-[10px] font-bold uppercase tracking-[0.14em] hover:border-primary"
            onClick={() => {
              const map = {
                Left: { x: -1, y: 0 },
                Right: { x: 1, y: 0 },
                Up: { x: 0, y: -1 },
                Down: { x: 0, y: 1 },
              };
              stateRef.current.nextDir = map[label];
            }}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="h-10 rounded-none border border-primary bg-primary px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-foreground"
          onClick={restart}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

type GameState = {
  grid: Cell[][];
  player: { x: number; y: number };
  ghost: { x: number; y: number };
  dir: Dir;
  nextDir: Dir;
  ghostDir: Dir;
  remaining: number;
  total: number;
  frightened: number;
  tick: number;
  mouth: number;
  over: boolean;
  won: boolean;
  score: number;
  lives: number;
};

function walkable(grid: Cell[][], x: number, y: number) {
  return y >= 0 && y < ROWS && x >= 0 && x < COLS && grid[y][x] !== "#";
}

function stepPlayer(s: GameState) {
  const nx = s.player.x + s.nextDir.x;
  const ny = s.player.y + s.nextDir.y;
  if (walkable(s.grid, nx, ny) && (s.nextDir.x || s.nextDir.y)) s.dir = s.nextDir;
  const px = s.player.x + s.dir.x;
  const py = s.player.y + s.dir.y;
  if (!walkable(s.grid, px, py)) return;
  s.player = { x: px, y: py };
  const cell = s.grid[py][px];
  if (cell === "." || cell === "o") {
    s.grid[py][px] = " ";
    s.remaining -= 1;
    s.score += cell === "o" ? 50 : 10;
    if (cell === "o") s.frightened = 42;
  }
}

function stepGhost(s: GameState) {
  const options = DIRS.filter((dir) => walkable(s.grid, s.ghost.x + dir.x, s.ghost.y + dir.y));
  if (options.length === 0) return;
  const reverse = { x: -s.ghostDir.x, y: -s.ghostDir.y };
  const forward = options.filter((dir) => !(dir.x === reverse.x && dir.y === reverse.y));
  const pool = forward.length ? forward : options;
  pool.sort((a, b) => {
    const aimX = s.frightened ? COLS - 1 - s.player.x : s.player.x;
    const aimY = s.frightened ? ROWS - 1 - s.player.y : s.player.y;
    const da = Math.abs(s.ghost.x + a.x - aimX) + Math.abs(s.ghost.y + a.y - aimY);
    const db = Math.abs(s.ghost.x + b.x - aimX) + Math.abs(s.ghost.y + b.y - aimY);
    return da - db;
  });
  // Mix a little randomness so it feels like a game, not a script.
  const choice = pool[s.tick % 7 === 0 ? Math.min(1, pool.length - 1) : 0];
  s.ghostDir = choice;
  s.ghost = { x: s.ghost.x + choice.x, y: s.ghost.y + choice.y };
}

function checkCollision(s: GameState) {
  if (s.player.x !== s.ghost.x || s.player.y !== s.ghost.y) return;
  if (s.frightened > 0) {
    s.score += 200;
    s.ghost = { x: 9, y: 6 };
    s.frightened = 0;
    return;
  }
  s.lives -= 1;
  s.player = { x: 9, y: 5 };
  s.ghost = { x: 9, y: 6 };
  s.dir = { x: 0, y: 0 };
  s.nextDir = { x: 0, y: 0 };
  if (s.lives <= 0) s.over = true;
}

function draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, s: GameState) {
  const cw = canvas.width / COLS;
  const ch = canvas.height / ROWS;
  ctx.fillStyle = "#050505";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = s.grid[y][x];
      const px = x * cw;
      const py = y * ch;
      if (cell === "#") {
        ctx.fillStyle = "#1b1b1b";
        ctx.fillRect(px + 1, py + 1, cw - 2, ch - 2);
        ctx.strokeStyle = "#e62b1e";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px + 3, py + 3, cw - 6, ch - 6);
      } else if (cell === ".") {
        ctx.fillStyle = "#e62b1e";
        ctx.beginPath();
        ctx.arc(px + cw / 2, py + ch / 2, 2.2, 0, Math.PI * 2);
        ctx.fill();
      } else if (cell === "o") {
        ctx.fillStyle = "#fff4e8";
        ctx.beginPath();
        ctx.arc(px + cw / 2, py + ch / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const gx = s.ghost.x * cw + cw / 2;
  const gy = s.ghost.y * ch + ch / 2;
  ctx.fillStyle = s.frightened ? "#f4f0ff" : "#3d7dff";
  ctx.beginPath();
  ctx.arc(gx, gy - 2, 8, Math.PI, 0);
  ctx.lineTo(gx + 8, gy + 8);
  ctx.lineTo(gx + 4, gy + 5);
  ctx.lineTo(gx, gy + 8);
  ctx.lineTo(gx - 4, gy + 5);
  ctx.lineTo(gx - 8, gy + 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#111";
  ctx.fillRect(gx - 4, gy - 4, 2.5, 2.5);
  ctx.fillRect(gx + 1.5, gy - 4, 2.5, 2.5);

  const px = s.player.x * cw + cw / 2;
  const py = s.player.y * ch + ch / 2;
  const open = s.mouth < 5 ? 0.25 : 0.05;
  let start = open;
  let end = Math.PI * 2 - open;
  if (s.dir.x === -1) {
    start = Math.PI + open;
    end = Math.PI - open;
  } else if (s.dir.y === -1) {
    start = -Math.PI / 2 + open;
    end = -Math.PI / 2 - open;
  } else if (s.dir.y === 1) {
    start = Math.PI / 2 + open;
    end = Math.PI / 2 - open;
  }
  ctx.fillStyle = "#e62b1e";
  ctx.beginPath();
  ctx.moveTo(px, py);
  ctx.arc(px, py, 9, start, end, false);
  ctx.closePath();
  ctx.fill();
}

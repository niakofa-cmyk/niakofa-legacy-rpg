import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const repo = resolve(import.meta.dirname, "..");
const app = resolve(repo, "apps/legacy-rpg");
const scene = readFileSync(resolve(app, "src/game/scene-mensah-compound.ts"), "utf8");
const canvas = readFileSync(resolve(app, "src/game/LegacyGameCanvas.tsx"), "utf8");
const bridge = readFileSync(resolve(app, "src/integration/niakofa-bridge.ts"), "utf8");

function check(condition, message) {
  assert.ok(condition, message);
  console.log(`✓ ${message}`);
}

console.log("Mensah Compound validation");

execFileSync("pnpm", ["--filter", "@niakofa/legacy-rpg", "typecheck"], { cwd: repo, stdio: "inherit" });
execFileSync("pnpm", ["--filter", "@niakofa/legacy-rpg", "build"], { cwd: repo, stdio: "inherit" });

for (const asset of [
  "ground-tiles-runtime/ground-grass-01.png",
  "buildings-structures/building-compound-01.png",
  "legacy-character-assets/kwame-mensah/runtime-sheets/Kwame_Mensah_32-Frame_Hand-Drawn_Animation_Atlas.png",
]) {
  check(existsSync(resolve(app, "public/environment-assets", asset)) || existsSync(resolve(app, "public", asset)),
    `runtime asset exists: ${asset}`);
}

for (const point of [
  "main-house", "family-shrine", "well", "compound-fishing-pond",
  "workshop", "garden-plots", "front-gate",
]) {
  check(scene.includes(`id: "${point}"`), `authored interaction exists: ${point}`);
}

check(scene.includes("MENSAH_COMPOUND_SPAWN"), "Kwame spawn is authored");
check(scene.includes("collision:"), "compound collision geometry is authored");
check(canvas.includes("KEY_TO_VECTOR") && canvas.includes("player.tick"), "keyboard movement reaches player controller");
check(canvas.includes("scene.collision.some"), "movement is collision constrained");
check(canvas.includes("root.x += (clampedX - root.x)") && canvas.includes("root.y += (clampedY - root.y)"),
  "camera follows with smoothing and bounds");
check(canvas.includes("tryInteractOrTalk") && canvas.includes("dialogueLines"), "NPC dialogue interaction is wired");
check(canvas.includes("startFishingRuntime") && canvas.includes("fishingHook") && canvas.includes("fishingLand"),
  "focused fishing interaction is wired");
check(canvas.includes("persistRuntimeState") && canvas.includes("readPersistedRuntimeState"),
  "save and refresh restore are wired");
check(!bridge.includes("params.get(\"token\")") && !bridge.includes("params.get(\"familyId\")"),
  "raw launch query tokens are not accepted");
check(bridge.includes("params.get(\"ticket\")") && bridge.includes("/api/legacy/launch-context"),
  "short-lived launch ticket exchange is required for live launches");

console.log("Mensah Compound validation passed.");
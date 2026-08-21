import "pixi.js/unsafe-eval";
import { createRoot } from "react-dom/client";
import { LegacyGameCanvas } from "./game/LegacyGameCanvas";
import {
  mensahCompoundAssets,
  mensahCompoundBaseUrl,
  mensahCompoundScene,
  MENSAH_COMPOUND_SPAWN,
} from "./game/scene-mensah-compound";
import { KWAME_SHEET_MANIFEST } from "./game/kwame-sheet-manifest";
import { getLegacyLaunchContext } from "./integration/niakofa-bridge";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);

function renderWorld(context: Awaited<ReturnType<typeof getLegacyLaunchContext>>) {
  root.render(
    <main className="legacy-app">
      <LegacyGameCanvas
        scene={mensahCompoundScene}
        environmentAssets={mensahCompoundAssets}
        environmentBaseUrl={mensahCompoundBaseUrl}
        characterManifest={KWAME_SHEET_MANIFEST}
        gameHour={context.gameHour ?? 14}
        initialSpawn={MENSAH_COMPOUND_SPAWN}
      />
      <div className="legacy-badge" aria-label="Niakofa Legacy launch mode">
        <strong>LEGACY</strong>
        <span>{context.mode === "live" ? "Family session" : "Mock Kwame"}</span>
      </div>
    </main>,
  );
}

root.render(<main className="legacy-app"><div className="legacy-launch-status">Opening Legacy…</div></main>);

void getLegacyLaunchContext()
  .then(renderWorld)
  .catch((error: unknown) => {
    root.render(
      <main className="legacy-app">
        <div className="legacy-launch-error" role="alert">
          <strong>Legacy launch unavailable</strong>
          <span>{error instanceof Error ? error.message : "The launch context could not be loaded."}</span>
        </div>
      </main>,
    );
  });
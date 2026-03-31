import { registerHubAndExtras } from "@/scenes/core/extras";
import { sceneHub } from "@/scenes/core/scenes";
import { registerCommitmentScenario } from "@/scenes/scenarios/commitment-decisions";
import { registerComparisonScenario } from "@/scenes/scenarios/comparison-online";
import { registerDatingNormsScenario } from "@/scenes/scenarios/dating-norms";
import { registerDigitalSupportScenario } from "@/scenes/scenarios/digital-support";
import { registerJealousyScenario } from "@/scenes/scenarios/online-jealousy";
import { registerPeerPressureScenario } from "@/scenes/scenarios/peer-pressure";
import { registerSocialMediaScenario } from "@/scenes/scenarios/social-media";

registerHubAndExtras();
registerSocialMediaScenario();
registerJealousyScenario();
registerPeerPressureScenario();
registerComparisonScenario();
registerCommitmentScenario();
registerDatingNormsScenario();
registerDigitalSupportScenario();

const scene1 = sceneHub;

export { scene1 };

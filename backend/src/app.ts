import { sleep } from "./lib/utils.ts";
import { app } from "./services/express/index.ts";
import { generateSwagger } from "./services/open-api/index.ts";
import { startFeed } from "./services/pubnub/index.ts"; 

const PORT = 3000;

generateSwagger(app);
app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
  const stopFeed = startFeed();
  // sleep(2500).then(() => stopFeed());
});

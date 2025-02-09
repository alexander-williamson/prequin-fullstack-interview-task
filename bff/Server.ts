import app from "./App";
import { configuration } from "./Configuration";

app.listen(configuration.PORT);
console.debug(`Listening on port ${configuration.PORT}`);

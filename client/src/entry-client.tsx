import { hydrate } from "preact";
import App from "./App";
import "./index.css";

hydrate(<App />, document.getElementById("root")!);

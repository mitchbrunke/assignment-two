import "./App.css";
import "@radix-ui/themes/styles.css";

import Home from "./Pages/Home";
import Template from "./Pages/Template";
import { Theme } from "@radix-ui/themes";

function App() {
  return (
    <Theme>
      <Template>
        <Home />
      </Template>
    </Theme>
  );
}

export default App;

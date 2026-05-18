import { Toaster } from "sonner";
import { Approutes } from "./routes/Approutes";

const App = () => {
  return (
    <div>
      <Approutes></Approutes>
      <Toaster position="top-right" richColors />
    </div>
  );
};

export default App;

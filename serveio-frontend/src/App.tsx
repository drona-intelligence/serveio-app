import { Toaster } from "sonner";
import { Approutes } from "./routes/Approutes";
import { NotificationProvider } from "./components/NotificationProvider";

const App = () => {
  return (
    <NotificationProvider>
      <div>
        <Approutes></Approutes>
        <Toaster position="top-right" richColors />
      </div>
    </NotificationProvider>
  );
};

export default App;

import Install from "./components/Install";
import Home from "./components/home";

function App() {
  if (window.ethereum) {
    return <Home />;
  } else {
    return <Install />;
  }
}
export default App;

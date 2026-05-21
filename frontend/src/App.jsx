import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Web3Provider } from "./context/Web3Context";
import Header from "./components/Header";
// import Footer from './components/Footer';
import Home from "./pages/Home";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import Dashboard from "./pages/Dashboard";
import AboutPage from "./pages/AboutPage";
import Help from "./pages/Help";
function App() {
  return (
    <Router>
      <Web3Provider>
        <div className="min-h-screen flex flex-col bg-dark-primary text-text-primary">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/campaign/:address" element={<CampaignDetail />} />
              <Route path="/create" element={<CreateCampaign />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<Help />} />
            </Routes>
          </main>
        </div>
      </Web3Provider>
    </Router>
  );
}

export default App;

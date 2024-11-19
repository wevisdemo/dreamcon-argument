import "@wevisdemo/ui/styles/index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Room from "./pages/room";
import Comment from "./pages/comment";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for listing all comments */}
        <Route path="/" element={<Home />} />
        {/* Dynamic route for comment details */}
        <Route path="/rooms/:id" element={<Room />} />
        <Route path="/comments/:id" element={<Comment />} />
      </Routes>
    </Router>
  );
}

export default App;

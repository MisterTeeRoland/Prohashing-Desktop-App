import "./App.css";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Workers from "./Components/Workers/Workers";
import Settings from "./Components/Settings/Settings";
import Wamp from "./Components/Wamp/Wamp";

function App() {
    const pageLayout = {
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
    };

    return (
        <Router>
            <div style={pageLayout}>
                <Nav />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/workers" element={<Workers />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
            <Wamp />
        </Router>
    );
}

export default App;

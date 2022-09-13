import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Workers from "./Components/Workers/Workers";
import Settings from "./Components/Settings/Settings";
import { useEffect, useState } from "react";
// import Wamp from "./Components/Wamp/Wamp";

function App() {
    const pageLayout = {
        display: "flex",
        flexDirection: "row",
    };

    const [settings, setSettings] = useState({});

    useEffect(() => {
        //load settings from local storage
        const settings = localStorage.getItem("settings");
        if (settings) {
            setSettings(JSON.parse(settings));
        }
    }, []);

    const trySaveSettings = (settings) => {
        setSettings(settings);
        localStorage.setItem("settings", JSON.stringify(settings));
    };

    return (
        <Router>
            <div style={pageLayout}>
                <Nav />

                <Routes>
                    <Route path="/" element={<Home settings={settings} />} />
                    <Route
                        path="/workers"
                        element={<Workers settings={settings} />}
                    />
                    <Route
                        path="/settings"
                        element={
                            <Settings
                                settings={settings}
                                onSaveSettings={trySaveSettings}
                            />
                        }
                    />
                </Routes>
            </div>
            {/* <Wamp /> */}
        </Router>
    );
}

export default App;

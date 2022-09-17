import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Workers from "./Components/Workers/Workers";
import Settings from "./Components/Settings/Settings";
import { useEffect, useState } from "react";
import Wamp from "./Components/Wamp/Wamp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const pageLayout = {
        display: "flex",
        flexDirection: "row",
    };

    const [settings, setSettings] = useState({});
    const [balances, setBalances] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [workers, setWorkers] = useState([]);
    const [totalHashrate, setTotalHashrate] = useState(0);

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

    const updateBalances = ({ sortedBalances, totalValue }) => {
        setBalances(sortedBalances);
        setTotalValue(totalValue);
    };

    const updateWorkers = ({ sortedWorkers, totalHashrate }) => {
        setWorkers(sortedWorkers);
        setTotalHashrate(totalHashrate);
    };

    const sendToast = (message, type) => {
        switch (type) {
            case "success":
                toast.success(message);
                break;
            case "error":
                toast.error(message);
                break;
            default:
                toast(message);
                break;
        }
    };

    return (
        <Router>
            <div style={pageLayout}>
                <Nav />

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                settings={settings}
                                balances={balances}
                                totalValue={totalValue}
                            />
                        }
                    />
                    <Route
                        path="/workers"
                        element={
                            <Workers
                                settings={settings}
                                workers={workers}
                                totalHashrate={totalHashrate}
                            />
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <Settings
                                settings={settings}
                                onSaveSettings={trySaveSettings}
                                onSendToast={sendToast}
                            />
                        }
                    />
                </Routes>
            </div>
            {settings?.apiKey && settings?.currency && (
                <Wamp
                    apiKey={settings?.apiKey ?? null}
                    currency={settings?.currency ?? "usd"}
                    onUpdateBalances={updateBalances}
                    onUpdateWorkers={updateWorkers}
                />
            )}

            <ToastContainer autoClose={2000} />
        </Router>
    );
}

export default App;

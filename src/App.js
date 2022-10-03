import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import Workers from "./Components/Workers/Workers";
import Settings from "./Components/Settings/Settings";
import React, { useEffect, useRef, useState } from "react";
import Wamp from "./Components/Wamp/Wamp";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Pool from "./Components/Pool/Pool";
import { getProhashingTokens } from "./helpers/Prohashing";
import { getSupportedVSCurrencies } from "./helpers/CoinGecko";
import LoadingScreen from "./Components/Loaders/LoadingScreen";

const App = React.memo(() => {
    const [settings, setSettings] = useState({});
    const [appLoaded, setAppLoaded] = useState(false);

    const wampSession = useRef(null);
    const allTokens = useRef(null);
    const allCurrencies = useRef([]);
    const settingsLoaded = useRef(null);
    const workers = useRef({});

    //load settings from local storage
    const loadSettings = () => {
        const userSettings = localStorage.getItem("settings");
        if (userSettings) {
            setSettings(JSON.parse(userSettings));
            settingsLoaded.current = true;
        }
    };

    //get tokens from prohashing
    const getTokens = async () => {
        const tokens = await getProhashingTokens();
        allTokens.current = tokens;
    };

    const getAllCurrencies = async () => {
        const currencies = await getSupportedVSCurrencies();
        allCurrencies.current = currencies;
    };

    const tryInit = async () => {
        if (!appLoaded) {
            if (!allTokens.current) {
                await getTokens();
            }
            if (allCurrencies.current.length === 0) {
                await getAllCurrencies();
            }
            if (
                Object.entries(settings).length === 0 &&
                !settingsLoaded.current
            ) {
                loadSettings();
            }
            setAppLoaded(true);
        }
    };

    const setPageInfo = () => {
        const pageIcon = document.querySelector("link[rel=icon]");
        if (pageIcon) {
            pageIcon.href = "/favicon.ico";
        }
    };

    useEffect(() => {
        if (!appLoaded) {
            tryInit();
        }

        setPageInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const trySaveSettings = (settings) => {
        setSettings(settings);
        localStorage.setItem("settings", JSON.stringify(settings));
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
        <>
            {appLoaded === true ? (
                <Router>
                    <div className="pageLayout">
                        <Nav />

                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <Home
                                        settings={settings}
                                        allTokens={allTokens}
                                        wampSession={wampSession}
                                    />
                                }
                            />
                            <Route
                                path="/workers"
                                element={
                                    <Workers
                                        settings={settings}
                                        workers={workers}
                                        wampSession={wampSession}
                                    />
                                }
                            />
                            <Route
                                path="/settings"
                                element={
                                    <Settings
                                        settings={settings}
                                        allCurrencies={allCurrencies}
                                        onSaveSettings={trySaveSettings}
                                        onSendToast={sendToast}
                                        wampSession={wampSession}
                                    />
                                }
                            />
                            <Route
                                path="/pool"
                                element={<Pool wampSession={wampSession} />}
                            />
                        </Routes>
                    </div>
                    {settings?.apiKey && settings?.currency && (
                        <Wamp
                            apiKey={settings?.apiKey ?? null}
                            currency={settings?.currency ?? "usd"}
                            wampSession={wampSession}
                            workers={workers}
                        />
                    )}

                    <ToastContainer autoClose={2000} />
                </Router>
            ) : (
                <LoadingScreen />
            )}
        </>
    );
});

export default App;

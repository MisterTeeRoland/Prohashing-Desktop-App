const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;

const func = async () => {
    try {
        // const response = await window.versions.ping();
        // console.log(response);
        console.log("exposed variables: ", window.george);
    } catch (error) {
        console.log("error: ", error.message);
    }
};

func();

document
    .getElementById("toggle-dark-mode")
    .addEventListener("click", async () => {
        const isDarkMode = await window.darkMode.toggle();
        document.getElementById("theme-source").innerHTML = isDarkMode
            ? "Dark"
            : "Light";
    });

document
    .getElementById("reset-to-system")
    .addEventListener("click", async () => {
        await window.darkMode.system();
        document.getElementById("theme-source").innerHTML = "System";
    });

const http = require("http");
const fs = require("fs");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", (orgVal.main.temp - 273).toFixed(2));
    temperature = temperature.replace("{%tempMin%}", (orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace("{%tempMax%}", (orgVal.main.temp_max - 273).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        let locationVal = req.headers.location;
        if (!locationVal) {
            res.write("Please provide a location in the request headers.");
            res.end();
            return;
        }

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${locationVal}&appid=b4606309b1a08c02839d53a5aa56f236`;
        http.get(url, (response) => {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                const objData = JSON.parse(data);
                const arrData = [objData];
                const RealTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(RealTimeData);
                res.end();
            });
        }).on("error", (err) => {
            console.error("Error: ", err.message);
            res.write("Error: " + err.message);
            res.end();
        });
    } else {
        res.write("ERROR, Page not found !!");
        res.end();
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Server running at http://127.0.0.1:8000/");
});

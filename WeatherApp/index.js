const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", (orgVal.main.temp - 273).toFixed(2));
    temperature = temperature.replace("{%tempMin%}", (orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace("{%tempMax%}", (orgVal.main.temp_max - 273).toFixed(2));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    // console.log(orgVal.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    
    if(req.url == "/"){
        requests(
            `https://api.openweathermap.org/data/2.5/weather?q=Navsari&appid=b4606309b1a08c02839d53a5aa56f236`
        )
         .on('data', (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            // console.log(arrData);
            const RealTimeData = arrData.map(val => replaceVal(homeFile, val))
            .join("");
            res.write(RealTimeData);
         })
         .on('end', (err) => {
            if(err) console.error("Connection Terminated due to error", err);
            res.end();
            console.log("end");
         })
    }else{
        res.end("ERROR, Page not found !!");
    }
});

server.listen(8000, "127.0.0.1");
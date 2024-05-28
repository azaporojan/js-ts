import express from 'express'
import bodyParser from "body-parser";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


const indexHtml = path.resolve(__dirname, '../index.html');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use('/src', express.static(__dirname));
app.use(express.static(path.join(__dirname, '..')));


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
app.get("/activity", (req, res) => {
    console.log("getting activity")
    fetch('https://bored-api.appbrewery.com/random')
        .then(response => response.json())
        .catch(err => console.log(err))
        .then(data => {
            console.log(data)
            res.send(data);
        })
});

app.get("/", (req, res) => {

    res.sendFile(indexHtml);
})

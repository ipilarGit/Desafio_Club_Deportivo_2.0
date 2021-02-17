const url = require("url");
const http = require("http");
const fs = require("fs");

http
    .createServer(function(req, res) {

        const { nombre, precio } = url.parse(req.url, true).query;

        const data = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
        const deportes = data.deportes;
        console.log("deportes:", deportes);

        let deporte = { nombre, precio };

        if (req.url == "/") {
            res.setHeader('content-type', 'text/html')
            fs.readFile('index.html', 'utf8', (err, html) => {
                res.end(html)
            })
        }

        if (req.url == "/deportes") {
            const jsonDeportes = fs.readFileSync("deportes.json", "utf8");
            res.end(jsonDeportes);
        }

        if (req.url.startsWith("/agregar")) {
            deportes.push(deporte);
            fs.writeFileSync("deportes.json", JSON.stringify({ deportes }));
            res.end("deporte agregado");
        }

        if (req.url.startsWith("/editar")) {

            let deportesParaEditar = deportes.map((d) => d.nombre === nombre);
            console.log(deportesParaEditar.indexOf(true));
            deportes[deportesParaEditar.indexOf(true)].precio = precio;

            console.log('deportes editado: ', deportes);

            fs.writeFileSync('deportes.json', JSON.stringify({ deportes }));
            res.end("deporte editado")
        }

        if (req.url.startsWith("/eliminar")) {

            let deporteParaEliminar = deportes.map((d) => d.nombre === nombre);
            console.log(deporteParaEliminar.indexOf(true));
            deportes.splice((deporteParaEliminar.indexOf(true)), 1);

            console.log('deportes:', deportes);

            fs.writeFileSync('deportes.json', JSON.stringify({ deportes }));
            res.end("deporte eliminado")
        }
    }).listen(3000);
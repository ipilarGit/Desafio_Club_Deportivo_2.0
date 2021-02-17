const url = require('url')
const http = require('http')
const fs = require('fs')
http
    .createServer(function(req, res) {

        const { nombre, precio } = url.parse(req.url, true).query;

        const dataJSON = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
        const deportes = dataJSON.deportes;
        console.log("deportes:", deportes);

        if (req.url == '/') {
            res.setHeader('content-type', 'text/html')
            fs.readFile('index.html', 'utf8', (err, data) => {
                res.end(data)
            })
        }

        if ((req.url == '/deportes') && (req.method == "GET")) {

            /*  fs.readFile('data.json', 'utf8', (err, data) => {
                 res.end(data)
             }) */

            res.end(JSON.stringify(dataJSON));
        }

        if ((req.url.startsWith('/agregar')) && (req.method == "POST")) {
            //  const { nombre, precio } = url.parse(req.url, true).query
            /*  fs.readFile('data.json', 'utf8', (err, data) => {
                 let deportes = JSON.parse(data).deportes
                 deportes.push({
                     nombre,
                     precio,
                 })
                 fs.writeFile('data.json', JSON.stringify({ deportes }), (err, data) => {
                     err ? console.log(' oh oh...') : console.log(' OK ')
                     res.end('Deporte agregado con exito')
                 })
             }) */

            let body;
            req.on("data", (payload) => {
                body = JSON.parse(payload);
            });
            req.on("end", () => {

                deporte = {
                    nombre: body.nombre,
                    precio: body.precio,
                };

                deportes.push(deporte);
                fs.writeFileSync("deportes.json", JSON.stringify(dataJSON));
                res.end('Deporte agregado con exito')
            });

        }

        if ((req.url.startsWith('/editar')) && (req.method == "PUT")) {
            // const { nombre, precio } = url.parse(req.url, true).query
            /*  fs.readFile('data.json', 'utf8', (err, data) => {
                 let deportes = JSON.parse(data).deportes
                 deportes = deportes.map((d) => {
                     if (d.nombre == nombre) {
                         d.precio = precio
                         return d
                     }
                     return d
                 })
                 fs.writeFile('data.json', JSON.stringify({ deportes }), (err, data) => {
                     err ? console.log(' oh oh...') : console.log(' OK ')
                     res.end('Deporte editado con exito')
                 })
             }) */

            let body;
            req.on("data", (payload) => {
                body = JSON.parse(payload);
            });
            req.on("end", () => {

                const data = fs.readFileSync("deportes.json", "utf8");
                let deportes = JSON.parse(data).deportes
                deportes = deportes.map((d) => {
                    if (d.nombre == body.nombre) {
                        d.precio = precio
                        return body
                    }
                    return d
                })

                fs.writeFileSync("deportes.json", JSON.stringify(dataJSON));
                res.end("deporte modificado");
            });
        }

        if ((req.url.startsWith('/eliminar')) && (req.method == "DELETE")) {
            const { nombre } = url.parse(req.url, true).query;
            /* 
            fs.readFile('data.json', 'utf8', (err, data) => {
                let deportes = JSON.parse(data).deportes
                deportes = deportes.filter((d) => d.nombre !== nombre)
                fs.writeFile('data.json', JSON.stringify({ deportes }), (err, data) => {
                    err ? console.log(' oh oh...') : console.log(' OK ')
                    res.end('Deporte elimado con exito')
                })
            }) */

            dataJSON.deportes = deportes.filter((d) => d.nombre !== nombre);
            fs.writeFileSync("deportes.json", JSON.stringify(dataJSON));
            res.end("deporte eliminado");

        }
    })
    .listen(3000)

/* module.exports = server; */
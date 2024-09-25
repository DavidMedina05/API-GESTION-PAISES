/*
-------------------------------------------------------------------
  
Autor: David Rafael Medina Roque
  Fecha Creacion: 18.08.2024
  Asunto: Taller 3
------------------------------------------------------------------
*/

const express = require('express');
const fs = require('fs');

// Iniciando express
const app = express();

// Capa middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Definiendo el puerto de comunicación o de escucha
app.listen(5000, () => {
    console.log('Estamos conectados por medio del puerto 5000');
});

// Método GET --> Lee los datos almacenados en un archivo JSON
app.get('/paises', (req, res) => {
    fs.readFile('paises.json', (error, file) => {
        if (error) {
            console.log('No se pudo leer el archivo', error);
            return res.status(500).send('Error al leer el archivo');
        }
        const paises = JSON.parse(file);
        return res.json(paises);
    });
});

// Método POST --> Escribe un nuevo registro dentro del archivo paises.json
app.post('/paises',(req,res) => {
    fs.readFile('paises.json',(err,data) =>{
        if(err){
            console.log('No se pudo leer el archivo', err);
            return;
        }
        const paises = JSON.parse(data);

        //generando un nuevo numero de ID al registro a insertar
        const newPaisId = paises.length + 1;
        req.body.id = newPaisId;
        paises.push(req.body);

        //Agregando al arreglo de datos una nueva pelicula
        const newPais = JSON.stringify(paises,null,2);

        fs.writeFile('paises.json',newPais, (err)=>{
            if(err){
                console.log('Ha ocurrido un error en el momento de realizar la escritura del nuevo registro en el archivo movies.json', err);
            }
            return res.status(200).send("El pais se agregó con éxito");
        });
    });
});


// Método PATCH --> Permite registrar las actualizaciones a los datos almacenados en el archivo paises.json
app.patch('/paises/:id', (req, res) => {
    const mid = req.params.id; // Se captura el id indicado por el usuario
    const { pais, poblacion, longitud } = req.body; // Son los datos del registro seleccionado

    fs.readFile('paises.json', (err, data) => {
        if (err) {
            console.log("Ha ocurrido un error al leer los datos del archivo paises.json", err);
            return res.status(500).send('Error al leer el archivo');
        }

        const paises = JSON.parse(data);

        let paisEncontrado = false;
        paises.forEach(country => {
            if (country.id === Number(mid)) {
                paisEncontrado = true;

                // Modifica el nombre del país si es diferente al actual
                if (pais !== undefined) {
                    country.pais = pais;
                }
                // Modifica la población si es diferente a la actual
                if (poblacion !== undefined) {
                    country.poblacion = poblacion;
                }
                // Modifica la longitud si es diferente a la actual
                if (longitud !== undefined) {
                    country.longitud = longitud;
                }

                // Aplicando la actualización de los datos en el archivo paises.json
                const PaisUpdated = JSON.stringify(paises, null, 2);
                fs.writeFile('paises.json', PaisUpdated, (err) => {
                    if (err) {
                        console.log("Ocurrió un error al momento de la actualización de los datos", err);
                        return res.status(500).send('Error al actualizar los datos');
                    }
                    return res.status(200).json({ message: "Datos actualizados satisfactoriamente" });
                });
            }
        });

        if (!paisEncontrado) {
            return res.status(404).json({ message: "El país con el ID especificado no fue encontrado" });
        }
    });
});

// Método DELETE --> Elimina datos del archivo
app.delete('/paises/:id', (req, res) => {
    const mid = req.params.id;
    fs.readFile('paises.json', (err, data) => {
        if (err) {
            console.log("Ha ocurrido un error al leer los datos del archivo paises.json", err);
            return res.status(500).send('Error al leer el archivo');
        }
        const paises = JSON.parse(data);

        const index = paises.findIndex(pais => pais.id === Number(mid));
        if (index !== -1) {
            paises.splice(index, 1);
            const PaisDelete = JSON.stringify(paises, null, 2);

            fs.writeFile('paises.json', PaisDelete, (err) => {
                if (err) {
                    console.log("Ocurrió un error al momento de la eliminación de los datos", err);
                    return res.status(500).send('Error al eliminar los datos');
                }
                return res.status(200).json({ message: "El país fue eliminado" });
            });
        } else {
            return res.status(404).json({ message: "El país con el ID especificado no fue encontrado" });
        }
    });
});

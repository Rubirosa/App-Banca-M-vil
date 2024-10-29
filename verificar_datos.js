const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.db', (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conexión exitosa a la base de datos SQLite.");
    }
});

// Consultar los datos de la tabla 'clientes'
db.all('SELECT * FROM clientes', (err, rows) => {
    if (err) {
        console.error("Error al obtener los datos de la tabla 'clientes':", err.message);
    } else {
        console.log("Datos en la tabla 'clientes':");
        console.table(rows);
    }
});

// Consultar los datos de la tabla 'transacciones'
db.all('SELECT * FROM transacciones', (err, rows) => {
    if (err) {
        console.error("Error al obtener los datos de la tabla 'transacciones':", err.message);
    } else {
        console.log("Datos en la tabla 'transacciones':");
        console.table(rows);
    }
});

db.close((err) => {
    if (err) {
        console.error("Error al cerrar la conexión con la base de datos:", err.message);
    } else {
        console.log("Conexión con la base de datos SQLite cerrada.");
    }
});

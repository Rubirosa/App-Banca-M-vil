const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./banco.db', (err) => {
    if (err) {
        console.error("Error al conectar con la base de datos:", err.message);
    } else {
        console.log("Conexión exitosa a la base de datos SQLite.");
    }
});

db.serialize(() => {
    // Crear la tabla de clientes
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id TEXT UNIQUE,
            saldo REAL
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla de clientes:", err.message);
        } else {
            console.log("Tabla 'clientes' creada o ya existe.");
        }
    });

    // Crear la tabla de transacciones
    db.run(`
        CREATE TABLE IF NOT EXISTS transacciones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id TEXT,
            tipo TEXT,
            monto REAL,
            fecha TEXT
        )
    `, (err) => {
        if (err) {
            console.error("Error al crear la tabla de transacciones:", err.message);
        } else {
            console.log("Tabla 'transacciones' creada o ya existe.");
        }
    });

    // Insertar datos iniciales en la tabla de clientes
    const clientesIniciales = [
        ['1001', 1000.0],
        ['1002', 1500.0]
    ];
    const insertStmt = db.prepare('INSERT OR IGNORE INTO clientes (cliente_id, saldo) VALUES (?, ?)', (err) => {
        if (err) {
            console.error("Error al preparar la inserción:", err.message);
        }
    });

    clientesIniciales.forEach(cliente => {
        insertStmt.run(cliente, (err) => {
            if (err) {
                console.error("Error al insertar datos iniciales:", err.message);
            } else {
                console.log(`Cliente ${cliente[0]} insertado con saldo ${cliente[1]}`);
            }
        });
    });
    insertStmt.finalize((err) => {
        if (err) {
            console.error("Error al finalizar la inserción:", err.message);
        } else {
            console.log("Datos iniciales insertados en la tabla 'clientes'.");
        }
    });
});

db.close((err) => {
    if (err) {
        console.error("Error al cerrar la conexión con la base de datos:", err.message);
    } else {
        console.log("Conexión con la base de datos SQLite cerrada.");
    }
});

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());

const db = new sqlite3.Database('./banco.db');

// Ruta para consultar el saldo de un cliente
app.get('/api/clientes/:clienteId/saldo', (req, res) => {
    const clienteId = req.params.clienteId;
    db.get('SELECT saldo FROM clientes WHERE cliente_id = ?', [clienteId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Error en la base de datos" });
        }
        row ? res.json({ saldo: row.saldo }) : res.status(404).json({ error: "Cliente no encontrado" });
    });
});

// Ruta para realizar una transferencia entre clientes
app.post('/api/transferencias', (req, res) => {
    const { origen, destino, monto } = req.body;
    if (!origen || !destino || !monto) {
        return res.status(400).json({ error: "Faltan datos" });
    }
    
    db.serialize(() => {
        db.get('SELECT saldo FROM clientes WHERE cliente_id = ?', [origen], (err, origenRow) => {
            db.get('SELECT saldo FROM clientes WHERE cliente_id = ?', [destino], (err, destinoRow) => {
                if (origenRow && destinoRow && origenRow.saldo >= monto) {
                    const fecha = new Date().toISOString();
                    db.run('UPDATE clientes SET saldo = saldo - ? WHERE cliente_id = ?', [monto, origen]);
                    db.run('UPDATE clientes SET saldo = saldo + ? WHERE cliente_id = ?', [monto, destino]);
                    db.run('INSERT INTO transacciones (cliente_id, tipo, monto, fecha) VALUES (?, ?, ?, ?)', [origen, 'Transferencia Enviada', monto, fecha]);
                    db.run('INSERT INTO transacciones (cliente_id, tipo, monto, fecha) VALUES (?, ?, ?, ?)', [destino, 'Transferencia Recibida', monto, fecha]);
                    res.json({ mensaje: "Transferencia realizada con éxito" });
                } else {
                    res.status(400).json({ error: "Fallo en la transferencia" });
                }
            });
        });
    });
});

// Ruta para ver el historial de transacciones de un cliente
app.get('/api/clientes/:clienteId/transacciones', (req, res) => {
    const clienteId = req.params.clienteId;
    db.all('SELECT tipo, monto, fecha FROM transacciones WHERE cliente_id = ?', [clienteId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error en la base de datos" });
        }
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});

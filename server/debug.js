const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write("=== BULLETPROOF DEBUGGER ===\n\n");
    res.write("Node Version: " + process.version + "\n\n");

    let hasDotenv = false;
    try {
        require('dotenv').config();
        res.write("Dotenv loaded successfully.\n");
        res.write("DATABASE_URL is: " + (process.env.DATABASE_URL ? "SET" : "MISSING") + "\n\n");
        hasDotenv = true;
    } catch(e) {
        res.write("ERROR LOADING DOTENV (node_modules is broken!): " + e.message + "\n\n");
    }

    try {
        const { PrismaClient } = require('@prisma/client');
        res.write("PrismaClient required successfully.\n");
        const prisma = new PrismaClient();
        res.write("PrismaClient instantiated successfully.\n");
        
        prisma.$connect().then(() => {
            res.write("\nPrisma connected to the database successfully!\n");
            res.end();
        }).catch(err => {
            res.write("\nPRISMA CONNECTION ERROR:\n");
            res.write(err.toString() + "\n");
            res.end();
        });
    } catch(e) {
        res.write("ERROR LOADING PRISMA (node_modules or engines are broken!): " + e.message + "\n\n");
        res.end();
    }
});

server.listen(process.env.PORT || 3001, () => {
    console.log("Debug server running");
});

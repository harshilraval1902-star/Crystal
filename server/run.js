const fs = require('fs');

// Create or clear the log file
fs.writeFileSync('cpanel_debug.log', '=== CPANEL BOOT LOG ===\nNode Version: ' + process.version + '\n');
fs.appendFileSync('cpanel_debug.log', 'Current Directory: ' + process.cwd() + '\n');

// Intercept crashes
process.on('uncaughtException', (err) => {
    fs.appendFileSync('cpanel_debug.log', '\n[CRASH - UNCAUGHT EXCEPTION]\n' + err.stack + '\n');
});

process.on('unhandledRejection', (err) => {
    fs.appendFileSync('cpanel_debug.log', '\n[CRASH - UNHANDLED PROMISE]\n' + (err ? err.stack : String(err)) + '\n');
});

// Intercept process.exit (like the one in env.ts)
const originalExit = process.exit;
process.exit = function(code) {
    fs.appendFileSync('cpanel_debug.log', '\n[CRASH - PROCESS.EXIT CALLED]\nExit Code: ' + code + '\n');
    // We do not actually exit, so Passenger doesn't throw a 500!
    // Instead we start a dummy server so the page loads and tells the user to check the log!
    const http = require('http');
    http.createServer((req, res) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("App crashed with process.exit(" + code + "). Check cpanel_debug.log in File Manager!");
    }).listen(process.env.PORT || 3001);
};

try {
    fs.appendFileSync('cpanel_debug.log', 'Attempting to load dist/index.js...\n');
    require('./dist/index.js');
    fs.appendFileSync('cpanel_debug.log', 'Successfully loaded dist/index.js without crashing!\n');
} catch (e) {
    fs.appendFileSync('cpanel_debug.log', '\n[CRASH - REQUIRE ERROR]\n' + e.stack + '\n');
    
    // Start dummy server to prevent Passenger 500 error screen
    const http = require('http');
    http.createServer((req, res) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end("App crashed on require. Check cpanel_debug.log in File Manager!");
    }).listen(process.env.PORT || 3001);
}

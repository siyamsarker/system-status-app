const express = require('express');
const si = require('systeminformation');
const path = require('path');
// Remove this line:
// const fetch = require('node-fetch');

const app = express();
const PORT = 6001;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const diskArr = await si.fsSize();
        const osInfo = await si.osInfo();
        const uptime = await si.time();
        const processes = await si.processes();
        const networkStats = await si.networkStats();
        const netIfs = await si.networkInterfaces();

        // Sum all disks
        const totalDisk = diskArr.reduce((acc, d) => acc + d.size, 0);
        const usedDisk = diskArr.reduce((acc, d) => acc + d.used, 0);

        // Get private IPv4 and IPv6 (first non-internal)
        const privateIpv4 = netIfs.find(i => i.internal === false && i.ip4)?.ip4 || 'N/A';
        const privateIpv6 = netIfs.find(i => i.internal === false && i.ip6 && i.ip6 !== '::1')?.ip6 || 'N/A';

        // Get public IPv4 and IPv6
        let publicIpv4 = 'N/A';
        let publicIpv6 = 'N/A';
        try {
            // IPv4
            const ipRes4 = await fetch('https://checkip.amazonaws.com');
            publicIpv4 = (await ipRes4.text()).trim();
        } catch (e) {
            console.error('Failed to fetch public IPv4:', e);
        }
        try {
            // IPv6 (use a service that supports IPv6, fallback to N/A if not available)
            const ipRes6 = await fetch('https://api64.ipify.org');
            let ipv6 = (await ipRes6.text()).trim();
            // Only accept if it looks like a real IPv6 address
            if (ipv6.includes(':') && !ipv6.includes('.')) {
                publicIpv6 = ipv6;
            } else {
                publicIpv6 = 'N/A';
            }
        } catch (e) {
            console.error('Failed to fetch public IPv6:', e);
        }

        res.json({
            cpu: cpu.currentLoad,
            mem: {
                total: mem.total,
                used: mem.used,
                free: mem.free
            },
            disk: {
                total: totalDisk,
                used: usedDisk
            },
            os: {
                platform: osInfo.platform,
                distro: osInfo.distro,
                release: osInfo.release
            },
            uptime: uptime.uptime,
            processes: processes.all,
            network: {
                rx: networkStats[0]?.rx_bytes || 0,
                tx: networkStats[0]?.tx_bytes || 0
            },
            privateIpv4,
            privateIpv6,
            publicIpv4,
            publicIpv6
        });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`System status app running at http://localhost:${PORT}`);
});
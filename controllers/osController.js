const os = require('os');

module.exports.getOsInformation = async (req, res) => {
    try {
        const osInfo = {
            platform: os.platform(),       // 'linux', 'win32', 'darwin' (macOS)
            osType: os.type(),             // 'Linux', 'Windows_NT', 'Darwin'
            osRelease: os.release(),       // Kernel/OS version
            osArch: os.arch(),             // 'x64', 'arm', 'arm64'
            totalMemory: `${(os.totalmem() / (1024 ** 3)).toFixed(2)} GB`, // Total RAM
            freeMemory: `${(os.freemem() / (1024 ** 3)).toFixed(2)} GB`,   // Free RAM
            cpuInfo: os.cpus(),            // Array of CPU cores
            hostname: os.hostname(),      // Machine name
            uptime: `${(os.uptime() / 3600).toFixed(2)} hours`, // System uptime in hours
            networkInterfaces: os.networkInterfaces(), // Network details
            userInfo: os.userInfo(),      // Current user details
        };

        res.status(200).json(osInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
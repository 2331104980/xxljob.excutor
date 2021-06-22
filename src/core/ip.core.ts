/**
 * 获取容器
 */
import * as os from 'os';
import { readFileSync } from 'fs';
const { exec } = require('child_process');

export class IPClass {
    /**
     * 判断是否docker
     * @returns
     */
    public static isDocker(): boolean {
        const platform = os.platform();
        // Assume this module is running in linux containers
        if (platform === 'darwin' || platform === 'win32') return false;
        const file = readFileSync('/proc/self/cgroup', 'utf-8');
        return file.indexOf('/docker') !== -1;
    }
    /**
     * 获取容器IP
     * @returns
     */
    public static async getContainerIp(): Promise<string> {
        let ip = await IPClass.exec('hostname -i'); //.stdout.trim();
        ip = ip.trim();
        console.log(ip);
        return ip;
    }
    /**
     * 获取网卡信息
     * @returns
     */
    public static async getIP4ArrayFromNetworkInterface(): Promise<
        Array<string>
    > {
        const nets = os.networkInterfaces();
        const ipArray = new Array<string>();

        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    ipArray.push(net.address);
                }
            }
        }
        console.log(ipArray);
        return ipArray;
    }
    /**
     * 获取机器IP
     */
    public static async getHostIp(matchRegexStr: string, filterRegexStr: string) {
        if (this.isDocker) {
            // return (await exec("hostname -i")).stdout.trim();
        } else {
        }
    }

    public static async getIp(
        matchRegexStr: string,
        filterRegexStr: string,
    ): Promise<string> {
        let ip = ``;

        if (IPClass.isDocker()) {
            // const exec = promisify(cp.exec);
            ip = await IPClass.getContainerIp();
            return ip;
        }
        //获取服务器IP
        const IpArray = await IPClass.getIP4ArrayFromNetworkInterface();
        for (const ipStr of IpArray) {
            const matchStr = `'${ipStr}'.match(${matchRegexStr})`;
            const filterStr = `'${ipStr}'.match(${filterRegexStr})`;
            console.log(matchStr);
            console.log(filterStr);
            if (filterRegexStr && eval(filterStr)) {
                continue;
            }

            if (!matchRegexStr || eval(matchStr)) {
                ip = ipStr;
                break;
            }
        }
        console.log(ip);
        return ip;
    }

    private static async exec(cmd): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    resolve(null);
                } else {
                    resolve(stdout);
                    console.log(`stdout: ${stdout}`);
                    console.error(`stderr: ${stderr}`);
                }
            });
        });
    }
}
// IPClass.getIP4ArrayFromNetworkInterface();
// IPClass.getIp('', '')

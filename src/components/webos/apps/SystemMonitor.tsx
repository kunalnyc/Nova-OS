import { useState, useEffect } from "react";
import { Activity, Cpu, HardDrive, MemoryStick, Wifi, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProcessInfo {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  status: "running" | "sleeping";
}

export const SystemMonitor = () => {
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [diskUsage, setDiskUsage] = useState(38);
  const [networkSpeed, setNetworkSpeed] = useState(12.4);

  const processes: ProcessInfo[] = [
    { id: 1, name: "NovaFlix", cpu: 15.2, memory: 1024, status: "running" },
    { id: 2, name: "Browser", cpu: 8.5, memory: 512, status: "running" },
    { id: 3, name: "Music Player", cpu: 5.1, memory: 256, status: "running" },
    { id: 4, name: "Code Editor", cpu: 12.3, memory: 768, status: "running" },
    { id: 5, name: "File Manager", cpu: 2.1, memory: 128, status: "running" },
    { id: 6, name: "Terminal", cpu: 1.5, memory: 64, status: "sleeping" },
    { id: 7, name: "Settings", cpu: 0.8, memory: 32, status: "sleeping" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
      setMemoryUsage((prev) => Math.max(30, Math.min(85, prev + (Math.random() - 0.5) * 8)));
      setDiskUsage((prev) => Math.max(20, Math.min(70, prev + (Math.random() - 0.5) * 5)));
      setNetworkSpeed((prev) => Math.max(0, Math.min(50, prev + (Math.random() - 0.5) * 5)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (usage: number) => {
    if (usage < 50) return "text-green-500";
    if (usage < 75) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-slate-900/20 via-background to-slate-800/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Activity className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">System Monitor</h1>
        </div>

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                <span className={getUsageColor(cpuUsage)}>{cpuUsage.toFixed(1)}%</span>
              </div>
              <Progress value={cpuUsage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                4 Cores @ 3.2 GHz
              </p>
            </CardContent>
          </Card>

          {/* Memory */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Memory</CardTitle>
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                <span className={getUsageColor(memoryUsage)}>
                  {memoryUsage.toFixed(1)}%
                </span>
              </div>
              <Progress value={memoryUsage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                5.0 GB / 8.0 GB used
              </p>
            </CardContent>
          </Card>

          {/* Disk */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                <span className={getUsageColor(diskUsage)}>{diskUsage.toFixed(1)}%</span>
              </div>
              <Progress value={diskUsage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                192 GB / 512 GB used
              </p>
            </CardContent>
          </Card>

          {/* Network */}
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Network</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2 text-blue-500">
                {networkSpeed.toFixed(1)} MB/s
              </div>
              <Progress value={(networkSpeed / 50) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Download speed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Processes Table */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Running Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b border-border font-semibold text-sm text-muted-foreground">
                <div className="col-span-5">Process Name</div>
                <div className="col-span-2 text-right">CPU</div>
                <div className="col-span-3 text-right">Memory</div>
                <div className="col-span-2 text-center">Status</div>
              </div>

              {/* Table Rows */}
              {processes.map((process) => (
                <div
                  key={process.id}
                  className="grid grid-cols-12 gap-4 py-3 border-b border-border/50 hover:bg-accent/50 rounded transition-colors"
                >
                  <div className="col-span-5 font-medium">{process.name}</div>
                  <div className={`col-span-2 text-right ${getUsageColor(process.cpu)}`}>
                    {process.cpu.toFixed(1)}%
                  </div>
                  <div className="col-span-3 text-right text-muted-foreground">
                    {process.memory} MB
                  </div>
                  <div className="col-span-2 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        process.status === "running"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {process.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Operating System</p>
                <p className="font-medium">NovaOS 1.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kernel Version</p>
                <p className="font-medium">5.15.0-nova</p>
              </div>
              <div>
                <p className="text-muted-foreground">Processor</p>
                <p className="font-medium">Intel Core i7-12700K</p>
              </div>
              <div>
                <p className="text-muted-foreground">Graphics</p>
                <p className="font-medium">NVIDIA RTX 4070</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uptime</p>
                <p className="font-medium">2 days, 14 hours</p>
              </div>
              <div>
                <p className="text-muted-foreground">Boot Time</p>
                <p className="font-medium">8.2 seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

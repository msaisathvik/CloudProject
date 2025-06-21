import {
    LineChart, Line, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Rectangle
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Clock, CheckCircle, Flame, Car, CloudDrizzle } from 'lucide-react';
import SectionLayout from '@/layouts/SectionLayout';
import { useContext, useEffect, useState } from 'react';
import DetectionDataContext from '@/context/DetectionDataContext';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css';

const Dashboard = () => {
    const { dashboard, state } = useContext(DetectionDataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [anomaliesLeft, setAnomaliesLeft] = useState([]);
    const [anomaliesRight, setAnomaliesRight] = useState([]);

    const ANOMALY_CONFIG = {
        fire: {
            label: 'Fire',
            icon: <Flame className="inline h-4 w-4 mr-1" />,
            color: 'bg-red-500',
            side: 'left'
        },
        accident: {
            label: 'Accident',
            icon: <Car className="inline h-4 w-4 mr-1" />,
            color: 'bg-blue-500',
            side: 'left'
        },
        smoke: {
            label: 'Smoke',
            icon: <CloudDrizzle className="inline h-4 w-4 mr-1" />,
            color: 'bg-gray-500',
            side: 'right'
        },
        pothole: {
            label: 'Pothole',
            icon: <Flame className="inline h-4 w-4 mr-1" />,
            color: 'bg-green-500',
            side: 'right'
        }
    };

    useEffect(() => {
        if (!state.detectionData || state.detectionData.length === 0) {
            setIsLoading(true);
            return;
        }

        setIsLoading(true);

        const stats = state.detectionData.reduce((acc, detection) => {
            const label = detection.label?.toLowerCase();
            if (!acc[label]) acc[label] = { total: 0, correct: 0 };
            acc[label].total++;
            if (detection.confidence > 70) acc[label].correct++;
            return acc;
        }, {});

        const left = [];
        const right = [];

        Object.entries(stats).forEach(([key, { total, correct }]) => {
            const config = ANOMALY_CONFIG[key];
            if (config) {
                const accuracy = Math.round((correct / total) * 100);
                const anomaly = {
                    label: config.label,
                    percent: accuracy,
                    icon: config.icon,
                    color: config.color
                };
                if (config.side === 'left') {
                    left.push(anomaly);
                } else {
                    right.push(anomaly);
                }
            }
        });

        setAnomaliesLeft(left);
        setAnomaliesRight(right);
        setIsLoading(false);
    }, [state.detectionData]);
    //useEffect end here 

    const getDetectionsByMonth = () => {
        const monthlyCounts = Array(12).fill(0).map((_, index) => ({
            name: new Date(0, index).toLocaleString('default', { month: 'short' }),
            value: 0
        }));

        if (!state.detectionData || !Array.isArray(state.detectionData)) {
            return monthlyCounts;
        }

        state.detectionData.forEach(detection => {
            if (detection) {
                const timestamp = detection.timestamp || detection.createdAt;
                if (timestamp) {
                    const date = new Date(timestamp);
                    const month = date.getMonth();
                    if (monthlyCounts[month]) {
                        monthlyCounts[month].value++;
                    }
                }
            }
        });

        return monthlyCounts;
    };

    const chartData = getDetectionsByMonth();

    const Matrics_Cards_Data = [
        { label: 'Active Cameras', value: dashboard?.activeCameras || '0/0', lineChart: false },
        { label: 'Total Accident', value: dashboard?.totalDetections || 0, lineChart: false },
        { label: 'Camera Uptime', value: dashboard?.cameraUptime || '0 hr 0m', lineChart: false },
        { label: 'Detection Accuracy', value: dashboard?.detectionAccuracy || '0%', lineChart: true },
        { label: 'Success Ratio', value: dashboard?.successRatio || '0%', lineChart: true },
        { label: 'Detection Rate', value: dashboard?.detectionRate || '+0%', lineChart: true },
    ];

    return (
        <div className="p-4 md:p-8 space-y-6">
            {isLoading || !state.detectionData ? (
                <div className='flex justify-center items-center h-screen'>
                    <Helix size="45" speed="2.5" color="#1B59F8" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Matrics_Cards_Data.map((card, index) => (
                                <Card key={index}>
                                    <CardContent className="p-4 flex flex-col">
                                        <p className='text-textColor'>{card.label}</p>
                                        <h2 className="text-2xl font-bold mt-5">{card.value}</h2>
                                        {card.lineChart && (
                                            <div className="h-[100px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData}>
                                                        <Line type="monotone" dataKey="value" stroke="#1B59F8" strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card>
                            <CardContent className="p-2">
                                <p className="text-lg font-semibold mb-2">Total Detections</p>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey="value"
                                            fill="#1B59F8"
                                            radius={[20, 20, 0, 0]} // top-left, top-right, bottom-right, bottom-left
                                            barSize={20}
                                            activeBar={<Rectangle stroke="#1B59F8" />}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[anomaliesLeft, anomaliesRight].map((group, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-3">
                                    <h3 className="text-textColor font-semibold text-lg">Detection Anomalies</h3>
                                    {group.map((a, index) => (
                                        <div key={index} className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span>{a.icon} {a.label}</span>
                                                <span>{a.percent}% Correct</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`${a.color} h-3 rounded-full`} style={{ width: `${a.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <h3 className="text-textColor font-semibold text-lg">Recent Alerts</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {['S.No', 'Type', 'Message', 'Severity', 'Camera', 'Status', 'Time'].map((head, idx) => (
                                    <TableHead key={idx} className="text-center text-[#ffffff]">{head}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(state.alertData || []).slice(0, 4).map((alert, index) => {
                                const dateObj = new Date(alert.timestamp || new Date());
                                return (
                                    <TableRow key={alert.id || index}>
                                        <TableCell className="text-center">{index + 1}</TableCell>
                                        <TableCell className="text-center capitalize">{alert.type || 'N/A'}</TableCell>
                                        <TableCell className="text-center text-sm">{alert.message || 'N/A'}</TableCell>
                                        <TableCell className="text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                                                alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                                {alert.severity || 'N/A'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">{alert.camera_id || 'N/A'}</TableCell>
                                        <TableCell className="text-center">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium">
                                                {alert.status === 'sent'
                                                    ? <CheckCircle className="h-3 w-3 mr-1 text-mySecondary" />
                                                    : <Clock className="h-3 w-3 mr-1 text-pending" />}
                                                {alert.status || 'pending'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center">{dateObj.toLocaleTimeString()}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default SectionLayout(Dashboard);


{/* Filters (optional placeholders) 
<div className="md:flex md:flex-row flex-col justify-between flex-wrap gap-4">
    <select className="flex-1 border bg-myWhite px-4 py-3 rounded-md text-sm">
        <option>Timeframe: All-time</option>
    </select>
    <select className="flex-1 border bg-myWhite px-4 py-3 rounded-md text-sm">
        <option>People: All</option>
    </select>
    <select className="flex-1 border bg-myWhite px-4 py-3 rounded-md text-sm">
        <option>Topic: All</option>
    </select>
</div>
*/}
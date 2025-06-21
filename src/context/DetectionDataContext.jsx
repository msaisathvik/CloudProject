import { createContext, useEffect, useReducer, useMemo, useCallback } from "react";
import { FirestoreService } from "../services/firestoreService";

const DetectionDataContext = createContext();

const initialState = {
    detectionData: [],
    alertData: [],
    camerasData: [],
    detection_history: [],
    user_profile: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_DETECTION_DATA":
            return { ...state, detectionData: action.payload };
        case "SET_ALERT_DATA":
            return { ...state, alertData: action.payload };
        case "SET_CAMERAS_DATA":
            return { ...state, camerasData: action.payload };
        case "SET_DETECTION_HISTORY":
            return { ...state, detection_history: action.payload };
        case "SET_USER_PROFILE":
            return { ...state, user_profile: action.payload };
        default:
            return state;
    }
};

export const DetectionDataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchData = useCallback(async () => {
        try {
            console.log('Fetching data from Firestore...');
            // Fetch data from Firestore
            const [detectionsResult, alertsResult, camerasResult, detectionHistoryResult] = await Promise.all([
                FirestoreService.getDetections(100), // Get last 100 detections
                FirestoreService.getAlerts(),
                FirestoreService.getCameras(),
                FirestoreService.getDocuments('detection_history')
            ]);

            console.log('Firestore fetch results:', {
                detections: detectionsResult,
                alerts: alertsResult,
                cameras: camerasResult,
                detectionHistory: detectionHistoryResult
            });

            // Handle detections
            if (!detectionsResult.error) {
                dispatch({ type: "SET_DETECTION_DATA", payload: detectionsResult.data || [] });
            }

            // Handle alerts (with detection references)
            if (!alertsResult.error) {
                const alertsWithDetection = alertsResult.data || [];
                // Note: In Firestore, you might need to fetch detection data separately
                // or use subcollections for better performance
                dispatch({ type: "SET_ALERT_DATA", payload: alertsWithDetection });
            }

            // Handle cameras
            if (!camerasResult.error) {
                dispatch({ type: "SET_CAMERAS_DATA", payload: camerasResult.data || [] });
            }

            // Handle detection history
            if (!detectionHistoryResult.error) {
                dispatch({ type: "SET_DETECTION_HISTORY", payload: detectionHistoryResult.data || [] });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const dashboard = useMemo(() => {
        const { detectionData, alertData, camerasData } = state;

        const totalCameras = camerasData.length;
        const activeCameras = camerasData.filter(cam => cam.status === "active").length;

        const totalDetections = detectionData.length;
        const accurateDetections = detectionData.filter(d => d.confidence > 70).length;
        const detectionAccuracy = totalDetections ? Math.round((accurateDetections / totalDetections) * 100) : 0;

        const successfulAlerts = alertData.filter(a => a.status === "sent").length;
        const successRatio = alertData.length ? Math.round((successfulAlerts / alertData.length) * 100) : 0;

        const accidentCases = detectionData.filter(d => d.label && d.label.toLowerCase() === "accident").length;

        // Handle both timestamp and createdAt fields
        const timestamps = detectionData
            .map(d => {
                const timestamp = d.timestamp || d.createdAt;
                return timestamp ? new Date(timestamp) : null;
            })
            .filter(date => date !== null)
            .sort((a, b) => a - b);
            
        const cameraUptimeSeconds =
            timestamps.length >= 2
                ? Math.floor((timestamps[timestamps.length - 1] - timestamps[0]) / 1000)
                : 0;
        const cameraUptime = `${Math.floor(cameraUptimeSeconds / 3600)} hr ${Math.floor((cameraUptimeSeconds % 3600) / 60)}m`;

        const detectionRate = `+${Math.round((detectionAccuracy + successRatio) / 2)}%`;

        const pendingAcknowledgments = alertData.filter(a => !a.acknowledged_at).length;

        return {
            activeCameras: `${activeCameras}/${totalCameras}`,
            totalAccidentCases: accidentCases,
            cameraUptime,
            successRatio: `${successRatio}%`,
            detectionAccuracy: `${detectionAccuracy}%`,
            detectionRate,
            totalDetections,
            pendingAcknowledgments,
        };
    }, [state]);

    return (
        <DetectionDataContext.Provider value={{ state, dispatch, dashboard }}>
            {children}
        </DetectionDataContext.Provider>
    );
};

export default DetectionDataContext;

import { createContext, useEffect, useReducer, useMemo, useCallback } from "react";
import { Supabase } from "../../Supabase";

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
        const [
            { data: detections },
            { data: alertsWithDetection },
            { data: cameras },
            { data: detectionHistory },
        ] = await Promise.all([
            Supabase.from("detections").select("*"),
            Supabase.from("alerts").select(`
      *,
      detections: detection_id (
        id,
        location,
        camera_id,
        label,
        confidence,
        timestamp,
        frame_url
      )
    `).order("sent_at", { ascending: false }),
            Supabase.from("cameras").select("*"),
            Supabase.from("detection_history").select("*"),
        ]);

        dispatch({ type: "SET_DETECTION_DATA", payload: detections || [] });
        dispatch({ type: "SET_ALERT_DATA", payload: alertsWithDetection || [] });
        dispatch({ type: "SET_CAMERAS_DATA", payload: cameras || [] });
        dispatch({ type: "SET_DETECTION_HISTORY", payload: detectionHistory || [] });
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

        const successfulAlerts = alertData.filter(a => a.status === "sent").length; // retrieving successful alerts from detection_history table
        const successRatio = alertData.length ? Math.round((successfulAlerts / alertData.length) * 100) : 0;

        const accidentCases = detectionData.filter(d => d.label.toLowerCase() === "accident").length;

        const timestamps = detectionData.map(d => new Date(d.timestamp)).sort((a, b) => a - b);
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

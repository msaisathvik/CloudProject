import React, { useContext, useState } from 'react';
import SectionLayout from '../layouts/SectionLayout';
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DetectionDataContext from '@/context/DetectionDataContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Supabase } from '../../Supabase';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css'

const Alerts = () => {
    const { state, dispatch } = useContext(DetectionDataContext);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentAlert, setCurrentAlert] = useState({
        detect_id: null,
        date: '',
        location: '',
        camera_id: '',
        anomly: '',
        frame_url: '',
    });

    const [alertToDelete, setAlertToDelete] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'sent':
                return 'bg-mySecondary text-white';
            case 'pending':
                return 'bg-pending text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    // Alert edit button handler
    const handleEditBtn = (detect_id, date, location, camera_id, anomly, frame_url, id) => {
        setCurrentAlert({
            detect_id,
            date,
            location,
            camera_id,
            anomly,
            frame_url,
            id,
        });
        setEditDialogOpen(true);
    };

    // delete button handler
    const handleDeleteBtn = (id) => {
        setAlertToDelete(id);
        setDeleteDialogOpen(true);
    };
    // edit alert status button update handler
    const handleStatusUpdate = async (status) => {
        try {
            setIsLoading(true);
            const { data, error } = await Supabase
                .from('detection_history')
                .insert([{
                    detect_id: currentAlert.detect_id,
                    date: currentAlert.date,
                    location: currentAlert.location,
                    camera_id: currentAlert.camera_id,
                    anomly: currentAlert.anomly,
                    status,
                }])
                .select();
            setIsLoading(false);

            // after insertion in detection_history remove the entry from alerts table
            if (error) throw error;

            updateAlertDataAfterEdit(currentAlert.id);
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Failed to update status:", error);
            setIsLoading(false);
        }
    };

    // update the alert status in the database and update the context state
    const updateAlertDataAfterEdit = async (id) => {
        setIsLoading(true);
        const { error } = await Supabase
            .from('alerts')
            .delete()
            .eq('id', id);
        if (error) throw error;

        // Update the alert data in the context state
        dispatch({
            type: "SET_ALERT_DATA",
            payload: state.alertData.filter(alert => alert.id !== id)
        });
        // Update the detection history in the context state
        dispatch({
            type: "SET_DETECTION_HISTORY",
            payload: state.detection_history.map(hist =>
                hist.id === currentAlert.detect_id ? { ...hist, status: currentAlert.status } : hist
            )
        });
        setIsLoading(false);

    }

    // delete alert confirmation handler
    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            const { error } = await Supabase
                .from('alerts')
                .delete()
                .eq('id', alertToDelete);

            if (error) throw error;

            dispatch({
                type: "SET_ALERT_DATA",
                payload: state.alertData.filter(alert => alert.id !== alertToDelete)
            });

            setDeleteDialogOpen(false);
            setAlertToDelete(null);
            setIsLoading(false);
        } catch (error) {
            console.error('Error deleting alert:', error);
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the alert.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-error hover:bg-error/90 hover:cursor-pointer"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Alert edit window */}
            <AlertDialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <AlertDialogContent className="max-w-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Alert Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            Review the detection and update its status
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {currentAlert?.frame_url && (
                        <div className="my-4">
                            <img
                                src={currentAlert.frame_url}
                                alt="Detection frame"
                                className="w-full h-auto rounded-lg border border-gray-200"
                            />
                        </div>

                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <Button
                            variant="outline"
                            className="bg-green-300 hover:bg-green-400 text-green-800 hover:cursor-pointer"
                            onClick={() => handleStatusUpdate('Resolved')}
                        >
                            Resolved
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-yellow-300 hover:bg-yellow-400 text-yellow-800 hover:cursor-pointer"
                            onClick={() => handleStatusUpdate('Pending')}
                        >
                            Pending
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-red-300 hover:bg-red-400 text-red-800 hover:cursor-pointer"
                            onClick={() => handleStatusUpdate('Rejected')}
                        >
                            Rejected
                        </Button>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer">Close</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            <div className="overflow-x-auto bg-white rounded-lg shadow">
                {isLoading || state.alertData.length === 0 ? (
                    <div className='flex justify-center items-center h-screen'>
                        <Helix
                            size="45"
                            speed="2.5"
                            color='#1B59F8'
                        />
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center text-[#ffffff]">S.No</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Location</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Label</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Confidence</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Authority Email</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Email Status</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Email Sent At</TableHead>
                                <TableHead className="text-center text-[#ffffff]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.alertData.map((alert, index) => (
                                <TableRow key={alert.id} className="hover:bg-[#1B59F8]/20 data-[state=selected]:bg-muted border-b transition-colors">
                                    <TableCell className="text-center">{index + 1}</TableCell>
                                    <TableCell className="text-center">{alert.detections?.location || 'N/A'}</TableCell>
                                    <TableCell className="text-center">{alert.detections?.label || 'N/A'}</TableCell>
                                    <TableCell className="text-center">
                                        {alert.detections?.confidence ? `${alert.detections.confidence.toFixed(2)}%` : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center">{alert.authority_email || 'N/A'}</TableCell>
                                    <TableCell className="text-center">
                                        <span className={`inline-flex justify-center items-center min-w-[80px] text-center px-4 py-1 rounded-md text-sm font-semibold ${getStatusColor(alert.status)}`}>
                                            {alert.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {alert.sent_at ?
                                            `${new Date(alert.sent_at).toLocaleDateString()} ${new Date(alert.sent_at).toLocaleTimeString()}` :
                                            'N/A'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <button className="text-myPrimary hover:text-blue-900 mr-2">
                                            <RiEdit2Line
                                                className="h-6 w-6 hover:cursor-pointer"
                                                onClick={() => handleEditBtn(
                                                    alert?.detection_id,
                                                    alert?.sent_at,
                                                    alert?.detections?.location,
                                                    alert?.detections?.camera_id,
                                                    alert?.detections?.label,
                                                    alert?.detections?.frame_url,
                                                    alert?.id,
                                                )}
                                            />
                                        </button>
                                        <button className="text-error hover:text-red-900">
                                            <RiDeleteBin6Line
                                                className="h-6 w-6 hover:cursor-pointer"
                                                onClick={() => handleDeleteBtn(alert.id)}
                                            />
                                        </button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

            </div>
        </div>
    );
};

export default SectionLayout(Alerts);
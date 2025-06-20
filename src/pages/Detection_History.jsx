import React, { useContext, useState } from 'react';
import SectionLayout from '../layouts/SectionLayout';
import CameraIcon from '../assets/icons/camera_icon.svg';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog"
import { Supabase } from '../../Supabase';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CheckCircle, Clock } from 'lucide-react';
import DetectionDataContext from '@/context/DetectionDataContext';
import { Helix } from 'ldrs/react';
import 'ldrs/react/Helix.css'


const Detection_History = () => {

    const { state, dispatch } = useContext(DetectionDataContext);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState({
        dialog: false,
        id: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // handle delete detection history
    const handleDelete = (id) => {
        setDeleteDialogOpen({ dialog: true, id: id });


    }
    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            const { error } = await Supabase
                .from('detection_history')
                .delete()
                .eq('detect_id', deleteDialogOpen.id);

            if (error) throw error;

            // Fix here 👇
            dispatch({
                type: "SET_DETECTION_HISTORY",
                payload: state.detection_history.filter(item => item.detect_id !== deleteDialogOpen.id)
            });

            setDeleteDialogOpen({ dialog: false, id: '' });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }



    // console.log(state.detection_history);
    return (
        <div className="p-6">
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={deleteDialogOpen.dialog}
                    onOpenChange={(val) => setDeleteDialogOpen(prev => ({ ...prev, dialog: val }))}
                >
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

                {/* table shown */}
                {
                    isLoading || state.detection_history.length === 0 ? (
                        <div className='flex justify-center items-center h-screen'>
                            <Helix
                                size="45"
                                speed="2.5"
                                color='#1B59F8'
                            />
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="text-center text-[#ffffff]">S.No</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">ID</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">Date</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">Label</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">Location</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">Camera</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">Status</TableHead>
                                        <TableHead className="text-center text-[#ffffff]">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        state?.detection_history.sort((a, b) => new Date(b.date) - new Date(a.date)).map((item, index) => (
                                            <TableRow key={item.detect_id} className="hover:bg-[#1B59F8]/20 data-[state=selected]:bg-muted border-b transition-colors">
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="text-center">{item?.detect_id}</TableCell>
                                                <TableCell className="text-center">{item?.date}</TableCell>
                                                <TableCell className="text-center">{item?.anomly}</TableCell>
                                                <TableCell className="text-center">{item?.location}</TableCell>
                                                <TableCell className="text-center">{item?.camera_id}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
                                                        {
                                                            item.status === 'Resolved' ? (
                                                                <CheckCircle className="h-3 w-3 mr-1 text-mySecondary" />
                                                            ) : item.status === 'Pending' ? (
                                                                <Clock className="h-3 w-3 mr-1 text-pending" />
                                                            ) : (
                                                                <Clock className="h-3 w-3 mr-1 text-error" />
                                                            )}
                                                        {item.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <button
                                                        onClick={() => handleDelete(item.detect_id)}
                                                        className="text-blue-600 hover:text-blue-900 hover:cursor-pointer *:focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full p-1">
                                                        <img src={CameraIcon} alt="Camera" className="h-6 w-6" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>

                        </>
                    )
                }


            </div>
        </div>
    );
};
export default SectionLayout(Detection_History);
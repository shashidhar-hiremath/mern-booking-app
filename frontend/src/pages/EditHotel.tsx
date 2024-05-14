import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
const EditHotel = () => {
    const { hotelId } = useParams();
    const { showToast } = useAppContext();
    const { data: hotel } = useQuery('fetchHotelById', () => apiClient.fetchMyHotelById(hotelId || ''), {
        enabled: !!hotelId,
        onError: () => {
            showToast({ message: 'Error occured while fecthing hotel data', type: 'ERROR'});
        }
    });
    const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
        onSuccess: () => {
            showToast({ message: 'Hotel details are updated.', type: 'SUCCESS'});
        }, 
        onError: () => {
            showToast({ message: 'Error occured while updating hotel data', type: 'ERROR'});
        }
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    return (<ManageHotelForm hotel={hotel} isLoading={isLoading} onSave={handleSave}/> );
}

export default EditHotel;
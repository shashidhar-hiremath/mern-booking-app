import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../context/AppContext";
import * as apiClient from "../api-client";
const AddHotel = () => {
    const { showToast } = useAppContext();
    const  {mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({ message: 'Hotel Saved...!!!', type: 'SUCCESS'});
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: 'ERROR'});
        }
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    const data: any = {};
    
    return (
        <ManageHotelForm onSave={handleSave} isLoading={isLoading} hotel={data}/>
    )
}

export default AddHotel;

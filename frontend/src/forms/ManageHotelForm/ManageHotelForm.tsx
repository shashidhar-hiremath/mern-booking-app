import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from './GuestsSection';
import ImagesSection from './ImagesSection';

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    pricePerNight: number;
    starRating: number;
    imageUrls: string;
    imageFiles: FileList;
}

type Props = {
    onSave: (hotelFormData: FormData) => void;
    isLoading: boolean;
};

const ManageHotelForm = ({ onSave, isLoading}: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit } = formMethods;
    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        const formData = new FormData();
        formData.append('name', formDataJson.name);
        formData.append('city', formDataJson.city);
        formData.append('country', formDataJson.country);
        formData.append('description', formDataJson.description);
        formData.append('type', formDataJson.type);
        formData.append('adultCount', formDataJson.adultCount.toString());
        formData.append('childCount', formDataJson.childCount.toString());
        formData.append('pricePerNight', formDataJson.pricePerNight.toString());
        formData.append('starRating', formDataJson.starRating.toString());
        formDataJson.facilities.forEach((facility, i) => {
            formData.append(`facilities[${i}]`, facility);
        });
        Array.from(formDataJson.imageFiles).forEach((imageFile) => {
            formData.append(`imageFiles`, imageFile);
        });
        console.log(formData);
        onSave(formData);
    });


    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection></DetailsSection>
                <TypeSection></TypeSection>
                <FacilitiesSection></FacilitiesSection>
                <GuestsSection></GuestsSection>
                <ImagesSection></ImagesSection>
                <div className="flex justify-end">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500">
                            { isLoading ? 'Saving...!!!' : 'Save' }
                    </button>
                </div>

            </form>
        </FormProvider>
    );
};

export default ManageHotelForm;
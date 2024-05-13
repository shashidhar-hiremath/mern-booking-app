import { useQuery } from "react-query";
import { Link } from "react-router-dom"
import * as apiClient from "../api-client";
import { useAppContext } from "../context/AppContext";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";
const MyHotels = () => {
    const { showToast} = useAppContext();
    const { data: hotelData } = useQuery("fetchMyHotels", apiClient.fetchMyHotel, {
        onError: () => {
            showToast({ message: '', type: 'ERROR'});
        }
    });

    if (!hotelData) {
        return <span> No hotels found.</span>
    }
    return (
        <div className="space-y-5">
            <span className="flex justify-between">
                <h1 className="text-3xl font-bold">My Hotels</h1>
                <Link to="/add-hotel"
                    className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500">
                        Add Hotel
                </Link>
            </span>
            <div className="grid grid-col-1 gap-8">
                {
                    hotelData.map((hotel) => {
                        return (
                            <div className="flex flex-col justify-butween border border-slate-300 rounded-lg p-8 gap-5" key={hotel._id}>
                                <h2 className="text-2xl font-bold">{hotel.name}</h2>
                                <div className="whitespace-pre-line">{hotel.description}</div>
                                <div className="grid grid-cols-5 gap-5">
                                    <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                        <BsMap className="mr-1" />
                                        <span className="whitespace-nowrap text-ellipsis overflow-hidden">{ hotel.city}, {hotel.country}</span> 
                                    </div>
                                    <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                        <BsBuilding className="mr-1" />
                                        <span className="whitespace-nowrap text-ellipsis overflow-hidden">{ hotel.type}</span> 
                                    </div>
                                    <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                        <BiMoney className="mr-1" />
                                        <span className="whitespace-nowrap text-ellipsis overflow-hidden">${ hotel.pricePerNight} per night</span> 
                                    </div>
                                    <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                        <BiHotel className="mr-1" />
                                        <span className="whitespace-nowrap text-ellipsis overflow-hidden">{ hotel.adultCount} adult, {hotel.childCount} children</span> 
                                    </div>
                                    <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                                        <BiStar className="mr-1" />
                                        <span className="whitespace-nowrap text-ellipsis overflow-hidden">{ hotel.starRating} Star rating</span> 
                                    </div>
                                </div>
                                <span className="flex justify-end ">
                                    <Link to={`/edit-hotel/${hotel._id}`} className="flex bg-blue-600 text-white text-xl font-bold p-2 hover:bg-blue-500x">View Details</Link> 
                                </span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default MyHotels;
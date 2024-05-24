import { FormEvent, useState } from "react";
import { useSearchContext } from "../context/SearchContext"
import { MdTravelExplore } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
const SearchBar = () => {
    const search = useSearchContext();
    const [destination, setDestination] = useState<string>(search.destination);
    const [checkin, setCheckin] = useState<Date>(search.checkin);
    const [checkout, setCheckout] = useState<Date>(search.checkout);
    const [adultCount, setAdultCount] = useState<number>(search.adultCount);
    const [childCount, setChildCount] = useState<number>(search.childCount);
    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(
            destination,
            checkin,
            checkout,
            adultCount,
            childCount,
        );
        navigate('/search');
    };
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    return (
        <form onSubmit={handleSubmit} className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4">
            <div className="flex flex-row items-center flex-1 bg-white p-2">
                <MdTravelExplore size={25} className="mr-2"/>
                <input type="text" placeholder="Where are you going"
                    className="text-md w-full focus:outline-none" value={destination}
                    onChange={ (event) =>  {setDestination(event.target.value)}}
                />
            </div>
            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults
                    <input type="number" className="w-full p-1 focus:outline-none font-bold" min={1} max={20}
                        onChange={(event) => setAdultCount(parseInt(event.target.value))} />
                </label>
                <label className="items-center flex">
                    Children
                    <input type="number" className="w-full p-1 focus:outline-none font-bold" min={0} max={20}
                        onChange={(event) => setChildCount(parseInt(event.target.value))} />
                </label>
            </div>
            <div>
                <DatePicker selected={checkin} onChange={(date) => { setCheckin(date as Date)}}
                    selectsStart
                    startDate={checkin}
                    endDate={checkout}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-in Date"
                    className="min-w-full bg-white p-2 focus:outline-none"
                    wrapperClassName="min-w-full"
                    />
            </div>
            <div>
                <DatePicker selected={checkin} onChange={(date) => { setCheckout(date as Date)}}
                    selectsStart
                    startDate={checkin}
                    endDate={checkout}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-out Date"
                    className="min-w-full bg-white p-2 focus:outline-none"
                    wrapperClassName="min-w-full"

                    />
            </div>
            <div className="flex gap-1">
                <button className="w-2/3 bg-blue-600 h-full p-2 text-white font-bold text-xl hover:bg-blue-500">
                    Search
                </button>
                <button className="w-1/3 bg-red-600 h-full p-2 text-white font-bold text-xl hover:bg-red-500">
                    Clear
                </button>
            </div>
        </form>
    )
}

export default SearchBar;
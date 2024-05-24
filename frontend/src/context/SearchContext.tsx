import { createContext, useContext, useState } from "react";

type SearchContext = {
    destination: string;
    checkin: Date;
    checkout: Date;
    adultCount: number;
    childCount: number;
    hotelId: string;
    saveSearchValues: (
        destination: string,
        checkin: Date,
        checkout: Date,
        adultCount: number,
        childCount: number,
        hotelId?: string
    ) => void;
}

const SearchContext = createContext<SearchContext | undefined>(undefined);

export const SearchContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [destination, setDestination] = useState<string>("");
    const [checkin, setCheckin] = useState<Date>(new Date());
    const [checkout, setCheckout] = useState<Date>(new Date());
    const [adultCount, setAdultCount] = useState<number>(1);
    const [childCount, setChildCount] = useState<number>(0);
    const [hotelId, setHotelId] = useState<string>("");

    const saveSearchValues = (
        destination: string,
        checkin: Date,
        checkout: Date,
        adultCount: number,
        childCount: number,
        hotelId?: string
    ) => {
        setDestination(destination);
        setCheckin(checkin);
        setCheckout(checkout);
        setAdultCount(adultCount);
        setChildCount(childCount);
        if (hotelId) {
            setHotelId(hotelId);
        }
    }

    return (
        <SearchContext.Provider value={{
            destination,
            checkin,
            checkout,
            adultCount,
            childCount,
            hotelId,
            saveSearchValues
        }}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearchContext = () => {
    const searchContext = useContext(SearchContext);
    return searchContext as SearchContext;
}
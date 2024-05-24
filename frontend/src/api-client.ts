import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType } from "../../backend/src/shared/types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const responseBody = await response.json();

    if (!response.ok) {
        throw new Error(responseBody.message);
    }

}

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(formData),
        headers: {
            "Content-Type": "application/json"
        },
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.message);
    }

    return body;
}

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validation-token`, {
        credentials: "include"
    })

    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
}

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Error during signout.")
    }
}

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: 'POST',
        credentials: 'include',
        // headers: {
        //     "Content-Type": "application/json"
        // },  
        body: hotelFormData
    });

    if (!response.ok) {
        throw new Error("Failed to add hotel.");
    }

    // const responseBody = await response.json();

    return response.json();
}

export const fetchMyHotel = async (): Promise<HotelType[]> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Error fetching hotel.");
    }

    return response.json();
}

export const fetchMyHotelById = async (id: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${id}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error("Error fetching hotel details.");
    }

    return response.json();
}


export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`, {
        method: 'put',
        credentials: 'include',
        body: hotelFormData
    });

    if (!response.ok) {
        throw new Error("Failed to update hotel.");
    }

    return response.json();
}

export type SearchParams = {
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    adultCount?: string;
    childCount?: string;
    page?: string;
    facilities?: string[];
    types?: string[];
    stars?: string[];
    maxPrice?: string;
    sortOption?: string;
}

export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams();
    queryParams.append('destination', searchParams.destination || '');
    queryParams.append('checkIn', searchParams.checkIn || '');
    queryParams.append('checkOut', searchParams.checkOut || '');
    queryParams.append('adultCount', searchParams.adultCount || '');
    queryParams.append('childCount', searchParams.childCount || '');
    queryParams.append('page', searchParams.page || '');

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(`${API_BASE_URL}/api/hotels/search?${queryParams}`, {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error('Error while fetching hotels');
    }

    return response.json();
}



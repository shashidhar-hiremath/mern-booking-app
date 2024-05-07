import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
const SignOutButton = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {showToast } = useAppContext();
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            showToast({ message: "user loged out successfully.", type: "SUCCESS"});
            navigate("/sign-in");
        }, 
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR"});
        }
    })
    const signout = () => {
        mutation.mutate();
    };
    return (
        <button onClick={signout} className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100">
            Sign Out
        </button>
    )
}

export default SignOutButton;
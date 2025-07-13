import useAuthStore from "@/store/useAuth";
import { toast } from 'react-toastify';
import axios from "axios";

const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const { userId } = useAuthStore.getState();
const adminId = userId;

export const getLegalContentByDocumentType = async (documentType: string) => {
    try {
        const endPoint = process.env.NEXT_PUBLIC_GET_LEGAL_CONTENT_BY_TYPE?.replace(':documentType', documentType);
        const response = await axios.get(`${apiBaseUrl}${endPoint}?adminId=${adminId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error("Error fetching legal content:", error);
        toast.error("Failed to fetch legal content.");
    }
}

export const upsertLegalContent = async ({
    documentType,
    title,
    description,
}: {
    documentType: string;
    title: string;
    description: string;
}) => {
    try {
        const endPoint = process.env.NEXT_PUBLIC_UPSERT_LEGAL_CONTENT;
        
        const response = await axios.post(`${apiBaseUrl}${endPoint}?adminId=${adminId}`, {
            documentType,
            title,
            description,
        });

        if (response.status === 200) {
            toast.success("Legal content saved!");
            return response.data;
        }
    } catch (error) {
        console.error("Error saving legal content:", error);
        toast.error("Failed to save content.");
    }
}

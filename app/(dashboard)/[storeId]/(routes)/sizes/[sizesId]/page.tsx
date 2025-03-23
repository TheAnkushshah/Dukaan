import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({ params }: { params: { sizesId: string, storeId: string } }) => {
    const { sizesId, storeId } = params;

    if (!sizesId) {
        // Handle the case where sizesId is not provided
        return <div>Error: Size ID is required</div>;
    }

    const size = await prismadb.size.findUnique({ 
        where: {
            id: sizesId
        }
    });

    if (!size) {
        // If no size is found, render the form to add a new size
        return (
            <div className="flex-col">
                <div className="flex-1 p-8 pt-6 space-y-4">
                    <SizeForm initialData={null} storeId={storeId} sizesId={sizesId} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SizeForm initialData={size} storeId={storeId} sizesId={sizesId} />
            </div>
        </div>
    );
}

export default SizePage;
import { UserButton } from "@clerk/nextjs";
import { MainNav } from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import primsadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";

const Navbar = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const stores = await primsadb.store.findMany({
        where: {
            userId,
        },
    });

    return (
        <div className='border-b'>
            <div className='flex items-center h-16 px-4'>
                <StoreSwitcher items={stores} />
                <MainNav className='mx-6' />
                <div className='flex items-center ml-auto space-x-4'>
                    <ThemeToggle />
                    <UserButton afterSignOutUrl='/' />
                </div>
            </div>
        </div>
    )
}

export default Navbar
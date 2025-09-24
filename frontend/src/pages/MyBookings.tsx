import { cancelBooking, fetchMyBookings } from "@/api/bookingApi";
import { UserContext } from "@/context/UserContext";
import type { Booking } from "@/types/booking";
import { useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as signalR from "@microsoft/signalr";
import MyBookingCard from "@/components/MyBooking/MyBookingCard";
import "./MyBookings.css";

const MyBookings: React.FC = () => {
    const {token} = useContext(UserContext);
    
    //State for bookings and loading
    const [myBookings, setMyBookings] = useState<Booking[]>([]);
    const [sortedBookings, setSortedBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    //SignalR URL
    const hubUrl = useMemo(() => `${import.meta.env.VITE_API_BASE_URL}/bookingHub`, []);

    useEffect(() => 
    {
        if (!token) return;

        //Gets resources and bookings at the same time
        Promise.all([fetchMyBookings(token)])
        .then(([myBookings]) => 
        {
            setMyBookings(myBookings);
        })
        .catch(() => 
        {
            toast.error("Kunde inte hämta resurser eller bokningar");
        })
        .finally(() => setLoading(false));


        //Creating signalR connection
        const connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, 
        {
            accessTokenFactory: () => token || "",
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
        })
        .withAutomaticReconnect()
        .build();

        //Starting connection
        const start = async () => 
        {
            try 
            {
                await connection.start();
                console.log("SignalR connected");
            } 
            catch (err) 
            {
                console.error("SignalR start error:", err);
            }
        };
        start();

        //Function to get resources and bookings when a change is made
        const refreshData = async () => 
        {
            const [newMyBookings] = await Promise.all([
                fetchMyBookings(token),
            ]);
            setMyBookings(newMyBookings);
        };

        //Listening on signalR events (Changes in bookings)
        connection.on("BookingCreated", refreshData);
        connection.on("BookingCancelled", refreshData);
        connection.on("BookingDeleted", refreshData);
        connection.on("BookingUpdated", refreshData);

        //Stopping connection
        return () => 
        {
            connection.stop();
        };
    }, [token, hubUrl]);

    useEffect(() => 
    {
        var bookings = myBookings;
        var sorted = bookings;

        for (var i = 0; i < sorted.length; i++) 
        {
            for (var j = 0; j < (sorted.length - i - 1); j++) 
            {
                if (Date.parse(sorted[j].bookingDate) > Date.parse(sorted[j + 1].bookingDate)) 
                {
                    var temp = sorted[j]
                    sorted[j] = sorted[j + 1]
                    sorted[j + 1] = temp
                }
            }
        }

        setSortedBookings(sorted);
    }, [myBookings])

    const handleCancel = async (bookingId: number) => 
    {
        if (!token) return;
        try 
        {
            await cancelBooking(token, bookingId);
            toast.success("Bokning avbokad!");

            //Updating data after cancel has happened
            const [newMyBookings] = 
            await Promise.all([
                fetchMyBookings(token)
            ]);
            setMyBookings(newMyBookings);
        } 
        catch (err: any) 
        {
            console.error(err);
            toast.error(err?.message ?? "Kunde inte avboka");
        }
    };

    if (loading) return <p className="text-gray-600">Loading bookings...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">My bookings</h1>
            <br />
    
            <div className="grid gap-6"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", justifyContent: "center", maxWidth: "1200px", margin: "0 auto",}}>
                {sortedBookings.map((b) => 
                (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <MyBookingCard booking={b} onCancel={handleCancel}/>
                    </div>
                ))}
            </div>
            {myBookings.length == 0 ? <p className="text-center">You have no active bookings.</p> : null}
        </div>
    );
};

export default MyBookings;
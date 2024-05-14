import React from 'react';
interface HomeProps {
    host?: string;
    channel?: string;
}

export default function EventsPage({ host, channel }: HomeProps) {

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Upcoming Events</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <img src="https://source.unsplash.com/random" alt="Event" className="w-full h-48 object-cover rounded mb-4" />
                        <h2 className="text-xl font-bold mb-2">Event Title</h2>
                        <p className="text-gray-700 mb-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
                        <button className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Join Event</button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <img src="https://source.unsplash.com/random" alt="Event" className="w-full h-48 object-cover rounded mb-4" />
                        <h2 className="text-xl font-bold mb-2">Event Title</h2>
                        <p className="text-gray-700 mb-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
                        <button className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Join Event</button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <img src="https://source.unsplash.com/random" alt="Event" className="w-full h-48 object-cover rounded mb-4" />
                        <h2 className="text-xl font-bold mb-2">Event Title</h2>
                        <p className="text-gray-700 mb-4">Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
                        <button className="block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Join Event</button>
                    </div>
                </div>
            </div>
        </div>
    );
};



import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock submission
        setSubmitted(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Contact Us</h1>
                <p className="mt-4 text-xl text-slate-500">
                    We'd love to hear from you. Get in touch with our team.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Get in Touch</h2>
                    <div className="space-y-4 text-slate-600">
                        <p>
                            Have a question about our pricing, features, or need a custom solution? Fill out the form, and our team will get back to you shortly.
                        </p>
                        <div className="pt-4">
                            <p className="font-semibold text-slate-800">Address:</p>
                            <p>123 Tech Park, Sector 5<br/>Gujarat, India 382010</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">Email:</p>
                            <p>support@ontru.com</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">Phone:</p>
                            <p>+91 98765 43210</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md border border-slate-200">
                    {submitted ? (
                        <div className="text-center py-12">
                            <h3 className="text-2xl font-bold text-green-600">Thank You!</h3>
                            <p className="text-slate-600 mt-2">Your message has been received. We will contact you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                                <input type="text" id="name" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                                <input type="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                                <textarea id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"></textarea>
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

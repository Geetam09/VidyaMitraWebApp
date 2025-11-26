
import React, { use, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';

const TestPapersList = () => {

    const token = localStorage.getItem("token");
    const [testPapers, setTestPapers] = useState([]);
    const [selectedClass, setSelectedClass] = useState({});
    const [classes, setClasses] = useState([]);
    const [showDelete, setShowDelete] = useState(true);

    const formatClassName = (cls) => {
        return `${cls.grade} ${cls.section}`;
    };
    useEffect(() => {
        getTestPapers();
    }, []);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            const classesData = await apiService.getAllClasses(token);
            setClasses(classesData);
            // if (classesData.length > 0 && !selectedClass) {
            //   setSelectedClass(classesData[0].id);
            // }
        } catch (error) {
            console.error('Error fetching classes:', error);
            alert('Failed to load classes');
        }
    };

    const getTestPapers = async () => {
        const response = await apiService.getTestPapers(token)
        setTestPapers(response);
        console.log(response)
        // Logic to fetch test papers from backend API
    };

    const sendPaperToClass = async (paperId, classId) => {
        try {
            const response = await apiService.sendTestPaperToClass(paperId, classId, token);
            alert('Test paper sent successfully!');
            if (response.ok) {
                setShowDelete(false);
            }
        }
        catch (error) {
            console.error('Error sending test paper:', error);
            alert('Failed to send test paper');
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">Test Papers</h2>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select Class</th>

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {/* Sample Row */}
                                {
                                    testPapers.map((paper) => (
                                        <tr key={paper.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper?.subject}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.startTime}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.endTime}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <select
                                                    key={paper.id}
                                                    value={selectedClass[paper.id] || ""}
                                                    onChange={(e) =>
                                                        setSelectedClass(prev => ({
                                                            ...prev,
                                                            [paper.id]: e.target.value
                                                        }))
                                                    }
                                                    className="px-2 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                >
                                                    <option value="">Select Class</option>
                                                    {classes.map(cls => (
                                                        <option key={cls.id} value={cls.id}>
                                                            {formatClassName(cls)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>


                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {
                                                    selectedClass[paper.id] ? (
                                                        <button
                                                            className="text-green-600 hover:text-green-900 mr-4"
                                                            onClick={() => sendPaperToClass(paper.id, selectedClass[paper.id])}
                                                        >Send </button>
                                                    ) : null
                                                }
                                                {/* <button className="text-indigo-600 hover:text-indigo-900 mr-4">View</button> */}

                                                {/* {
                                                    showDelete ? (
                                                        <button 
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    ) : null
                                                } */}

                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {/* More rows can be added here */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPapersList;
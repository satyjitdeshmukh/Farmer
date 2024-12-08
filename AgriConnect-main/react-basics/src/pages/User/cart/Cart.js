import React, { useState } from 'react';
import axios from 'axios';
import Groq from 'groq-sdk';

const FarmerDataSubmission = () => {
    const [formStage, setFormStage] = useState(1);
    const [farmerData, setFarmerData] = useState({
        farmerName: '',
        farmLocation: '',
        contactNumber: '',
        cropType: '',
        landDetails: {
            totalArea: 0,
            cultivationArea: 0,
            soilType: '',
            previousCrops: []
        },
        farmingExperience: '',
        cultivationGoals: ''
    });

    const [aiGuidance, setAiGuidance] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFarmerData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleLandDetailsChange = (e) => {
        const { name, value } = e.target;
        setFarmerData(prevState => ({
            ...prevState,
            landDetails: {
                ...prevState.landDetails,
                [name]: value
            }
        }));
    };

    const generateComprehensiveFarmingGuidance = async () => {
        setIsLoading(true);
        setAiGuidance('');

        try {
            const groq = new Groq({
                apiKey: "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",
                dangerouslyAllowBrowser: true
            });

            const prompt = `Provide a comprehensive farming strategy for a farmer with the following profile:
            - Crop Type: ${farmerData.cropType}
            - Total Land Area: ${farmerData.landDetails.totalArea} acres
            - Cultivation Area: ${farmerData.landDetails.cultivationArea} acres
            - Soil Type: ${farmerData.landDetails.soilType}
            - Farming Experience: ${farmerData.farmingExperience}
            - Cultivation Goals: ${farmerData.cultivationGoals}
            - Previous Crops: ${farmerData.landDetails.previousCrops.join(', ')}

            Detailed guidance should include:
            1. Crop selection and suitability analysis
            2. Soil preparation and land management
            3. Optimal planting techniques
            4. Irrigation and water management strategies
            5. Fertilization and nutrient management
            6. Pest and disease control methods
            7. Estimated yield projections
            8. Economic feasibility and potential challenges
            9. Recommended modern farming technologies
            10. Sustainable farming practices

            Provide practical, actionable, and region-specific advice.`;

            const result = await groq.chat.completions.create({
                messages: [{
                    role: "user",
                    content: prompt
                }],
                model: "mixtral-8x7b-32768",
                temperature: 0.7,
                max_tokens: 3072,
                top_p: 1,
                stream: false,
            });

            const guidance = result.choices[0]?.message?.content;
            setAiGuidance(guidance || "Unable to generate comprehensive farming guidance.");
        } catch (error) {
            console.error("Error generating AI guidance:", error);
            setAiGuidance("An error occurred while generating farming guidance.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderFormStage = () => {
        switch(formStage) {
            case 1:
                return (
                    <div className="farmer-personal-details">
                        <h3>Farmer Personal Details</h3>
                        <input
                            type="text"
                            name="farmerName"
                            placeholder="Full Name"
                            value={farmerData.farmerName}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="farmLocation"
                            placeholder="Farm Location"
                            value={farmerData.farmLocation}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="tel"
                            name="contactNumber"
                            placeholder="Contact Number"
                            value={farmerData.contactNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <button onClick={() => setFormStage(2)}>Next</button>
                    </div>
                );
            
            case 2:
                return (
                    <div className="land-details">
                        <h3>Land and Crop Details</h3>
                        <select
                            name="cropType"
                            value={farmerData.cropType}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Crop Type</option>
                            <option value="rice">Rice</option>
                            <option value="wheat">Wheat</option>
                            <option value="corn">Corn</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="sugarcane">Sugarcane</option>
                        </select>
                        <input
                            type="number"
                            name="totalArea"
                            placeholder="Total Land Area (acres)"
                            value={farmerData.landDetails.totalArea}
                            onChange={handleLandDetailsChange}
                            required
                        />
                        <input
                            type="number"
                            name="cultivationArea"
                            placeholder="Cultivation Area (acres)"
                            value={farmerData.landDetails.cultivationArea}
                            onChange={handleLandDetailsChange}
                            required
                        />
                        <select
                            name="soilType"
                            value={farmerData.landDetails.soilType}
                            onChange={handleLandDetailsChange}
                            required
                        >
                            <option value="">Select Soil Type</option>
                            <option value="clay">Clay</option>
                            <option value="sandy">Sandy</option>
                            <option value="loam">Loam</option>
                            <option value="silt">Silt</option>
                        </select>
                        <button onClick={() => setFormStage(3)}>Next</button>
                    </div>
                );
            
            case 3:
                return (
                    <div className="farming-experience">
                        <h3>Farming Experience and Goals</h3>
                        <select
                            name="farmingExperience"
                            value={farmerData.farmingExperience}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Farming Experience</option>
                            <option value="beginner">0-2 years</option>
                            <option value="intermediate">3-5 years</option>
                            <option value="experienced">6-10 years</option>
                            <option value="expert">10+ years</option>
                        </select>
                        <textarea
                            name="cultivationGoals"
                            placeholder="Describe your cultivation goals and challenges"
                            value={farmerData.cultivationGoals}
                            onChange={handleInputChange}
                            required
                        />
                        <button onClick={() => {
                            generateComprehensiveFarmingGuidance();
                            setFormStage(4);
                        }}>
                            Get Farming Guidance
                        </button>
                    </div>

                );
            
            case 4:
                return (
                    <div className="ai-guidance">
                        {isLoading ? (
                            <div>Generating personalized farming guidance...</div>
                        ) : (
                            <div>
                                <h3>Comprehensive Farming Strategy</h3>
                                <pre style={{
                                    whiteSpace: 'pre-wrap', 
                                    fontFamily: 'Arial, sans-serif',
                                    lineHeight: '1.6'
                                }}>
                                    {aiGuidance}
                                </pre>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="farmer-data-submission">
            <h2>Personalized Farmer Crop Planning</h2>
            {renderFormStage()}
        </div>
    );
};

export default FarmerDataSubmission;
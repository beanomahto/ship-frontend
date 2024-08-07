import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useChannelIntegration from '../../../hooks/useChannelIntegration';
import { message } from 'antd';
import shopifyInt from '../../../utils/shopifyInt.png.jpg';

const Shopify = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [storeInputs, setStoreInputs] = useState({
        storeName: '',
        salesChannel: '',
        apiKey: '',
        apiSecret: '',
        token: ''
    });
    const { channelIntegration } = useChannelIntegration();

    useEffect(() => {
        const getChannelInfo = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`https://backend-9u5u.onrender.com/api/integration/getApi/${slug}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                const result = await res.json();
                setData(result);
                setStoreInputs({
                    storeName: result.storeName || '',
                    salesChannel: result.salesChannel || '',
                    apiKey: result.apiKey || '',
                    apiSecret: result.apiSecret || '',
                    token: result.token || ''
                });
            } catch (error) {
                console.error(error);
            }
        };
        getChannelInfo();
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data) {
            await updateChannelInfo();
        } else {
            await channelIntegration(storeInputs);
            message.success("Integrated Successfully");
        }
    };

    const updateChannelInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`https://backend-9u5u.onrender.com/api/integration/updateApi/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
                body: JSON.stringify(storeInputs),
            });

            if (res.ok) {
                message.success("Updated Successfully");
            } else {
                const errorData = await res.json();
                const errorMessage = errorData?.message || "Failed to Update";
                message.error(errorMessage);
            }
        } catch (error) {
            console.error("Error updating channel info:", error);
            message.error("An error occurred");
        }
    };

    return (
        <div style={{ marginTop: '-2.5rem' }}>
            <div className="image-container">
                <img src={shopifyInt} alt="Shopify Integration" style={{}} className="background-image" />
                <div className='inte' style={{ zIndex: '9', marginTop: '-7rem' }}>
                    <form className="form" onSubmit={handleSubmit}>
                        <p className="title">Integrate Shopify</p>
                        <div className="flex">
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={storeInputs.storeName}
                                    onChange={(e) => setStoreInputs({ ...storeInputs, storeName: e.target.value })}
                                />
                                <span>Store Name</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={slug}
                                    onChange={(e) => setStoreInputs({ ...storeInputs, salesChannel: e.target.value })}
                                />
                                <span>Sales Channel</span>
                            </label>
                        </div>
                        <div className="flex">
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={storeInputs.apiKey}
                                    onChange={(e) => setStoreInputs({ ...storeInputs, apiKey: e.target.value })}
                                />
                                <span>API Key</span>
                            </label>
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={storeInputs.apiSecret}
                                    onChange={(e) => setStoreInputs({ ...storeInputs, apiSecret: e.target.value })}
                                />
                                <span>API Secret</span>
                            </label>
                        </div>
                        <div className="flex">
                            <label>
                                <input
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={storeInputs.token}
                                    onChange={(e) => setStoreInputs({ ...storeInputs, token: e.target.value })}
                                />
                                <span>Token</span>
                            </label>
                        </div>
                        <button className="submit">{data ? 'Update' : 'Integrate'} Channel</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Shopify;

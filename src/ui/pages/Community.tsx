import React from 'react';
import AdminLayout from '../components/AdminLayout/AdminLayout';
import Card from 'antd/es/card/Card';
import { List } from 'antd';

export const Community: React.FC = () => {
    return (
        <AdminLayout>
            <Card>
        <div className="community-page">
            <h1>Community</h1>
            <p>Welcome to the Community page</p>
        </div>
        </Card>
        </AdminLayout>
    );
};

export default Community;
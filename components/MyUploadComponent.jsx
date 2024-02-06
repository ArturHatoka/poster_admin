import React from 'react';
import { Label, Box, BasePropertyComponent } from 'adminjs';

const MyUploadComponent = (props) => {
    const { property, record, onChange } = props;

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        // Обработайте файл здесь или отправьте на сервер
    };

    return (
        <Box>
            <Label>{property.label}</Label>
            <input type="file" onChange={handleFileChange} />
        </Box>
    );
};

export default MyUploadComponent;
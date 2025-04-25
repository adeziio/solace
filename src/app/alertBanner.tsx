import React from 'react';
import { Alert } from '@mui/material';

interface AlertObject {
    msg: String;
    type: "error" | "success" | ""
};

interface PageHeader {
    alert: AlertObject;
};

const AlertBanner: React.FC<PageHeader> = ({ alert }) => {
    return (
        <>
            {alert.type === "success" ?
                <Alert
                    severity="success"
                    sx={{
                        textAlign: "center", // Centers text horizontally
                        display: "flex",     // Ensures the container layout supports alignment
                        alignItems: "center", // Centers text vertically
                        justifyContent: "center", // Centers content horizontally
                    }}
                >
                    {alert.msg}
                </Alert> : alert.type === "error" ?
                    <Alert
                        severity="error"
                        sx={{
                            textAlign: "center", // Centers text horizontally
                            display: "flex",     // Ensures the container layout supports alignment
                            alignItems: "center", // Centers text vertically
                            justifyContent: "center", // Centers content horizontally
                        }}
                    >
                        {alert.msg}
                    </Alert> : null
            }
        </>
    )
}

export default AlertBanner;
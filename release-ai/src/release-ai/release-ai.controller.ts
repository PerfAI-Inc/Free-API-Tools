import { Controller, Post, Body, Res } from '@nestjs/common';
import axios from 'axios';


@Controller('api/v1/release-ai')
export class ReleaseAiController {
    private readonly token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdhOFItNlFVUlpwbHJ3OFM4M1lVRiJ9.eyJuaWNrbmFtZSI6InlvYmVpZDIwMDIiLCJuYW1lIjoieW9iZWlkMjAwMkBnbWFpbC5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNTk1OGExZTMyMWYyNmI3YTA1OWJlYzk3MDJkMmRiYWQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ5by5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMi0xNVQwNDo1NDozOS41NTRaIiwiZW1haWwiOiJ5b2JlaWQyMDAyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi15MzQ1MGI0MmN3eTh2eWwxLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJPeGlwb0pTOEVJZHBOM0t6aFZRMjgwemtLeHd6R0xmSSIsImlhdCI6MTcwNzk3Mjk4NSwiZXhwIjoxNzExNTcyOTg1LCJzdWIiOiJhdXRoMHw2NTFmMDYxMzQxOTkzYmQ4ODgwMGZiZGUiLCJzaWQiOiJpU2R0Zm55RHlOUks2Sm1oOTAyS05rR25wMWxmZVFqQyIsIm5vbmNlIjoiUmpGdlJVZGxiMjkxUTBoWlEzWmlaMWR2VW0xWlpqTlNlRXh0T0VKdVdVTXpaME5SWmpOS1VDNVplQT09In0.blwRUR-t7TcdtaWVMgreTwZdhcyswVBm-6zM81dD11LQS-IxiMquk13J-KbTQ0kzU7J6oNGnMmViYbBNKcAnqV7368RlTwPCS_DIdBTKB_79TEa1lirwKAzc0F3S-oQkChHRg9kQ0b6A9PAD_T7KZK3Ug-5Xb2HGHquFSmjNtOjnlAaBaQuvcm8eN2PwkOl1rJbXLPlFJbQNlnd-P_FvyB9aR8Ej172Rkgw6xxMVPv1QtzWPktnM_r1hxjDDC1zjEB-NxnUQ40zaN0pNwGTqTSAac2psR2x4BPafHT_I04C_VZqiUF0Hmr2PzozU0D0EPgG1s3y9UNaE_sVABd_lLw';

    @Post('scan')
    async registerAndPoll(@Body() body: any, @Res() res): Promise<void> {
        try {
            // Step 1: Register the API URL
            console.log("Starting Register!");
            const registrationResponse = await axios.post('https://api.perfai.ai/api/v1/api-catalog/apps/create-run', {
                openapi_spec: body.openapi_spec,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
            });
            console.log("Register Successful");

            // Extract the _id from the third element of the response array
            const appId = registrationResponse.data[2]._id;

            let timeoutReached = false;

            // Create a timeout promise
            const timeoutPromise = new Promise(resolve => {
                setTimeout(() => {
                    timeoutReached = true;
                    resolve('TIMEOUT');
                }, 60000);
            });

            // Step 2: Poll the endpoint until the analysis is COMPLETE
            let analysisStatus = '';
            console.log("Registered");
            let analysisResponse;
            console.log("Running through ReleaseAI");
            // do {
                const result = await Promise.race([
                    // console.log(appId),
                    axios.get(`https://api.perfai.ai/api/v1/version-management-service/apps/api-version?app_id=65c3d79e139133aa0f41082a`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        analysisResponse = response;
                        console.log(analysisResponse);
                        return 'COMPLETED';
                    }),
                    timeoutPromise
                ]);

                if (result === 'TIMEOUT' || timeoutReached) {
                    console.log('Timeout reached, exiting...');
                    res.status(408).json({ message: 'Processing timeout.' });
                    return;
                }


            const analysisData = analysisResponse.data;

            // const modifiedData = analysisData.map(({ _id, ...keepAttrs }) => keepAttrs);

            // Then, format this modified data to JSON string and send it in the response
            // const formattedResponse = JSON.stringify(modifiedData, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(analysisData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred during the process.' });
        }
    }
}
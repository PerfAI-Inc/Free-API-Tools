import { Controller, Post, Body, Res } from '@nestjs/common';
import axios from 'axios';


@Controller('api/v1/governance-ai')
export class GovernanceAiController {
    private readonly token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdhOFItNlFVUlpwbHJ3OFM4M1lVRiJ9.eyJuaWNrbmFtZSI6ImludGVzYXIrdG9vbHMiLCJuYW1lIjoiaW50ZXNhcit0b29sc0BwZXJmYWkuYWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNGNjODZmMGU5NWVkOGU4YTgwZGY2YmRjMWNhNDcxMmI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZpbi5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMi0wNVQyMjo1MjoxNy41MDBaIiwiZW1haWwiOiJpbnRlc2FyK3Rvb2xzQHBlcmZhaS5haSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi15MzQ1MGI0MmN3eTh2eWwxLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJPeGlwb0pTOEVJZHBOM0t6aFZRMjgwemtLeHd6R0xmSSIsImlhdCI6MTcwNzE3MzYyNSwiZXhwIjoxNzEwNzczNjI1LCJzdWIiOiJhdXRoMHw2NWJjODUzZTU4MDE3ZjI4ZDI0OWU5ZWEiLCJzaWQiOiJYMkZTcWZUNGJVTlZUSXFCMERRTXZ4a3FZSlFKWlhiSCIsIm5vbmNlIjoiVEVKQ2RuUnZaMDh3VEVSTFRYRmlVa291VTJneVFUUkZVVzFNWjFwQk1GOXpjSGMwVFdnNWZuQmhWZz09In0.xXLEK9-mEFBsU8Svf4iVu-beqFhMhwqC9a2wFdNRz23r3kgAWCNXTZ3CkBzRzxUxaOr2swlPZLLeRcvvDLWNNI-DpvhgsRGMOP5VlLRC2HOHX8XorzftW4hqeXD781w9P1fIolSK63G_XaBITILw2cU1reKrjfHZTJkoMmkq3VWo_BMoM6C3SHFe2h5eUWtUKw8v2RGhlJf60qRKMvQ5e879YY6KuFOzQP6U9zooMQtY05x-doaJGGUn5QlP7B1Dco6AYiLXBts1NbRUgF_oXgQLEWmiq4DzeWj9otEIk3tTk4wS745I5JXAslyf5-56bvP1gxNph8svzX2khBA5Dw';

    @Post('scan')
    async registerAndPoll(@Body() body: any, @Res() res): Promise<void> {
        try {
            // Step 1: Register the API URL
            const registrationResponse = await axios.post('https://webapp.api.perfaibackend.com/api/v1/api-catalog/apps/create-run', {
                openapi_spec: body.openapi_spec,
                base_path: body.base_path,
                label: body.label,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
            });

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
            let analysisResponse;
            do {
                const result = await Promise.race([
                    axios.get(`https://webapp.api.perfaibackend.com/api/v1/design-analysis-service/apps?id=${appId}`, {
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    }).then(response => {
                        analysisResponse = response;
                        analysisStatus = response.data.latest_run.status;
                        console.log(analysisStatus);
                        if (analysisStatus !== 'COMPLETED') {
                            return new Promise(resolve => setTimeout(resolve, 1000)); // Continue polling
                        }
                        return 'COMPLETED';
                    }),
                    timeoutPromise
                ]);

                if (result === 'TIMEOUT' || timeoutReached) {
                    console.log('Timeout reached, exiting...');
                    res.status(408).json({ message: 'Processing timeout.' });
                    return;
                }

            } while (analysisStatus !== 'COMPLETED');

            const formattedResponse = JSON.stringify(analysisResponse.data.das, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(formattedResponse);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred during the process.' });
        }
    }
}

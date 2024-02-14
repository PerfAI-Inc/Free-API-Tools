import { Controller, Post, Body, Res } from '@nestjs/common';
import axios from 'axios';
import * as yaml from 'js-yaml';


@Controller('api/v1/governance-ai')
export class GovernanceAiController {
    private readonly token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdhOFItNlFVUlpwbHJ3OFM4M1lVRiJ9.eyJuaWNrbmFtZSI6ImludGVzYXIrdG9vbHMiLCJuYW1lIjoiaW50ZXNhcit0b29sc0BwZXJmYWkuYWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNGNjODZmMGU5NWVkOGU4YTgwZGY2YmRjMWNhNDcxMmI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZpbi5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMi0xNFQxNzoyODoxOC40MTFaIiwiZW1haWwiOiJpbnRlc2FyK3Rvb2xzQHBlcmZhaS5haSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi15MzQ1MGI0MmN3eTh2eWwxLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJPeGlwb0pTOEVJZHBOM0t6aFZRMjgwemtLeHd6R0xmSSIsImlhdCI6MTcwNzkzMTcwMiwiZXhwIjoxNzExNTMxNzAyLCJzdWIiOiJhdXRoMHw2NWJjODUzZTU4MDE3ZjI4ZDI0OWU5ZWEiLCJzaWQiOiJaUndWZFJiYVZLZ2lValNacDZJR3dHMm9OclZfSWpGbiIsIm5vbmNlIjoiU0RSS2QyWjFObk0xUVhrMlVUZDNhalpXUjBSR2RFdFZZMTlrWW5oWFJYWjViVzFXYlRReGVHSTNUZz09In0.PGHjO1XLf-OnqrI8d98Vls1Tq3rCh8qJ_vzIj5zyFeLg0TNajAuwazjnGOXjNHy9rYranU1-FiHQ4pmMm5TC7A6QeIvDRCzOYdZOzRHglCvmMdX5-WUO-l-2RTKqM04UYpseEhLbHh9Kv2BsnzEpSWWYAFrA7nZ-s7JFqqQX5C1eaqZqaY-1WvB-fN_uSvwvybOP-jheSbJqKoG2ztaYDvUOTsi-fCU4ken4JgwUhO8O8WSTvA3NStFp1zGyb0XfX2bUx0uUR8bjtxOP0buttk2Pc7Fm_FeVBOUoG8P-bjymOfozdxuxYQ8XxRS-k2iX2HM-xF940qed4Pu4CbcnjQ';

    @Post('scan')
    async registerAndPoll(@Body() body: any, @Res() res): Promise<void> {
        try {
            // Step 1: Register the API URL
            console.log("Starting Register!");
            const registrationResponse = await axios.post('https://webapp.api.perfaibackend.com/api/v1/api-catalog/apps/create-run', {
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
            let analysisResponse;
            console.log("Running through GovernanceAI");
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

            console.log("Completed GovernanceAI");

            const analysisData = analysisResponse.data.das;

            // Map through each item and omit the 'remediation' and '_id' fields
            const modifiedData = analysisData.map(({ _id, ...keepAttrs }) => keepAttrs);

            // Then, format this modified data to JSON string and send it in the response
            const formattedResponse = JSON.stringify(modifiedData, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(formattedResponse);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred during the process.' });
        }
    }
}

import { Controller, Post, Body, Res } from '@nestjs/common';
import axios from 'axios';
import * as yaml from 'js-yaml';


@Controller('api/v1/governance-ai')
export class GovernanceAiController {
    private readonly token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdhOFItNlFVUlpwbHJ3OFM4M1lVRiJ9.eyJuaWNrbmFtZSI6ImludGVzYXIrdG9vbHMiLCJuYW1lIjoiaW50ZXNhcit0b29sc0BwZXJmYWkuYWkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvNGNjODZmMGU5NWVkOGU4YTgwZGY2YmRjMWNhNDcxMmI_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZpbi5wbmciLCJ1cGRhdGVkX2F0IjoiMjAyNC0wMi0xMlQyMTo1NzowNC41MDVaIiwiZW1haWwiOiJpbnRlc2FyK3Rvb2xzQHBlcmZhaS5haSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczovL2Rldi15MzQ1MGI0MmN3eTh2eWwxLnVzLmF1dGgwLmNvbS8iLCJhdWQiOiJPeGlwb0pTOEVJZHBOM0t6aFZRMjgwemtLeHd6R0xmSSIsImlhdCI6MTcwNzc3NTA3NSwiZXhwIjoxNzExMzc1MDc1LCJzdWIiOiJhdXRoMHw2NWJjODUzZTU4MDE3ZjI4ZDI0OWU5ZWEiLCJzaWQiOiIxWkpPSkxwMzdsQUkxV3BpRmVCQ0ZyeEx1Qm5jQ1Z5NSIsIm5vbmNlIjoiVWpkclZXbFJkR0pPY1Zwa1dEaG9ielpsVlZrelFuVXdjRUpKYUdGWWNDMWpkbmMxTTNSYU5Ib3hkUT09In0.iT54u4Esia66R7Vw-NRwugeX-6eMeP12HW6v-_Whx2bB5hll0hMbK-UNW4pSpCfWz1TB-lNW3vO4IPyzFSL0rzUMLt6H3LFSbUlj7nJLqVP1VYz99Ec1ZAYpgDYyMewZuG1DMTCvPcZBfZDFLlvjs4QTo6uOwHHq2bW2frm7RU69kJL6Sc_qGCYKUD4SheGb2dIj5aYfpAQJSTXA8VmRpeSNYVK7olHm1GeHxu8ncgjtOAsYlQ5xsOI4rWNAAU-f4mT0V6V0R35k6gppui4rtnb4lW235Yoq73pP9HdLVo6Nmbh5RpzDwLAVQqsN18cIcohF-VSmYQSTLRWgDf-a6A';

    @Post('scan')
    async registerAndPoll(@Body() body: any, @Res() res): Promise<void> {
        try {
            // Step 1: Register the API URL
            const registrationResponse = await axios.post('https://webapp.api.perfaibackend.com/api/v1/api-catalog/apps/create-run', {
                openapi_spec: body.openapi_spec,
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

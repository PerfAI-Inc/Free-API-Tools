import { Controller, Post, Body, Res } from '@nestjs/common';
import axios from 'axios';


@Controller('api/v1/governance-ai')
export class GovernanceAiController {
    private readonly token = '';

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
            // console.log(registrationResponse.data[2]._id);
            const appId = registrationResponse.data[2]._id;
            console.log(appId);

            // Step 2: Poll the endpoint until the analysis is COMPLETE
            let analysisStatus = '';
            let analysisResponse;
            do {
                analysisResponse = await axios.get(`https://webapp.api.perfaibackend.com/api/v1/design-analysis-service/apps?id=${appId}`, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                console.log();
                analysisStatus = analysisResponse.data.latest_run.status;
                if (analysisStatus !== 'COMPLETED') {
                    // Wait for 1 seconds before polling again
                    console.log(analysisStatus);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } while (analysisStatus !== 'COMPLETED');

            // Once COMPLETE, respond with the issues from the das field
            console.log(analysisStatus);
            const formattedResponse = JSON.stringify(analysisResponse.data.das, null, 2);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(formattedResponse);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'An error occurred during the process.' });
        }
    }
}

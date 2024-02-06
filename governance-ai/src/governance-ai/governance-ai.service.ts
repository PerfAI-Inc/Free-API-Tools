import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GovernanceAiService {
    async scanApi(openApiSpecUrl: string): Promise<any> {
        const response = await axios.post('https://external-api.example.com', {
            // Your request payload
        }, {
            headers: {
                Authorization: 'Bearer YOUR_JWT_TOKEN'
            }
        });
        return response.data;
    }
}

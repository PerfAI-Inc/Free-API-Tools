<table>
  <thead align="center">
    <tr border: none;>
      <td><b>📘 Project</b></td>
      <td><b>⭐ Stars</b></td>
      <td><b>🤝 Forks</b></td>
      <td>LinkedIn</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://github.com/PerfAI-Inc/Free-API-Tools"><b>Free API Tools</b></a></td>
      <td><img alt="Stars" src="https://img.shields.io/github/stars/PerfAI-Inc/Free-API-Tools?style=flat-square&labelColor=343b41"/></td>
      <td><img alt="Forks" src="https://img.shields.io/github/forks/PerfAI-Inc/Free-API-Tools?style=flat-square&labelColor=343b41"/></td>
      <td><a href="https://www.linkedin.com/company/perfai/" target="_blank"><img src="https://img.shields.io/badge/LinkedIn-%230077B5.svg?&style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a></td>
    </tr>
  </tbody>
</table>

# GovernanceAI Free API Tools (Beta)

## Introduction

**Note: This project is currently in Beta. We're actively improving it and welcome any feedback.**

In today's fast-paced software development world, maintaining high-quality API governance is crucial yet challenging. GovernanceAI simplifies this by providing developers and organizations with powerful, automated tools to scan, analyze, and improve their APIs. This open-source project leverages advanced AI to identify issues in real-time, offering actionable insights to enhance API design, security, and performance.

## GovernanceAI Free and Open API

GovernanceAI's API is freely available for developers to integrate into their workflows. Whether you're using cURL, Postman, or Insomnia, you can easily incorporate GovernanceAI's capabilities into your projects.

### How to Use

**cURL Example:**

```bash
curl -X POST http://api.governanceai.example.com/scan \
-H "Content-Type: application/json" \
-d '{
  "openApiSpecUrl": "https://yourapi.com/spec.yaml"
}'
```

**Response:**
```json
{
  "apiName": "Your API Name",
  "totalEndpoints": 10,
  "issues": [
    {
      "method": "GET",
      "path": "/example-endpoint",
      "category": "Security",
      "priority": "High",
      "summary": "Summary of the issue"
    }
  ]
}
```
Please star the repo if you find it useful!

## Fair-use Policy

You are free to use, modify, and distribute the code for “our project name”  for personal or commercial purposes. Please refrain from using the code for malicious purposes or violating any laws. While attribution is encouraged, it's not mandatory. Contributions are welcome under the same license. The code comes without warranties, and we are not liable for any issues. Report violations via the repository or the email listed in the contact information. We reserve the right to modify this policy. By using the code, you agree to comply with this Fair Use Policy.

## License

The code in this repository is licensed under the Apache License, Version 2.0. You are free to use, modify, and distribute the code for “our project name” for personal or commercial purposes. The license allows for open and free use, with the condition that any contributions you make are also licensed under the same terms. Please refer to the “Apache License 2.0” file for the full text of the Apache License, Version 2.0.

## Roadmap

* More Test Tools: Expanding our suite to offer more comprehensive testing capabilities.
* Rate Limiting: Introducing rate limits for API usage to ensure fair use.
* Email Reporting: Option to receive detailed reports directly via email.
* GitHub Actions Integration: Seamlessly integrate with your CI/CD workflows.

## Open Source Contributions

We welcome contributions from the community! If you're interested in contributing, please reach out to yahya@perfai.ai.

## File Bugs / Feature Requests

Encounter a bug or have a feature request? Please file an issue on our GitHub repository.

## Demo Video

Watch our demo video to see GovernanceAI in action. [Link the Video]

## Additional Notes

Free API Product: Requests timeout after 1 minute. The service checks for completion every 1 second. Caller IP and call counts are logged for monitoring purposes.
Response Messaging: Future updates will include more descriptive messages, including INFO messages and the option to set an email address to receive a copy of your report.

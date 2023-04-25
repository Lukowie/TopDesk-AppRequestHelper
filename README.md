# ResetAddApp
Reads and writes to Azure Blob Storage container to use JSON file as pseudo database

Wrapped Azure AD SSO functionality to only allow certain users to use the web app
- Hosted the web app in Azure Web App, free plan
- Set up Enterprise Application

.env is hidden, but used https://github.com/Azure-Samples/ms-identity-node to get me on the right track

TODO:
- Styling (Very barebones at the moment, using html, bootstrap, and hbs templates)
- Automated reading of Excel online spreadsheet and/or detecting when a new folder is uploaded to sharepoint directory to then copy into own directory
      - Might be hard to do using the Microsoft graph api since I do not have access to the guest tenant...

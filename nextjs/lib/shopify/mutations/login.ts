export const loginMutation = `
    mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) { 
        customerAccessTokenCreate(input: $input) { 
            customerAccessToken { 
                accessToken 
                expiresAt 
            } 
            customerUserErrors { code field message } 
        } 
    }
`;

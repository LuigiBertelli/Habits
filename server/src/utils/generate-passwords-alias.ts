
export const generatePasswordAlias = (email : string, createdAt: string, password: string) => email.slice(0, email.length % password.length) + createdAt + password; 
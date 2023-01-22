export const generateProgressPercentage = (total: number = 0, completed: number = 0) => {
    if(total <= 0)
        return 0;
    
    return Math.round((completed / total) * 100);
}
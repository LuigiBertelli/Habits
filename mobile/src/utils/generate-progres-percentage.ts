export const generateProgressPercentage = (total: number, completed: number) => {
    if(total <= 0)
        return 0;
    
    return completed / total;
}
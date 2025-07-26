export function getTwoYearsAgoDate(): string {
    const today = new Date();
    const twoYearsAgo = new Date(today);
    twoYearsAgo.setFullYear(today.getFullYear() - 2);

    // Format as YYYY-MM-DD
    return twoYearsAgo.toISOString().split("T")[0];
}

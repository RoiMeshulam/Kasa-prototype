// utils/formatDate.ts
export function formatDateTime(isoString: string) {
    if (!isoString) return { date: "-", time: "-" };
  
    const dateObj = new Date(isoString);
  
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // חודשים מ-0
    const year = dateObj.getFullYear();
  
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  
    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    };
  }
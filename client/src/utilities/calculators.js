export const timeSince = (date) => {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

export const averageRating = (reviews) => {
    if (reviews === undefined) return 0;
    if (Object.entries(reviews).length === 0) return 0;
    return (reviews.map((r, _) => r.review.rating).reduce((sum, a) => sum + a, 0)) / reviews.length;
}

export const shrinkText = (text, charCount) => {
    if(text && text == null) return "";
    if(text.length > charCount) return `${text.substring(0, charCount)}...`;
    return text;
}
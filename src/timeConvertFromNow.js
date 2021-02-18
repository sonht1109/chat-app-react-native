const timeConvertFromNow = time => {
    const period = Math.round(new Date().getTime() / 1000 - time)
    const mins = Math.floor(period / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if(days){
        return `${days} ${days > 1 ? "days" : "day"} ago`
    }
    if(hours) {
        return `${hours} ${hours > 1 ? "hours" : "hour"} ago`
    }
    else if(mins === 0){
        return 'Just now'
    }
    return `${mins} ${mins > 1 ? "mins" : "min"} ago`
}

export default timeConvertFromNow
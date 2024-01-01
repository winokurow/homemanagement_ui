export function calculateDatesForNextDays(numberOfDays: number) : Date[] {
  const today = new Date();
  const nextDays: Date[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const nextDay = new Date(today);
    nextDay.setHours(0,0,0,0);
    nextDay.setDate(today.getDate() + i);
    nextDays.push(nextDay);
  }
  return nextDays;
}

export function dayBegin(date: Date) : Date {
  let beginTime = new Date(date);
  beginTime.setHours(7, 0);
  return beginTime;
}

export function dayEnd(date: Date) : Date {
  let endTime = new Date(date);
  endTime.setHours(21, 45);
  return endTime;
}

export function calculateDurationInMinutes(startDate: Date, endDate: Date): number {
  const millisecondsDifference = endDate.getTime() - startDate.getTime();
  // 1000 milliseconds = 1 second, 60 seconds = 1 minute
  return millisecondsDifference / (1000 * 60);
}

export function addTimeToDate(sourceDate: Date, targetDate: Date): Date {
  // Get the time from the source date
  const hours = sourceDate.getHours();
  const minutes = sourceDate.getMinutes();
  const seconds = sourceDate.getSeconds();

  // Set the time to the target date
  console.log(targetDate);
  console.log(typeof targetDate);
  targetDate.setHours(hours);
  targetDate.setMinutes(minutes);
  targetDate.setSeconds(seconds);

  return targetDate;
}



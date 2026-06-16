export function dateOnly(input: Date | string): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const copy = new Date(date.getTime());
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString().slice(0, 10);
}

export function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return dateOnly(date);
}

export function formatDate(date?: string): string {
  if (!date) return 'Not set';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(`${date}T00:00:00`),
  );
}

export function isOverdue(date?: string): boolean {
  if (!date) return false;
  return date < dateOnly(new Date());
}

export function isTodayOrOverdue(date?: string): boolean {
  if (!date) return false;
  return date <= dateOnly(new Date());
}

export function isWithinDays(date?: string, days = 3): boolean {
  if (!date) return false;
  const today = new Date(`${dateOnly(new Date())}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);
  const diff = target.getTime() - today.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

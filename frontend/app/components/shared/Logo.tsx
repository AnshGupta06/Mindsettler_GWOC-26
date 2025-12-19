import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="MindBloom Home">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1" />
        <path d="M12 8c-2.67 0-5.33.33-8 1 .33-1.67 1-3.33 2-5" />
        <path d="m20 9-2-5c1 1.67 1.67 3.33 2 5" />
        <path d="M4.68 11.05c-.38.82-.68 1.68-.88 2.58" />
        <path d="M20.2 13.63c-.2-.9-.5-1.76-.88-2.58" />
        <path d="M12 22a9.12 9.12 0 0 1-8.59-6.37" />
        <path d="M12 22a9.12 9.12 0 0 0 8.59-6.37" />
        <path d="M12 14a6 6 0 0 1-6-6" />
        <path d="M12 14a6 6 0 0 0 6-6" />
      </svg>
      <span className="font-headline text-2xl font-bold text-foreground">
        MindBloom
      </span>
    </Link>
  );
}

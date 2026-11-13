"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="standalone-error">
      <p className="eyebrow">SUN-KA / LARTON</p>
      <h1>Let’s try that again.</h1>
      <p>
        The request could not be completed. Your recorded demo data is retained.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}

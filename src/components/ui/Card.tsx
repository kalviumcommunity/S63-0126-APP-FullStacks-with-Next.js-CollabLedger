/**
 * Card Component
 * Reusable card container with title and optional children.
 */
interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-black/10 bg-white p-6 shadow-sm ${className}`.trim()}
    >
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-black">{title}</h3>
      )}
      {children}
    </div>
  );
}

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnotatedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AnnotatedLayout = React.forwardRef<HTMLDivElement, AnnotatedLayoutProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-6 flex flex-col items-center", className)}
      {...props}
    >
      {children}
    </div>
  )
);
AnnotatedLayout.displayName = "AnnotatedLayout";

interface AnnotatedSectionProps {
  title: string;
  description?: string;
  docLink?: string;
  children: React.ReactNode;
  className?: string;
}

const AnnotatedSection = React.forwardRef<
  HTMLDivElement,
  AnnotatedSectionProps
>(({ title, description, docLink, children, className, ...props }, ref) => {
  const titleId = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full max-w-4xl py-6 grid-cols-1 gap-y-4 px-6 md:grid-cols-12 md:gap-x-8 lg:gap-x-16 bg-background border rounded-2xl",
        className
      )}
      {...props}
    >
      <div className="md:col-span-5 space-y-4">
        <h2 id={titleId} className="text-sm font-semibold">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {docLink && (
          <a
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            href={docLink}
          >
            Read documentation
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
      <div className="md:col-span-7" aria-labelledby={titleId}>
        {children}
      </div>
    </div>
  );
});
AnnotatedSection.displayName = "AnnotatedSection";

export { AnnotatedLayout, AnnotatedSection };

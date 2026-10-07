import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react"

import { isStr, obj } from "@/lib/genui-guards"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}


/* ---------------------------------------------------------------------------
 * Generative-UI entry point.
 *
 * The compound parts above are composed with JSX, which a model cannot emit.
 * This takes the model's JSON straight from the tool call instead: flat,
 * string-only props, validated here because they arrived over HTTP from a
 * probabilistic system. Bad props render nothing rather than throwing.
 * ------------------------------------------------------------------------- */

// The model picks a token from a closed set; this map decides what it renders.
// That indirection is what keeps the model out of the styling.
const ALERT_TONES = {
  note: { icon: Info, variant: "default" },
  success: { icon: CircleCheck, variant: "default" },
  warning: { icon: TriangleAlert, variant: "default" },
  danger: { icon: CircleAlert, variant: "destructive" },
} as const

type AlertTone = keyof typeof ALERT_TONES

const isAlertTone = (value: unknown): value is AlertTone =>
  isStr(value) && value in ALERT_TONES

function AlertBlock({ props }: { props: unknown }) {
  const { tone, title, description } = obj(props)

  if (!isStr(title) || !isStr(description)) return null

  // An unrecognised tone is a styling detail, not a reason to drop the content.
  const { icon: Icon, variant } = ALERT_TONES[isAlertTone(tone) ? tone : "note"]

  return (
    <Alert variant={variant}>
      <Icon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertBlock }

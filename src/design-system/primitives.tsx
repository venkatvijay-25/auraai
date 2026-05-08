import type { ReactNode } from 'react'
import clsx from 'clsx'

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

type CardProps = {
  children: ReactNode
  className?: string
  interactive?: boolean
  selected?: boolean
}

type SectionHeaderProps = {
  eyebrow?: string
  title: string
  meta?: ReactNode
  actions?: ReactNode
}

type SegmentedControlProps<T extends string> = {
  ariaLabel: string
  compact?: boolean
  labels?: Partial<Record<T, string>>
  onChange: (value: T) => void
  options: readonly T[]
  value: T
}

type PillProps = {
  children: ReactNode
  tone?: Tone
}

type MetricTileProps = {
  detail?: ReactNode
  label: string
  value: ReactNode
}

type ProgressBarProps = {
  tone?: Tone
  value: number
}

export function Card({ children, className, interactive, selected }: CardProps) {
  return (
    <section
      className={clsx(
        'card',
        interactive && 'card--interactive',
        selected && 'card--selected',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  meta,
  actions,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2 className="section-header__title">{title}</h2>
        {meta ? <p className="section-header__meta">{meta}</p> : null}
      </div>
      {actions ? <div className="section-header__actions">{actions}</div> : null}
    </div>
  )
}

export function SegmentedControl<T extends string>({
  ariaLabel,
  compact,
  labels,
  onChange,
  options,
  value,
}: SegmentedControlProps<T>) {
  return (
    <div
      aria-label={ariaLabel}
      className={clsx('segmented-control', compact && 'segmented-control--compact')}
      role="tablist"
    >
      {options.map((option) => (
        <button
          aria-selected={option === value}
          className={clsx(
            'segmented-control__button',
            option === value && 'is-active',
          )}
          key={option}
          onClick={() => onChange(option)}
          role="tab"
          type="button"
        >
          {labels?.[option] ?? option}
        </button>
      ))}
    </div>
  )
}

export function Pill({ children, tone = 'neutral' }: PillProps) {
  return <span className={clsx('pill', `pill--${tone}`)}>{children}</span>
}

export function MetricTile({ detail, label, value }: MetricTileProps) {
  return (
    <div className="metric-tile">
      <span className="metric-tile__label">{label}</span>
      <strong className="metric-tile__value">{value}</strong>
      {detail ? <div className="metric-tile__detail">{detail}</div> : null}
    </div>
  )
}

export function ProgressBar({ tone = 'info', value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className="progress-bar">
      <div
        className={clsx('progress-bar__fill', `progress-bar__fill--${tone}`)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

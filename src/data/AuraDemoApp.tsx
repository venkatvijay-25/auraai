import { startTransition, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  LayoutGrid,
  Mic,
  Paperclip,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react'
import clsx from 'clsx'
import './aura-demo.css'
import {
  marketById,
  markets,
  matchScenarioFromPrompt,
  quickPromptOrder,
  scenarioById,
  threadById,
  threads,
  type ChatThread,
  type FollowUpPrompt,
  type MarketCard,
  type ProposalWorkflow,
  type Scenario,
  type ScenarioId,
  type Tone,
} from './auraDemo'
import {
  scenarioEnhancementById,
  threadFeatureById,
  type AccountProfile,
  type ScenarioEnhancement,
} from './auraFeatureData'
import {
  addDocumentToWorkspace,
  archiveNotification,
  addProposalComment,
  ensureProposalReady,
  exportProposalMemo,
  focusThreadScenario,
  getInitialWorkspaceState,
  markDocumentRead,
  markNotificationRead,
  queueProposalReview,
  resetThreadWorkspace,
  selectActiveAccount,
  selectActiveMarket,
  selectActiveThread,
  submitPromptToWorkspace,
  toggleComparedAnalysis,
  toggleAdvisorQueue,
  togglePinnedAnalysis,
  toggleProposalChecklistItem,
  updateProposalTrade,
  generateThreadSummary,
  type AuraWorkspaceState,
  type DocumentArtifact,
  type NotificationItem,
  type NotificationTone,
  type ProposalDraftState,
  type ProposalTradeState,
  type ProposalStage,
} from './auraWorkspaceService'

type InsightMode = 'detail' | 'action' | null
type NotificationFilter = 'all' | 'unread' | 'workflow' | 'documents'

function getInitialProposalOpen() {
  const workspace = getInitialWorkspaceState()
  return workspace.threadStateById[workspace.activeThreadId].proposalStage !== 'draft'
}

function formatSeriesValue(value: number, scenario: Scenario) {
  if (scenario.id === 'tax') {
    return `$${value.toFixed(0)}K`
  }

  if (scenario.id === 'liquidity') {
    return `${value.toFixed(1)}x`
  }

  return `${value.toFixed(1)}%`
}

function buildComparisonSeries(scenario: Scenario, enhancement: ScenarioEnhancement, activeMarket: MarketCard) {
  const benchmarkSeries = enhancement.marketImpactById[activeMarket.id].benchmarkSeries

  return scenario.series.map((point, index) => ({
    label: point.label,
    portfolio: point.value,
    benchmark:
      benchmarkSeries.find((benchmarkPoint) => benchmarkPoint.label === point.label)?.value ??
      benchmarkSeries[index]?.value ??
      point.value,
  }))
}

function sparkPath(points: number[]) {
  const width = 100
  const height = 26
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width
      const y = height - ((point - min) / range) * (height - 4) - 2

      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}

function toneClass(tone: Tone | NotificationTone) {
  if (tone === 'positive') return 'is-positive'
  if (tone === 'negative') return 'is-negative'
  return 'is-neutral'
}

function ToneIcon({ tone }: { tone: Tone | NotificationTone }) {
  if (tone === 'positive') {
    return <ArrowUpRight size={14} />
  }

  if (tone === 'negative') {
    return <ArrowDownRight size={14} />
  }

  return <Sparkles size={14} />
}

function proposalStageLabel(stage: ProposalStage) {
  if (stage === 'queued') return 'Advisor review queued'
  if (stage === 'exported') return 'Memo exported'
  if (stage === 'ready') return 'Ready to route'
  return 'Draft proposal'
}

function AssistantAvatar() {
  return (
    <div className="message-avatar message-avatar--assistant" aria-hidden="true">
      <Sparkles size={16} />
    </div>
  )
}

function UserAvatar() {
  return (
    <div className="message-avatar message-avatar--user" aria-hidden="true">
      VR
    </div>
  )
}

function MarketSparkline({ market }: { market: MarketCard }) {
  return (
    <svg
      className={clsx('market-card__sparkline', toneClass(market.tone))}
      viewBox="0 0 100 26"
      preserveAspectRatio="none"
      role="presentation"
    >
      <path d={sparkPath(market.points)} />
    </svg>
  )
}

function MarketTile({
  market,
  active,
  onSelect,
}: {
  market: MarketCard
  active: boolean
  onSelect: (id: MarketCard['id']) => void
}) {
  return (
    <button
      className={clsx('market-card', active && 'is-active')}
      onClick={() => onSelect(market.id)}
      type="button"
    >
      <div className="market-card__header">
        <div>
          <div className="market-card__label">{market.label}</div>
          <div className="market-card__value">{market.value}</div>
        </div>
        <div className={clsx('trend-chip', toneClass(market.tone))}>
          <ToneIcon tone={market.tone} />
          {market.change}
        </div>
      </div>
      <MarketSparkline market={market} />
    </button>
  )
}

function PortfolioRail({
  activeThread,
  activeScenarioId,
  activeAccountId,
  activeThreadId,
  onNewSession,
  onSelectAccount,
  onSelectThread,
}: {
  activeThread: ChatThread
  activeScenarioId: ScenarioId
  activeAccountId: string
  activeThreadId: string
  onNewSession: () => void
  onSelectAccount: (accountId: string) => void
  onSelectThread: (thread: ChatThread) => void
}) {
  const threadFeature = threadFeatureById[activeThread.id]

  return (
    <div className="rail-shell">
      <div className="brand-block">
        <div className="brand-block__name">FortuneForge</div>
        <div className="brand-block__meta">Private Office</div>
      </div>

      <section className="wealth-card">
        <div className="wealth-card__eyebrow">Household Canvas</div>
        <div className="wealth-card__value">{activeThread.portfolioValue}</div>
        <div className="wealth-card__trend">
          <ArrowUpRight size={14} />
          {activeThread.dayChange}
        </div>

        <div className="allocation-bar" aria-hidden="true">
          {activeThread.allocation.map((segment) => (
            <span
              className={clsx('allocation-bar__segment', `allocation-bar__segment--${segment.tone}`)}
              key={segment.label}
              style={{ width: `${segment.share}%` }}
            />
          ))}
        </div>

        <div className="allocation-meta">
          {activeThread.allocation.map((segment) => (
            <span key={segment.label}>
              {segment.label} {segment.share}%
            </span>
          ))}
        </div>
      </section>

      <section className="context-card">
        <div className="section-kicker">Active mandate</div>
        <div className="context-card__headline">{activeThread.household}</div>
        <div className="context-pill-row">
          <span className="context-pill">{activeThread.riskBand}</span>
          <span className="context-pill">{activeThread.accountScope}</span>
        </div>
        <p className="context-card__copy">{activeThread.objective}</p>
        <div className="constraint-list">
          {activeThread.constraints.map((constraint) => (
            <span className="constraint-chip" key={constraint}>
              {constraint}
            </span>
          ))}
        </div>
      </section>

      <section className="context-card">
        <div className="section-kicker">Goal buckets</div>
        <div className="goal-stack">
          {threadFeature.objectiveBuckets.map((bucket) => (
            <div className="goal-row" key={bucket.label}>
              <div>
                <div className="goal-row__title">{bucket.label}</div>
                <div className="goal-row__meta">
                  {bucket.target} | {bucket.funded}
                </div>
              </div>
              <span className="context-pill">{bucket.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="context-card">
        <div className="section-kicker">Account lens</div>
        <div className="account-selector">
          {threadFeature.accounts.map((account) => (
            <button
              className={clsx('account-selector__item', account.id === activeAccountId && 'is-active')}
              key={account.id}
              onClick={() => onSelectAccount(account.id)}
              type="button"
            >
              <span>{account.name}</span>
              <span>{account.value}</span>
            </button>
          ))}
        </div>
      </section>

      <nav className="nav-stack" aria-label="Main engine">
        <div className="section-kicker">Main Engine</div>
        <div className="nav-item">
          <LayoutGrid size={18} />
          <span>Wealth Canvas</span>
        </div>
        <div className="nav-item">
          <Activity size={18} />
          <span>Market Intelligence</span>
        </div>
        <div className="nav-item nav-item--active">
          <WalletCards size={18} />
          <span>Advisor Workspace</span>
        </div>
      </nav>

      <section className="recent-stack">
        <div className="section-kicker">Household Threads</div>
        {threads.map((thread) => (
          <button
            className={clsx('recent-thread', thread.id === activeThreadId && 'is-active')}
            key={thread.id}
            onClick={() => onSelectThread(thread)}
            type="button"
          >
            <div className="recent-thread__title">{thread.title}</div>
            <div className="recent-thread__teaser">{thread.teaser}</div>
          </button>
        ))}
      </section>

      <section className="member-card">
        <div className="member-card__profile">
          <div className="member-avatar">VR</div>
          <div>
            <div className="member-card__name">Venkat R.</div>
            <div className="member-card__tier">
              Lead Advisor | {scenarioById[activeScenarioId].label}
            </div>
          </div>
        </div>

        <button className="ghost-cta" onClick={onNewSession} type="button">
          Reset current thread
        </button>
      </section>
    </div>
  )
}

function MarketRail({
  activeMarket,
  activeScenario,
  onSelectMarket,
}: {
  activeMarket: MarketCard
  activeScenario: Scenario
  onSelectMarket: (id: MarketCard['id']) => void
}) {
  return (
    <div className="rail-shell rail-shell--markets">
      <div className="market-rail__header">
        <div className="section-kicker">Market Snapshot</div>
        <div className="market-rail__subtext">US live context</div>
      </div>

      <div className="market-grid">
        {markets.map((market) => (
          <MarketTile
            active={market.id === activeMarket.id}
            key={market.id}
            market={market}
            onSelect={onSelectMarket}
          />
        ))}
      </div>

      <section className="quick-pulse">
        <div className="section-kicker">Why it matters</div>
        <div className="focus-note">
          <div className="focus-note__title">{activeMarket.label}</div>
          <p>{activeMarket.portfolioEffect}</p>
        </div>
      </section>

      <section className="focus-note">
        <div className="focus-note__title">Current cue</div>
        <p>{activeScenario.marketTakeaway}</p>
      </section>

      <section className="health-card">
        <div className="health-card__label">Portfolio Health</div>
        <div className="health-card__value">{activeScenario.healthScore}%</div>
        <div className="health-card__meta">
          {activeScenario.healthScore >= 95 ? 'Client-ready' : 'Needs review'}
        </div>
      </section>
    </div>
  )
}

function AccountLens({
  account,
}: {
  account: AccountProfile
}) {
  const [activeHoldingTicker, setActiveHoldingTicker] = useState(account.holdings[0]?.ticker ?? '')
  const activeHolding =
    account.holdings.find((holding) => holding.ticker === activeHoldingTicker) ?? account.holdings[0]

  return (
    <section className="context-showcase">
      <div className="context-showcase__header">
        <div>
          <div className="section-kicker">Selected account</div>
          <h3>{account.name}</h3>
        </div>
        <div className="trust-strip">
          <span className="trust-chip">{account.type}</span>
          <span className="trust-chip">{account.riskBand}</span>
          <span className="trust-chip">{account.value}</span>
        </div>
      </div>

      <div className="context-showcase__grid">
        <div className="context-showcase__card">
          <div className="section-kicker">Mandate and constraints</div>
          <div className="context-showcase__headline">{account.mandate}</div>
          <div className="goal-stack">
            <div className="goal-row">
              <div className="goal-row__title">Cash reserve</div>
              <div className="goal-row__meta">{account.cashReserve}</div>
            </div>
            <div className="goal-row">
              <div className="goal-row__title">Liquidity coverage</div>
              <div className="goal-row__meta">{account.liquidityCoverage}</div>
            </div>
          </div>
          <div className="constraint-list">
            {account.restrictions.map((restriction) => (
              <span className="constraint-chip" key={restriction}>
                {restriction}
              </span>
            ))}
          </div>
        </div>

        <div className="context-showcase__card">
          <div className="section-kicker">Holdings drill-down</div>
          <div className="holding-drilldown">
            {account.holdings.map((holding) => (
              <button
                className={clsx(
                  'holding-drilldown__item',
                  holding.ticker === activeHolding?.ticker && 'is-active',
                )}
                key={holding.ticker}
                onClick={() => setActiveHoldingTicker(holding.ticker)}
                type="button"
              >
                <div>
                  <div className="goal-row__title">{holding.ticker}</div>
                  <div className="goal-row__meta">{holding.name}</div>
                </div>
                <div className="holding-drilldown__metrics">
                  <span>{holding.value}</span>
                  <span className={clsx(toneClass(holding.tone))}>{holding.change}</span>
                </div>
              </button>
            ))}
          </div>

          {activeHolding?.lots?.length ? (
            <div className="lot-stack">
              {activeHolding.lots.map((lot) => (
                <div className="lot-row" key={lot.id}>
                  <div>
                    <div className="goal-row__title">{lot.opened}</div>
                    <div className="goal-row__meta">{lot.term}</div>
                  </div>
                  <div className="lot-row__metrics">
                    <span>{lot.marketValue}</span>
                    <span>{lot.unrealized}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function WorkspaceSummary({
  compareLabels,
  onGenerateSummary,
  pinnedLabels,
  summary,
}: {
  compareLabels: string[]
  onGenerateSummary: () => void
  pinnedLabels: string[]
  summary: string
}) {
  return (
    <section className="summary-shell">
      <div className="summary-shell__header">
        <div>
          <div className="section-kicker">Workspace summary</div>
          <div className="context-showcase__headline">Advisor recap</div>
        </div>
        <button className="secondary-button" onClick={onGenerateSummary} type="button">
          Refresh summary
        </button>
      </div>
      <p>{summary}</p>
      <div className="summary-shell__grid">
        <div className="context-showcase__card">
          <div className="section-kicker">Pinned analyses</div>
          <div className="follow-up-row">
            {pinnedLabels.length ? (
              pinnedLabels.map((label) => (
                <span className="trust-chip" key={label}>
                  {label}
                </span>
              ))
            ) : (
              <span className="goal-row__meta">Pin any analysis card to keep it in the advisor stack.</span>
            )}
          </div>
        </div>
        <div className="context-showcase__card">
          <div className="section-kicker">Compare mode</div>
          <div className="follow-up-row">
            {compareLabels.length ? (
              compareLabels.map((label) => (
                <span className="trust-chip" key={label}>
                  {label}
                </span>
              ))
            ) : (
              <span className="goal-row__meta">Select up to two analyses to compare tradeoffs side-by-side.</span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function DocumentHub({
  accountsById,
  activeDocumentId,
  documents,
  onOpenDocument,
}: {
  accountsById: Record<string, AccountProfile>
  activeDocumentId: string | null
  documents: DocumentArtifact[]
  onOpenDocument: (documentId: string) => void
}) {
  const activeDocument = documents.find((document) => document.id === activeDocumentId) ?? documents[0]

  if (!documents.length || !activeDocument) {
    return null
  }

  return (
    <section className="context-showcase">
      <div className="context-showcase__header">
        <div>
          <div className="section-kicker">Document inbox</div>
          <h3>Attached statements and transcripts</h3>
        </div>
        <span className="trust-chip">{documents.filter((document) => !document.read).length} unread</span>
      </div>

      <div className="context-showcase__grid">
        <div className="context-showcase__card">
          <div className="document-stack">
            {documents.map((document) => (
              <button
                className={clsx('document-item', document.id === activeDocument.id && 'is-active')}
                key={document.id}
                onClick={() => onOpenDocument(document.id)}
                type="button"
              >
                <div>
                  <div className="goal-row__title">{document.title}</div>
                  <div className="goal-row__meta">
                    {document.kind} | {document.status} | {document.uploadedAt}
                  </div>
                </div>
                <span className={clsx('document-item__status', !document.read && 'is-unread')}>
                  {!document.read ? 'Unread' : 'Open'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="context-showcase__card">
          <div className="section-kicker">{activeDocument.source}</div>
          <div className="context-showcase__headline">{activeDocument.title}</div>
          {activeDocument.excerpt ? <p>{activeDocument.excerpt}</p> : null}
          <div className="follow-up-row">
            {activeDocument.accountIds.map((accountId) => (
              <span className="trust-chip" key={accountId}>
                {accountsById[accountId]?.name ?? accountId}
              </span>
            ))}
          </div>
          <div className="document-highlight-list">
            {activeDocument.highlights.map((highlight) => (
              <div className="document-highlight" key={highlight}>
                {highlight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ScenarioResponse({
  active,
  activeAccount,
  activeMarket,
  enhancement,
  insightMode,
  onExportProposal,
  onFollowUp,
  onPrimaryAction,
  onQueueProposal,
  onSecondaryAction,
  onToggleChecklist,
  onToggleCompare,
  onTogglePin,
  onTradeChange,
  onAddProposalComment,
  pinned,
  compared,
  proposalDraft,
  proposalOpen,
  proposalStage,
  scenario,
}: {
  active: boolean
  activeAccount: AccountProfile
  activeMarket: MarketCard
  enhancement: ScenarioEnhancement
  insightMode: InsightMode
  onExportProposal: () => void
  onFollowUp: (followUp: FollowUpPrompt) => void
  onPrimaryAction: () => void
  onQueueProposal: () => void
  onSecondaryAction: () => void
  onToggleChecklist: (checklistId: string) => void
  onToggleCompare: () => void
  onTogglePin: () => void
  onTradeChange: (
    tradeId: string,
    patch: Partial<Pick<ProposalTradeState, 'included' | 'owner' | 'comment' | 'status'>>,
  ) => void
  onAddProposalComment: (comment: string) => void
  pinned: boolean
  compared: boolean
  proposalDraft: ProposalDraftState
  proposalOpen: boolean
  proposalStage: ProposalStage
  scenario: Scenario
}) {
  const chartStroke = scenario.id === 'risk' ? '#ffb4ab' : '#43e0cf'
  const chartFill = scenario.id === 'risk' ? '#ffb4ab' : '#63f9e8'
  const proposal = scenario.proposal
  const marketImpact = enhancement.marketImpactById[activeMarket.id]
  const comparisonSeries = buildComparisonSeries(scenario, enhancement, activeMarket)

  return (
    <div className="rich-response">
      <div className="message-bubble message-bubble--assistant">{scenario.responseText}</div>

      <article className="analysis-card">
        <div className="analysis-card__glow" />
        <div className="analysis-card__header">
          <div>
            <div className="section-kicker">Insight Module</div>
            <h3>{scenario.metricLabel}</h3>
          </div>
          <div className="analysis-card__controls">
            <button className={clsx('mini-toggle', pinned && 'is-active')} onClick={onTogglePin} type="button">
              Pin
            </button>
            <button
              className={clsx('mini-toggle', compared && 'is-active')}
              onClick={onToggleCompare}
              type="button"
            >
              Compare
            </button>
            <div
              className={clsx(
                'trend-chip',
                scenario.metricDelta.startsWith('-') ? 'is-negative' : 'is-positive',
              )}
            >
              <ToneIcon tone={scenario.metricDelta.startsWith('-') ? 'negative' : 'positive'} />
              {scenario.metricDelta}
            </div>
          </div>
        </div>

        <div className="analysis-card__metric">
          {scenario.metricValue}
          <span>{scenario.period}</span>
        </div>

        <div className="trust-strip">
          <span className="trust-chip">{scenario.confidenceLabel}</span>
          <span className="trust-chip">{scenario.asOf}</span>
          <span className="trust-chip">US mandate only</span>
          <span className="trust-chip">{enhancement.advisorReviewStatus}</span>
        </div>

        <div className="market-context">
          <div>
            <div className="section-kicker">Market link</div>
            <div className="market-context__headline">{marketImpact.headline}</div>
          </div>
          <div className="market-context__content">
            <p>{marketImpact.exposureNote}</p>
            <div className="follow-up-row">
              <span className="trust-chip">
                {marketImpact.benchmarkLabel} {marketImpact.benchmarkDelta}
              </span>
              <span className="trust-chip">Focused account {activeAccount.name}</span>
              <span className="trust-chip">{marketImpact.impactedAccounts.length} linked accounts impacted</span>
            </div>
            <div className="market-catalyst-grid">
              {marketImpact.catalysts.map((catalyst) => (
                <div className="market-catalyst" key={catalyst.label}>
                  <div className="section-kicker">{catalyst.label}</div>
                  <p>{catalyst.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <div className="section-kicker">{scenario.metricLabel}</div>
            <div className="chart-card__period">{scenario.period}</div>
          </div>
          <div className="chart-card__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={comparisonSeries} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`aura-chart-fill-${scenario.id}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={chartFill} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={chartFill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(186, 202, 198, 0.08)"
                  strokeDasharray="4 6"
                  vertical={false}
                />
                <XAxis
                  axisLine={false}
                  dataKey="label"
                  tick={{ fill: '#8fa2b3', fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis axisLine={false} hide tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(4, 32, 59, 0.96)',
                    border: '1px solid rgba(67, 224, 207, 0.18)',
                    borderRadius: 18,
                    color: '#d2e4ff',
                  }}
                  cursor={{ stroke: 'rgba(67, 224, 207, 0.25)', strokeWidth: 1 }}
                  formatter={(value, name) => [
                    formatSeriesValue(Number(value), scenario),
                    name === 'benchmark' ? marketImpact.benchmarkLabel : scenario.metricLabel,
                  ]}
                  labelStyle={{ color: '#8fa2b3' }}
                />
                <Area
                  dataKey="portfolio"
                  fill={`url(#aura-chart-fill-${scenario.id})`}
                  stroke={chartStroke}
                  strokeWidth={3}
                  type="monotone"
                />
                <Line
                  dataKey="benchmark"
                  dot={false}
                  isAnimationActive={false}
                  stroke="#b0c8eb"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  type="monotone"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="source-panel">
          <div className="section-kicker">Sources, assumptions, and controls</div>
          <div className="source-grid">
            {enhancement.citations.map((citation) => (
              <div className="source-card" key={citation.id}>
                <div className="source-card__label">{citation.claim}</div>
                <p>{citation.sourceLabel}</p>
                <p>{citation.sourceDetail}</p>
                <div className="goal-row__meta">
                  {citation.refreshedAt} | {citation.impact}
                </div>
              </div>
            ))}
          </div>
          <div className="flag-grid">
            {enhancement.complianceFlags.map((flag) => (
              <div className="flag-card" key={flag.label}>
                <div className={clsx('holding-badge', toneClass(flag.tone))}>{flag.label}</div>
                <p>{flag.detail}</p>
              </div>
            ))}
          </div>
          <div className="assumption-list">
            {enhancement.assumptions.map((assumption) => (
              <div className="compliance-note" key={assumption}>
                {assumption}
              </div>
            ))}
          </div>
          <div className="follow-up-row">
            {marketImpact.vulnerableHoldings.map((holding) => (
              <span className="workflow-pill" key={holding}>
                Watch {holding}
              </span>
            ))}
          </div>
          <div className="compliance-note">{scenario.complianceNote}</div>
        </div>

        <div className="holdings-card">
          <div className="section-kicker">
            {scenario.listTitle} | selected account {activeAccount.name}
          </div>

          <div className="holding-stack">
            {scenario.items.map((item) => (
              <div className="holding-row" key={`${scenario.id}-${item.ticker}`}>
                <div className="holding-row__identity">
                  <div className={clsx('holding-badge', toneClass(item.tone))}>{item.ticker}</div>
                  <div>
                    <div className="holding-row__name">{item.name}</div>
                    <div className="holding-row__meta">{item.meta}</div>
                  </div>
                </div>

                <div className="holding-row__metrics">
                  <div className="holding-row__value">{item.value}</div>
                  <div className={clsx('holding-row__change', toneClass(item.tone))}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="holding-actions">
            <button className="secondary-button" onClick={onSecondaryAction} type="button">
              {scenario.secondaryAction}
            </button>
            <button className="primary-button" onClick={onPrimaryAction} type="button">
              {scenario.primaryAction}
            </button>
          </div>
        </div>

        <div className="follow-up-panel">
          <div className="section-kicker">Suggested follow-ups</div>
          <div className="follow-up-row">
            {scenario.followUps.map((followUp) => (
              <button
                className="follow-up-chip"
                key={followUp.label}
                onClick={() => onFollowUp(followUp)}
                type="button"
              >
                {followUp.label}
              </button>
            ))}
          </div>
        </div>

        {active && insightMode ? (
          <div className="insight-panel">
            <div className="insight-panel__title">
              {insightMode === 'detail' ? scenario.detailTitle : scenario.actionTitle}
            </div>
            <p>{insightMode === 'detail' ? scenario.detailBody : scenario.actionBody}</p>
          </div>
        ) : null}

        {active && proposalOpen ? (
          <ProposalPanel
            activeAccount={activeAccount}
            onAddProposalComment={onAddProposalComment}
            onExportProposal={onExportProposal}
            onQueueProposal={onQueueProposal}
            onToggleChecklist={onToggleChecklist}
            onTradeChange={onTradeChange}
            proposal={proposal}
            proposalDraft={proposalDraft}
            proposalStage={proposalStage}
          />
        ) : null}
      </article>
    </div>
  )
}

function ProposalPanel({
  activeAccount,
  onAddProposalComment,
  onExportProposal,
  onQueueProposal,
  onToggleChecklist,
  onTradeChange,
  proposal,
  proposalDraft,
  proposalStage,
}: {
  activeAccount: AccountProfile
  onAddProposalComment: (comment: string) => void
  onExportProposal: () => void
  onQueueProposal: () => void
  onToggleChecklist: (checklistId: string) => void
  onTradeChange: (
    tradeId: string,
    patch: Partial<Pick<ProposalTradeState, 'included' | 'owner' | 'comment' | 'status'>>,
  ) => void
  proposal: ProposalWorkflow
  proposalDraft: ProposalDraftState
  proposalStage: ProposalStage
}) {
  const [commentDraft, setCommentDraft] = useState('')
  const filteredTrades = proposalDraft.trades.filter((trade) => trade.accountId === activeAccount.id)

  return (
    <section className="proposal-panel">
      <div className="proposal-panel__header">
        <div>
          <div className="section-kicker">Execution workflow</div>
          <h3>{proposal.title}</h3>
        </div>
        <div className="workflow-pill">{proposalStageLabel(proposalStage)}</div>
      </div>

      <p className="proposal-panel__summary">{proposal.summary}</p>

      <div className="proposal-grid">
        <div className="proposal-block">
          <div className="section-kicker">Impacted accounts</div>
          <div className="proposal-list">
            {proposal.accounts.map((account) => (
              <div className="proposal-item" key={account.name}>
                <div className="proposal-item__title">{account.name}</div>
                <div className="proposal-item__meta">{account.mandate}</div>
                <p>{account.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="proposal-block">
          <div className="section-kicker">Trade basket | {activeAccount.name}</div>
          <div className="proposal-list">
            {(filteredTrades.length ? filteredTrades : proposalDraft.trades).map((trade) => (
              <div className="proposal-item" key={trade.id}>
                <div className="proposal-item__split">
                  <div className="proposal-item__title">
                    {trade.action} {trade.ticker}
                  </div>
                  <span className="proposal-item__shift">{trade.shift}</span>
                </div>
                <div className="proposal-item__meta">
                  {trade.name} | {trade.notional}
                </div>
                <p>{trade.note}</p>
                <div className="proposal-trade-controls">
                  <button
                    className={clsx('mini-toggle', trade.included && 'is-active')}
                    onClick={() => onTradeChange(trade.id, { included: !trade.included })}
                    type="button"
                  >
                    {trade.included ? 'Included' : 'Excluded'}
                  </button>
                  <button
                    className="mini-toggle"
                    onClick={() =>
                      onTradeChange(trade.id, {
                        status:
                          trade.status === 'draft'
                            ? 'review'
                            : trade.status === 'review'
                              ? 'approved'
                              : 'draft',
                      })
                    }
                    type="button"
                  >
                    {trade.status}
                  </button>
                  <button
                    className="mini-toggle"
                    onClick={() =>
                      onTradeChange(trade.id, {
                        owner: trade.owner === 'Trader' ? 'Portfolio manager' : 'Trader',
                      })
                    }
                    type="button"
                  >
                    {trade.owner}
                  </button>
                </div>
                <input
                  className="proposal-input"
                  onChange={(event) => onTradeChange(trade.id, { comment: event.target.value })}
                  placeholder="Add trade note"
                  type="text"
                  value={trade.comment}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="proposal-grid proposal-grid--tight">
        <div className="proposal-block">
          <div className="section-kicker">Workflow checks</div>
          <div className="proposal-list">
            {proposalDraft.checklist.map((item) => (
              <button
                className={clsx('proposal-item', 'proposal-item--compact', item.complete && 'is-complete')}
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                type="button"
              >
                <div className="proposal-item__split">
                  <p>{item.label}</p>
                  <span className="proposal-item__shift">{item.owner}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="proposal-block">
          <div className="section-kicker">Approval path</div>
          <div className="approval-path">
            {proposal.approvalPath.map((step) => (
              <span className="approval-step" key={step}>
                {step}
              </span>
            ))}
          </div>
          <div className="proposal-audit">{proposal.auditNote}</div>
          <div className="proposal-comment-box">
            <input
              className="proposal-input"
              onChange={(event) => setCommentDraft(event.target.value)}
              placeholder="Add reviewer comment"
              type="text"
              value={commentDraft}
            />
            <button
              className="secondary-button"
              onClick={() => {
                if (!commentDraft.trim()) {
                  return
                }
                onAddProposalComment(commentDraft)
                setCommentDraft('')
              }}
              type="button"
            >
              Add comment
            </button>
          </div>
          {proposalDraft.comments.length ? (
            <div className="proposal-comment-list">
              {proposalDraft.comments.map((comment) => (
                <div className="document-highlight" key={comment}>
                  {comment}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="holding-actions">
        <button className="secondary-button" onClick={onExportProposal} type="button">
          {proposal.exportLabel}
        </button>
        <button className="primary-button" onClick={onQueueProposal} type="button">
          {proposal.approveLabel}
        </button>
      </div>
    </section>
  )
}

export default function AuraDemoApp() {
  const [workspace, setWorkspace] = useState<AuraWorkspaceState>(() => getInitialWorkspaceState())
  const [composerValue, setComposerValue] = useState('')
  const [insightMode, setInsightMode] = useState<InsightMode>(null)
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [proposalOpen, setProposalOpen] = useState(() => getInitialProposalOpen())
  const [portfolioRailOpen, setPortfolioRailOpen] = useState(false)
  const [marketRailOpen, setMarketRailOpen] = useState(false)
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)

  const conversationBottomRef = useRef<HTMLDivElement | null>(null)
  const workspaceRef = useRef(workspace)

  const activeThreadId = workspace.activeThreadId
  const activeMarketId = workspace.activeMarketId
  const notifications = workspace.notifications
  const threadWorkspace = workspace.threadStateById[activeThreadId]
  const activeScenarioId = threadWorkspace.activeScenarioId
  const activeAnalysisId = threadWorkspace.activeAnalysisId
  const proposalStage = threadWorkspace.proposalStage
  const advisorQueued = threadWorkspace.advisorQueued
  const activeMessages = threadWorkspace.conversation
  const activeDocuments = threadWorkspace.documents
  const proposalDraft = threadWorkspace.proposalDraftByScenarioId[activeScenarioId] as ProposalDraftState

  const activeThread = useMemo(() => threadById[activeThreadId], [activeThreadId])
  const threadFeature = useMemo(() => threadFeatureById[activeThreadId], [activeThreadId])
  const accountsById = useMemo(
    () =>
      Object.fromEntries(threadFeature.accounts.map((account) => [account.id, account])) as Record<
        string,
        AccountProfile
      >,
    [threadFeature],
  )
  const activeAccount =
    accountsById[threadWorkspace.activeAccountId] ?? accountsById[threadFeature.defaultAccountId] ?? threadFeature.accounts[0]
  const activeScenario = useMemo(() => scenarioById[activeScenarioId], [activeScenarioId])
  const activeMarket = useMemo(() => marketById[activeMarketId], [activeMarketId])
  const resolvedActiveDocumentId =
    activeDocumentId && activeDocuments.some((document) => document.id === activeDocumentId)
      ? activeDocumentId
      : activeDocuments[0]?.id ?? null
  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read && !notification.archived),
    [notifications],
  )
  const visibleNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (notification.archived) {
        return false
      }

      if (notificationFilter === 'unread') {
        return !notification.read
      }

      if (notificationFilter === 'workflow') {
        return notification.target === 'proposal' || notification.target === 'thread'
      }

      if (notificationFilter === 'documents') {
        return notification.target === 'document'
      }

      return true
    })
  }, [notificationFilter, notifications])
  const pinnedLabels = useMemo(
    () =>
      threadWorkspace.pinnedAnalysisIds
        .map((analysisId) =>
          activeMessages.find((message) => message.id === analysisId && message.scenarioId)?.scenarioId,
        )
        .filter((scenarioId): scenarioId is ScenarioId => Boolean(scenarioId))
        .map((scenarioId) => scenarioById[scenarioId].label),
    [activeMessages, threadWorkspace.pinnedAnalysisIds],
  )
  const compareLabels = useMemo(
    () =>
      threadWorkspace.compareAnalysisIds
        .map((analysisId) =>
          activeMessages.find((message) => message.id === analysisId && message.scenarioId)?.scenarioId,
        )
        .filter((scenarioId): scenarioId is ScenarioId => Boolean(scenarioId))
        .map((scenarioId) => scenarioById[scenarioId].label),
    [activeMessages, threadWorkspace.compareAnalysisIds],
  )

  useEffect(() => {
    conversationBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [activeMessages.length, activeThreadId, proposalOpen])

  useEffect(() => {
    workspaceRef.current = workspace
  }, [workspace])

  async function runWorkspaceMutation(
    mutate: (current: AuraWorkspaceState) => Promise<AuraWorkspaceState>,
  ) {
    const nextWorkspace = await mutate(workspaceRef.current)

    startTransition(() => {
      setWorkspace(nextWorkspace)
    })

    return nextWorkspace
  }

  function appendScenarioExchange(threadId: string, nextScenarioId: ScenarioId, promptText: string) {
    setComposerValue('')
    setInsightMode(null)
    setProposalOpen(false)
    setNotificationsOpen(false)
    void runWorkspaceMutation((current) =>
      submitPromptToWorkspace(current, threadId, promptText, nextScenarioId),
    )
  }

  function handleSelectThread(thread: ChatThread) {
    const nextThreadState = workspace.threadStateById[thread.id]

    setComposerValue('')
    setInsightMode(null)
    setProposalOpen(nextThreadState.proposalStage !== 'draft')
    setNotificationsOpen(false)
    setPortfolioRailOpen(false)
    setMarketRailOpen(false)
    void runWorkspaceMutation((current) => selectActiveThread(current, thread.id))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextPrompt = composerValue.trim()
    if (!nextPrompt) {
      return
    }

    appendScenarioExchange(activeThreadId, matchScenarioFromPrompt(nextPrompt), nextPrompt)
  }

  function handleQuickPrompt(nextScenarioId: ScenarioId) {
    appendScenarioExchange(activeThreadId, nextScenarioId, scenarioById[nextScenarioId].userPrompt)
  }

  function handleFollowUp(followUp: FollowUpPrompt) {
    appendScenarioExchange(activeThreadId, followUp.scenarioId, followUp.prompt)
  }

  function handleNewSession() {
    setComposerValue('')
    setInsightMode(null)
    setProposalOpen(false)
    setNotificationsOpen(false)
    void runWorkspaceMutation((current) => resetThreadWorkspace(current, activeThread.id))
  }

  function handlePrimaryAction(scenarioId: ScenarioId) {
    setInsightMode('action')
    setProposalOpen(true)
    void (async () => {
      await runWorkspaceMutation((current) => focusThreadScenario(current, activeThreadId, scenarioId))
      await runWorkspaceMutation((current) => ensureProposalReady(current, activeThreadId))
    })()
  }

  function handleSecondaryAction(scenarioId: ScenarioId) {
    setInsightMode('detail')
    setProposalOpen(false)
    void runWorkspaceMutation((current) => focusThreadScenario(current, activeThreadId, scenarioId))
  }

  function handleExportProposal(scenarioId: ScenarioId) {
    setProposalOpen(true)
    void (async () => {
      await runWorkspaceMutation((current) => focusThreadScenario(current, activeThreadId, scenarioId))
      await runWorkspaceMutation((current) => exportProposalMemo(current, activeThreadId, scenarioId))
    })()
  }

  function handleQueueProposal(scenarioId: ScenarioId) {
    setProposalOpen(true)
    void (async () => {
      await runWorkspaceMutation((current) => focusThreadScenario(current, activeThreadId, scenarioId))
      await runWorkspaceMutation((current) => queueProposalReview(current, activeThreadId, scenarioId))
    })()
  }

  function handleToggleAdvisorQueue() {
    if (!advisorQueued) {
      setProposalOpen(true)
    }

    void runWorkspaceMutation((current) =>
      toggleAdvisorQueue(current, activeThreadId, activeScenarioId),
    )
  }

  function handleAttachment() {
    void (async () => {
      const nextWorkspace = await runWorkspaceMutation((current) =>
        addDocumentToWorkspace(
          current,
          activeThreadId,
          {
            kind: 'statement',
            title: `${activeAccount.name} custody statement`,
            source: 'Schwab secure upload',
            status: 'parsed',
            uploadedAt: 'Just now',
            accountIds: [activeAccount.id],
            scenarioIds: [activeScenarioId],
            highlights: [
              `${activeAccount.name} cash reserve reconciled at ${activeAccount.cashReserve}.`,
              `Largest current weight remains ${activeAccount.holdings[0]?.ticker ?? 'core sleeve'} pending advisor review.`,
              `Tax-lot and restriction checks were refreshed for ${activeScenario.label.toLowerCase()} analysis.`,
            ],
            excerpt: `Aura parsed a fresh statement for ${activeAccount.name} and linked the extracted balances to this thread.`,
          },
          `Aura attached a custody statement for ${activeAccount.name} and linked the extracted balances to the ${activeScenario.label.toLowerCase()} workflow.`,
        ),
      )

      startTransition(() => {
        setActiveDocumentId(nextWorkspace.threadStateById[activeThreadId].documents[0]?.id ?? null)
      })
    })()
  }

  function handleVoicePrompt() {
    setComposerValue(scenarioById.risk.userPrompt)
    void (async () => {
      const nextWorkspace = await runWorkspaceMutation((current) =>
        addDocumentToWorkspace(
          current,
          activeThreadId,
          {
            kind: 'transcript',
            title: `Advisor voice transcript | ${activeThread.household}`,
            source: 'Advisor mobile capture',
            status: 'parsed',
            uploadedAt: 'Just now',
            accountIds: [activeAccount.id],
            scenarioIds: ['risk'],
            highlights: [
              'Reduce risk without going fully defensive.',
              'Preserve liquidity for near-term distributions.',
              'Keep the solution inside the household US-only mandate.',
            ],
            excerpt:
              'Aura transcribed a voice note requesting a softer risk profile while maintaining upside participation.',
          },
          'Aura transcribed the latest voice note and staged a risk-focused follow-up in the composer.',
        ),
      )

      startTransition(() => {
        setActiveDocumentId(nextWorkspace.threadStateById[activeThreadId].documents[0]?.id ?? null)
      })
    })()
  }

  function handleGenerateSummary() {
    void runWorkspaceMutation((current) => generateThreadSummary(current, activeThreadId))
  }

  function handleTogglePin(analysisId: string) {
    void runWorkspaceMutation((current) => togglePinnedAnalysis(current, activeThreadId, analysisId))
  }

  function handleToggleCompare(analysisId: string) {
    void runWorkspaceMutation((current) => toggleComparedAnalysis(current, activeThreadId, analysisId))
  }

  function handleToggleChecklist(checklistId: string, scenarioId: ScenarioId) {
    void runWorkspaceMutation((current) =>
      toggleProposalChecklistItem(current, activeThreadId, scenarioId, checklistId),
    )
  }

  function handleTradeChange(
    tradeId: string,
    patch: Partial<Pick<ProposalTradeState, 'included' | 'owner' | 'comment' | 'status'>>,
    scenarioId: ScenarioId,
  ) {
    void runWorkspaceMutation((current) =>
      updateProposalTrade(current, activeThreadId, scenarioId, tradeId, patch),
    )
  }

  function handleAddProposalReviewComment(comment: string, scenarioId: ScenarioId) {
    void runWorkspaceMutation((current) => addProposalComment(current, activeThreadId, scenarioId, comment))
  }

  function handleOpenDocument(documentId: string) {
    const document = activeDocuments.find((item) => item.id === documentId)

    void (async () => {
      if (document?.scenarioIds[0]) {
        await runWorkspaceMutation((current) =>
          focusThreadScenario(current, activeThreadId, document.scenarioIds[0]),
        )
      }

      await runWorkspaceMutation((current) => markDocumentRead(current, activeThreadId, documentId))
      startTransition(() => {
        setActiveDocumentId(documentId)
      })
    })()
  }

  function handleNotificationOpen(notification: NotificationItem) {
    const targetThreadId = notification.threadId ?? activeThreadId

    void (async () => {
      await runWorkspaceMutation((current) => markNotificationRead(current, notification.id))

      if (notification.threadId) {
        await runWorkspaceMutation((current) =>
          focusThreadScenario(current, notification.threadId!, notification.scenarioId),
        )
      }

      if (notification.documentId) {
        await runWorkspaceMutation((current) =>
          markDocumentRead(current, targetThreadId, notification.documentId!),
        )
        startTransition(() => {
          setActiveDocumentId(notification.documentId!)
        })
      }

      setProposalOpen(notification.target === 'proposal')
      setNotificationsOpen(false)
      setPortfolioRailOpen(false)
      setMarketRailOpen(false)
    })()
  }

  function handleArchiveNotification(notificationId: string) {
    void runWorkspaceMutation((current) => archiveNotification(current, notificationId))
  }

  return (
    <div className="aura-app">
      <div
        aria-hidden="true"
        className={clsx('mobile-overlay', (portfolioRailOpen || marketRailOpen) && 'is-visible')}
        onClick={() => {
          setPortfolioRailOpen(false)
          setMarketRailOpen(false)
        }}
      />

      <aside className={clsx('aura-rail aura-rail--left', portfolioRailOpen && 'is-open')}>
        <div className="mobile-rail-topbar">
          <span>Portfolio</span>
          <button onClick={() => setPortfolioRailOpen(false)} type="button">
            <X size={18} />
          </button>
        </div>
        <PortfolioRail
          activeScenarioId={activeScenarioId}
          activeAccountId={threadWorkspace.activeAccountId}
          activeThread={activeThread}
          activeThreadId={activeThreadId}
          onNewSession={handleNewSession}
          onSelectAccount={(accountId) => {
            void runWorkspaceMutation((current) => selectActiveAccount(current, activeThreadId, accountId))
          }}
          onSelectThread={handleSelectThread}
        />
      </aside>

      <main className="aura-main">
        <header className="top-shell">
          <div className="mobile-rail-actions">
            <button
              className="mobile-rail-button"
              onClick={() => setPortfolioRailOpen(true)}
              type="button"
            >
              <LayoutGrid size={16} />
              Portfolio
            </button>
          </div>

          <div className="brand-shell">
            <div className="brand-shell__mark">
              <Sparkles size={22} />
              <span className="brand-shell__status-dot" />
            </div>
            <div>
              <h1>Aura AI</h1>
              <div className="brand-shell__status">
                <span>Active</span>
                <span className="brand-shell__divider" />
                <span>Demo backend synced {workspace.lastSyncedAt}</span>
              </div>
            </div>
          </div>

          <div className="top-shell__actions">
            <button
              className={clsx('advisor-button', advisorQueued && 'is-active')}
              onClick={handleToggleAdvisorQueue}
              type="button"
            >
              <ShieldAlert size={16} />
              {advisorQueued ? 'Advisor Queued' : 'Escalate to Advisor'}
            </button>

            <div className="notification-shell">
              <button
                aria-label="Notifications"
                className={clsx('icon-button', notificationsOpen && 'is-active')}
                onClick={() => setNotificationsOpen((current) => !current)}
                type="button"
              >
                <Bell size={18} />
                <span className="icon-badge">{unreadNotifications.length}</span>
              </button>

              {notificationsOpen ? (
                <div className="notification-popover">
                  <div className="notification-popover__header">
                    <div>
                      <div className="section-kicker">Workflow activity</div>
                      <div className="goal-row__meta">{unreadNotifications.length} unread</div>
                    </div>
                    <button onClick={() => setNotificationsOpen(false)} type="button">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="notification-filter-row">
                    {(['all', 'unread', 'workflow', 'documents'] as NotificationFilter[]).map((filter) => (
                      <button
                        className={clsx('mini-toggle', notificationFilter === filter && 'is-active')}
                        key={filter}
                        onClick={() => setNotificationFilter(filter)}
                        type="button"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="notification-list">
                    {visibleNotifications.length ? (
                      visibleNotifications.map((notification) => (
                        <div
                          className={clsx('notification-item', !notification.read && 'is-unread')}
                          key={notification.id}
                        >
                          <div className={clsx('notification-item__icon', toneClass(notification.tone))}>
                            <ToneIcon tone={notification.tone} />
                          </div>
                          <div className="notification-item__copy">
                            <div className="notification-item__title">{notification.title}</div>
                            <p>{notification.body}</p>
                            <span>{notification.time}</span>
                          </div>
                          <div className="notification-item__actions">
                            <button
                              className="mini-toggle"
                              onClick={() => handleNotificationOpen(notification)}
                              type="button"
                            >
                              Open
                            </button>
                            <button
                              className="mini-toggle"
                              onClick={() => handleArchiveNotification(notification.id)}
                              type="button"
                            >
                              Archive
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="notification-empty">No notifications match this filter.</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              className="mobile-rail-button mobile-rail-button--markets"
              onClick={() => setMarketRailOpen(true)}
              type="button"
            >
              <Activity size={16} />
              Markets
            </button>
          </div>
        </header>

        {advisorQueued ? (
          <div className="advisor-banner">
            <ShieldAlert size={16} />
            Aura queued a human review with the active scenario, proposed trade basket, and source-backed assumptions.
          </div>
        ) : null}

        <section className="chat-scroll">
          <div className="welcome-block">
            <div className="welcome-copy">
              <h2>{activeThread.greeting}</h2>
              <p>{activeThread.summary}</p>
              <p className="welcome-copy__brief">{threadFeature.householdBrief}</p>
            </div>

            <div className="prompt-strip">
              {quickPromptOrder.map((scenarioId) => {
                const scenario = scenarioById[scenarioId]
                return (
                  <button
                    className={clsx('prompt-chip', activeScenarioId === scenario.id && 'is-active')}
                    key={scenario.id}
                    onClick={() => handleQuickPrompt(scenario.id)}
                    type="button"
                  >
                    {scenario.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="workspace-stack">
            <WorkspaceSummary
              compareLabels={compareLabels}
              onGenerateSummary={handleGenerateSummary}
              pinnedLabels={pinnedLabels}
              summary={threadWorkspace.summaryCard}
            />
            <AccountLens account={activeAccount} key={activeAccount.id} />
            <DocumentHub
              accountsById={accountsById}
              activeDocumentId={resolvedActiveDocumentId}
              documents={activeDocuments}
              onOpenDocument={handleOpenDocument}
            />
          </div>

          <div className="conversation-stack">
            {activeMessages.map((message) => {
              const scenario = message.scenarioId ? scenarioById[message.scenarioId] : null

              if (message.role === 'user') {
                return (
                  <div className="message-row message-row--user" key={message.id}>
                    <div className="message-content message-content--user">
                      <div className="message-meta">{message.createdAt}</div>
                      <div className="message-bubble message-bubble--user">{message.text}</div>
                    </div>
                    <UserAvatar />
                  </div>
                )
              }

              return (
                <div className="message-row" key={message.id}>
                  <AssistantAvatar />
                  <div className="message-content">
                    <div className="message-meta">{message.createdAt}</div>
                    {message.variant === 'analysis' && scenario ? (
                      <ScenarioResponse
                        active={message.id === activeAnalysisId}
                        activeAccount={activeAccount}
                        activeMarket={activeMarket}
                        compared={threadWorkspace.compareAnalysisIds.includes(message.id)}
                        enhancement={scenarioEnhancementById[scenario.id]}
                        insightMode={insightMode}
                        onAddProposalComment={(comment) => handleAddProposalReviewComment(comment, scenario.id)}
                        onExportProposal={() => handleExportProposal(scenario.id)}
                        onFollowUp={handleFollowUp}
                        onPrimaryAction={() => handlePrimaryAction(scenario.id)}
                        onQueueProposal={() => handleQueueProposal(scenario.id)}
                        onSecondaryAction={() => handleSecondaryAction(scenario.id)}
                        onToggleChecklist={(checklistId) => handleToggleChecklist(checklistId, scenario.id)}
                        onToggleCompare={() => handleToggleCompare(message.id)}
                        onTogglePin={() => handleTogglePin(message.id)}
                        onTradeChange={(tradeId, patch) => handleTradeChange(tradeId, patch, scenario.id)}
                        pinned={threadWorkspace.pinnedAnalysisIds.includes(message.id)}
                        proposalDraft={
                          (threadWorkspace.proposalDraftByScenarioId[scenario.id] as ProposalDraftState) ?? proposalDraft
                        }
                        proposalOpen={proposalOpen}
                        proposalStage={proposalStage}
                        scenario={scenario}
                      />
                    ) : (
                      <div className="message-bubble message-bubble--assistant">{message.text}</div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={conversationBottomRef} />
          </div>
        </section>

        <form className="composer-shell" onSubmit={handleSubmit}>
          <div className="composer">
            <button className="composer-icon" onClick={handleAttachment} type="button" aria-label="Attach portfolio file">
              <Paperclip size={18} />
            </button>

            <input
              aria-label="Ask Aura"
              onChange={(event) => setComposerValue(event.target.value)}
              placeholder="Ask Aura anything about this US household..."
              type="text"
              value={composerValue}
            />

            <div className="composer__actions">
              <button className="composer-icon" onClick={handleVoicePrompt} type="button" aria-label="Use voice input">
                <Mic size={18} />
              </button>
              <button className="composer-send" type="submit" aria-label="Send message">
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="composer-note">
            Source-backed demo for US markets only. Review tax and suitability assumptions before trading.
          </div>
        </form>
      </main>

      <aside className={clsx('aura-rail aura-rail--right', marketRailOpen && 'is-open')}>
        <div className="mobile-rail-topbar">
          <span>Markets</span>
          <button onClick={() => setMarketRailOpen(false)} type="button">
            <X size={18} />
          </button>
        </div>
        <MarketRail
          activeMarket={activeMarket}
          activeScenario={activeScenario}
          onSelectMarket={(marketId) => {
            void runWorkspaceMutation((current) => selectActiveMarket(current, marketId))
            setMarketRailOpen(false)
          }}
        />
      </aside>
    </div>
  )
}

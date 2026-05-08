export type Tone = 'positive' | 'negative' | 'neutral'

export type ScenarioId =
  | 'performance'
  | 'diversification'
  | 'tax'
  | 'liquidity'
  | 'risk'
  | 'sectors'

export type MarketId = 'sp500' | 'nasdaq' | 'ust10y'

export type AllocationSegmentTone = 'primary' | 'secondary' | 'tertiary'

export interface AllocationSegment {
  label: string
  share: number
  tone: AllocationSegmentTone
}

export interface SeriesPoint {
  label: string
  value: number
}

export interface ScenarioItem {
  ticker: string
  name: string
  meta: string
  value: string
  change: string
  tone: Tone
}

export interface SourceNote {
  label: string
  detail: string
}

export interface FollowUpPrompt {
  label: string
  prompt: string
  scenarioId: ScenarioId
}

export interface ProposalAccount {
  name: string
  mandate: string
  impact: string
}

export interface ProposalTrade {
  action: string
  ticker: string
  name: string
  shift: string
  notional: string
  note: string
}

export interface ProposalWorkflow {
  title: string
  summary: string
  accounts: ProposalAccount[]
  trades: ProposalTrade[]
  checklist: string[]
  approvalPath: string[]
  exportLabel: string
  approveLabel: string
  auditNote: string
}

export interface Scenario {
  id: ScenarioId
  label: string
  userPrompt: string
  leadText: string
  responseText: string
  metricLabel: string
  metricValue: string
  metricDelta: string
  period: string
  series: SeriesPoint[]
  healthScore: number
  listTitle: string
  items: ScenarioItem[]
  secondaryAction: string
  primaryAction: string
  detailTitle: string
  detailBody: string
  actionTitle: string
  actionBody: string
  confidenceLabel: string
  asOf: string
  complianceNote: string
  marketTakeaway: string
  sources: SourceNote[]
  followUps: FollowUpPrompt[]
  proposal: ProposalWorkflow
}

export interface MarketCard {
  id: MarketId
  label: string
  value: string
  change: string
  tone: Tone
  points: number[]
  note: string
  portfolioEffect: string
}

export interface ChatThread {
  id: string
  title: string
  teaser: string
  greeting: string
  summary: string
  household: string
  objective: string
  riskBand: string
  accountScope: string
  portfolioValue: string
  dayChange: string
  defaultScenarioId: ScenarioId
  focusMarketId: MarketId
  allocation: AllocationSegment[]
  constraints: string[]
}

export const scenarios: Scenario[] = [
  {
    id: 'performance',
    label: 'Performance',
    userPrompt:
      'Show me what is driving quarterly performance across the taxable and trust accounts.',
    leadText:
      'Aura has stitched together account-level P&L, benchmark drift, and realized gains across the family office.',
    responseText:
      'Quarter-to-date performance is being driven by large-cap technology and a modest duration tailwind in the trust. The taxable sleeve is still carrying two concentrated winners that explain most of the upside and most of the single-name risk.',
    metricLabel: 'Net Portfolio Return',
    metricValue: '+6.4%',
    metricDelta: '+180 bps vs policy',
    period: 'Quarter to date',
    series: [
      { label: 'Jan', value: 12.4 },
      { label: 'Feb', value: 12.9 },
      { label: 'Mar', value: 13.6 },
      { label: 'Apr', value: 14.2 },
      { label: 'May', value: 14.8 },
      { label: 'Jun', value: 15.1 },
    ],
    healthScore: 96,
    listTitle: 'Top contributors',
    items: [
      {
        ticker: 'MSFT',
        name: 'Microsoft',
        meta: 'Riverview Taxable | 7.8% weight',
        value: '$3.8M',
        change: '+11.2%',
        tone: 'positive',
      },
      {
        ticker: 'NVDA',
        name: 'NVIDIA',
        meta: 'Riverview Taxable | 6.5% weight',
        value: '$3.2M',
        change: '+18.4%',
        tone: 'positive',
      },
      {
        ticker: 'IEF',
        name: 'iShares 7-10Y Treasury',
        meta: 'Family Trust | ballast sleeve',
        value: '$1.4M',
        change: '+1.6%',
        tone: 'positive',
      },
    ],
    secondaryAction: 'See attribution notes',
    primaryAction: 'Draft rebalance basket',
    detailTitle: 'Attribution notes',
    detailBody:
      'Seventy-one percent of excess return came from three positions. Aura is flagging that the outperformance is concentrated enough that any trim decision should be paired with a benchmark and tax-awareness check.',
    actionTitle: 'Rebalance setup',
    actionBody:
      'Aura can prepare a draft trade basket that trims concentrated technology exposure, tops up short-duration Treasuries, and keeps realized gains inside the household tax budget.',
    confidenceLabel: '92% confidence',
    asOf: 'Updated 8:42 AM ET',
    complianceNote:
      'Assumes no restricted list changes and uses current household gain budget of $420K for the quarter.',
    marketTakeaway:
      'Equity beta remains the key return driver. If the Nasdaq fades, this household will feel it faster than policy targets imply.',
    sources: [
      {
        label: 'Custodian feed',
        detail: 'Schwab position and lot data refreshed pre-open.',
      },
      {
        label: 'Benchmark model',
        detail: '60/25/10/5 household policy blend from IPS rev. 2026-01.',
      },
      {
        label: 'Tax engine',
        detail: 'Realized and projected capital gains through April 7.',
      },
    ],
    followUps: [
      {
        label: 'Compare to policy benchmark',
        prompt: 'Compare this quarter performance to the household policy benchmark.',
        scenarioId: 'performance',
      },
      {
        label: 'Show concentration risk',
        prompt: 'How concentrated is the portfolio after the recent technology rally?',
        scenarioId: 'diversification',
      },
      {
        label: 'Check tax budget',
        prompt: 'Can we trim without breaching the household tax budget this quarter?',
        scenarioId: 'tax',
      },
    ],
    proposal: {
      title: 'Technology trim with Treasury refill',
      summary:
        'Reduce two oversized winners and redirect proceeds into short-duration Treasuries plus an equal-weight quality sleeve.',
      accounts: [
        {
          name: 'Riverview Taxable',
          mandate: 'Tax-aware growth',
          impact: '$510K of net sales, realized gains within quarterly budget.',
        },
        {
          name: 'Family Trust',
          mandate: 'Capital preservation ballast',
          impact: '$250K added to Treasuries to rebuild downside buffer.',
        },
      ],
      trades: [
        {
          action: 'Trim',
          ticker: 'NVDA',
          name: 'NVIDIA',
          shift: '-110 bps',
          notional: '$320K',
          note: 'Reduces single-name drift and harvests only long-term gains.',
        },
        {
          action: 'Trim',
          ticker: 'MSFT',
          name: 'Microsoft',
          shift: '-75 bps',
          notional: '$190K',
          note: 'Keeps exposure above benchmark while freeing cash for re-risking elsewhere.',
        },
        {
          action: 'Add',
          ticker: 'SGOV',
          name: 'iShares 0-3M Treasury',
          shift: '+95 bps',
          notional: '$350K',
          note: 'Raises liquidity for the summer distribution window.',
        },
        {
          action: 'Add',
          ticker: 'QUAL',
          name: 'iShares MSCI USA Quality',
          shift: '+55 bps',
          notional: '$160K',
          note: 'Keeps equity exposure invested with lower single-name risk.',
        },
      ],
      checklist: [
        'Confirm no blackout restrictions on NVDA or MSFT.',
        'Validate realized gain estimate against live lots before release.',
        'Route trust sleeve trade through the conservative model overlay.',
      ],
      approvalPath: ['Aura draft', 'Advisor review', 'Client approval', 'Trading desk'],
      exportLabel: 'Export IC memo',
      approveLabel: 'Queue for advisor review',
      auditNote:
        'Trade rationale anchored to IPS concentration guardrail of 8% max single-name exposure and the quarterly gain budget.',
    },
  },
  {
    id: 'diversification',
    label: 'Diversification',
    userPrompt: 'Where is the portfolio too concentrated right now?',
    leadText:
      'Aura has mapped exposures by issuer, sector, strategy, and account so you can see where concentration is clustering.',
    responseText:
      'Single-name concentration is the primary watch item. Technology and communication services together are running 620 bps above policy, and the taxable account holds the majority of that active risk.',
    metricLabel: 'Single-name concentration',
    metricValue: '14.3%',
    metricDelta: '+430 bps above guardrail',
    period: 'Current allocation',
    series: [
      { label: 'Jan', value: 9 },
      { label: 'Feb', value: 10 },
      { label: 'Mar', value: 11 },
      { label: 'Apr', value: 12 },
      { label: 'May', value: 13 },
      { label: 'Jun', value: 14.3 },
    ],
    healthScore: 91,
    listTitle: 'Concentration hotspots',
    items: [
      {
        ticker: 'TECH',
        name: 'Technology sector',
        meta: 'Household aggregate exposure',
        value: '31%',
        change: '+6% vs policy',
        tone: 'negative',
      },
      {
        ticker: 'NVDA',
        name: 'NVIDIA',
        meta: 'Largest single-name active weight',
        value: '6.5%',
        change: '+2.1% drift',
        tone: 'negative',
      },
      {
        ticker: 'META',
        name: 'Meta Platforms',
        meta: 'Taxable plus donor-advised fund overlap',
        value: '4.2%',
        change: '+0.9% drift',
        tone: 'neutral',
      },
    ],
    secondaryAction: 'Show overlap map',
    primaryAction: 'Build de-risking plan',
    detailTitle: 'Overlap map',
    detailBody:
      'Concentration is not only at the issuer level. The household owns similar growth factors through direct equities, an innovation ETF, and a private growth fund marked quarterly.',
    actionTitle: 'De-risking plan',
    actionBody:
      'Aura can assemble a risk-aware de-risking plan that preserves upside participation, reduces correlated growth exposure, and keeps liquidity ready for client distributions.',
    confidenceLabel: '89% confidence',
    asOf: 'Updated 8:45 AM ET',
    complianceNote:
      'Private fund exposures are marked using last quarter statements and may overstate diversification if public comps move sharply.',
    marketTakeaway:
      'The portfolio will track the Nasdaq more closely than the household benchmark until large-cap growth exposure is trimmed.',
    sources: [
      {
        label: 'Exposure graph',
        detail: 'Cross-account overlap model with look-through ETF holdings.',
      },
      {
        label: 'Private assets',
        detail: 'Last GP capital account statements loaded March 31.',
      },
      {
        label: 'Risk policy',
        detail: 'Single-name soft guardrail 10%, hard guardrail 12%.',
      },
    ],
    followUps: [
      {
        label: 'See sector tilts',
        prompt: 'Break down the sector tilts contributing to concentration.',
        scenarioId: 'sectors',
      },
      {
        label: 'Draft a risk reduction plan',
        prompt: 'Draft a de-risking plan that still keeps us invested in quality US equities.',
        scenarioId: 'risk',
      },
      {
        label: 'Check liquidity impact',
        prompt: 'Would a de-risking move improve near-term liquidity for distributions?',
        scenarioId: 'liquidity',
      },
    ],
    proposal: {
      title: 'Diversification plan',
      summary:
        'Reduce correlated growth exposure and widen equity participation through quality and dividend-focused US sleeves.',
      accounts: [
        {
          name: 'Riverview Taxable',
          mandate: 'Tax-aware growth',
          impact: 'Primary source of concentrated public equity exposure.',
        },
        {
          name: 'Donor Advised Fund',
          mandate: 'Long-horizon charitable pool',
          impact: 'Opportunity to offset direct technology concentration with diversified equity beta.',
        },
      ],
      trades: [
        {
          action: 'Trim',
          ticker: 'META',
          name: 'Meta Platforms',
          shift: '-40 bps',
          notional: '$120K',
          note: 'Reduces communications overlap with existing growth sleeves.',
        },
        {
          action: 'Trim',
          ticker: 'VGT',
          name: 'Vanguard Information Technology ETF',
          shift: '-85 bps',
          notional: '$240K',
          note: 'Cuts duplicate exposure already expressed through direct holdings.',
        },
        {
          action: 'Add',
          ticker: 'DGRO',
          name: 'iShares Core Dividend Growth',
          shift: '+65 bps',
          notional: '$190K',
          note: 'Adds broader factor mix and durable free cash flow exposure.',
        },
        {
          action: 'Add',
          ticker: 'SCHD',
          name: 'Schwab US Dividend Equity ETF',
          shift: '+60 bps',
          notional: '$170K',
          note: 'Broadens sector exposure while preserving US-only mandate.',
        },
      ],
      checklist: [
        'Review overlap with private growth managers before final weights.',
        'Confirm DAF reallocation cadence with the charitable administrator.',
        'Keep post-trade equity beta within policy band.',
      ],
      approvalPath: ['Aura draft', 'PM review', 'Advisor review', 'Client approval'],
      exportLabel: 'Export overlap brief',
      approveLabel: 'Open PM review',
      auditNote:
        'Reallocation designed to reduce correlated growth factor exposure without taking the household below its 55% public equity floor.',
    },
  },
  {
    id: 'tax',
    label: 'Tax',
    userPrompt: 'Show me the cleanest tax moves available before month-end.',
    leadText:
      'Aura has scanned open lots, wash-sale windows, and the household gain budget for the current quarter.',
    responseText:
      'The cleanest move is to rotate out of two legacy losers in the taxable sleeve while preserving market exposure with close-but-not-substantially-identical US ETFs. That creates room for any performance trims we may want to execute later this quarter.',
    metricLabel: 'Harvestable loss',
    metricValue: '$286K',
    metricDelta: '+$94K vs last week',
    period: 'Available now',
    series: [
      { label: 'Jan', value: 120 },
      { label: 'Feb', value: 140 },
      { label: 'Mar', value: 165 },
      { label: 'Apr', value: 188 },
      { label: 'May', value: 233 },
      { label: 'Jun', value: 286 },
    ],
    healthScore: 94,
    listTitle: 'Harvest candidates',
    items: [
      {
        ticker: 'IWM',
        name: 'iShares Russell 2000 ETF',
        meta: 'Taxable lot opened 2025-11',
        value: '$420K',
        change: '-9.8%',
        tone: 'negative',
      },
      {
        ticker: 'ARKK',
        name: 'ARK Innovation ETF',
        meta: 'Legacy tactical sleeve',
        value: '$190K',
        change: '-21.4%',
        tone: 'negative',
      },
      {
        ticker: 'SCHB',
        name: 'Schwab US Broad Market ETF',
        meta: 'Replacement candidate',
        value: '$0',
        change: 'Wash-sale clean',
        tone: 'positive',
      },
    ],
    secondaryAction: 'Review lot detail',
    primaryAction: 'Assemble harvest trades',
    detailTitle: 'Lot detail',
    detailBody:
      'Two loss positions are outside all current wash-sale windows and can be rotated today. The proposed replacements keep US equity exposure intact while remaining distinct enough from the sold positions.',
    actionTitle: 'Harvest workflow',
    actionBody:
      'Aura can produce a tax-loss harvesting package with replacement ETFs, lot-specific tax estimates, and an approval memo for the advisor team.',
    confidenceLabel: '95% confidence',
    asOf: 'Updated 8:48 AM ET',
    complianceNote:
      'Wash-sale analysis assumes no spouse or controlled-entity purchases have occurred outside linked accounts.',
    marketTakeaway:
      'Tax flexibility is strongest while small caps and legacy innovation exposures remain below cost basis.',
    sources: [
      {
        label: 'Lot engine',
        detail: 'All taxable household lots and acquisition dates through April 7.',
      },
      {
        label: 'Wash-sale monitor',
        detail: 'Linked-account trade review across spouse and trust entities.',
      },
      {
        label: 'Tax policy',
        detail: 'Target to offset up to $350K of realized gains this quarter.',
      },
    ],
    followUps: [
      {
        label: 'Pair with performance trim',
        prompt: 'Pair the harvesting move with any performance trims we should make.',
        scenarioId: 'performance',
      },
      {
        label: 'Review liquidity effect',
        prompt: 'Does harvesting change our liquidity position for summer distributions?',
        scenarioId: 'liquidity',
      },
      {
        label: 'Check replacement exposures',
        prompt: 'Show the exposures of the replacement ETFs before we trade.',
        scenarioId: 'diversification',
      },
    ],
    proposal: {
      title: 'Tax-loss harvesting package',
      summary:
        'Realize losses in small-cap and innovation sleeves, then maintain US equity exposure with cleaner replacement ETFs.',
      accounts: [
        {
          name: 'Riverview Taxable',
          mandate: 'Tax-aware growth',
          impact: '$286K of projected harvested losses with no cash drag.',
        },
      ],
      trades: [
        {
          action: 'Sell',
          ticker: 'IWM',
          name: 'iShares Russell 2000 ETF',
          shift: '-115 bps',
          notional: '$420K',
          note: 'Harvests an estimated $44K loss.',
        },
        {
          action: 'Buy',
          ticker: 'VB',
          name: 'Vanguard Small-Cap ETF',
          shift: '+115 bps',
          notional: '$420K',
          note: 'Maintains small-cap exposure with a distinct index methodology.',
        },
        {
          action: 'Sell',
          ticker: 'ARKK',
          name: 'ARK Innovation ETF',
          shift: '-50 bps',
          notional: '$190K',
          note: 'Harvests an estimated $242K loss across legacy lots.',
        },
        {
          action: 'Buy',
          ticker: 'SCHB',
          name: 'Schwab US Broad Market ETF',
          shift: '+50 bps',
          notional: '$190K',
          note: 'Keeps market participation broad and wash-sale clean.',
        },
      ],
      checklist: [
        'Reconfirm external household accounts have no matching buys in the last 30 days.',
        'Validate lot-level tax estimates before release.',
        'Diary the wash-sale lockout for all replacement tickers.',
      ],
      approvalPath: ['Aura draft', 'Tax review', 'Advisor review', 'Trading desk'],
      exportLabel: 'Export tax packet',
      approveLabel: 'Queue tax review',
      auditNote:
        'Replacements selected to preserve beta while keeping wash-sale exposure low under current IRS guidance.',
    },
  },
  {
    id: 'liquidity',
    label: 'Liquidity',
    userPrompt: 'Do we have enough liquidity for the July distribution and tuition outflow?',
    leadText:
      'Aura has lined up the household cash ladder against known near-term outflows and settlement timing.',
    responseText:
      'Yes, but the margin is thinner than the client is used to. The next 60 days are covered at 1.4x after expected inflows, which is adequate but below the family office preference for a 1.8x cushion.',
    metricLabel: '60-day liquidity coverage',
    metricValue: '1.4x',
    metricDelta: '-0.3x vs target',
    period: 'Next 60 days',
    series: [
      { label: 'Apr', value: 2.1 },
      { label: 'May', value: 1.9 },
      { label: 'Jun', value: 1.7 },
      { label: 'Jul', value: 1.6 },
      { label: 'Aug', value: 1.5 },
      { label: 'Sep', value: 1.4 },
    ],
    healthScore: 93,
    listTitle: 'Near-term liquidity stack',
    items: [
      {
        ticker: 'CASH',
        name: 'Sweep and money market',
        meta: 'Across taxable and trust accounts',
        value: '$1.18M',
        change: 'Ready today',
        tone: 'positive',
      },
      {
        ticker: 'SGOV',
        name: '0-3M Treasuries',
        meta: 'Same-day or next-day liquidity',
        value: '$640K',
        change: 'Low friction',
        tone: 'positive',
      },
      {
        ticker: 'DIST',
        name: 'Known outflows',
        meta: 'July distribution + tuition',
        value: '$1.29M',
        change: 'Due in 6 weeks',
        tone: 'negative',
      },
    ],
    secondaryAction: 'Show cash ladder',
    primaryAction: 'Prepare liquidity sleeve',
    detailTitle: 'Cash ladder',
    detailBody:
      'Current cash plus short-duration Treasuries cover known outflows, but any additional capital call or charitable grant would require selling risk assets. A proactive liquidity top-up is prudent.',
    actionTitle: 'Liquidity sleeve',
    actionBody:
      'Aura can draft a liquidity sleeve recommendation that raises short-duration cash reserves without materially changing household return expectations.',
    confidenceLabel: '88% confidence',
    asOf: 'Updated 8:51 AM ET',
    complianceNote:
      'Private fund distributions are assumed to arrive on schedule; a delay would reduce the coverage ratio by roughly 0.2x.',
    marketTakeaway:
      'Short-duration Treasury yields make it cheaper to hold near-term liquidity than it was last year, so raising the buffer is less punitive.',
    sources: [
      {
        label: 'Cash ladder',
        detail: 'Known obligations from family office calendar through September.',
      },
      {
        label: 'Settlement model',
        detail: 'Assumes T+1 for listed securities and next-day treasury ETF liquidity.',
      },
      {
        label: 'IPS liquidity target',
        detail: '1.8x next-60-day obligations target.',
      },
    ],
    followUps: [
      {
        label: 'Raise liquidity from winners',
        prompt: 'If we need more liquidity, which winners should we trim first?',
        scenarioId: 'performance',
      },
      {
        label: 'Check risk impact',
        prompt: 'How much does the portfolio risk improve if we lift the liquidity sleeve?',
        scenarioId: 'risk',
      },
      {
        label: 'Review tax consequences',
        prompt: 'What are the tax consequences of raising that liquidity sleeve now?',
        scenarioId: 'tax',
      },
    ],
    proposal: {
      title: 'Liquidity sleeve top-up',
      summary:
        'Increase the near-term reserve from equity trims and move proceeds into Treasury bills so the July distribution clears with a wider cushion.',
      accounts: [
        {
          name: 'Family Trust',
          mandate: 'Distribution funding',
          impact: 'Adds $300K of same-week liquidity.',
        },
        {
          name: 'Riverview Taxable',
          mandate: 'Tax-aware growth',
          impact: 'Funds a portion of the top-up from long-term gain positions.',
        },
      ],
      trades: [
        {
          action: 'Trim',
          ticker: 'AAPL',
          name: 'Apple',
          shift: '-45 bps',
          notional: '$140K',
          note: 'Uses a mature long-term gain position to help fund upcoming outflows.',
        },
        {
          action: 'Trim',
          ticker: 'QQQ',
          name: 'Invesco QQQ',
          shift: '-50 bps',
          notional: '$160K',
          note: 'Reduces beta and increases cash flexibility ahead of July.',
        },
        {
          action: 'Add',
          ticker: 'SGOV',
          name: 'iShares 0-3M Treasury',
          shift: '+95 bps',
          notional: '$300K',
          note: 'Raises near-term liquidity with minimal duration risk.',
        },
      ],
      checklist: [
        'Confirm July distribution amount with the family office.',
        'Coordinate trust funding sequence with the custodian.',
        'Validate realized gain impact stays inside quarterly budget.',
      ],
      approvalPath: ['Aura draft', 'Advisor review', 'Operations', 'Trading desk'],
      exportLabel: 'Export liquidity memo',
      approveLabel: 'Send to operations',
      auditNote:
        'Top-up keeps the household above a 1.7x coverage ratio even if one expected private distribution slips by two weeks.',
    },
  },
  {
    id: 'risk',
    label: 'Risk',
    userPrompt: 'What is the cleanest way to take risk down a notch without going defensive?',
    leadText:
      'Aura has stress-tested the household across equity pullback, rate shock, and concentrated-gain scenarios.',
    responseText:
      'The cleanest path is to reduce the highest-beta overlap and recycle some of that capital into quality and Treasuries. That lowers downside participation without taking the household out of the market or breaking the US-only mandate.',
    metricLabel: 'Projected drawdown',
    metricValue: '-9.2%',
    metricDelta: '+130 bps vs target',
    period: 'Mild shock case',
    series: [
      { label: 'Stress 1', value: -5.2 },
      { label: 'Stress 2', value: -6.1 },
      { label: 'Stress 3', value: -7.4 },
      { label: 'Stress 4', value: -8.2 },
      { label: 'Stress 5', value: -8.8 },
      { label: 'Stress 6', value: -9.2 },
    ],
    healthScore: 90,
    listTitle: 'Risk reducers',
    items: [
      {
        ticker: 'QQQ',
        name: 'Nasdaq 100 ETF',
        meta: 'High beta overlap with direct tech names',
        value: '$710K',
        change: 'High beta',
        tone: 'negative',
      },
      {
        ticker: 'QUAL',
        name: 'MSCI USA Quality',
        meta: 'Candidate replacement sleeve',
        value: '$0',
        change: 'Lower beta',
        tone: 'positive',
      },
      {
        ticker: 'SHY',
        name: '1-3Y Treasury ETF',
        meta: 'Optional stabilizer',
        value: '$0',
        change: 'Low duration',
        tone: 'positive',
      },
    ],
    secondaryAction: 'Review stress test',
    primaryAction: 'Draft de-risking proposal',
    detailTitle: 'Stress test',
    detailBody:
      'The household drawdown now comes more from overlapping US growth beta than from pure market exposure. Small trims in QQQ and direct technology positions materially improve downside shape.',
    actionTitle: 'De-risking proposal',
    actionBody:
      'Aura can build a proposal that reduces peak drawdown, preserves liquidity, and keeps the portfolio aligned with the household return target.',
    confidenceLabel: '90% confidence',
    asOf: 'Updated 8:54 AM ET',
    complianceNote:
      'Stress tests use public-market proxies for private growth holdings and may understate dispersion risk in a sharper selloff.',
    marketTakeaway:
      'A softer growth tape or delayed Fed cuts would likely hit the current overlap more than the policy mix.',
    sources: [
      {
        label: 'Risk engine',
        detail: 'Multi-factor household stress model refreshed with April betas.',
      },
      {
        label: 'Policy targets',
        detail: 'Target max mild-shock drawdown of 8.0% for this mandate.',
      },
      {
        label: 'Correlations',
        detail: 'Look-through estimates for ETFs and private growth sleeve.',
      },
    ],
    followUps: [
      {
        label: 'Tie this to concentration',
        prompt: 'Show how the de-risking proposal also reduces concentration.',
        scenarioId: 'diversification',
      },
      {
        label: 'Fund from liquidity',
        prompt: 'Can we increase the liquidity sleeve as part of that risk reduction?',
        scenarioId: 'liquidity',
      },
      {
        label: 'Check after-tax version',
        prompt: 'What does the lower-risk version look like after tax constraints?',
        scenarioId: 'tax',
      },
    ],
    proposal: {
      title: 'Moderate de-risking proposal',
      summary:
        'Reduce overlapping high-beta US growth exposure while keeping the household invested in quality equities and short Treasuries.',
      accounts: [
        {
          name: 'Riverview Taxable',
          mandate: 'Tax-aware growth',
          impact: 'Supplies most of the de-risking capital with long-term gain lots only.',
        },
        {
          name: 'Family Trust',
          mandate: 'Capital preservation ballast',
          impact: 'Adds a stabilizer sleeve to improve downside resilience.',
        },
      ],
      trades: [
        {
          action: 'Trim',
          ticker: 'QQQ',
          name: 'Invesco QQQ',
          shift: '-95 bps',
          notional: '$300K',
          note: 'Reduces the highest beta overlap in the public equity book.',
        },
        {
          action: 'Trim',
          ticker: 'NVDA',
          name: 'NVIDIA',
          shift: '-55 bps',
          notional: '$170K',
          note: 'Lowers scenario drawdown sensitivity while remaining overweight.',
        },
        {
          action: 'Add',
          ticker: 'QUAL',
          name: 'iShares MSCI USA Quality',
          shift: '+85 bps',
          notional: '$270K',
          note: 'Keeps US equity exposure invested with better balance-sheet quality.',
        },
        {
          action: 'Add',
          ticker: 'SHY',
          name: 'iShares 1-3Y Treasury',
          shift: '+65 bps',
          notional: '$200K',
          note: 'Adds ballast without extending duration meaningfully.',
        },
      ],
      checklist: [
        'Run final lot-aware tax estimate prior to release.',
        'Validate portfolio remains above the 6% annualized return target.',
        'Prepare client language that clarifies this is a moderation, not a defensive exit.',
      ],
      approvalPath: ['Aura draft', 'PM review', 'Advisor review', 'Client approval'],
      exportLabel: 'Export risk memo',
      approveLabel: 'Send for advisor review',
      auditNote:
        'Projected mild-shock drawdown improves from 9.2% to 7.8% with minimal change to long-run expected return.',
    },
  },
  {
    id: 'sectors',
    label: 'Sectors',
    userPrompt: 'Break down our sector exposures versus policy targets.',
    leadText:
      'Aura has decomposed the US equity book into sector tilts across direct holdings, ETFs, and look-through exposures.',
    responseText:
      'Technology remains the largest active overweight, while healthcare and financials are both modestly underweight versus policy. That leaves the portfolio more exposed to one macro narrative than the household usually prefers.',
    metricLabel: 'Technology overweight',
    metricValue: '+6.2%',
    metricDelta: '+280 bps in 30 days',
    period: 'Versus policy target',
    series: [
      { label: 'Jan', value: 2.8 },
      { label: 'Feb', value: 3.6 },
      { label: 'Mar', value: 4.1 },
      { label: 'Apr', value: 4.9 },
      { label: 'May', value: 5.5 },
      { label: 'Jun', value: 6.2 },
    ],
    healthScore: 92,
    listTitle: 'Sector tilts',
    items: [
      {
        ticker: 'TECH',
        name: 'Technology',
        meta: '31% actual vs 24.8% policy',
        value: '+6.2%',
        change: 'Overweight',
        tone: 'negative',
      },
      {
        ticker: 'HLTH',
        name: 'Healthcare',
        meta: '9.4% actual vs 12.1% policy',
        value: '-2.7%',
        change: 'Underweight',
        tone: 'neutral',
      },
      {
        ticker: 'FIN',
        name: 'Financials',
        meta: '8.1% actual vs 10.4% policy',
        value: '-2.3%',
        change: 'Underweight',
        tone: 'neutral',
      },
    ],
    secondaryAction: 'Show sector map',
    primaryAction: 'Build sector rebalance',
    detailTitle: 'Sector map',
    detailBody:
      'The household is leaning heavily into the AI and software complex while running light in more defensive cash-flow sectors. A modest rebalance would diversify macro exposure without changing the US-only policy.',
    actionTitle: 'Sector rebalance',
    actionBody:
      'Aura can prepare a sector-aware rebalance that trims the technology overweight and re-allocates into quality healthcare and financials.',
    confidenceLabel: '87% confidence',
    asOf: 'Updated 8:57 AM ET',
    complianceNote:
      'Sector exposures reflect look-through ETF holdings as of the latest published constituent files.',
    marketTakeaway:
      'If the market leadership broadens beyond mega-cap technology, this portfolio could lag until sector weights normalize.',
    sources: [
      {
        label: 'Look-through sectors',
        detail: 'ETF and SMA holdings decomposed to GICS sectors.',
      },
      {
        label: 'Policy benchmark',
        detail: 'Household benchmark sector targets derived from the approved IPS.',
      },
      {
        label: 'Public equity model',
        detail: 'Excludes private fund marks until next GP statement refresh.',
      },
    ],
    followUps: [
      {
        label: 'See concentration',
        prompt: 'Show how these sector tilts feed the concentration problem.',
        scenarioId: 'diversification',
      },
      {
        label: 'Check lower-risk mix',
        prompt: 'What would a lower-risk sector mix look like right now?',
        scenarioId: 'risk',
      },
      {
        label: 'Estimate tax impact',
        prompt: 'Estimate the tax impact of a sector rebalance.',
        scenarioId: 'tax',
      },
    ],
    proposal: {
      title: 'Sector rebalance',
      summary:
        'Trim the technology overweight and rebalance into healthcare and diversified financials while staying fully US focused.',
      accounts: [
        {
          name: 'Riverview Taxable',
          mandate: 'Core public equity growth',
          impact: 'Supplies the majority of the technology trim.',
        },
        {
          name: 'Donor Advised Fund',
          mandate: 'Long-horizon charitable growth',
          impact: 'Useful account for adding broader sector exposure without tax friction.',
        },
      ],
      trades: [
        {
          action: 'Trim',
          ticker: 'VGT',
          name: 'Vanguard Information Technology ETF',
          shift: '-90 bps',
          notional: '$260K',
          note: 'Reduces the largest sector overweight quickly.',
        },
        {
          action: 'Add',
          ticker: 'XLV',
          name: 'Health Care Select Sector SPDR',
          shift: '+45 bps',
          notional: '$130K',
          note: 'Closes part of the healthcare underweight.',
        },
        {
          action: 'Add',
          ticker: 'VFH',
          name: 'Vanguard Financials ETF',
          shift: '+45 bps',
          notional: '$130K',
          note: 'Balances the macro exposure profile.',
        },
      ],
      checklist: [
        'Check all sector sleeves against current client guidelines.',
        'Ensure post-trade tech exposure stays above the strategic minimum.',
        'Coordinate DAF purchases to maximize tax efficiency across the household.',
      ],
      approvalPath: ['Aura draft', 'PM review', 'Advisor review'],
      exportLabel: 'Export sector brief',
      approveLabel: 'Send to PM review',
      auditNote:
        'Proposal narrows the technology overweight by roughly one-third while preserving the household US equity allocation target.',
    },
  },
]

export const scenarioById: Record<ScenarioId, Scenario> = Object.fromEntries(
  scenarios.map((scenario) => [scenario.id, scenario]),
) as Record<ScenarioId, Scenario>

export const quickPromptOrder: ScenarioId[] = [
  'performance',
  'diversification',
  'tax',
  'liquidity',
  'risk',
]

export const markets: MarketCard[] = [
  {
    id: 'sp500',
    label: 'S&P 500',
    value: '5,238',
    change: '+0.8%',
    tone: 'positive',
    points: [4880, 4935, 5008, 5070, 5145, 5238],
    note:
      'Breadth has improved, but leadership is still concentrated in high-quality mega-cap names.',
    portfolioEffect:
      'This household keeps modest alpha if breadth broadens, but its current tilt still leans heavily toward the biggest winners.',
  },
  {
    id: 'nasdaq',
    label: 'Nasdaq 100',
    value: '18,612',
    change: '+1.3%',
    tone: 'positive',
    points: [17110, 17380, 17620, 17990, 18340, 18612],
    note:
      'AI infrastructure optimism remains supportive, which is helping the household but also increasing concentration drift.',
    portfolioEffect:
      'Because public growth exposure is overweight, further Nasdaq strength helps returns quickly, but any reversal would hit concentration metrics fast.',
  },
  {
    id: 'ust10y',
    label: 'US 10Y Treasury',
    value: '4.18%',
    change: '-9 bps',
    tone: 'positive',
    points: [4.42, 4.37, 4.31, 4.28, 4.23, 4.18],
    note:
      'Yields easing gives short-duration reserves more carry without forcing the household into long duration.',
    portfolioEffect:
      'Treasury sleeves are finally competitive as a funding and risk buffer, which makes liquidity top-ups less expensive from a return perspective.',
  },
]

export const marketById: Record<MarketId, MarketCard> = Object.fromEntries(
  markets.map((market) => [market.id, market]),
) as Record<MarketId, MarketCard>

export const threads: ChatThread[] = [
  {
    id: 'riverview-core',
    title: 'Riverview family office',
    teaser: 'Quarterly performance, concentration, and tax budget review.',
    greeting: 'Here is the current read on the Riverview household.',
    summary:
      'Aura is tracking cross-account performance, concentration drift, tax capacity, and the next round of cash needs for the family office.',
    household: 'Riverview household',
    objective: 'Protect multi-generational purchasing power while funding annual distributions.',
    riskBand: 'Moderate growth',
    accountScope: '5 linked accounts',
    portfolioValue: '$48.6M',
    dayChange: '+$382K today',
    defaultScenarioId: 'performance',
    focusMarketId: 'nasdaq',
    allocation: [
      { label: 'Equities', share: 58, tone: 'primary' },
      { label: 'Fixed income', share: 26, tone: 'tertiary' },
      { label: 'Alternatives', share: 10, tone: 'secondary' },
      { label: 'Cash', share: 6, tone: 'primary' },
    ],
    constraints: [
      'Max 12% single-name exposure',
      'Keep US public market mandate',
      'Stay within quarterly gain budget',
    ],
  },
  {
    id: 'trust-income',
    title: 'Trust distribution planning',
    teaser: 'Liquidity buffer and trust payout preparation for July.',
    greeting: 'Trust coverage is healthy, but the cushion is thinner than target.',
    summary:
      'Aura is monitoring known outflows, trust reserve coverage, and short-duration funding options ahead of July distributions.',
    household: 'Family trust',
    objective: 'Fund known distributions with minimal friction and preserve the reserve ladder.',
    riskBand: 'Balanced income',
    accountScope: '3 linked accounts',
    portfolioValue: '$17.4M',
    dayChange: '+$64K today',
    defaultScenarioId: 'liquidity',
    focusMarketId: 'ust10y',
    allocation: [
      { label: 'Equities', share: 41, tone: 'primary' },
      { label: 'Fixed income', share: 39, tone: 'tertiary' },
      { label: 'Alternatives', share: 8, tone: 'secondary' },
      { label: 'Cash', share: 12, tone: 'primary' },
    ],
    constraints: [
      'Maintain 1.8x 60-day liquidity coverage',
      'No leverage or derivatives',
      'Preserve trust spending schedule',
    ],
  },
  {
    id: 'tax-alpha',
    title: 'Tax alpha workspace',
    teaser: 'Loss harvesting and sector rebalance opportunities in taxable assets.',
    greeting: 'Tax alpha opportunities are available right now in the taxable sleeve.',
    summary:
      'Aura is watching wash-sale windows, replacement exposure quality, and how tax moves can support broader de-risking.',
    household: 'Taxable public equity sleeve',
    objective: 'Improve after-tax outcomes without losing strategic US market exposure.',
    riskBand: 'Tax-aware growth',
    accountScope: '2 linked taxable accounts',
    portfolioValue: '$11.2M',
    dayChange: '+$58K today',
    defaultScenarioId: 'tax',
    focusMarketId: 'sp500',
    allocation: [
      { label: 'Equities', share: 73, tone: 'primary' },
      { label: 'Fixed income', share: 12, tone: 'tertiary' },
      { label: 'Alternatives', share: 5, tone: 'secondary' },
      { label: 'Cash', share: 10, tone: 'primary' },
    ],
    constraints: [
      'Avoid wash-sale conflicts',
      'Use long-term gain lots first',
      'Keep US equity beta invested',
    ],
  },
]

export const threadById: Record<string, ChatThread> = Object.fromEntries(
  threads.map((thread) => [thread.id, thread]),
)

const keywordMap: Array<{ scenarioId: ScenarioId; keywords: string[] }> = [
  {
    scenarioId: 'tax',
    keywords: ['tax', 'harvest', 'loss', 'wash sale', 'after-tax', 'gain'],
  },
  {
    scenarioId: 'liquidity',
    keywords: ['liquidity', 'cash', 'distribution', 'tuition', 'reserve', 'outflow'],
  },
  {
    scenarioId: 'diversification',
    keywords: ['concentrated', 'concentration', 'overlap', 'diversify'],
  },
  {
    scenarioId: 'sectors',
    keywords: ['sector', 'healthcare', 'financials', 'technology overweight'],
  },
  {
    scenarioId: 'risk',
    keywords: ['risk', 'drawdown', 'stress', 'de-risk', 'volatility'],
  },
  {
    scenarioId: 'performance',
    keywords: ['performance', 'return', 'benchmark', 'contributors', 'attribution'],
  },
]

export function matchScenarioFromPrompt(prompt: string): ScenarioId {
  const normalized = prompt.toLowerCase()

  for (const matcher of keywordMap) {
    if (matcher.keywords.some((keyword) => normalized.includes(keyword))) {
      return matcher.scenarioId
    }
  }

  return 'performance'
}

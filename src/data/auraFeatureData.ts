import type { MarketId, ScenarioId, SeriesPoint, Tone } from './auraDemo'

export interface ObjectiveBucket {
  label: string
  target: string
  funded: string
  status: string
  note: string
}

export interface LotDetail {
  id: string
  opened: string
  costBasis: string
  marketValue: string
  unrealized: string
  term: 'Long-term' | 'Short-term'
}

export interface AccountHolding {
  ticker: string
  name: string
  value: string
  weight: string
  change: string
  tone: Tone
  lots?: LotDetail[]
}

export interface AccountProfile {
  id: string
  name: string
  type: string
  mandate: string
  value: string
  cashReserve: string
  liquidityCoverage: string
  riskBand: string
  restrictions: string[]
  holdings: AccountHolding[]
}

export interface ThreadFeatureSet {
  householdBrief: string
  defaultAccountId: string
  objectiveBuckets: ObjectiveBucket[]
  accounts: AccountProfile[]
}

export interface CitationClaim {
  id: string
  claim: string
  sourceLabel: string
  sourceDetail: string
  refreshedAt: string
  impact: string
}

export interface ComplianceFlag {
  label: string
  detail: string
  tone: Tone | 'neutral'
}

export interface MarketCatalyst {
  label: string
  detail: string
}

export interface MarketScenarioImpact {
  headline: string
  benchmarkLabel: string
  benchmarkDelta: string
  benchmarkSeries: SeriesPoint[]
  exposureNote: string
  impactedAccounts: string[]
  vulnerableHoldings: string[]
  catalysts: MarketCatalyst[]
}

export interface ScenarioEnhancement {
  advisorReviewStatus: string
  assumptions: string[]
  citations: CitationClaim[]
  complianceFlags: ComplianceFlag[]
  marketImpactById: Record<MarketId, MarketScenarioImpact>
}

export interface DocumentSeed {
  id: string
  kind: 'statement' | 'memo' | 'transcript'
  title: string
  source: string
  status: 'parsed' | 'draft'
  uploadedAt: string
  accountIds: string[]
  scenarioIds: ScenarioId[]
  highlights: string[]
  excerpt?: string
}

export const threadFeatureById: Record<string, ThreadFeatureSet> = {
  'riverview-core': {
    householdBrief:
      'Primary family office household with taxable growth, trust ballast, and charitable capital pooled under one investment policy.',
    defaultAccountId: 'riverview-taxable',
    objectiveBuckets: [
      {
        label: 'Annual distributions',
        target: '$2.4M',
        funded: '71%',
        status: 'On track',
        note: 'July distribution is funded; fourth-quarter buffer still needs topping up.',
      },
      {
        label: 'Tax budget',
        target: '$420K gains',
        funded: '58%',
        status: 'Room available',
        note: 'There is still room to pair trims with loss harvesting later this quarter.',
      },
      {
        label: 'Family reserve',
        target: '1.8x obligations',
        funded: '1.4x',
        status: 'Below target',
        note: 'The reserve ladder is adequate but thinner than the family office preference.',
      },
    ],
    accounts: [
      {
        id: 'riverview-taxable',
        name: 'Riverview Taxable',
        type: 'Individual taxable',
        mandate: 'Tax-aware US growth',
        value: '$24.8M',
        cashReserve: '$820K',
        liquidityCoverage: '1.2x',
        riskBand: 'Moderate growth',
        restrictions: ['Respect gain budget', 'No non-US securities', 'No leverage'],
        holdings: [
          {
            ticker: 'MSFT',
            name: 'Microsoft',
            value: '$3.8M',
            weight: '15.3%',
            change: '+11.2%',
            tone: 'positive',
            lots: [
              {
                id: 'msft-lt-1',
                opened: '2023-02-14',
                costBasis: '$2.9M',
                marketValue: '$3.1M',
                unrealized: '+$220K',
                term: 'Long-term',
              },
              {
                id: 'msft-lt-2',
                opened: '2024-01-18',
                costBasis: '$610K',
                marketValue: '$700K',
                unrealized: '+$90K',
                term: 'Long-term',
              },
            ],
          },
          {
            ticker: 'NVDA',
            name: 'NVIDIA',
            value: '$3.2M',
            weight: '12.9%',
            change: '+18.4%',
            tone: 'positive',
            lots: [
              {
                id: 'nvda-lt-1',
                opened: '2022-11-03',
                costBasis: '$1.4M',
                marketValue: '$2.0M',
                unrealized: '+$600K',
                term: 'Long-term',
              },
              {
                id: 'nvda-st-1',
                opened: '2025-10-08',
                costBasis: '$1.0M',
                marketValue: '$1.2M',
                unrealized: '+$180K',
                term: 'Short-term',
              },
            ],
          },
          {
            ticker: 'QQQ',
            name: 'Invesco QQQ',
            value: '$710K',
            weight: '2.9%',
            change: '+7.1%',
            tone: 'positive',
          },
        ],
      },
      {
        id: 'riverview-trust',
        name: 'Family Trust',
        type: 'Trust',
        mandate: 'Capital preservation ballast',
        value: '$15.7M',
        cashReserve: '$540K',
        liquidityCoverage: '1.7x',
        riskBand: 'Balanced income',
        restrictions: ['No options', 'Keep duration under 3 years', 'Fund scheduled distributions'],
        holdings: [
          {
            ticker: 'SGOV',
            name: 'iShares 0-3M Treasury',
            value: '$640K',
            weight: '4.1%',
            change: '+0.6%',
            tone: 'positive',
          },
          {
            ticker: 'IEF',
            name: 'iShares 7-10Y Treasury',
            value: '$1.4M',
            weight: '8.9%',
            change: '+1.6%',
            tone: 'positive',
          },
          {
            ticker: 'SHY',
            name: 'iShares 1-3Y Treasury',
            value: '$920K',
            weight: '5.9%',
            change: '+0.8%',
            tone: 'positive',
          },
        ],
      },
      {
        id: 'riverview-daf',
        name: 'Donor Advised Fund',
        type: 'Charitable',
        mandate: 'Long-horizon charitable growth',
        value: '$8.1M',
        cashReserve: '$110K',
        liquidityCoverage: '2.8x',
        riskBand: 'Growth',
        restrictions: ['No private placements', 'Preserve annual grant cadence'],
        holdings: [
          {
            ticker: 'SCHD',
            name: 'Schwab US Dividend Equity ETF',
            value: '$820K',
            weight: '10.1%',
            change: '+4.3%',
            tone: 'positive',
          },
          {
            ticker: 'XLV',
            name: 'Health Care Select Sector SPDR',
            value: '$540K',
            weight: '6.7%',
            change: '+2.2%',
            tone: 'neutral',
          },
          {
            ticker: 'VFH',
            name: 'Vanguard Financials ETF',
            value: '$470K',
            weight: '5.8%',
            change: '+1.8%',
            tone: 'neutral',
          },
        ],
      },
    ],
  },
  'trust-income': {
    householdBrief:
      'Distribution-focused trust sleeves with short-duration reserves and a conservative public equity ballast.',
    defaultAccountId: 'trust-operating',
    objectiveBuckets: [
      {
        label: 'July distribution',
        target: '$950K',
        funded: '100%',
        status: 'Ready',
        note: 'Operating trust has enough same-week liquidity for the July transfer.',
      },
      {
        label: 'Tuition reserve',
        target: '$340K',
        funded: '82%',
        status: 'Needs topping up',
        note: 'One additional Treasury sale would restore the preferred cushion.',
      },
      {
        label: 'Reserve ladder',
        target: '1.8x obligations',
        funded: '1.6x',
        status: 'Slightly low',
        note: 'Coverage remains acceptable but below policy preference.',
      },
    ],
    accounts: [
      {
        id: 'trust-operating',
        name: 'Operating Trust',
        type: 'Trust',
        mandate: 'Fund near-term distributions',
        value: '$7.9M',
        cashReserve: '$620K',
        liquidityCoverage: '1.9x',
        riskBand: 'Balanced income',
        restrictions: ['Keep 12 months of distributions visible', 'No long duration'],
        holdings: [
          {
            ticker: 'SGOV',
            name: 'iShares 0-3M Treasury',
            value: '$480K',
            weight: '6.1%',
            change: '+0.6%',
            tone: 'positive',
          },
          {
            ticker: 'SHY',
            name: 'iShares 1-3Y Treasury',
            value: '$610K',
            weight: '7.7%',
            change: '+0.8%',
            tone: 'positive',
          },
        ],
      },
      {
        id: 'trust-reserve',
        name: 'Reserve Trust',
        type: 'Trust',
        mandate: 'Capital preservation ballast',
        value: '$6.2M',
        cashReserve: '$410K',
        liquidityCoverage: '1.5x',
        riskBand: 'Conservative',
        restrictions: ['No equities above 45%', 'No structured notes'],
        holdings: [
          {
            ticker: 'IEF',
            name: 'iShares 7-10Y Treasury',
            value: '$1.1M',
            weight: '17.7%',
            change: '+1.6%',
            tone: 'positive',
          },
          {
            ticker: 'MUB',
            name: 'iShares National Muni Bond ETF',
            value: '$890K',
            weight: '14.3%',
            change: '+0.9%',
            tone: 'positive',
          },
        ],
      },
    ],
  },
  'tax-alpha': {
    householdBrief:
      'Taxable-only workspace for harvesting, replacement exposure review, and sector rebalancing within the US mandate.',
    defaultAccountId: 'tax-core',
    objectiveBuckets: [
      {
        label: 'Loss budget',
        target: '$350K',
        funded: '$286K',
        status: 'Harvestable now',
        note: 'Two sleeves currently provide the cleanest losses before month-end.',
      },
      {
        label: 'Replacement exposure',
        target: '100% beta retained',
        funded: 'Ready',
        status: 'Ready',
        note: 'Replacement ETFs preserve broad US market exposure without wash-sale overlap.',
      },
      {
        label: 'Sector rebalance',
        target: 'Tech overweight < 4%',
        funded: '6.2%',
        status: 'Pending',
        note: 'A combined tax and sector move could narrow the overweight materially.',
      },
    ],
    accounts: [
      {
        id: 'tax-core',
        name: 'Core Taxable',
        type: 'Individual taxable',
        mandate: 'Core US equity growth',
        value: '$7.6M',
        cashReserve: '$380K',
        liquidityCoverage: '1.3x',
        riskBand: 'Tax-aware growth',
        restrictions: ['Avoid wash-sale conflicts', 'No non-US securities'],
        holdings: [
          {
            ticker: 'IWM',
            name: 'iShares Russell 2000 ETF',
            value: '$420K',
            weight: '5.5%',
            change: '-9.8%',
            tone: 'negative',
            lots: [
              {
                id: 'iwm-1',
                opened: '2025-11-12',
                costBasis: '$464K',
                marketValue: '$420K',
                unrealized: '-$44K',
                term: 'Short-term',
              },
            ],
          },
          {
            ticker: 'SCHB',
            name: 'Schwab US Broad Market ETF',
            value: '$0',
            weight: '0%',
            change: 'Replacement',
            tone: 'positive',
          },
        ],
      },
      {
        id: 'tax-satellite',
        name: 'Satellite Taxable',
        type: 'Individual taxable',
        mandate: 'Tactical US tilts',
        value: '$3.6M',
        cashReserve: '$140K',
        liquidityCoverage: '1.1x',
        riskBand: 'Aggressive',
        restrictions: ['Use long-term gains first', 'No options'],
        holdings: [
          {
            ticker: 'ARKK',
            name: 'ARK Innovation ETF',
            value: '$190K',
            weight: '5.3%',
            change: '-21.4%',
            tone: 'negative',
            lots: [
              {
                id: 'arkk-1',
                opened: '2024-03-22',
                costBasis: '$310K',
                marketValue: '$190K',
                unrealized: '-$120K',
                term: 'Long-term',
              },
              {
                id: 'arkk-2',
                opened: '2025-01-18',
                costBasis: '$312K',
                marketValue: '$190K',
                unrealized: '-$122K',
                term: 'Long-term',
              },
            ],
          },
          {
            ticker: 'VB',
            name: 'Vanguard Small-Cap ETF',
            value: '$0',
            weight: '0%',
            change: 'Replacement',
            tone: 'positive',
          },
        ],
      },
    ],
  },
}

export const scenarioEnhancementById: Record<ScenarioId, ScenarioEnhancement> = {
  performance: {
    advisorReviewStatus: 'Reviewed by PM desk at 9:12 AM',
    assumptions: [
      'Policy benchmark uses the current 60/25/10/5 household blend.',
      'Private assets are held flat at last GP marks.',
      'Tax budget assumes no external household trades since April 7.',
    ],
    citations: [
      {
        id: 'perf-1',
        claim: 'Three positions contributed over 70% of excess return this quarter.',
        sourceLabel: 'Attribution engine',
        sourceDetail: 'Household contribution model using daily account-level positions.',
        refreshedAt: '8:42 AM ET',
        impact: 'Supports the trim recommendation for concentrated winners.',
      },
      {
        id: 'perf-2',
        claim: 'Trust ballast modestly improved returns as yields eased.',
        sourceLabel: 'Fixed income sleeve report',
        sourceDetail: 'Trust sleeve performance and duration dashboard.',
        refreshedAt: '8:40 AM ET',
        impact: 'Justifies topping up short-duration reserves instead of going defensive.',
      },
    ],
    complianceFlags: [
      {
        label: 'Suitability check',
        detail: 'Aligned with moderate-growth mandate and current IPS return target.',
        tone: 'positive',
      },
      {
        label: 'Tax sensitivity',
        detail: 'Trims should prefer long-term gain lots to stay inside the quarterly budget.',
        tone: 'neutral',
      },
    ],
    marketImpactById: {
      sp500: {
        headline: 'Outperformance remains above broad-market beta.',
        benchmarkLabel: 'Policy benchmark',
        benchmarkDelta: '+1.8%',
        benchmarkSeries: [
          { label: 'Jan', value: 11.9 },
          { label: 'Feb', value: 12.4 },
          { label: 'Mar', value: 12.9 },
          { label: 'Apr', value: 13.3 },
          { label: 'May', value: 13.8 },
          { label: 'Jun', value: 14.0 },
        ],
        exposureNote:
          'Breadth has improved, but Riverview is still earning most alpha from the same technology leaders.',
        impactedAccounts: ['riverview-taxable', 'riverview-daf'],
        vulnerableHoldings: ['MSFT', 'NVDA', 'QQQ'],
        catalysts: [
          { label: 'Earnings breadth', detail: 'Broader participation would help the DAF sleeves catch up.' },
          { label: 'Buyback season', detail: 'Supports quality US large caps held in the taxable account.' },
        ],
      },
      nasdaq: {
        headline: 'Nasdaq strength explains most current excess return.',
        benchmarkLabel: 'Nasdaq-relative drift',
        benchmarkDelta: '+2.6%',
        benchmarkSeries: [
          { label: 'Jan', value: 12.1 },
          { label: 'Feb', value: 12.8 },
          { label: 'Mar', value: 13.5 },
          { label: 'Apr', value: 14.0 },
          { label: 'May', value: 14.4 },
          { label: 'Jun', value: 14.7 },
        ],
        exposureNote:
          'If Nasdaq leadership reverses, the taxable sleeve would absorb most of the drawdown before policy ballast offsets it.',
        impactedAccounts: ['riverview-taxable'],
        vulnerableHoldings: ['NVDA', 'MSFT', 'QQQ'],
        catalysts: [
          { label: 'Mega-cap guidance', detail: 'Any reset in AI capex would affect the top two contributors immediately.' },
          { label: 'Fed path', detail: 'Delayed cuts increase sensitivity to high-duration growth multiples.' },
        ],
      },
      ust10y: {
        headline: 'Treasury ballast is working but still underfunded.',
        benchmarkLabel: 'Short-duration reserve target',
        benchmarkDelta: '-0.3x',
        benchmarkSeries: [
          { label: 'Jan', value: 1.9 },
          { label: 'Feb', value: 1.8 },
          { label: 'Mar', value: 1.7 },
          { label: 'Apr', value: 1.6 },
          { label: 'May', value: 1.5 },
          { label: 'Jun', value: 1.4 },
        ],
        exposureNote:
          'Easing yields make it cheaper to rebuild reserves with SGOV or SHY without sacrificing too much carry.',
        impactedAccounts: ['riverview-trust'],
        vulnerableHoldings: ['IEF', 'SGOV', 'SHY'],
        catalysts: [
          { label: 'Treasury auction cycle', detail: 'Stable demand keeps reserve rebuild attractive.' },
          { label: 'Distribution window', detail: 'July obligations raise the value of near-term liquidity.' },
        ],
      },
    },
  },
  diversification: {
    advisorReviewStatus: 'Risk review pending for overlap reductions',
    assumptions: [
      'Look-through exposures use the latest ETF constituent files.',
      'Private growth marks are held flat until next quarterly statements.',
      'Single-name guardrails use household aggregate exposure, not account-only views.',
    ],
    citations: [
      {
        id: 'div-1',
        claim: 'Technology and communication services are 620 bps above policy.',
        sourceLabel: 'Exposure graph',
        sourceDetail: 'Cross-account overlap model with ETF look-through holdings.',
        refreshedAt: '8:45 AM ET',
        impact: 'Supports the case for sector and single-name reduction.',
      },
      {
        id: 'div-2',
        claim: 'The taxable account carries most of the current active concentration risk.',
        sourceLabel: 'Household account decomposition',
        sourceDetail: 'Contribution to active weight by account and sleeve.',
        refreshedAt: '8:46 AM ET',
        impact: 'Focuses the de-risking plan on the taxable account before touching charitable assets.',
      },
    ],
    complianceFlags: [
      {
        label: 'Policy guardrail',
        detail: 'Soft single-name limit is breached; hard limit is close but not crossed.',
        tone: 'negative',
      },
      {
        label: 'Client objective fit',
        detail: 'Diversification move remains aligned with long-term growth objective.',
        tone: 'positive',
      },
    ],
    marketImpactById: {
      sp500: {
        headline: 'Broadening market leadership would reduce the current active-risk penalty.',
        benchmarkLabel: 'Sector breadth gap',
        benchmarkDelta: '+4.1%',
        benchmarkSeries: [
          { label: 'Jan', value: 3.1 },
          { label: 'Feb', value: 3.5 },
          { label: 'Mar', value: 3.8 },
          { label: 'Apr', value: 4.2 },
          { label: 'May', value: 4.0 },
          { label: 'Jun', value: 4.1 },
        ],
        exposureNote:
          'The household benefits if S&P breadth improves because underweights in healthcare and financials have room to contribute.',
        impactedAccounts: ['riverview-taxable', 'riverview-daf'],
        vulnerableHoldings: ['VGT', 'META', 'NVDA'],
        catalysts: [
          { label: 'Breadth rotation', detail: 'Would reward a diversified sector stance more than current positioning.' },
          { label: 'Dividend resilience', detail: 'Supports adding SCHD and DGRO into the charitable sleeve.' },
        ],
      },
      nasdaq: {
        headline: 'Nasdaq-heavy overlap is the main concentration issue.',
        benchmarkLabel: 'Nasdaq overlap',
        benchmarkDelta: '+6.2%',
        benchmarkSeries: [
          { label: 'Jan', value: 10.1 },
          { label: 'Feb', value: 10.8 },
          { label: 'Mar', value: 11.5 },
          { label: 'Apr', value: 12.3 },
          { label: 'May', value: 13.4 },
          { label: 'Jun', value: 14.3 },
        ],
        exposureNote:
          'The same growth complex is expressed through direct equities, QQQ, VGT, and private growth proxies.',
        impactedAccounts: ['riverview-taxable'],
        vulnerableHoldings: ['NVDA', 'META', 'QQQ', 'VGT'],
        catalysts: [
          { label: 'AI concentration', detail: 'Any sentiment reset would affect both direct and ETF sleeves simultaneously.' },
          { label: 'Correlation spike', detail: 'Stress periods compress diversification across similar growth factors.' },
        ],
      },
      ust10y: {
        headline: 'Treasury sleeves can absorb some proceeds without breaking return targets.',
        benchmarkLabel: 'Reserve absorption capacity',
        benchmarkDelta: '+$350K',
        benchmarkSeries: [
          { label: 'Jan', value: 140 },
          { label: 'Feb', value: 180 },
          { label: 'Mar', value: 220 },
          { label: 'Apr', value: 260 },
          { label: 'May', value: 310 },
          { label: 'Jun', value: 350 },
        ],
        exposureNote:
          'Short-duration Treasuries provide a clean landing spot for de-risking proceeds while distribution needs remain visible.',
        impactedAccounts: ['riverview-trust'],
        vulnerableHoldings: ['SGOV', 'SHY'],
        catalysts: [
          { label: 'Carry opportunity', detail: 'Cash alternatives are no longer a major return drag.' },
          { label: 'Liquidity optionality', detail: 'Reserve build improves flexibility for mid-year cash needs.' },
        ],
      },
    },
  },
  tax: {
    advisorReviewStatus: 'Tax desk reviewed wash-sale assumptions at 8:55 AM',
    assumptions: [
      'Linked spouse and trust accounts have not purchased the same securities in the last 30 days.',
      'Replacement ETFs are treated as sufficiently distinct for wash-sale purposes.',
      'Loss budget is measured against current quarter realized gains only.',
    ],
    citations: [
      {
        id: 'tax-1',
        claim: 'IWM and ARKK provide the cleanest harvestable losses available today.',
        sourceLabel: 'Tax lot worksheet',
        sourceDetail: 'Lot-level unrealized P&L and acquisition dates across linked taxable accounts.',
        refreshedAt: '8:48 AM ET',
        impact: 'Prioritizes harvest candidates that can offset future trims.',
      },
      {
        id: 'tax-2',
        claim: 'Replacement sleeves keep US equity beta invested and wash-sale clean.',
        sourceLabel: 'Replacement exposure review',
        sourceDetail: 'ETF overlap and index methodology comparison.',
        refreshedAt: '8:50 AM ET',
        impact: 'Supports immediate rotation without losing strategic market exposure.',
      },
    ],
    complianceFlags: [
      {
        label: 'Wash-sale watch',
        detail: 'No linked-account conflicts detected, but spouse-account activity is assumed static.',
        tone: 'neutral',
      },
      {
        label: 'Tax objective fit',
        detail: 'Recommended harvesting remains aligned with after-tax growth mandate.',
        tone: 'positive',
      },
    ],
    marketImpactById: {
      sp500: {
        headline: 'Broad-market replacements preserve core US exposure.',
        benchmarkLabel: 'Replacement beta',
        benchmarkDelta: '0.99x',
        benchmarkSeries: [
          { label: 'Jan', value: 94 },
          { label: 'Feb', value: 95 },
          { label: 'Mar', value: 96 },
          { label: 'Apr', value: 97 },
          { label: 'May', value: 98 },
          { label: 'Jun', value: 99 },
        ],
        exposureNote:
          'SCHB and VB keep the taxable sleeves invested while avoiding concentrated innovation risk.',
        impactedAccounts: ['tax-core', 'tax-satellite'],
        vulnerableHoldings: ['IWM', 'ARKK', 'SCHB', 'VB'],
        catalysts: [
          { label: 'Small-cap mean reversion', detail: 'Replacing IWM with VB preserves rebound participation.' },
          { label: 'Innovation volatility', detail: 'Leaving ARKK lowers idiosyncratic drawdown risk.' },
        ],
      },
      nasdaq: {
        headline: 'Harvesting legacy growth risk creates room for later tech trims.',
        benchmarkLabel: 'Tax budget freed',
        benchmarkDelta: '$286K',
        benchmarkSeries: [
          { label: 'Jan', value: 120 },
          { label: 'Feb', value: 140 },
          { label: 'Mar', value: 165 },
          { label: 'Apr', value: 188 },
          { label: 'May', value: 233 },
          { label: 'Jun', value: 286 },
        ],
        exposureNote:
          'Capturing losses now increases flexibility if the team later trims MSFT, NVDA, or QQQ for risk reasons.',
        impactedAccounts: ['tax-core', 'tax-satellite'],
        vulnerableHoldings: ['ARKK', 'QQQ', 'NVDA'],
        catalysts: [
          { label: 'Future trim capacity', detail: 'Losses can offset later gains from concentrated winners.' },
          { label: 'Volatility window', detail: 'Current dislocations make harvesting more valuable than usual.' },
        ],
      },
      ust10y: {
        headline: 'No need to hold idle cash after harvesting.',
        benchmarkLabel: 'Cash drag avoided',
        benchmarkDelta: '+0.4%',
        benchmarkSeries: [
          { label: 'Jan', value: 0.1 },
          { label: 'Feb', value: 0.1 },
          { label: 'Mar', value: 0.2 },
          { label: 'Apr', value: 0.2 },
          { label: 'May', value: 0.3 },
          { label: 'Jun', value: 0.4 },
        ],
        exposureNote:
          'Replacements can be invested immediately, so the tax move does not require carrying cash while rates remain elevated.',
        impactedAccounts: ['tax-core'],
        vulnerableHoldings: ['SCHB', 'VB'],
        catalysts: [
          { label: 'Settlement speed', detail: 'T+1 execution keeps the taxable sleeve fully invested.' },
          { label: 'Reserve option', detail: 'If needed, part of the proceeds can still seed a short Treasury sleeve.' },
        ],
      },
    },
  },
  liquidity: {
    advisorReviewStatus: 'Operations queue checked cash ladder assumptions',
    assumptions: [
      'Private distributions arrive on schedule within the next six weeks.',
      'All public securities settle T+1 and are tradeable during the liquidity window.',
      'No unexpected charitable grants are added before month-end.',
    ],
    citations: [
      {
        id: 'liq-1',
        claim: 'The next 60 days are covered at 1.4x after expected inflows.',
        sourceLabel: 'Cash ladder model',
        sourceDetail: 'Family office obligations calendar and account-level reserve balances.',
        refreshedAt: '8:51 AM ET',
        impact: 'Supports building a larger Treasury sleeve before July.',
      },
      {
        id: 'liq-2',
        claim: 'The operating trust can fund July, but the reserve trust remains below target coverage.',
        sourceLabel: 'Trust reserve decomposition',
        sourceDetail: 'Operating vs reserve trust coverage analysis.',
        refreshedAt: '8:53 AM ET',
        impact: 'Focuses the top-up on the reserve trust rather than the DAF or charitable pools.',
      },
    ],
    complianceFlags: [
      {
        label: 'Liquidity policy',
        detail: 'Household is below the 1.8x next-60-day target but still above minimum operating coverage.',
        tone: 'negative',
      },
      {
        label: 'Execution readiness',
        detail: 'Funding path stays inside trust liquidity and duration constraints.',
        tone: 'positive',
      },
    ],
    marketImpactById: {
      sp500: {
        headline: 'Funding from winners reduces equity beta only modestly.',
        benchmarkLabel: 'Equity sleeve change',
        benchmarkDelta: '-95 bps',
        benchmarkSeries: [
          { label: 'Jan', value: 58 },
          { label: 'Feb', value: 58 },
          { label: 'Mar', value: 57 },
          { label: 'Apr', value: 57 },
          { label: 'May', value: 56 },
          { label: 'Jun', value: 55 },
        ],
        exposureNote:
          'A small trim in broad-market or quality winners funds liquidity without materially changing the household return posture.',
        impactedAccounts: ['riverview-taxable', 'trust-operating'],
        vulnerableHoldings: ['AAPL', 'QQQ', 'SGOV'],
        catalysts: [
          { label: 'Distribution timing', detail: 'Funding now avoids forced sales later in July.' },
          { label: 'Broad market strength', detail: 'Using equity gains for reserve funding keeps the move client-friendly.' },
        ],
      },
      nasdaq: {
        headline: 'Nasdaq-heavy winners are the cleanest source of reserve funding.',
        benchmarkLabel: 'Growth trim funding',
        benchmarkDelta: '$300K',
        benchmarkSeries: [
          { label: 'Jan', value: 60 },
          { label: 'Feb', value: 90 },
          { label: 'Mar', value: 140 },
          { label: 'Apr', value: 190 },
          { label: 'May', value: 250 },
          { label: 'Jun', value: 300 },
        ],
        exposureNote:
          'AAPL and QQQ trims improve both concentration and near-term reserve quality at the same time.',
        impactedAccounts: ['riverview-taxable'],
        vulnerableHoldings: ['AAPL', 'QQQ', 'NVDA'],
        catalysts: [
          { label: 'Growth winner funding', detail: 'Reduces dependence on selling into a later drawdown.' },
          { label: 'July cash need', detail: 'Reserve build matters more than squeezing incremental upside right now.' },
        ],
      },
      ust10y: {
        headline: 'Treasury carry makes the reserve rebuild materially easier.',
        benchmarkLabel: 'Liquidity sleeve carry',
        benchmarkDelta: '+4.18%',
        benchmarkSeries: [
          { label: 'Jan', value: 3.9 },
          { label: 'Feb', value: 4.0 },
          { label: 'Mar', value: 4.1 },
          { label: 'Apr', value: 4.2 },
          { label: 'May', value: 4.2 },
          { label: 'Jun', value: 4.18 },
        ],
        exposureNote:
          'SGOV and SHY both preserve same-week liquidity while still earning enough yield to justify a larger reserve bucket.',
        impactedAccounts: ['trust-operating', 'trust-reserve'],
        vulnerableHoldings: ['SGOV', 'SHY', 'IEF'],
        catalysts: [
          { label: 'Carry cushion', detail: 'Reserve build is less costly than in prior years.' },
          { label: 'Short-duration advantage', detail: 'No need to extend duration to raise yield.' },
        ],
      },
    },
  },
  risk: {
    advisorReviewStatus: 'PM desk requested a lower-beta option set',
    assumptions: [
      'Stress model uses current factor betas and public proxies for private growth exposures.',
      'Household return target remains 6% annualized after fees.',
      'Any risk reduction should keep the portfolio primarily invested in US public markets.',
    ],
    citations: [
      {
        id: 'risk-1',
        claim: 'Projected mild-shock drawdown currently exceeds target by 130 bps.',
        sourceLabel: 'Household stress engine',
        sourceDetail: 'Multi-factor shock model calibrated with April betas.',
        refreshedAt: '8:54 AM ET',
        impact: 'Supports a moderate de-risking proposal without a defensive exit.',
      },
      {
        id: 'risk-2',
        claim: 'Most downside sensitivity comes from overlapping high-beta growth exposures.',
        sourceLabel: 'Scenario contribution report',
        sourceDetail: 'Drawdown contribution by holding, sector, and sleeve.',
        refreshedAt: '8:55 AM ET',
        impact: 'Focuses the proposal on QQQ and concentrated tech names first.',
      },
    ],
    complianceFlags: [
      {
        label: 'Risk target',
        detail: 'Current scenario exceeds the mild-shock drawdown target for this mandate.',
        tone: 'negative',
      },
      {
        label: 'Mandate alignment',
        detail: 'The proposed mix remains growth-oriented and fully within the US-market policy.',
        tone: 'positive',
      },
    ],
    marketImpactById: {
      sp500: {
        headline: 'A lower-beta US quality mix still participates in broad-market upside.',
        benchmarkLabel: 'Projected drawdown',
        benchmarkDelta: '-7.8%',
        benchmarkSeries: [
          { label: 'Stress 1', value: -4.8 },
          { label: 'Stress 2', value: -5.6 },
          { label: 'Stress 3', value: -6.3 },
          { label: 'Stress 4', value: -6.9 },
          { label: 'Stress 5', value: -7.4 },
          { label: 'Stress 6', value: -7.8 },
        ],
        exposureNote:
          'Quality replacements keep the portfolio participating in the S&P while smoothing the downside path.',
        impactedAccounts: ['riverview-taxable', 'riverview-trust'],
        vulnerableHoldings: ['QQQ', 'NVDA', 'QUAL', 'SHY'],
        catalysts: [
          { label: 'Broad-market resilience', detail: 'Quality and short Treasuries improve resilience without going to cash.' },
          { label: 'Client narrative', detail: 'The move is easier to explain as moderation rather than market timing.' },
        ],
      },
      nasdaq: {
        headline: 'Nasdaq overlap remains the biggest drawdown amplifier.',
        benchmarkLabel: 'Overlap drag',
        benchmarkDelta: '+1.4%',
        benchmarkSeries: [
          { label: 'Stress 1', value: -5.2 },
          { label: 'Stress 2', value: -6.1 },
          { label: 'Stress 3', value: -7.4 },
          { label: 'Stress 4', value: -8.2 },
          { label: 'Stress 5', value: -8.8 },
          { label: 'Stress 6', value: -9.2 },
        ],
        exposureNote:
          'A selloff in high-duration growth still hits the taxable sleeve first; trimming QQQ and NVDA lowers that amplification materially.',
        impactedAccounts: ['riverview-taxable'],
        vulnerableHoldings: ['QQQ', 'NVDA', 'MSFT'],
        catalysts: [
          { label: 'AI sentiment shock', detail: 'Would hit direct and ETF growth sleeves at the same time.' },
          { label: 'Rate reset', detail: 'Higher-for-longer is the main macro threat to current overlap.' },
        ],
      },
      ust10y: {
        headline: 'Short Treasuries are the most neutral stabilizer available.',
        benchmarkLabel: 'Ballast contribution',
        benchmarkDelta: '+65 bps',
        benchmarkSeries: [
          { label: 'Stress 1', value: 0.1 },
          { label: 'Stress 2', value: 0.2 },
          { label: 'Stress 3', value: 0.3 },
          { label: 'Stress 4', value: 0.4 },
          { label: 'Stress 5', value: 0.5 },
          { label: 'Stress 6', value: 0.6 },
        ],
        exposureNote:
          'SHY and SGOV add enough ballast to improve drawdown shape without introducing significant duration risk.',
        impactedAccounts: ['riverview-trust'],
        vulnerableHoldings: ['SHY', 'SGOV', 'IEF'],
        catalysts: [
          { label: 'Carry plus defense', detail: 'Treasuries help on both income and volatility fronts right now.' },
          { label: 'Distribution flexibility', detail: 'The stabilizer sleeve can also be used for later cash needs.' },
        ],
      },
    },
  },
  sectors: {
    advisorReviewStatus: 'Sector rebalance ready for PM review',
    assumptions: [
      'Sector weights use GICS look-through holdings from current ETFs.',
      'Underweights can be closed using liquid US sector sleeves.',
      'Client preference remains fully US public-market exposure.',
    ],
    citations: [
      {
        id: 'sector-1',
        claim: 'Technology is 6.2% above policy while healthcare and financials remain underweight.',
        sourceLabel: 'Sector decomposition',
        sourceDetail: 'Look-through GICS sector analysis across direct and ETF holdings.',
        refreshedAt: '8:57 AM ET',
        impact: 'Supports a targeted sector rebalance rather than a broad de-risking move.',
      },
      {
        id: 'sector-2',
        claim: 'Broadening market leadership would likely penalize the current sector mix.',
        sourceLabel: 'Market breadth tracker',
        sourceDetail: 'Breadth and participation dashboard tied to sector leadership.',
        refreshedAt: '8:58 AM ET',
        impact: 'Adds urgency to closing the healthcare and financials underweights.',
      },
    ],
    complianceFlags: [
      {
        label: 'Sector policy',
        detail: 'Technology overweight is outside the preferred sector band.',
        tone: 'negative',
      },
      {
        label: 'Implementation fit',
        detail: 'Proposed sleeves remain liquid, US-only, and easy to explain to clients.',
        tone: 'positive',
      },
    ],
    marketImpactById: {
      sp500: {
        headline: 'Breadth rotation would reward a more balanced sector mix.',
        benchmarkLabel: 'Sector breadth',
        benchmarkDelta: '+2.1',
        benchmarkSeries: [
          { label: 'Jan', value: 1.2 },
          { label: 'Feb', value: 1.4 },
          { label: 'Mar', value: 1.6 },
          { label: 'Apr', value: 1.8 },
          { label: 'May', value: 1.9 },
          { label: 'Jun', value: 2.1 },
        ],
        exposureNote:
          'Healthcare and financials would contribute more if the S&P rally broadens beyond mega-cap technology.',
        impactedAccounts: ['riverview-taxable', 'riverview-daf'],
        vulnerableHoldings: ['VGT', 'XLV', 'VFH'],
        catalysts: [
          { label: 'Breadth rotation', detail: 'Supports moving a slice of VGT into healthcare and financials.' },
          { label: 'Defensive cash flow', detail: 'Healthcare improves resilience if leadership broadens slowly.' },
        ],
      },
      nasdaq: {
        headline: 'Nasdaq leadership is what made the sector gap widen this quickly.',
        benchmarkLabel: 'Technology overweight',
        benchmarkDelta: '+6.2%',
        benchmarkSeries: [
          { label: 'Jan', value: 2.8 },
          { label: 'Feb', value: 3.6 },
          { label: 'Mar', value: 4.1 },
          { label: 'Apr', value: 4.9 },
          { label: 'May', value: 5.5 },
          { label: 'Jun', value: 6.2 },
        ],
        exposureNote:
          'The longer mega-cap growth leads, the harder it becomes to rebalance without giving up recent winners.',
        impactedAccounts: ['riverview-taxable'],
        vulnerableHoldings: ['VGT', 'MSFT', 'NVDA'],
        catalysts: [
          { label: 'Leadership concentration', detail: 'Current alpha is tightly bound to technology leadership.' },
          { label: 'Rebalance timing', detail: 'Taking some action now reduces the chance of a larger forced trim later.' },
        ],
      },
      ust10y: {
        headline: 'Treasuries let the sector rebalance happen without losing optionality.',
        benchmarkLabel: 'Reserve sidecar',
        benchmarkDelta: '$130K',
        benchmarkSeries: [
          { label: 'Jan', value: 20 },
          { label: 'Feb', value: 40 },
          { label: 'Mar', value: 60 },
          { label: 'Apr', value: 80 },
          { label: 'May', value: 105 },
          { label: 'Jun', value: 130 },
        ],
        exposureNote:
          'If the team wants to phase the rebalance, part of the trim can sit in Treasuries while new sector weights are staged.',
        impactedAccounts: ['riverview-trust', 'riverview-daf'],
        vulnerableHoldings: ['SGOV', 'SHY', 'VGT'],
        catalysts: [
          { label: 'Phased execution', detail: 'Treasuries provide a neutral parking sleeve between trims and redeployments.' },
          { label: 'Client pacing', detail: 'Useful if the household wants a staged rather than all-at-once rebalance.' },
        ],
      },
    },
  },
}

export const initialDocumentsByThreadId: Record<string, DocumentSeed[]> = {
  'riverview-core': [
    {
      id: 'doc-rv-1',
      kind: 'statement',
      title: 'Q2 custody statement',
      source: 'Schwab custodial feed',
      status: 'parsed',
      uploadedAt: '8:32 AM',
      accountIds: ['riverview-taxable', 'riverview-trust'],
      scenarioIds: ['performance', 'tax'],
      highlights: [
        'Realized gains at $244K quarter-to-date.',
        'Largest drift remains in MSFT and NVDA.',
      ],
      excerpt: 'Parsed custody statement with lot summaries, realized gains, and cash balances.',
    },
    {
      id: 'doc-rv-2',
      kind: 'memo',
      title: 'Investment committee note',
      source: 'Advisor draft',
      status: 'draft',
      uploadedAt: '9:05 AM',
      accountIds: ['riverview-taxable'],
      scenarioIds: ['performance', 'diversification'],
      highlights: [
        'Technology concentration flagged for advisor review.',
        'Treasury refill recommended if liquidity sleeve is raised.',
      ],
    },
  ],
  'trust-income': [
    {
      id: 'doc-trust-1',
      kind: 'statement',
      title: 'Trust cash ladder',
      source: 'Family office calendar',
      status: 'parsed',
      uploadedAt: '8:47 AM',
      accountIds: ['trust-operating', 'trust-reserve'],
      scenarioIds: ['liquidity'],
      highlights: [
        'July distribution due in six weeks.',
        'Tuition outflow still leaves only a 1.6x reserve cushion.',
      ],
    },
  ],
  'tax-alpha': [
    {
      id: 'doc-tax-1',
      kind: 'statement',
      title: 'Tax lot worksheet',
      source: 'Tax engine export',
      status: 'parsed',
      uploadedAt: '8:49 AM',
      accountIds: ['tax-core', 'tax-satellite'],
      scenarioIds: ['tax'],
      highlights: [
        'IWM and ARKK currently provide the cleanest harvestable losses.',
        'Replacement exposure is wash-sale clean across linked accounts.',
      ],
    },
  ],
}

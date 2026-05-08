import type { AlertFilter, PortfolioKey, TimeRange } from '../design-system/tokens'
import { designSystem } from '../design-system/tokens'

type AlertCategory = Exclude<AlertFilter, 'All'>

export type AccountRisk = {
  id: string
  name: string
  owner: string
  currentCash: number
  requiredCash: number
  coverage: number
  nextAction: string
  status: 'healthy' | 'watch' | 'critical'
}

export type TradeRequest = {
  id: string
  title: string
  description: string
  desk: string
  volume: number
  accounts: number
  eta: string
  nextMove: string
  category: AlertCategory
  priority: 'Immediate' | 'Today' | 'Monitor'
}

export type AlertItem = {
  id: string
  title: string
  description: string
  owner: string
  time: string
  category: AlertCategory
  severity: 'high' | 'medium' | 'low'
}

type LiquidityPoint = {
  label: string
  inflow: number
  requiredCash: number
  buffer: number
}

type SummaryAdjustments = {
  netFlowOffset: number
  requiredCashOffset: number
  coverageShift: number
  modelShift: number
}

type TopPosition = {
  name: string
  symbol: string
  value: number
  weight: number
  color: string
}

type DriftRow = {
  sleeve: string
  symbol: string
  drift: number
  limit: number
  action: string
}

type AllocationSlice = {
  name: string
  value: number
  color: string
}

type CashSleeve = {
  label: string
  amount: number
  share: number
}

type WorkingOrders = {
  open: number
  queued: number
  blocked: number
  delayed: number
  automation: number
}

type PortfolioProfile = {
  summaryAdjustments: SummaryAdjustments
  totalTradableCash: number
  primarySector: string
  liquidityProjection: {
    inflow: number
    gap: number
    buffer: number
    confidence: number
    note: string
  }
  liquiditySeries: Record<TimeRange, LiquidityPoint[]>
  accounts: AccountRisk[]
  tradeRequests: TradeRequest[]
  topPositions: TopPosition[]
  driftRows: DriftRow[]
  cashSleeves: CashSleeve[]
  alerts: AlertItem[]
  sectorAllocation: AllocationSlice[]
  assetMix: AllocationSlice[]
  workingOrders: WorkingOrders
}

export const rangeSummary: Record<
  TimeRange,
  {
    netFlow: number
    requiredCash: number
    coverage: number
    modelChanges: number
    flowNote: string
    coverageNote: string
    syncedAt: string
  }
> = {
  '1D': {
    netFlow: -483_530,
    requiredCash: 8_200_000,
    coverage: 91.6,
    modelChanges: 9,
    flowNote: '12 wire events land in the next 90 minutes',
    coverageNote: '2 accounts are already below policy floor',
    syncedAt: 'Updated 2 min ago',
  },
  '1W': {
    netFlow: 1_460_000,
    requiredCash: 18_300_000,
    coverage: 97.2,
    modelChanges: 21,
    flowNote: 'Midweek coupons narrowed the funding gap',
    coverageNote: '5 accounts still need manual review',
    syncedAt: 'Updated 4 min ago',
  },
  '1M': {
    netFlow: 6_480_000,
    requiredCash: 28_400_000,
    coverage: 102.8,
    modelChanges: 47,
    flowNote: 'Coupon cycle and settlements are net positive',
    coverageNote: '4.3% cushion above mandate minimum',
    syncedAt: 'Updated 2 min ago',
  },
  '1Q': {
    netFlow: 21_800_000,
    requiredCash: 74_200_000,
    coverage: 106.1,
    modelChanges: 113,
    flowNote: 'Quarter-end maturities created the largest tailwind',
    coverageNote: '11 sleeves remain close to tolerance bands',
    syncedAt: 'Updated 9 min ago',
  },
}

export const modelChangeTrend: Record<
  TimeRange,
  Array<{ label: string; changes: number; approvals: number }>
> = {
  '1D': [
    { label: '08:00', changes: 3, approvals: 2 },
    { label: '09:00', changes: 5, approvals: 4 },
    { label: '10:00', changes: 4, approvals: 3 },
    { label: '11:00', changes: 6, approvals: 5 },
    { label: '12:00', changes: 7, approvals: 5 },
    { label: '13:00', changes: 5, approvals: 4 },
  ],
  '1W': [
    { label: 'Mon', changes: 10, approvals: 6 },
    { label: 'Tue', changes: 14, approvals: 10 },
    { label: 'Wed', changes: 11, approvals: 8 },
    { label: 'Thu', changes: 17, approvals: 12 },
    { label: 'Fri', changes: 13, approvals: 10 },
  ],
  '1M': [
    { label: 'W1', changes: 12, approvals: 8 },
    { label: 'W2', changes: 17, approvals: 13 },
    { label: 'W3', changes: 15, approvals: 11 },
    { label: 'W4', changes: 21, approvals: 17 },
    { label: 'W5', changes: 19, approvals: 16 },
  ],
  '1Q': [
    { label: 'Jan', changes: 28, approvals: 22 },
    { label: 'Feb', changes: 35, approvals: 27 },
    { label: 'Mar', changes: 41, approvals: 34 },
    { label: 'Apr', changes: 37, approvals: 29 },
  ],
}

export const bondCashFlow: Record<
  TimeRange,
  Array<{ label: string; expected: number; committed: number }>
> = {
  '1D': [
    { label: '08:00', expected: 420_000, committed: 300_000 },
    { label: '09:30', expected: 680_000, committed: 440_000 },
    { label: '11:00', expected: 540_000, committed: 390_000 },
    { label: '12:30', expected: 770_000, committed: 620_000 },
    { label: '14:00', expected: 940_000, committed: 710_000 },
  ],
  '1W': [
    { label: 'Mon', expected: 2_000_000, committed: 1_400_000 },
    { label: 'Tue', expected: 1_600_000, committed: 1_100_000 },
    { label: 'Wed', expected: 2_500_000, committed: 1_900_000 },
    { label: 'Thu', expected: 2_200_000, committed: 1_700_000 },
    { label: 'Fri', expected: 1_800_000, committed: 1_300_000 },
  ],
  '1M': [
    { label: 'W1', expected: 4_100_000, committed: 3_300_000 },
    { label: 'W2', expected: 5_600_000, committed: 4_200_000 },
    { label: 'W3', expected: 4_400_000, committed: 3_700_000 },
    { label: 'W4', expected: 6_100_000, committed: 4_800_000 },
    { label: 'W5', expected: 5_200_000, committed: 4_300_000 },
  ],
  '1Q': [
    { label: 'Jan', expected: 14_400_000, committed: 10_800_000 },
    { label: 'Feb', expected: 12_800_000, committed: 9_400_000 },
    { label: 'Mar', expected: 16_300_000, committed: 12_100_000 },
    { label: 'Apr', expected: 13_700_000, committed: 10_500_000 },
  ],
}

export const modelChangeHighlights = [
  { model: 'Tax Aware Core', changes: 12, accounts: 42, lastUpdated: '09:42 AM' },
  { model: 'Municipal Ladder', changes: 9, accounts: 31, lastUpdated: '10:16 AM' },
  { model: 'Balanced Growth', changes: 7, accounts: 18, lastUpdated: '10:33 AM' },
]

export const toleranceBands = [
  { name: 'Tracking error', current: 68, limit: 72, accounts: 27 },
  { name: 'Liquidity floor', current: 79, limit: 75, accounts: 13 },
  { name: 'Cash drag', current: 46, limit: 58, accounts: 22 },
  { name: 'Credit drift', current: 61, limit: 63, accounts: 11 },
]

export const sizeSpread = [
  { label: 'Equity sleeves', smallest: 165_000, largest: 940_000 },
  { label: 'Income sleeves', smallest: 120_000, largest: 780_000 },
  { label: 'Tax aware sleeves', smallest: 96_000, largest: 660_000 },
]

const liquiditySeriesByRange: Record<TimeRange, LiquidityPoint[]> = {
  '1D': [
    { label: '08:00', inflow: 1_100_000, requiredCash: 1_450_000, buffer: 780_000 },
    { label: '09:00', inflow: 1_380_000, requiredCash: 1_620_000, buffer: 810_000 },
    { label: '10:00', inflow: 1_240_000, requiredCash: 1_700_000, buffer: 760_000 },
    { label: '11:00', inflow: 1_520_000, requiredCash: 1_540_000, buffer: 870_000 },
    { label: '12:00', inflow: 1_630_000, requiredCash: 1_570_000, buffer: 920_000 },
    { label: '13:00', inflow: 1_540_000, requiredCash: 1_600_000, buffer: 900_000 },
  ],
  '1W': [
    { label: 'Mon', inflow: 3_200_000, requiredCash: 3_500_000, buffer: 1_900_000 },
    { label: 'Tue', inflow: 4_000_000, requiredCash: 3_900_000, buffer: 2_100_000 },
    { label: 'Wed', inflow: 4_600_000, requiredCash: 4_200_000, buffer: 2_300_000 },
    { label: 'Thu', inflow: 4_100_000, requiredCash: 4_000_000, buffer: 2_100_000 },
    { label: 'Fri', inflow: 4_800_000, requiredCash: 4_300_000, buffer: 2_500_000 },
  ],
  '1M': [
    { label: 'W1', inflow: 5_800_000, requiredCash: 5_200_000, buffer: 2_400_000 },
    { label: 'W2', inflow: 6_200_000, requiredCash: 5_900_000, buffer: 2_700_000 },
    { label: 'W3', inflow: 5_400_000, requiredCash: 5_800_000, buffer: 2_200_000 },
    { label: 'W4', inflow: 7_100_000, requiredCash: 6_000_000, buffer: 3_000_000 },
    { label: 'W5', inflow: 6_500_000, requiredCash: 5_500_000, buffer: 2_900_000 },
  ],
  '1Q': [
    { label: 'Jan', inflow: 14_100_000, requiredCash: 12_200_000, buffer: 5_300_000 },
    { label: 'Feb', inflow: 13_600_000, requiredCash: 12_800_000, buffer: 4_900_000 },
    { label: 'Mar', inflow: 16_900_000, requiredCash: 13_500_000, buffer: 6_200_000 },
    { label: 'Apr', inflow: 15_200_000, requiredCash: 12_700_000, buffer: 5_700_000 },
  ],
}

function buildPortfolio(
  summaryAdjustments: SummaryAdjustments,
  totalTradableCash: number,
  primarySector: string,
  liquidityProjection: PortfolioProfile['liquidityProjection'],
  accounts: AccountRisk[],
  tradeRequests: TradeRequest[],
  topPositions: TopPosition[],
  driftRows: DriftRow[],
  cashSleeves: CashSleeve[],
  alerts: AlertItem[],
  sectorAllocation: AllocationSlice[],
  assetMix: AllocationSlice[],
  workingOrders: WorkingOrders,
): PortfolioProfile {
  return {
    summaryAdjustments,
    totalTradableCash,
    primarySector,
    liquidityProjection,
    liquiditySeries: liquiditySeriesByRange,
    accounts,
    tradeRequests,
    topPositions,
    driftRows,
    cashSleeves,
    alerts,
    sectorAllocation,
    assetMix,
    workingOrders,
  }
}

export const portfolioData: Record<PortfolioKey, PortfolioProfile> = {
  'All mandates': buildPortfolio(
    {
      netFlowOffset: 0,
      requiredCashOffset: 0,
      coverageShift: 0,
      modelShift: 0,
    },
    20_300_000,
    'Technology',
    {
      inflow: 16_400_000,
      gap: -2_600_000,
      buffer: 4_900_000,
      confidence: 92.4,
      note: 'Automated sweeps cover most of the gap before the noon redemption cycle.',
    },
    [
      {
        id: 'acct-1',
        name: 'ACME Income',
        owner: 'Northwell Advisors',
        currentCash: 12_800_000,
        requiredCash: 14_000_000,
        coverage: 91.4,
        nextAction: 'Rotate the 1:30 PM treasury maturity into the funding sleeve before the next wire batch.',
        status: 'watch',
      },
      {
        id: 'acct-2',
        name: 'Harbor Pension',
        owner: 'Capital Harbor',
        currentCash: 6_200_000,
        requiredCash: 8_000_000,
        coverage: 77.5,
        nextAction: 'Escalate to trading for two liquidation candidates already pre-approved by the desk.',
        status: 'critical',
      },
      {
        id: 'acct-3',
        name: 'Summit Balanced',
        owner: 'Summit Private Office',
        currentCash: 9_400_000,
        requiredCash: 9_100_000,
        coverage: 103.2,
        nextAction: 'Keep the current sweep in place and monitor only if the market-on-close basket grows.',
        status: 'healthy',
      },
      {
        id: 'acct-4',
        name: 'Crescent Tax Aware',
        owner: 'Crescent Wealth',
        currentCash: 5_500_000,
        requiredCash: 6_100_000,
        coverage: 90.2,
        nextAction: 'Pull forward the muni coupon settlement to tighten the afternoon coverage band.',
        status: 'watch',
      },
    ],
    [
      {
        id: 'req-1',
        title: 'Raise cash for redemptions',
        description: 'Two balanced mandates need same-day funding before cutoff.',
        desk: 'Funding desk',
        volume: 4_600_000,
        accounts: 2,
        eta: 'Due 2:15 PM',
        nextMove: 'Sequence the orders after the tax-aware basket so the liquidity sleeve stays above threshold.',
        category: 'Funding',
        priority: 'Immediate',
      },
      {
        id: 'req-2',
        title: 'Reduce drift in growth sleeve',
        description: 'Technology names are sitting above the tolerance band.',
        desk: 'Model operations',
        volume: 3_200_000,
        accounts: 6,
        eta: 'Queue for close',
        nextMove: 'Apply the prepared trim list and review the macro hedge only if volatility accelerates again.',
        category: 'Trading',
        priority: 'Today',
      },
      {
        id: 'req-3',
        title: 'Sweep idle cash from muni book',
        description: 'Idle cash is above the carry target after coupon receipts.',
        desk: 'Treasury',
        volume: 1_800_000,
        accounts: 4,
        eta: 'Before 4:00 PM',
        nextMove: 'Shift the sleeve into short dated paper once the redemption wires settle.',
        category: 'Funding',
        priority: 'Today',
      },
      {
        id: 'req-4',
        title: 'Recheck credit cap',
        description: 'One ladder strategy may breach credit spread guardrails.',
        desk: 'Risk controls',
        volume: 950_000,
        accounts: 1,
        eta: 'Needs approval',
        nextMove: 'Hold the trade ticket until risk signs off on the revised issuer concentration snapshot.',
        category: 'Risk',
        priority: 'Monitor',
      },
    ],
    [
      {
        name: 'NVIDIA',
        symbol: 'NVDA',
        value: 8_800_000,
        weight: 8.4,
        color: designSystem.chartPalette[0],
      },
      {
        name: 'Microsoft',
        symbol: 'MSFT',
        value: 8_100_000,
        weight: 7.7,
        color: designSystem.chartPalette[1],
      },
      {
        name: 'Amazon',
        symbol: 'AMZN',
        value: 6_400_000,
        weight: 6.2,
        color: designSystem.chartPalette[2],
      },
      {
        name: 'Apple',
        symbol: 'AAPL',
        value: 5_900_000,
        weight: 5.6,
        color: designSystem.chartPalette[3],
      },
      {
        name: 'Broadcom',
        symbol: 'AVGO',
        value: 4_700_000,
        weight: 4.3,
        color: designSystem.chartPalette[4],
      },
    ],
    [
      { sleeve: 'Balanced Core', symbol: 'NVDA', drift: 3.7, limit: 3.2, action: 'Trim' },
      { sleeve: 'Income Plus', symbol: 'MSFT', drift: 2.6, limit: 2.8, action: 'Monitor' },
      { sleeve: 'Tax Aware', symbol: 'AMZN', drift: 3.1, limit: 2.7, action: 'Rebalance' },
      { sleeve: 'Large Cap', symbol: 'AAPL', drift: 2.4, limit: 2.5, action: 'Hold' },
    ],
    [
      { label: 'Intraday liquidity', amount: 10_800_000, share: 54 },
      { label: 'Settlement sleeve', amount: 5_200_000, share: 26 },
      { label: 'Pending wires', amount: 2_900_000, share: 14 },
      { label: 'Safety buffer', amount: 1_400_000, share: 6 },
    ],
    [
      {
        id: 'alert-1',
        title: 'Funding floor breached',
        description: 'Harbor Pension dropped below the mandated liquidity floor.',
        owner: 'Treasury desk',
        time: '9 min ago',
        category: 'Funding',
        severity: 'high',
      },
      {
        id: 'alert-2',
        title: 'Technology drift widening',
        description: 'Growth sleeve moved 50 bps past the policy band after the open.',
        owner: 'Model ops',
        time: '14 min ago',
        category: 'Trading',
        severity: 'medium',
      },
      {
        id: 'alert-3',
        title: 'Credit cap check required',
        description: 'One muni ladder needs approval before adding to the issuer.',
        owner: 'Risk team',
        time: '18 min ago',
        category: 'Risk',
        severity: 'medium',
      },
      {
        id: 'alert-4',
        title: 'Wire queue healthy',
        description: 'Morning wires are clearing on schedule with no exceptions.',
        owner: 'Payments bot',
        time: '22 min ago',
        category: 'Funding',
        severity: 'low',
      },
    ],
    [
      { name: 'Technology', value: 34, color: designSystem.chartPalette[0] },
      { name: 'Healthcare', value: 18, color: designSystem.chartPalette[1] },
      { name: 'Industrials', value: 14, color: designSystem.chartPalette[2] },
      { name: 'Financials', value: 12, color: designSystem.chartPalette[3] },
      { name: 'Consumer', value: 11, color: designSystem.chartPalette[4] },
      { name: 'Other', value: 11, color: designSystem.chartPalette[5] },
    ],
    [
      { name: 'Equities', value: 61, color: designSystem.chartPalette[0] },
      { name: 'Municipals', value: 16, color: designSystem.chartPalette[1] },
      { name: 'Credit', value: 11, color: designSystem.chartPalette[2] },
      { name: 'Treasuries', value: 7, color: designSystem.chartPalette[3] },
      { name: 'Cash', value: 5, color: designSystem.chartPalette[5] },
    ],
    { open: 34, queued: 11, blocked: 3, delayed: 5, automation: 82 },
  ),
  'Income Focus': buildPortfolio(
    {
      netFlowOffset: -1_180_000,
      requiredCashOffset: 3_200_000,
      coverageShift: -5.2,
      modelShift: -14,
    },
    13_800_000,
    'Financials',
    {
      inflow: 11_100_000,
      gap: -4_200_000,
      buffer: 3_400_000,
      confidence: 88.1,
      note: 'Fixed income settlements are dependable, but the next redemption wave still requires manual sequencing.',
    },
    [
      {
        id: 'acct-i1',
        name: 'Liberty Income',
        owner: 'Liberty Family Office',
        currentCash: 7_200_000,
        requiredCash: 8_100_000,
        coverage: 88.9,
        nextAction: 'Move the next coupon receipt into the settlement sleeve before noon.',
        status: 'watch',
      },
      {
        id: 'acct-i2',
        name: 'Pioneer Yield',
        owner: 'Pioneer Advisors',
        currentCash: 4_900_000,
        requiredCash: 6_400_000,
        coverage: 76.6,
        nextAction: 'Use the approved bond trim list to close the gap before the client payout.',
        status: 'critical',
      },
      {
        id: 'acct-i3',
        name: 'North Ridge Income',
        owner: 'North Ridge',
        currentCash: 6_100_000,
        requiredCash: 5_800_000,
        coverage: 105.2,
        nextAction: 'No action required; continue routing residual cash into the ladder.',
        status: 'healthy',
      },
    ],
    [
      {
        id: 'req-i1',
        title: 'Fund client payout',
        description: 'One income mandate needs same-day cash for a scheduled withdrawal.',
        desk: 'Payments',
        volume: 2_700_000,
        accounts: 1,
        eta: 'Due 1:45 PM',
        nextMove: 'Trigger the treasury sweep as soon as the municipal coupon batch posts.',
        category: 'Funding',
        priority: 'Immediate',
      },
      {
        id: 'req-i2',
        title: 'Reinvest excess coupon cash',
        description: 'Carry loss is building in two income sleeves.',
        desk: 'Treasury',
        volume: 1_900_000,
        accounts: 3,
        eta: 'This afternoon',
        nextMove: 'Split the reinvestment between the short treasury ladder and the municipal bucket.',
        category: 'Funding',
        priority: 'Today',
      },
      {
        id: 'req-i3',
        title: 'Reduce issuer concentration',
        description: 'One municipal issuer is nearing the policy cap.',
        desk: 'Risk controls',
        volume: 800_000,
        accounts: 2,
        eta: 'Needs review',
        nextMove: 'Wait for the overnight risk refresh before sending the replacement ticket.',
        category: 'Risk',
        priority: 'Monitor',
      },
    ],
    [
      {
        name: 'JPMorgan',
        symbol: 'JPM',
        value: 4_100_000,
        weight: 6.4,
        color: designSystem.chartPalette[0],
      },
      {
        name: 'Wells Fargo',
        symbol: 'WFC',
        value: 3_800_000,
        weight: 5.9,
        color: designSystem.chartPalette[1],
      },
      {
        name: 'Bank of America',
        symbol: 'BAC',
        value: 3_600_000,
        weight: 5.5,
        color: designSystem.chartPalette[2],
      },
      {
        name: 'AT&T',
        symbol: 'T',
        value: 3_200_000,
        weight: 4.8,
        color: designSystem.chartPalette[3],
      },
    ],
    [
      { sleeve: 'Income Core', symbol: 'JPM', drift: 2.9, limit: 2.6, action: 'Trim' },
      { sleeve: 'Muni Ladder', symbol: 'BAC', drift: 1.8, limit: 2.1, action: 'Hold' },
      { sleeve: 'Dividend Yield', symbol: 'T', drift: 2.2, limit: 2.0, action: 'Rebalance' },
    ],
    [
      { label: 'Income reserve', amount: 6_100_000, share: 44 },
      { label: 'Coupon settlements', amount: 4_000_000, share: 29 },
      { label: 'Pending payouts', amount: 2_100_000, share: 15 },
      { label: 'Safety buffer', amount: 1_600_000, share: 12 },
    ],
    [
      {
        id: 'alert-i1',
        title: 'Client payout due today',
        description: 'Pioneer Yield requires a same-day withdrawal by 1:45 PM.',
        owner: 'Payments',
        time: '6 min ago',
        category: 'Funding',
        severity: 'high',
      },
      {
        id: 'alert-i2',
        title: 'Issuer cap near limit',
        description: 'Municipal ladder is approaching the issuer concentration guardrail.',
        owner: 'Risk team',
        time: '15 min ago',
        category: 'Risk',
        severity: 'medium',
      },
      {
        id: 'alert-i3',
        title: 'Coupon batch posted',
        description: 'Morning coupon settlements are ready for reinvestment.',
        owner: 'Treasury bot',
        time: '28 min ago',
        category: 'Funding',
        severity: 'low',
      },
    ],
    [
      { name: 'Financials', value: 28, color: designSystem.chartPalette[0] },
      { name: 'Utilities', value: 19, color: designSystem.chartPalette[1] },
      { name: 'Healthcare', value: 16, color: designSystem.chartPalette[2] },
      { name: 'Real estate', value: 14, color: designSystem.chartPalette[3] },
      { name: 'Other', value: 23, color: designSystem.chartPalette[4] },
    ],
    [
      { name: 'Investment grade', value: 37, color: designSystem.chartPalette[0] },
      { name: 'Municipals', value: 26, color: designSystem.chartPalette[1] },
      { name: 'Dividend equities', value: 21, color: designSystem.chartPalette[2] },
      { name: 'Treasuries', value: 9, color: designSystem.chartPalette[3] },
      { name: 'Cash', value: 7, color: designSystem.chartPalette[5] },
    ],
    { open: 19, queued: 8, blocked: 2, delayed: 4, automation: 76 },
  ),
  'Balanced Core': buildPortfolio(
    {
      netFlowOffset: 780_000,
      requiredCashOffset: -1_600_000,
      coverageShift: 2.8,
      modelShift: 6,
    },
    17_600_000,
    'Industrials',
    {
      inflow: 14_300_000,
      gap: -1_100_000,
      buffer: 5_100_000,
      confidence: 94.2,
      note: 'Balanced mandates are in the healthiest position, with redemptions largely offset by settlement inflows.',
    },
    [
      {
        id: 'acct-b1',
        name: 'Cedar Balanced',
        owner: 'Cedar Partners',
        currentCash: 8_600_000,
        requiredCash: 8_100_000,
        coverage: 106.2,
        nextAction: 'None right now; the portfolio can absorb the next rebalance cycle.',
        status: 'healthy',
      },
      {
        id: 'acct-b2',
        name: 'Harbor Core',
        owner: 'Harbor Wealth',
        currentCash: 6_400_000,
        requiredCash: 6_800_000,
        coverage: 94.1,
        nextAction: 'Top up the settlement sleeve if the close basket grows above expectations.',
        status: 'watch',
      },
      {
        id: 'acct-b3',
        name: 'Riverview Blend',
        owner: 'Riverview Advisors',
        currentCash: 5_100_000,
        requiredCash: 4_700_000,
        coverage: 108.5,
        nextAction: 'Maintain the current hedge posture and monitor only for late-day drift.',
        status: 'healthy',
      },
    ],
    [
      {
        id: 'req-b1',
        title: 'Trim equity overweight',
        description: 'Core balanced sleeves are leaning too far into cyclicals.',
        desk: 'Model operations',
        volume: 2_400_000,
        accounts: 5,
        eta: 'Into the close',
        nextMove: 'Use the balanced trim basket and keep proceeds in the short treasury sleeve until tomorrow.',
        category: 'Trading',
        priority: 'Today',
      },
      {
        id: 'req-b2',
        title: 'Refresh cash buffer',
        description: 'Raise a modest reserve ahead of tomorrow’s withdrawal file.',
        desk: 'Treasury',
        volume: 1_300_000,
        accounts: 2,
        eta: 'Before 3:30 PM',
        nextMove: 'Shift from the settlement sleeve first so no equity sale is needed.',
        category: 'Funding',
        priority: 'Monitor',
      },
    ],
    [
      {
        name: 'Honeywell',
        symbol: 'HON',
        value: 4_600_000,
        weight: 5.1,
        color: designSystem.chartPalette[0],
      },
      {
        name: 'UnitedHealth',
        symbol: 'UNH',
        value: 4_200_000,
        weight: 4.8,
        color: designSystem.chartPalette[1],
      },
      {
        name: 'Procter & Gamble',
        symbol: 'PG',
        value: 3_900_000,
        weight: 4.4,
        color: designSystem.chartPalette[2],
      },
      {
        name: 'Visa',
        symbol: 'V',
        value: 3_600_000,
        weight: 4.1,
        color: designSystem.chartPalette[3],
      },
    ],
    [
      { sleeve: 'Balanced Core', symbol: 'HON', drift: 2.5, limit: 2.8, action: 'Hold' },
      { sleeve: 'Balanced Core', symbol: 'UNH', drift: 2.9, limit: 2.6, action: 'Trim' },
      { sleeve: 'Balanced Growth', symbol: 'V', drift: 2.3, limit: 2.1, action: 'Rebalance' },
    ],
    [
      { label: 'Settlement sleeve', amount: 7_100_000, share: 40 },
      { label: 'Rebalance reserve', amount: 4_500_000, share: 26 },
      { label: 'Pending withdrawals', amount: 3_100_000, share: 18 },
      { label: 'Safety buffer', amount: 2_900_000, share: 16 },
    ],
    [
      {
        id: 'alert-b1',
        title: 'Cyclical tilt expanding',
        description: 'Balanced Growth moved above the cyclical exposure target this morning.',
        owner: 'Model ops',
        time: '11 min ago',
        category: 'Trading',
        severity: 'medium',
      },
      {
        id: 'alert-b2',
        title: 'Coverage remains healthy',
        description: 'All balanced accounts are above the same-day funding floor.',
        owner: 'Treasury bot',
        time: '20 min ago',
        category: 'Funding',
        severity: 'low',
      },
    ],
    [
      { name: 'Industrials', value: 22, color: designSystem.chartPalette[0] },
      { name: 'Healthcare', value: 20, color: designSystem.chartPalette[1] },
      { name: 'Consumer', value: 18, color: designSystem.chartPalette[2] },
      { name: 'Technology', value: 17, color: designSystem.chartPalette[3] },
      { name: 'Other', value: 23, color: designSystem.chartPalette[4] },
    ],
    [
      { name: 'Equities', value: 54, color: designSystem.chartPalette[0] },
      { name: 'Core bonds', value: 24, color: designSystem.chartPalette[1] },
      { name: 'Treasuries', value: 12, color: designSystem.chartPalette[2] },
      { name: 'Cash', value: 10, color: designSystem.chartPalette[5] },
    ],
    { open: 22, queued: 6, blocked: 1, delayed: 2, automation: 88 },
  ),
  'Opportunistic': buildPortfolio(
    {
      netFlowOffset: 2_100_000,
      requiredCashOffset: -2_900_000,
      coverageShift: 4.9,
      modelShift: 13,
    },
    15_900_000,
    'Technology',
    {
      inflow: 12_700_000,
      gap: 800_000,
      buffer: 5_800_000,
      confidence: 90.7,
      note: 'The opportunistic book has the widest upside but needs tighter drift management around concentrated names.',
    },
    [
      {
        id: 'acct-o1',
        name: 'Frontier Growth',
        owner: 'Frontier Capital',
        currentCash: 5_700_000,
        requiredCash: 5_100_000,
        coverage: 111.8,
        nextAction: 'No funding action needed; focus remains on trimming concentration.',
        status: 'healthy',
      },
      {
        id: 'acct-o2',
        name: 'Catalyst Tactical',
        owner: 'Catalyst',
        currentCash: 4_200_000,
        requiredCash: 4_600_000,
        coverage: 91.3,
        nextAction: 'Keep the buffer intact until the tactical basket is complete.',
        status: 'watch',
      },
      {
        id: 'acct-o3',
        name: 'Vertex Alpha',
        owner: 'Vertex Partners',
        currentCash: 3_400_000,
        requiredCash: 3_900_000,
        coverage: 87.2,
        nextAction: 'Raise cash by trimming the top semiconductor position before the close.',
        status: 'watch',
      },
    ],
    [
      {
        id: 'req-o1',
        title: 'Trim semiconductor concentration',
        description: 'One tactical sleeve is pressing the concentration cap.',
        desk: 'Growth desk',
        volume: 3_900_000,
        accounts: 3,
        eta: 'Before close',
        nextMove: 'Use the staged trim basket and route proceeds into the tactical cash sleeve.',
        category: 'Trading',
        priority: 'Immediate',
      },
      {
        id: 'req-o2',
        title: 'Deploy dry powder',
        description: 'Cash reserve is above the tactical target after this week’s unwind.',
        desk: 'Opportunity desk',
        volume: 2_600_000,
        accounts: 2,
        eta: 'Tomorrow open',
        nextMove: 'Keep the reserve overnight and re-enter only if volatility stays constructive.',
        category: 'Trading',
        priority: 'Today',
      },
    ],
    [
      {
        name: 'NVIDIA',
        symbol: 'NVDA',
        value: 7_600_000,
        weight: 10.8,
        color: designSystem.chartPalette[0],
      },
      {
        name: 'Broadcom',
        symbol: 'AVGO',
        value: 5_900_000,
        weight: 8.6,
        color: designSystem.chartPalette[1],
      },
      {
        name: 'Meta',
        symbol: 'META',
        value: 5_400_000,
        weight: 7.9,
        color: designSystem.chartPalette[2],
      },
      {
        name: 'CrowdStrike',
        symbol: 'CRWD',
        value: 4_100_000,
        weight: 5.4,
        color: designSystem.chartPalette[3],
      },
    ],
    [
      { sleeve: 'Tactical Growth', symbol: 'NVDA', drift: 4.2, limit: 3.3, action: 'Trim' },
      { sleeve: 'Momentum', symbol: 'AVGO', drift: 3.6, limit: 3.1, action: 'Rebalance' },
      { sleeve: 'AI Leaders', symbol: 'META', drift: 2.9, limit: 3.0, action: 'Hold' },
    ],
    [
      { label: 'Dry powder', amount: 6_400_000, share: 40 },
      { label: 'Tactical reserve', amount: 4_200_000, share: 26 },
      { label: 'Pending settlements', amount: 3_100_000, share: 19 },
      { label: 'Safety buffer', amount: 2_200_000, share: 15 },
    ],
    [
      {
        id: 'alert-o1',
        title: 'Concentration cap nearing breach',
        description: 'Semiconductor exposure is above the tactical band in one sleeve.',
        owner: 'Risk team',
        time: '4 min ago',
        category: 'Risk',
        severity: 'high',
      },
      {
        id: 'alert-o2',
        title: 'Cash reserve above target',
        description: 'Dry powder is waiting for re-entry conditions.',
        owner: 'Growth desk',
        time: '17 min ago',
        category: 'Trading',
        severity: 'medium',
      },
    ],
    [
      { name: 'Technology', value: 46, color: designSystem.chartPalette[0] },
      { name: 'Communication', value: 17, color: designSystem.chartPalette[1] },
      { name: 'Industrials', value: 12, color: designSystem.chartPalette[2] },
      { name: 'Healthcare', value: 9, color: designSystem.chartPalette[3] },
      { name: 'Other', value: 16, color: designSystem.chartPalette[4] },
    ],
    [
      { name: 'Growth equities', value: 69, color: designSystem.chartPalette[0] },
      { name: 'Options overlays', value: 9, color: designSystem.chartPalette[1] },
      { name: 'Treasuries', value: 10, color: designSystem.chartPalette[2] },
      { name: 'Cash', value: 12, color: designSystem.chartPalette[5] },
    ],
    { open: 27, queued: 9, blocked: 2, delayed: 3, automation: 80 },
  ),
}

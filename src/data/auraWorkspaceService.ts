import {
  scenarioById,
  threadById,
  threads,
  type ChatThread,
  type MarketId,
  type ScenarioId,
} from './auraDemo'
import {
  initialDocumentsByThreadId,
  threadFeatureById,
  type DocumentSeed,
} from './auraFeatureData'

export type ProposalStage = 'draft' | 'ready' | 'exported' | 'queued'
export type NotificationTone = 'positive' | 'neutral'

export interface ConversationMessage {
  id: string
  role: 'assistant' | 'user'
  text: string
  createdAt: string
  scenarioId?: ScenarioId
  variant: 'plain' | 'analysis'
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  time: string
  tone: NotificationTone
  read: boolean
  archived: boolean
  threadId?: string
  scenarioId?: ScenarioId
  documentId?: string
  target?: 'thread' | 'proposal' | 'document'
}

export interface DocumentArtifact extends DocumentSeed {
  read: boolean
}

export interface ProposalChecklistState {
  id: string
  label: string
  complete: boolean
  owner: string
}

export interface ProposalTradeState {
  id: string
  action: string
  ticker: string
  name: string
  shift: string
  notional: string
  note: string
  accountId: string
  included: boolean
  owner: string
  status: 'draft' | 'review' | 'approved'
  comment: string
}

export interface ProposalDraftState {
  scenarioId: ScenarioId
  owner: string
  reviewer: string
  comments: string[]
  checklist: ProposalChecklistState[]
  trades: ProposalTradeState[]
}

export interface ThreadWorkspaceState {
  activeScenarioId: ScenarioId
  activeAnalysisId: string | null
  proposalStage: ProposalStage
  advisorQueued: boolean
  activeAccountId: string
  pinnedAnalysisIds: string[]
  compareAnalysisIds: string[]
  summaryCard: string
  conversation: ConversationMessage[]
  documents: DocumentArtifact[]
  proposalDraftByScenarioId: Partial<Record<ScenarioId, ProposalDraftState>>
}

export interface AuraWorkspaceState {
  activeThreadId: string
  activeMarketId: MarketId
  notifications: NotificationItem[]
  threadStateById: Record<string, ThreadWorkspaceState>
  lastSyncedAt: string
}

export function getInitialWorkspaceState(): AuraWorkspaceState {
  return readWorkspaceState()
}

export async function selectActiveThread(
  workspace: AuraWorkspaceState,
  threadId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState({
    ...workspace,
    activeThreadId: threadId,
    activeMarketId: threadById[threadId].focusMarketId,
  })
}

export async function selectActiveMarket(
  workspace: AuraWorkspaceState,
  marketId: MarketId,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState({
    ...workspace,
    activeMarketId: marketId,
  })
}

export async function submitPromptToWorkspace(
  workspace: AuraWorkspaceState,
  threadId: string,
  promptText: string,
  nextScenarioId: ScenarioId,
): Promise<AuraWorkspaceState> {
  const scenario = scenarioById[nextScenarioId]
  const userMessage = createMessage('user', promptText)
  const assistantMessage = createMessage('assistant', scenario.responseText, {
    scenarioId: nextScenarioId,
    variant: 'analysis',
  })

  const nextWorkspace = withThreadState(workspace, threadId, (threadState) => ({
    ...threadState,
    activeScenarioId: nextScenarioId,
    activeAnalysisId: assistantMessage.id,
    proposalStage: threadState.proposalStage === 'queued' ? 'queued' : 'draft',
    conversation: [...threadState.conversation.map(cloneMessage), userMessage, assistantMessage],
  }))

  return persistWorkspaceState({
    ...nextWorkspace,
    activeThreadId: threadId,
  })
}

export async function appendAssistantNoteToWorkspace(
  workspace: AuraWorkspaceState,
  threadId: string,
  text: string,
  notification?: {
    title: string
    body: string
    tone?: NotificationTone
    options?: Partial<NotificationItem>
  },
): Promise<AuraWorkspaceState> {
  const note = createMessage('assistant', text)
  const nextWorkspace = withThreadState(workspace, threadId, (threadState) => ({
    ...threadState,
    conversation: [...threadState.conversation.map(cloneMessage), note],
  }))

  return persistWorkspaceState({
    ...nextWorkspace,
    notifications: notification
      ? pushNotification(
          nextWorkspace.notifications,
          notification.title,
          notification.body,
          notification.tone,
          notification.options,
        )
      : nextWorkspace.notifications,
  })
}

export async function resetThreadWorkspace(
  workspace: AuraWorkspaceState,
  threadId: string,
): Promise<AuraWorkspaceState> {
  const resetState = buildThreadWorkspaceState(threadById[threadId])

  return persistWorkspaceState({
    ...workspace,
    activeThreadId: threadId,
    threadStateById: {
      ...workspace.threadStateById,
      [threadId]: resetState,
    },
  })
}

export async function ensureProposalReady(
  workspace: AuraWorkspaceState,
  threadId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      proposalStage: threadState.proposalStage === 'draft' ? 'ready' : threadState.proposalStage,
    })),
  )
}

export async function exportProposalMemo(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId: ScenarioId,
): Promise<AuraWorkspaceState> {
  const scenario = scenarioById[scenarioId]
  const nextWorkspace = withThreadState(workspace, threadId, (threadState) => ({
    ...threadState,
    proposalStage: 'exported',
  }))

  return persistWorkspaceState({
    ...nextWorkspace,
    notifications: pushNotification(
      nextWorkspace.notifications,
      'Investment memo exported',
      `${scenario.proposal.title} was packaged for advisor distribution with account and trade details.`,
      'positive',
      { threadId, scenarioId, target: 'proposal' },
    ),
  })
}

export async function queueProposalReview(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId: ScenarioId,
): Promise<AuraWorkspaceState> {
  const scenario = scenarioById[scenarioId]
  const nextWorkspace = withThreadState(workspace, threadId, (threadState) => ({
    ...threadState,
    proposalStage: 'queued',
    advisorQueued: true,
  }))

  return persistWorkspaceState({
    ...nextWorkspace,
    notifications: pushNotification(
      nextWorkspace.notifications,
      'Advisor review queued',
      `${scenario.proposal.title} is now in the advisor review queue with the active trade basket attached.`,
      'positive',
      { threadId, scenarioId, target: 'proposal' },
    ),
  })
}

export async function toggleAdvisorQueue(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId: ScenarioId,
): Promise<AuraWorkspaceState> {
  const scenario = scenarioById[scenarioId]
  const household = threadById[threadId].household
  const currentThreadState = workspace.threadStateById[threadId] ?? buildThreadWorkspaceState(threadById[threadId])
  const nextQueued = !currentThreadState.advisorQueued

  const nextWorkspace = withThreadState(workspace, threadId, (threadState) => ({
    ...threadState,
    advisorQueued: nextQueued,
    proposalStage: nextQueued && threadState.proposalStage === 'draft' ? 'queued' : threadState.proposalStage,
  }))

  return persistWorkspaceState({
    ...nextWorkspace,
    notifications: nextQueued
        ? pushNotification(
            nextWorkspace.notifications,
            'Human handoff prepared',
            `${scenario.label} context and proposal notes were added to the advisor queue for ${household}.`,
            'positive',
            { threadId, scenarioId, target: 'proposal' },
          )
      : nextWorkspace.notifications,
  })
}

export async function pushWorkspaceNotification(
  workspace: AuraWorkspaceState,
  title: string,
  body: string,
  tone: NotificationTone = 'neutral',
  options: Partial<NotificationItem> = {},
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState({
    ...workspace,
    notifications: pushNotification(workspace.notifications, title, body, tone, options),
  })
}

export async function selectActiveAccount(
  workspace: AuraWorkspaceState,
  threadId: string,
  accountId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      activeAccountId: accountId,
    })),
  )
}

export async function togglePinnedAnalysis(
  workspace: AuraWorkspaceState,
  threadId: string,
  analysisId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      pinnedAnalysisIds: toggleValue(threadState.pinnedAnalysisIds, analysisId),
    })),
  )
}

export async function toggleComparedAnalysis(
  workspace: AuraWorkspaceState,
  threadId: string,
  analysisId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => {
      const next = toggleValue(threadState.compareAnalysisIds, analysisId).slice(0, 2)

      return {
        ...threadState,
        compareAnalysisIds: next,
      }
    }),
  )
}

export async function generateThreadSummary(
  workspace: AuraWorkspaceState,
  threadId: string,
): Promise<AuraWorkspaceState> {
  const threadState = workspace.threadStateById[threadId]
  const pinned = threadState.pinnedAnalysisIds
    .map((analysisId) =>
      threadState.conversation.find(
        (message) => message.id === analysisId && message.scenarioId && message.variant === 'analysis',
      ),
    )
    .filter((message): message is ConversationMessage & { scenarioId: ScenarioId } => Boolean(message))
  const compared = threadState.compareAnalysisIds
    .map((analysisId) =>
      threadState.conversation.find(
        (message) => message.id === analysisId && message.scenarioId && message.variant === 'analysis',
      ),
    )
    .filter((message): message is ConversationMessage & { scenarioId: ScenarioId } => Boolean(message))
  const summary = compared.length
    ? `Compared ${compared.map((message) => scenarioById[message.scenarioId].label).join(' vs ')} for ${
        threadById[threadId].household
      }. Current recommendation emphasizes ${scenarioById[threadState.activeScenarioId].label.toLowerCase()} with ${
        compared.length > 1 ? 'tradeoffs documented across both analyses.' : 'the selected analysis pinned for follow-up.'
      }${pinned.length ? ` Pinned views: ${pinned.map((message) => scenarioById[message.scenarioId].label).join(', ')}.` : ''}`
    : `Summary for ${threadById[threadId].household}: active recommendation is ${
        scenarioById[threadState.activeScenarioId].label
      }, advisor queue is ${threadState.advisorQueued ? 'engaged' : 'not engaged'}, and ${
        threadState.documents.length
      } source documents are attached.${pinned.length ? ` Pinned views include ${pinned.map((message) => scenarioById[message.scenarioId].label).join(', ')}.` : ''}`

  return persistWorkspaceState(
    withThreadState(workspace, threadId, (current) => ({
      ...current,
      summaryCard: summary,
    })),
  )
}

export async function toggleProposalChecklistItem(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId: ScenarioId,
  checklistId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      proposalDraftByScenarioId: {
        ...threadState.proposalDraftByScenarioId,
        [scenarioId]: {
          ...threadState.proposalDraftByScenarioId[scenarioId]!,
          checklist: threadState.proposalDraftByScenarioId[scenarioId]!.checklist.map((item) =>
            item.id === checklistId ? { ...item, complete: !item.complete } : item,
          ),
        },
      },
    })),
  )
}

export async function updateProposalTrade(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId: ScenarioId,
  tradeId: string,
  patch: Partial<Pick<ProposalTradeState, 'included' | 'owner' | 'comment' | 'status'>>,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      proposalDraftByScenarioId: {
        ...threadState.proposalDraftByScenarioId,
        [scenarioId]: {
          ...threadState.proposalDraftByScenarioId[scenarioId]!,
          trades: threadState.proposalDraftByScenarioId[scenarioId]!.trades.map((trade) =>
            trade.id === tradeId ? { ...trade, ...patch } : trade,
          ),
        },
      },
    })),
  )
}

export async function addProposalComment(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId: ScenarioId,
  comment: string,
): Promise<AuraWorkspaceState> {
  if (!comment.trim()) {
    return workspace
  }

  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      proposalDraftByScenarioId: {
        ...threadState.proposalDraftByScenarioId,
        [scenarioId]: {
          ...threadState.proposalDraftByScenarioId[scenarioId]!,
          comments: [...threadState.proposalDraftByScenarioId[scenarioId]!.comments, comment.trim()],
        },
      },
    })),
  )
}

export async function markNotificationRead(
  workspace: AuraWorkspaceState,
  notificationId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState({
    ...workspace,
    notifications: workspace.notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification,
    ),
  })
}

export async function archiveNotification(
  workspace: AuraWorkspaceState,
  notificationId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState({
    ...workspace,
    notifications: workspace.notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, archived: true, read: true } : notification,
    ),
  })
}

export async function markDocumentRead(
  workspace: AuraWorkspaceState,
  threadId: string,
  documentId: string,
): Promise<AuraWorkspaceState> {
  return persistWorkspaceState(
    withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      documents: threadState.documents.map((document) =>
        document.id === documentId ? { ...document, read: true } : document,
      ),
    })),
  )
}

export async function addDocumentToWorkspace(
  workspace: AuraWorkspaceState,
  threadId: string,
  document: Omit<DocumentSeed, 'id'> & { id?: string },
  noteText?: string,
): Promise<AuraWorkspaceState> {
  const artifact: DocumentArtifact = {
    ...document,
    id: document.id ?? createId('doc'),
    read: false,
  }

  const nextWorkspace = withThreadState(workspace, threadId, (threadState) => ({
    ...threadState,
    documents: [artifact, ...threadState.documents],
    conversation: noteText
      ? [...threadState.conversation.map(cloneMessage), createMessage('assistant', noteText)]
      : threadState.conversation.map(cloneMessage),
  }))

  return persistWorkspaceState({
    ...nextWorkspace,
    notifications: pushNotification(
      nextWorkspace.notifications,
      artifact.kind === 'transcript' ? 'Voice transcript attached' : 'Document intake refreshed',
      `${artifact.title} is now linked to ${threadById[threadId].household}.`,
      artifact.kind === 'transcript' ? 'neutral' : 'positive',
      {
        threadId,
        scenarioId: artifact.scenarioIds[0],
        documentId: artifact.id,
        target: 'document',
      },
    ),
  })
}

export async function focusThreadScenario(
  workspace: AuraWorkspaceState,
  threadId: string,
  scenarioId?: ScenarioId,
): Promise<AuraWorkspaceState> {
  const thread = threadById[threadId]
  const currentThreadState = workspace.threadStateById[threadId] ?? buildThreadWorkspaceState(thread)
  const matchingAnalysis = scenarioId
    ? [...currentThreadState.conversation]
        .reverse()
        .find((message) => message.variant === 'analysis' && message.scenarioId === scenarioId)
    : null

  return persistWorkspaceState({
    ...withThreadState(workspace, threadId, (threadState) => ({
      ...threadState,
      activeScenarioId: scenarioId ?? threadState.activeScenarioId,
      activeAnalysisId: matchingAnalysis?.id ?? threadState.activeAnalysisId,
    })),
    activeThreadId: threadId,
    activeMarketId: thread.focusMarketId,
  })
}

const STORAGE_KEY = 'aura-demo-workspace-v2'

function createId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function formatSyncTime() {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function createMessage(
  role: ConversationMessage['role'],
  text: string,
  options: Partial<Omit<ConversationMessage, 'id' | 'role' | 'text'>> = {},
): ConversationMessage {
  return {
    id: createId('msg'),
    role,
    text,
    createdAt: options.createdAt ?? 'Just now',
    scenarioId: options.scenarioId,
    variant: options.variant ?? 'plain',
  }
}

function createNotification(
  title: string,
  body: string,
  tone: NotificationTone = 'neutral',
  time = 'Just now',
  options: Partial<NotificationItem> = {},
): NotificationItem {
  return {
    id: createId('notice'),
    title,
    body,
    time,
    tone,
    read: options.read ?? false,
    archived: options.archived ?? false,
    threadId: options.threadId,
    scenarioId: options.scenarioId,
    documentId: options.documentId,
    target: options.target,
  }
}

function buildInitialHistory(thread: ChatThread) {
  const scenario = scenarioById[thread.defaultScenarioId]

  return [
    createMessage(
      'assistant',
      `Coverage loaded for ${thread.household}. ${scenario.leadText}`,
      { createdAt: '9:00 AM' },
    ),
    createMessage('user', scenario.userPrompt, {
      createdAt: '9:01 AM',
    }),
    createMessage('assistant', scenario.responseText, {
      createdAt: '9:02 AM',
      scenarioId: scenario.id,
      variant: 'analysis',
    }),
  ]
}

function resolveAccountId(threadId: string, scenarioId: ScenarioId, ticker: string, fallbackName?: string) {
  const accounts = threadFeatureById[threadId].accounts

  if (fallbackName) {
    const directMatch = accounts.find((account) => account.name === fallbackName)
    if (directMatch) {
      return directMatch.id
    }
  }

  if (scenarioId === 'tax') {
    return ticker === 'ARKK' || ticker === 'VB' ? 'tax-satellite' : 'tax-core'
  }

  if (ticker === 'SGOV' || ticker === 'SHY' || ticker === 'IEF' || ticker === 'MUB') {
    return accounts.find((account) => account.id.includes('trust') || account.id.includes('reserve'))?.id ?? accounts[0].id
  }

  if (ticker === 'SCHD' || ticker === 'XLV' || ticker === 'VFH') {
    return accounts.find((account) => account.id.includes('daf'))?.id ?? accounts[0].id
  }

  return accounts[0].id
}

function buildProposalDraftState(thread: ChatThread, scenarioId: ScenarioId): ProposalDraftState {
  const scenario = scenarioById[scenarioId]

  return {
    scenarioId,
    owner: 'Aura',
    reviewer: 'Lead advisor',
    comments: [],
    checklist: scenario.proposal.checklist.map((label, index) => ({
      id: `${scenarioId}-check-${index + 1}`,
      label,
      complete: false,
      owner: index === 0 ? 'Portfolio manager' : index === 1 ? 'Advisor' : 'Operations',
    })),
    trades: scenario.proposal.trades.map((trade, index) => ({
      id: `${scenarioId}-trade-${index + 1}`,
      action: trade.action,
      ticker: trade.ticker,
      name: trade.name,
      shift: trade.shift,
      notional: trade.notional,
      note: trade.note,
      accountId: resolveAccountId(thread.id, scenarioId, trade.ticker, scenario.proposal.accounts[index]?.name),
      included: true,
      owner: index < 2 ? 'Portfolio manager' : 'Trader',
      status: 'draft',
      comment: '',
    })),
  }
}

function buildProposalDraftMap(thread: ChatThread) {
  return Object.fromEntries(
    (Object.keys(scenarioById) as ScenarioId[]).map((scenarioId) => [
      scenarioId,
      buildProposalDraftState(thread, scenarioId),
    ]),
  ) as Partial<Record<ScenarioId, ProposalDraftState>>
}

function buildThreadWorkspaceState(thread: ChatThread): ThreadWorkspaceState {
  const conversation = buildInitialHistory(thread)
  const activeAnalysisId =
    [...conversation].reverse().find((message) => message.variant === 'analysis')?.id ?? null
  const documents = (initialDocumentsByThreadId[thread.id] ?? []).map((document) => ({
    ...document,
    read: false,
  }))

  return {
    activeScenarioId: thread.defaultScenarioId,
    activeAnalysisId,
    proposalStage: 'draft',
    advisorQueued: false,
    activeAccountId: threadFeatureById[thread.id].defaultAccountId,
    pinnedAnalysisIds: [],
    compareAnalysisIds: [],
    summaryCard: `Aura is tracking ${thread.summary.toLowerCase()}`,
    conversation,
    documents,
    proposalDraftByScenarioId: buildProposalDraftMap(thread),
  }
}

function createDefaultWorkspaceState(): AuraWorkspaceState {
  const defaultThread = threads[0]

  return {
    activeThreadId: defaultThread.id,
    activeMarketId: defaultThread.focusMarketId,
    notifications: [
      createNotification(
        'Morning refresh complete',
        'Custodian balances, lots, and benchmark drift were refreshed for all linked US accounts.',
        'positive',
        '8:40 AM',
        { target: 'thread', threadId: defaultThread.id },
      ),
      createNotification(
        'Liquidity watchlist updated',
        'July trust distribution and tuition obligations now appear in the active cash ladder.',
        'neutral',
        '8:52 AM',
        { target: 'thread', threadId: 'trust-income', scenarioId: 'liquidity' },
      ),
    ],
    threadStateById: Object.fromEntries(
      threads.map((thread) => [thread.id, buildThreadWorkspaceState(thread)]),
    ) as Record<string, ThreadWorkspaceState>,
    lastSyncedAt: formatSyncTime(),
  }
}

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function cloneMessage(message: ConversationMessage): ConversationMessage {
  return { ...message }
}

function normalizeThreadState(thread: ChatThread, candidate: unknown): ThreadWorkspaceState {
  const fallback = buildThreadWorkspaceState(thread)

  if (!candidate || typeof candidate !== 'object') {
    return fallback
  }

  const value = candidate as Partial<ThreadWorkspaceState>
  const conversation: ConversationMessage[] = Array.isArray(value.conversation)
    ? value.conversation
        .filter((message): message is ConversationMessage => Boolean(message && typeof message === 'object'))
        .map((message): ConversationMessage => ({
          id: typeof message.id === 'string' ? message.id : createId('msg'),
          role: message.role === 'user' ? 'user' : 'assistant',
          text: typeof message.text === 'string' ? message.text : '',
          createdAt: typeof message.createdAt === 'string' ? message.createdAt : 'Just now',
          scenarioId:
            typeof message.scenarioId === 'string' && message.scenarioId in scenarioById
              ? (message.scenarioId as ScenarioId)
              : undefined,
          variant: message.variant === 'analysis' ? 'analysis' : 'plain',
        }))
    : fallback.conversation.map(cloneMessage)

  const lastAnalysis =
    [...conversation].reverse().find((message) => message.variant === 'analysis') ?? null

  return {
    activeScenarioId:
      typeof value.activeScenarioId === 'string' && value.activeScenarioId in scenarioById
        ? (value.activeScenarioId as ScenarioId)
        : lastAnalysis?.scenarioId ?? thread.defaultScenarioId,
    activeAnalysisId:
      typeof value.activeAnalysisId === 'string'
        ? value.activeAnalysisId
        : lastAnalysis?.id ?? fallback.activeAnalysisId,
    proposalStage:
      value.proposalStage === 'ready' ||
      value.proposalStage === 'exported' ||
      value.proposalStage === 'queued'
        ? value.proposalStage
        : 'draft',
    advisorQueued: Boolean(value.advisorQueued),
    activeAccountId:
      typeof value.activeAccountId === 'string' &&
      threadFeatureById[thread.id].accounts.some((account) => account.id === value.activeAccountId)
        ? value.activeAccountId
        : threadFeatureById[thread.id].defaultAccountId,
    pinnedAnalysisIds: Array.isArray(value.pinnedAnalysisIds)
      ? value.pinnedAnalysisIds.filter((analysisId): analysisId is string => typeof analysisId === 'string')
      : [],
    compareAnalysisIds: Array.isArray(value.compareAnalysisIds)
      ? value.compareAnalysisIds.filter((analysisId): analysisId is string => typeof analysisId === 'string').slice(0, 2)
      : [],
    summaryCard:
      typeof value.summaryCard === 'string' && value.summaryCard.trim()
        ? value.summaryCard
        : fallback.summaryCard,
    conversation,
    documents: Array.isArray(value.documents)
      ? value.documents
          .filter((document): document is DocumentArtifact => Boolean(document && typeof document === 'object'))
          .map((document) => ({
            id: typeof document.id === 'string' ? document.id : createId('doc'),
            kind:
              document.kind === 'memo' || document.kind === 'transcript' ? document.kind : 'statement',
            title: typeof document.title === 'string' ? document.title : 'Untitled document',
            source: typeof document.source === 'string' ? document.source : 'Imported source',
            status: document.status === 'draft' ? 'draft' : 'parsed',
            uploadedAt: typeof document.uploadedAt === 'string' ? document.uploadedAt : 'Just now',
            accountIds: Array.isArray(document.accountIds)
              ? document.accountIds.filter((accountId): accountId is string => typeof accountId === 'string')
              : [],
            scenarioIds: Array.isArray(document.scenarioIds)
              ? document.scenarioIds.filter(
                  (scenarioId): scenarioId is ScenarioId =>
                    typeof scenarioId === 'string' && scenarioId in scenarioById,
                )
              : [],
            highlights: Array.isArray(document.highlights)
              ? document.highlights.filter((highlight): highlight is string => typeof highlight === 'string')
              : [],
            excerpt: typeof document.excerpt === 'string' ? document.excerpt : undefined,
            read: Boolean(document.read),
          }))
      : fallback.documents.map((document) => ({ ...document })),
    proposalDraftByScenarioId: Object.fromEntries(
      (Object.keys(scenarioById) as ScenarioId[]).map((scenarioId) => {
        const fallbackDraft = fallback.proposalDraftByScenarioId[scenarioId]!
        const candidateDraft = value.proposalDraftByScenarioId?.[scenarioId]

        if (!candidateDraft || typeof candidateDraft !== 'object') {
          return [
            scenarioId,
            {
              ...fallbackDraft,
              checklist: fallbackDraft.checklist.map((item) => ({ ...item })),
              trades: fallbackDraft.trades.map((trade) => ({ ...trade })),
              comments: [...fallbackDraft.comments],
            },
          ]
        }

        return [
          scenarioId,
          {
            scenarioId,
            owner:
              typeof candidateDraft.owner === 'string' && candidateDraft.owner.trim()
                ? candidateDraft.owner
                : fallbackDraft.owner,
            reviewer:
              typeof candidateDraft.reviewer === 'string' && candidateDraft.reviewer.trim()
                ? candidateDraft.reviewer
                : fallbackDraft.reviewer,
            comments: Array.isArray(candidateDraft.comments)
              ? candidateDraft.comments.filter((comment): comment is string => typeof comment === 'string')
              : [...fallbackDraft.comments],
            checklist: Array.isArray(candidateDraft.checklist)
              ? candidateDraft.checklist.map((item, index) => ({
                  id: typeof item.id === 'string' ? item.id : fallbackDraft.checklist[index]?.id ?? createId('check'),
                  label:
                    typeof item.label === 'string'
                      ? item.label
                      : fallbackDraft.checklist[index]?.label ?? 'Checklist item',
                  complete: Boolean(item.complete),
                  owner:
                    typeof item.owner === 'string' && item.owner.trim()
                      ? item.owner
                      : fallbackDraft.checklist[index]?.owner ?? 'Advisor',
                }))
              : fallbackDraft.checklist.map((item) => ({ ...item })),
            trades: Array.isArray(candidateDraft.trades)
              ? candidateDraft.trades.map((trade, index) => ({
                  id: typeof trade.id === 'string' ? trade.id : fallbackDraft.trades[index]?.id ?? createId('trade'),
                  action:
                    typeof trade.action === 'string'
                      ? trade.action
                      : fallbackDraft.trades[index]?.action ?? 'Trim',
                  ticker:
                    typeof trade.ticker === 'string'
                      ? trade.ticker
                      : fallbackDraft.trades[index]?.ticker ?? 'TICK',
                  name:
                    typeof trade.name === 'string'
                      ? trade.name
                      : fallbackDraft.trades[index]?.name ?? 'Holding',
                  shift:
                    typeof trade.shift === 'string'
                      ? trade.shift
                      : fallbackDraft.trades[index]?.shift ?? '0 bps',
                  notional:
                    typeof trade.notional === 'string'
                      ? trade.notional
                      : fallbackDraft.trades[index]?.notional ?? '$0',
                  note:
                    typeof trade.note === 'string'
                      ? trade.note
                      : fallbackDraft.trades[index]?.note ?? '',
                  accountId:
                    typeof trade.accountId === 'string'
                      ? trade.accountId
                      : fallbackDraft.trades[index]?.accountId ?? threadFeatureById[thread.id].defaultAccountId,
                  included: typeof trade.included === 'boolean' ? trade.included : true,
                  owner:
                    typeof trade.owner === 'string' && trade.owner.trim()
                      ? trade.owner
                      : fallbackDraft.trades[index]?.owner ?? 'Trader',
                  status:
                    trade.status === 'review' || trade.status === 'approved' ? trade.status : 'draft',
                  comment: typeof trade.comment === 'string' ? trade.comment : '',
                }))
              : fallbackDraft.trades.map((trade) => ({ ...trade })),
          },
        ]
      }),
    ) as Partial<Record<ScenarioId, ProposalDraftState>>,
  }
}

function normalizeWorkspace(candidate: unknown): AuraWorkspaceState {
  const fallback = createDefaultWorkspaceState()

  if (!candidate || typeof candidate !== 'object') {
    return fallback
  }

  const value = candidate as Partial<AuraWorkspaceState>
  const threadStateById = Object.fromEntries(
    threads.map((thread) => [thread.id, normalizeThreadState(thread, value.threadStateById?.[thread.id])]),
  ) as Record<string, ThreadWorkspaceState>

  return {
    activeThreadId:
      typeof value.activeThreadId === 'string' && value.activeThreadId in threadById
        ? value.activeThreadId
        : fallback.activeThreadId,
    activeMarketId:
      value.activeMarketId === 'sp500' || value.activeMarketId === 'nasdaq' || value.activeMarketId === 'ust10y'
        ? value.activeMarketId
        : fallback.activeMarketId,
    notifications: Array.isArray(value.notifications)
      ? value.notifications
          .filter((item): item is NotificationItem => Boolean(item && typeof item === 'object'))
          .map((item) => ({
            id: typeof item.id === 'string' ? item.id : createId('notice'),
            title: typeof item.title === 'string' ? item.title : 'Workflow update',
            body: typeof item.body === 'string' ? item.body : '',
            time: typeof item.time === 'string' ? item.time : 'Just now',
            tone: item.tone === 'positive' ? 'positive' : 'neutral',
            read: Boolean(item.read),
            archived: Boolean(item.archived),
            threadId:
              typeof item.threadId === 'string' && item.threadId in threadById ? item.threadId : undefined,
            scenarioId:
              typeof item.scenarioId === 'string' && item.scenarioId in scenarioById
                ? (item.scenarioId as ScenarioId)
                : undefined,
            documentId: typeof item.documentId === 'string' ? item.documentId : undefined,
            target:
              item.target === 'proposal' || item.target === 'document' || item.target === 'thread'
                ? item.target
                : undefined,
          }))
      : fallback.notifications,
    threadStateById,
    lastSyncedAt: typeof value.lastSyncedAt === 'string' ? value.lastSyncedAt : fallback.lastSyncedAt,
  }
}

function readWorkspaceState() {
  if (!hasWindow()) {
    return createDefaultWorkspaceState()
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? normalizeWorkspace(JSON.parse(stored)) : createDefaultWorkspaceState()
  } catch {
    return createDefaultWorkspaceState()
  }
}

function persistWorkspaceState(workspace: AuraWorkspaceState) {
  const stampedWorkspace = {
    ...workspace,
    lastSyncedAt: formatSyncTime(),
  }

  if (hasWindow()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stampedWorkspace))
  }

  return stampedWorkspace
}

function withThreadState(
  workspace: AuraWorkspaceState,
  threadId: string,
  updater: (threadState: ThreadWorkspaceState) => ThreadWorkspaceState,
) {
  const currentThreadState = workspace.threadStateById[threadId] ?? buildThreadWorkspaceState(threadById[threadId])

  return {
    ...workspace,
    threadStateById: {
      ...workspace.threadStateById,
      [threadId]: updater(currentThreadState),
    },
  }
}

function pushNotification(
  notifications: NotificationItem[],
  title: string,
  body: string,
  tone: NotificationTone = 'neutral',
  options: Partial<NotificationItem> = {},
) {
  return [createNotification(title, body, tone, 'Just now', options), ...notifications].slice(0, 12)
}

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]
}

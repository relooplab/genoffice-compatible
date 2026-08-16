import { useState } from 'react'
import type { AiProviderId, AiProviderMeta, AiSettings } from '@genoffice/ai-provider'

/**
 * Localized labels a host app supplies for the provider settings modal. Each
 * app owns its own i18n strings, so this shared component stays locale-agnostic.
 */
export interface AiProviderSettingsLabels {
  title: string
  provider: string
  apiKey: string
  baseUrl: string
  model: string
  /** placeholder for free-text model entry (custom provider) */
  modelPlaceholder: string
  save: string
  cancel: string
  gskLogin: string
  gskLoggedIn: string
  gskNotLoggedIn: string
  keyPlaceholder: string
}

export interface AiProviderSettingsProps {
  /** provider metadata (from @genoffice/ai-provider's AI_PROVIDERS) */
  providers: AiProviderMeta[]
  settings: AiSettings
  labels: AiProviderSettingsLabels
  /** Genspark account status; when set and not logged in, a sign-in button is shown for the genspark provider */
  gskAuth?: { loggedIn: boolean; email?: string } | undefined
  /** opens the Genspark sign-in flow (shell.openExternal) */
  onOpenLogin?: (() => void) | undefined
  /** persist the edited settings (host writes via setAiSettings and updates state) */
  onSave: (settings: AiSettings) => void
  onClose: () => void
}

function deepClone(settings: AiSettings): AiSettings {
  const providers = {} as AiSettings['providers']
  for (const id of Object.keys(settings.providers) as AiProviderId[]) {
    providers[id] = { ...settings.providers[id] }
  }
  return { provider: settings.provider, providers }
}

export function AiProviderSettings({
  providers,
  settings,
  labels,
  gskAuth,
  onOpenLogin,
  onSave,
  onClose,
}: AiProviderSettingsProps): React.JSX.Element {
  const [draft, setDraft] = useState<AiSettings>(() => deepClone(settings))
  const meta = providers.find((p) => p.id === draft.provider)

  const setActiveProvider = (id: AiProviderId): void => {
    setDraft((d) => (d.provider === id ? d : { ...d, provider: id }))
  }
  const patchConfig = (patch: Partial<AiSettings['providers'][AiProviderId]>): void => {
    setDraft((d) => ({
      ...d,
      providers: { ...d.providers, [d.provider]: { ...d.providers[d.provider], ...patch } },
    }))
  }

  const isGenspark = draft.provider === 'genspark'
  const needsBaseUrl = !!meta?.needsBaseUrl
  const modelOptions = meta?.models ?? []
return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal ai-provider-settings" role="dialog" aria-label={labels.title}>
        <div className="modal-title">{labels.title}</div>

        <label className="ai-provider-field">
          <span className="ai-provider-label">{labels.provider}</span>
          <div className="provider-tabs">
            {providers.map((p) => (
              <button
                key={p.id}
                className={`provider-tab${p.id === draft.provider ? ' provider-tab-active' : ''}`}
                onClick={() => setActiveProvider(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </label>

        {isGenspark && (
          <div className="ai-provider-gsk">
            {gskAuth?.loggedIn ? (
              <span className="ai-provider-status">
                {labels.gskLoggedIn}
                {gskAuth.email ? ` (${gskAuth.email})` : ''}
              </span>
            ) : (
              <button className="btn-primary" onClick={onOpenLogin}>
                {labels.gskLogin}
              </button>
            )}
            {!gskAuth?.loggedIn && <span className="ai-provider-hint">{labels.gskNotLoggedIn}</span>}
          </div>
        )}

        {!isGenspark && (
          <>
            <label className="ai-provider-field">
              <span className="ai-provider-label">{labels.apiKey}</span>
              <input
                className="ai-provider-input"
                type="password"
                value={draft.providers[draft.provider].apiKey}
                placeholder={labels.keyPlaceholder}
                onChange={(e) => patchConfig({ apiKey: e.target.value })}
                autoComplete="off"
                spellCheck={false}
              />
            </label>

            {needsBaseUrl && (
              <label className="ai-provider-field">
                <span className="ai-provider-label">{labels.baseUrl}</span>
                <input
                  className="ai-provider-input"
                  type="text"
                  value={draft.providers[draft.provider].baseUrl ?? ''}
                  placeholder="https://api.example.com/v1"
                  onChange={(e) => patchConfig({ baseUrl: e.target.value.trim() })}
                  spellCheck={false}
                />
              </label>
            )}

            {modelOptions.length > 0 ? (
              <label className="ai-provider-field">
                <span className="ai-provider-label">{labels.model}</span>
                <select
                  className="ai-provider-input"
                  value={draft.providers[draft.provider].model}
                  onChange={(e) => patchConfig({ model: e.target.value })}
                >
                  {!modelOptions.includes(draft.providers[draft.provider].model) && (
                    <option value={draft.providers[draft.provider].model}>
                      {draft.providers[draft.provider].model}
                    </option>
                  )}
                  {modelOptions.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="ai-provider-field">
                <span className="ai-provider-label">{labels.model}</span>
                <input
                  className="ai-provider-input"
                  type="text"
                  value={draft.providers[draft.provider].model}
                  placeholder={labels.modelPlaceholder}
                  onChange={(e) => patchConfig({ model: e.target.value })}
                  spellCheck={false}
                />
              </label>
            )}
          </>
        )}

        <div className="modal-actions">
          <button onClick={onClose}>{labels.cancel}</button>
          <button className="btn-primary" onClick={() => onSave(draft)}>
            {labels.save}
          </button>
        </div>
      </div>
    </div>
  )
}
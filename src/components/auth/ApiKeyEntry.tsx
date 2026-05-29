import { useState } from 'react';
import { useAuthStore } from '@/state/auth';
import styles from './ApiKeyEntry.module.css';

// GW2 API keys: hex groups separated by hyphens, at least 36 chars total
const GW2_KEY_RE = /^[0-9A-Fa-f]+(-[0-9A-Fa-f]+){3,}$/;

function isValidKeyFormat(key: string): boolean {
  return key.length >= 36 && GW2_KEY_RE.test(key);
}

interface Props {
  onSuccess: () => void;
}

export function ApiKeyEntry({ onSuccess }: Props) {
  const [value, setValue] = useState('');
  const setApiKey = useAuthStore((s) => s.setApiKey);

  const trimmed = value.trim();
  const isEmpty = trimmed.length === 0;
  const isMalformed = !isEmpty && !isValidKeyFormat(trimmed);
  const canSubmit = !isEmpty && !isMalformed;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setApiKey(trimmed);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputRow}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
          className={`${styles.input}${isMalformed ? ` ${styles.inputError}` : ''}`}
          autoComplete="off"
          spellCheck={false}
          aria-label="GW2 API key"
          aria-describedby={isMalformed ? 'key-error' : 'key-hint'}
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className={styles.connectBtn}
        >
          Connect
        </button>
      </div>

      {isMalformed && (
        <p id="key-error" role="alert" className={styles.error}>
          Format looks off — GW2 API keys are hex strings separated by hyphens.
        </p>
      )}

      <p id="key-hint" className={styles.hint}>
        Read-only key, stored on this device only, sent exclusively to the
        official GW2 API.{' '}
        <a
          href="https://account.arena.net/applications"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.hintLink}
        >
          Generate one at account.arena.net
        </a>{' '}
        and enable the <strong className={styles.hintStrong}>account</strong>,{' '}
        <strong className={styles.hintStrong}>characters</strong>, and{' '}
        <strong className={styles.hintStrong}>progression</strong> permissions —
        they can&rsquo;t be changed after the key is created, so check all three.
        Revocable from that same page at any time.
      </p>
    </form>
  );
}

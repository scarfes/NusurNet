import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface HealthCheckBadgeProps {
  ok: boolean;
  message: string;
}

/**
 * Visual indicator that the database connection works.
 * Will be removed/hidden in Sprint 1 once the real homepage takes over.
 */
export function HealthCheckBadge({ ok, message }: HealthCheckBadgeProps) {
  const t = useTranslations('home');

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border p-4 text-sm',
        ok
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800'
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'h-2.5 w-2.5 rounded-full',
            ok ? 'bg-emerald-500' : 'bg-red-500'
          )}
          aria-hidden
        />
        <span className="font-medium">
          {t('healthCheckLabel')}: {ok ? t('healthCheckOk') : t('healthCheckError')}
        </span>
      </div>
      <code className="hidden text-xs text-slate-600 sm:block">{message}</code>
    </div>
  );
}

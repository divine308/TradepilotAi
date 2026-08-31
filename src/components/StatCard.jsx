export default function StatCard({
  label,
  value,
  change,
  icon: Icon,
}) {

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-xs font-medium text-zinc-500">
            {label}
          </p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {value}
          </p>

          {change && (
            <p className="mt-2 text-xs text-emerald-400">
              {change}
            </p>
          )}

        </div>


        {Icon && (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 text-zinc-500">
            <Icon size={17} />
          </div>
        )}

      </div>

    </div>
  );
}
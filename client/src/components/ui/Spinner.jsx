export default function Spinner({ size = 'md' }) {
  const s = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${s[size]} border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`} />
    </div>
  )
}

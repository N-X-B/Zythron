with open("frontend/src/app/page.tsx", "r") as f:
    code = f.read()

# Replace low-contrast text classes with higher contrast ones
replacements = [
    ('text-zinc-500 mb-6 font-medium', 'text-zinc-300 mb-6 font-semibold bg-zinc-900/80 border border-zinc-700/80 px-4 py-1.5 rounded-full inline-block'),
    ('text-zinc-500 mb-4 font-medium', 'text-zinc-300 mb-4 font-semibold tracking-[0.35em]'),
    ('text-zinc-500 font-medium', 'text-zinc-300 font-semibold'),
    ('text-zinc-600 font-medium', 'text-zinc-400 font-medium'),
    ('text-zinc-600', 'text-zinc-400'),
    ('text-zinc-500', 'text-zinc-300'),
    ('text-zinc-400', 'text-zinc-200'),
    ('rgba(255,255,255,0.03)', 'rgba(255,255,255,0.08)'),
    ('rgba(255,255,255,0.04)', 'rgba(255,255,255,0.12)'),
    ('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.15)'),
    ('border-zinc-800/60', 'border-zinc-700/80'),
    ('border-zinc-800', 'border-zinc-700'),
]

for old, new in replacements:
    code = code.replace(old, new)

with open("frontend/src/app/page.tsx", "w") as f:
    f.write(code)

print("Elevated contrast across page.tsx")

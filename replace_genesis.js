const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'dashboard', 'GenesisEngineForm.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Remove timeLeft state and countdown effect
content = content.replace(/const \[timeLeft, setTimeLeft\] = useState\(12\);/, '');
content = content.replace(/\/\/ Time remaining countdown timer\s+useEffect\(\(\) => \{[\s\S]*?\}, \[isGenerating, statusStore\]\);/, '');
content = content.replace(/setTimeLeft\(12\);/, '');
content = content.replace(/setTimeLeft\(0\);/, '');

// 2. Add getMilestoneStatus helper before return statement
const getMilestoneStatus = `
  function getMilestoneStatus(id: string): 'pending' | 'active' | 'completed' {
    if (!isGenerating) return 'pending';
    switch (id) {
      case 'dna': return statusDna === 'completed' ? 'completed' : 'active';
      case 'brand': return statusBrand === 'completed' ? 'completed' : (statusBrand === 'running' ? 'active' : 'pending');
      case 'storefront': return (statusNavbar === 'completed' && statusLayout === 'completed') ? 'completed' : ((statusNavbar === 'running' || statusLayout === 'running') ? 'active' : 'pending');
      case 'categories': return statusCategories === 'completed' ? 'completed' : (statusCategories === 'running' ? 'active' : 'pending');
      case 'products': return statusProducts === 'completed' ? 'completed' : (statusProducts === 'running' ? 'active' : 'pending');
      case 'content': return statusFaq === 'completed' ? 'completed' : (statusFaq === 'running' ? 'active' : 'pending');
      case 'finalize': 
        if (statusStore === 'completed') return 'completed';
        const othersDone = statusDna === 'completed' && statusBrand === 'completed' && statusCategories === 'completed' && statusProducts === 'completed' && statusFaq === 'completed' && statusNavbar === 'completed' && statusLayout === 'completed';
        return othersDone ? 'active' : 'pending';
      default: return 'pending';
    }
  }

  const milestones = [
    { id: 'dna', label: 'Understanding business' },
    { id: 'brand', label: 'Creating brand' },
    { id: 'storefront', label: 'Designing storefront' },
    { id: 'categories', label: 'Building categories' },
    { id: 'products', label: 'Creating products' },
    { id: 'content', label: 'Writing content' },
    { id: 'finalize', label: 'Finalizing store' }
  ];
`;
content = content.replace(/return \(\s*<div className="flex-1 flex flex-col w-full min-h-0 relative overflow-hidden">/, getMilestoneStatus + '\n  return (\n    <div className="flex-1 flex flex-col w-full min-h-0 relative overflow-hidden">');

// 3. Update Split-screen wrapper and Left Panel
content = content.replace(
  /<div className="w-\[380px\] min-w-\[360px\] max-w-\[420px\] h-full flex flex-col border-r border-border\/40 bg-card shrink-0 min-h-0 overflow-hidden select-none">[\s\S]*?{statusStore !== 'completed' && \(\s*<Badge variant="secondary" className="font-mono text-xs px-2\.5 py-1">\s*~\{timeLeft\}s remaining\s*<\/Badge>\s*\)}\s*<\/div>/,
  `<div className="w-[30%] min-w-[320px] max-w-[420px] h-full flex flex-col border-r border-border/40 bg-card shrink-0 min-h-0 overflow-hidden select-none">
            <div className="p-6 border-b border-border/40 flex justify-between items-center bg-muted/20 shrink-0">
              <div className="flex items-center gap-2">
                <div className={cn("relative h-2 w-2 rounded-full", statusStore === 'completed' ? "bg-green-500" : "bg-primary animate-ping")} />
                <span className="text-xs font-bold uppercase tracking-widest text-foreground">Genesis Engine</span>
              </div>
              <Badge variant="secondary" className="font-mono text-xs px-2.5 py-1">
                {statusStore === 'completed' ? 'Complete' : 'Generating...'}
              </Badge>
            </div>`
);

// 4. Replace left panel content (Reasoning Logs & Cards) with simple milestones
content = content.replace(
  /<div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0">[\s\S]*?<\/div>\s*<\/div>\s*\{\/\* Right panel: Progressive Store Birth Canvas \*\/\}/,
  `<div className="flex-1 overflow-y-auto p-8 min-h-0 relative">
              <div className="absolute left-[47px] top-8 bottom-8 w-px bg-border/40" />
              <div className="space-y-8 relative">
                {milestones.map((m) => {
                  const s = getMilestoneStatus(m.id);
                  return (
                    <div key={m.id} className={cn("flex items-center gap-5 transition-all duration-500", s === 'pending' ? 'opacity-40' : 'opacity-100')}>
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card">
                        {s === 'completed' ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500 animate-in zoom-in duration-300">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : s === 'active' ? (
                          <div className="relative flex h-6 w-6 items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                        ) : (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted" />
                        )}
                      </div>
                      <span className={cn("text-sm transition-colors", s === 'active' ? 'text-primary font-bold shadow-sm' : s === 'completed' ? 'text-foreground font-medium' : 'text-muted-foreground font-medium')}>
                        {m.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Progressive Store Birth Canvas */}`
);

// 5. Update Right Panel widths
content = content.replace(
  /<div className="flex-1 h-full min-w-\[800px\] flex flex-col bg-muted\/10 relative overflow-hidden min-h-0">/,
  `<div className="w-[70%] flex-1 h-full flex flex-col bg-muted/10 relative overflow-hidden min-h-0">`
);

// 6. Update Preview Canvas reveal wrappers (Navbar)
content = content.replace(
  /\{\/\* Navbar Section \*\/\}\s*\{statusBrand === 'completed' && brand \? \(\s*<div className="bg-card\/90 px-6 py-4 flex items-center justify-between animate-in slide-in-from-top-4 duration-500">/,
  `{/* Navbar Section */}
              <div className="transition-all duration-300 ease-out">
                {statusBrand === 'completed' && brand ? (
                  <div className="bg-card/90 px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">`
);
content = content.replace(
  /<\/NavbarSkeleton>\s*\)\s*:\s*\(\s*<NavbarSkeleton \/>\s*\)\}/, // In case, but let's do precise
  `</NavbarSkeleton>\n                )}`
);

content = content.replace(
  /<NavbarSkeleton \/>\s*\)\}/,
  `<NavbarSkeleton />
                )}
              </div>`
);

// Hero
content = content.replace(
  /\{\/\* Hero Section \*\/\}\s*\{statusBrand === 'completed' && brand \? \(\s*<div className="px-6 py-16 grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto animate-in fade-in duration-700">/,
  `{/* Hero Section */}
              <div className="transition-all duration-300 ease-out delay-150">
                {statusBrand === 'completed' && brand ? (
                  <div className="px-6 py-16 grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto animate-in fade-in duration-300 delay-150">`
);
content = content.replace(
  /<HeroSkeleton \/>\s*\)\}/,
  `<HeroSkeleton />
                )}
              </div>`
);

// Category Grid
content = content.replace(
  /\{\/\* Category Grid Section \*\/\}\s*\{statusCategories === 'completed' && categories\.length > 0 \? \(\s*<div className="px-6 py-12 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">/,
  `{/* Category Grid Section */}
              <div className="transition-all duration-300 ease-out">
                {statusCategories === 'completed' && categories.length > 0 ? (
                  <div className="px-6 py-12 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">`
);
content = content.replace(
  /<CategoryGridSkeleton \/>\s*\)\}/,
  `<CategoryGridSkeleton />
                )}
              </div>`
);

// Product Grid
content = content.replace(
  /\{\/\* Product Grid Section \*\/\}\s*\{statusProducts === 'completed' && products\.length > 0 \? \(\s*<div className="px-6 py-12 max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">/,
  `{/* Product Grid Section */}
              <div className="transition-all duration-300 ease-out">
                {statusProducts === 'completed' && products.length > 0 ? (
                  <div className="px-6 py-12 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">`
);
content = content.replace(
  /<ProductGridSkeleton \/>\s*\)\}/,
  `<ProductGridSkeleton />
                )}
              </div>`
);

// Testimonials
content = content.replace(
  /\{\/\* Testimonials Section \*\/\}\s*\{statusFaq === 'completed' && testimonials\.length > 0 \? \(\s*<div className="px-6 py-12 max-w-5xl mx-auto space-y-8 bg-muted\/5 animate-in slide-in-from-bottom-4 duration-700">/,
  `{/* Testimonials Section */}
              <div className="transition-all duration-300 ease-out">
                {statusFaq === 'completed' && testimonials.length > 0 ? (
                  <div className="px-6 py-12 max-w-5xl mx-auto space-y-8 bg-muted/5 animate-in fade-in slide-in-from-bottom-2 duration-300">`
);
content = content.replace(
  /<TestimonialsSkeleton \/>\s*\)\}/,
  `<TestimonialsSkeleton />
                )}
              </div>`
);

// FAQ
content = content.replace(
  /\{\/\* FAQ Section \*\/\}\s*\{statusFaq === 'completed' && faq\.length > 0 \? \(\s*<div className="px-6 py-12 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">/,
  `{/* FAQ Section */}
              <div className="transition-all duration-300 ease-out delay-150">
                {statusFaq === 'completed' && faq.length > 0 ? (
                  <div className="px-6 py-12 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">`
);
content = content.replace(
  /<FaqSkeleton \/>\s*\)\}/,
  `<FaqSkeleton />
                )}
              </div>`
);

// Footer
content = content.replace(
  /\{\/\* Footer Section \*\/\}\s*\{statusBrand === 'completed' && brand \? \(\s*<div className="bg-card px-6 py-12 border-t border-border\/20 text-xs text-muted-foreground space-y-8 animate-in slide-in-from-bottom-4 duration-500">/,
  `{/* Footer Section */}
              <div className="transition-all duration-300 ease-out">
                {statusBrand === 'completed' && brand ? (
                  <div className="bg-card px-6 py-12 border-t border-border/20 text-xs text-muted-foreground space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">`
);
content = content.replace(
  /<FooterSkeleton \/>\s*\)\}/,
  `<FooterSkeleton />
                )}
              </div>`
);

// 7. Update Celebration Overlay
content = content.replace(
  /\{\/\* Celebration Screen Overlay[\s\S]*?Open Studio\n                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" \/>\n                <\/Button>\n              <\/div>\n            \)\}/,
  `{/* Celebration Screen Overlay */}
            {statusStore === 'completed' && projectId && brand && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-700 z-50">
                <div className="relative h-24 w-24 mb-6">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  <div className="relative h-24 w-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20">
                    <Check className="h-12 w-12 text-green-500" />
                  </div>
                </div>

                <div className="text-center space-y-2 max-w-md">
                  <h4 className="text-3xl font-extrabold tracking-tight text-green-500">✓ Store Created</h4>
                  <p className="text-4xl font-serif italic text-foreground font-bold pt-2">{brand.name}</p>
                </div>

                {/* Stats list */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-8 p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur font-mono text-sm shadow-xl">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>6 Products Created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>4 Categories Created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>5 FAQs Created</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>3 Testimonials Created</span>
                  </div>
                </div>

                <Button
                  onClick={() => router.push(\`/studio/\${projectId}\`)}
                  className="mt-10 h-14 px-8 text-lg font-semibold shadow-2xl hover:shadow-primary/20 transition-all gap-2 rounded-xl group bg-primary text-primary-foreground"
                >
                  Open Studio
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}`
);


fs.writeFileSync(filePath, content);
console.log('Successfully updated GenesisEngineForm.tsx!');

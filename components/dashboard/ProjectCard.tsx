'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/i18n-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { 
  MoreVertical, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Settings2,
  Layout,
  Palette
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProjectSummary } from '@/types';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectSummary;
  onDelete?: (id: string) => void;
}

function formatDate(value: string, locale: string) {
  const dateLocale = locale === 'uz' ? 'uz-UZ' : locale === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.DateTimeFormat(dateLocale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { t, locale } = useTranslation();

  // Extract color for thumbnail from store_config
  const config = ('config' in project.store_config) 
    ? project.store_config.config 
    : project.store_config;
  
  const primaryColor = config?.theme?.colors?.light?.primary || 'oklch(0.6 0.2 250)';
  const secondaryColor = config?.theme?.colors?.light?.secondary || 'oklch(0.9 0.05 250)';
  const brandName = config?.brand?.name || project.name;
  const tagline = config?.brand?.tagline || '';

  return (
    <Card className="group border-border/40 bg-card overflow-hidden rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
        <div 
          className="absolute inset-0 opacity-20 transition-transform duration-700 group-hover:scale-110"
          style={{ 
            background: `radial-gradient(circle at 20% 20%, ${primaryColor}, transparent), radial-gradient(circle at 80% 80%, ${secondaryColor}, transparent)` 
          }}
        />
        
        {/* Mock UI Preview */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="w-full max-w-[140px] aspect-video rounded-lg bg-background/80 backdrop-blur shadow-2xl border border-white/20 flex flex-col p-2 space-y-1.5 animate-in fade-in zoom-in duration-700">
            <div className="h-1.5 w-8 rounded-full bg-primary/40 mb-1" />
            <div className="h-4 w-full rounded bg-muted/40" />
            <div className="h-2.5 w-2/3 rounded bg-muted/30" />
            <div className="flex gap-1 mt-auto">
              <div className="h-6 w-1/3 rounded bg-primary/20" />
              <div className="h-6 w-1/3 rounded bg-muted/20" />
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-4">
          <Badge variant={project.status === 'published' ? 'default' : 'secondary'} className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-lg">
            {t(`dashboard.status.${project.status}`)}
          </Badge>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur border-white/20 shadow-lg">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl border-border/40 shadow-xl">
              <DropdownMenuItem className="gap-2 rounded-xl focus:bg-primary/5 focus:text-primary cursor-pointer">
                <ExternalLink className="h-4 w-4" />
                View Site
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(project.id)}
                className="gap-2 rounded-xl text-destructive focus:bg-destructive/5 focus:text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                {t('dashboard.deleteProject')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="p-6 pb-2">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight truncate">{brandName}</h3>
          <p className="text-xs text-muted-foreground font-medium truncate italic">{tagline}</p>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-2">
        <div className="flex items-center gap-4 text-[11px] font-medium text-muted-foreground/80">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatDate(project.updated_at, locale)}
          </div>
          <div className="flex items-center gap-1.5">
            <Layout className="h-3.5 w-3.5" />
            {project.status === 'draft' ? 'v1.0.0' : 'Live'}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4 flex gap-3">
        <Button asChild className="flex-1 rounded-2xl font-bold shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all">
          <Link href={`/studio/${project.id}`}>
            <Settings2 className="mr-2 h-4 w-4" />
            {t('dashboard.openStudio')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Folder, 
  Plus, 
  Video, 
  Settings, 
  User, 
  ChevronRight,
  MoreHorizontal,
  Film,
  Home,
  HelpCircle,
  LogOut,
  Trash2,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInput,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/hooks/use-session';
import { useProjects } from '@/hooks/use-projects';
import { CreateProjectDialog } from '@/components/create-project-dialog';
import { EditProjectDialog } from '@/components/edit-project-dialog';
import { DeleteProjectDialog } from '@/components/delete-project-dialog';

type Project = {
  id: string;
  title: string;
  createdAt: string;
  videoCount?: number;
};

type Folder = {
  id: string;
  name: string;
  projects: Project[];
};

export function AppSidebar() {
  const pathname = usePathname();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, loading: sessionLoading, signOut } = useSession({ suspense: false });
  const { projects, loading: projectsLoading, create, update, remove } = useProjects();

  useEffect(() => {
    // Optional: map a folder grouping if needed; keeping simple for now
    setFolders([]);
  }, []);

  const isProjectActive = (projectId: string) => {
    return pathname === `/dashboard/projects/${projectId}`;
  };

  const isDashboardActive = () => {
    return pathname === '/dashboard';
  };

  const displayName = user?.name ?? user?.email ?? 'User';
  const displayEmail = user?.email ?? '';


  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-4 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex items-center gap-2 flex-1 group-data-[collapsible=icon]:flex-none">
            <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Film className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">SYNTHATAR</span>
          </div>
        </div>
        
        <div className="px-4 pb-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <CreateProjectDialog onCreateProject={create}>
            <Button 
              className="w-full justify-start gap-2 h-10 bg-blue-600 hover:bg-blue-700 text-white group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:w-10"
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium group-data-[collapsible=icon]:hidden">New project</span>
            </Button>
          </CreateProjectDialog>
        </div>

        <div className="px-4 pb-4 group-data-[collapsible=icon]:hidden">
          <SidebarInput
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={isDashboardActive()} 
                tooltip="Dashboard"
                className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Folders Section */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Folders</span>
            <button className="h-4 w-4 p-0 hover:bg-transparent">
              <Plus className="h-4 w-4" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">New Folder</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              {folders.map((folder) => (
                <SidebarMenuItem key={folder.id}>
                  <div className="group flex items-center">
                    <SidebarMenuButton className="flex-1">
                      <Folder className="h-4 w-4" />
                      <span>{folder.name}</span>
                    </SidebarMenuButton>
                    <button className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded hover:bg-sidebar-accent flex items-center justify-center">
                      <MoreHorizontal className="h-3 w-3" />
                    </button>
                  </div>
                  {folder.projects.length > 0 && (
                    <SidebarMenuSub>
                      {folder.projects.map((project) => (
                        <SidebarMenuSubItem key={project.id}>
                          <SidebarMenuSubButton asChild isActive={isProjectActive(project.id)}>
                            <Link href={`/dashboard/projects/${project.id}`}>
                              <Video className="h-3 w-3" />
                              <span>{project.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Projects Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
            <span>Projects</span>
            <CreateProjectDialog onCreateProject={create}>
              <button className="h-4 w-4 p-0 hover:bg-transparent">
                <Plus className="h-4 w-4" />
              </button>
            </CreateProjectDialog>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projectsLoading ? (
                <SidebarMenuItem>
                  <div className="flex items-center gap-2 px-2 py-1.5 group-data-[collapsible=icon]:justify-center">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 flex-1 bg-muted rounded animate-pulse group-data-[collapsible=icon]:hidden"></div>
                  </div>
                </SidebarMenuItem>
              ) : (
                projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <div className="group flex items-center group-data-[collapsible=icon]:justify-center">
                      <SidebarMenuButton 
                        asChild 
                        isActive={isProjectActive(project.id)} 
                        className="flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
                        tooltip={project.title}
                      >
                        <Link href={`/dashboard/projects/${project.id}`} className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                          <div className="h-5 w-5 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex-shrink-0"></div>
                          <span className="truncate group-data-[collapsible=icon]:hidden">{project.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 group-data-[collapsible=icon]:hidden">
                        <EditProjectDialog 
                          project={project} 
                          onEditProject={update}
                        >
                          <button className="h-6 w-6 rounded hover:bg-sidebar-accent flex items-center justify-center">
                            <MoreHorizontal className="h-3 w-3" />
                          </button>
                        </EditProjectDialog>
                        <DeleteProjectDialog 
                          project={project} 
                          onDeleteProject={remove}
                        >
                          <button className="h-6 w-6 rounded hover:bg-sidebar-accent flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </DeleteProjectDialog>
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10"
                  tooltip="User Menu"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                      {(displayName || 'U').slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-xs group-data-[collapsible=icon]:hidden">
                    <span className="font-medium">
                      {sessionLoading ? 'Loading…' : displayName}
                    </span>
                    <span className="text-muted-foreground">
                      {sessionLoading ? '' : displayEmail}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
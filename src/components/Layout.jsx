import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, MessageCircle, LogOut, User, Home, Store, Briefcase, Users, GitBranch, Settings as SettingsIcon, 
  ChevronDown, Menu, UserCheck as UserSearch, Heart, Wrench, MoreHorizontal, ChevronRight, Users2, ListChecks, SearchCheck, Workflow, MessagesSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { useAuth } from '../hooks/useAuth.jsx';
import { useNotifications } from '../hooks/useNotifications.jsx';
import { useMessages } from '../hooks/useMessages.jsx';

const Layout = ({ children, currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const { unreadCount: unreadNotifications } = useNotifications();
  const { unreadCount: unreadMessages } = useMessages();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const commonNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'forum', label: 'Forum', icon: MessagesSquare },
  ];
  
  const advertiserNav = [
    ...commonNavItems,
    { 
      id: 'management', label: 'Management', icon: ListChecks,
      children: [
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'customers', label: 'Customers', icon: Users2 },
        { id: 'pipeline', label: 'Pipeline', icon: Workflow },
      ]
    },
    { 
      id: 'service-pros-tools', label: 'Service Pros', icon: Wrench,
      children: [
        { id: 'servicePros', label: 'Find Service Pros', icon: SearchCheck },
        { id: 'favorites', label: 'Favorites', icon: Heart },
      ]
    },
  ];
  
  const technicianNav = [
    ...commonNavItems,
    { id: 'marketplace', label: 'Marketplace', icon: Store },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'pipeline', label: 'My Leads', icon: Workflow },
  ];

  const navigation = user?.userType === 'advertiser' ? advertiserNav : technicianNav;

  const NavItem = ({ item, isMobile = false }) => {
    const Icon = item.icon;

    const handleClick = () => {
      setCurrentView(item.id);
      if (isMobile) setMobileMenuOpen(false);
    };
    
    const buttonContent = (
      <Button
        variant={currentView === item.id || (item.id === 'forum' && (currentView === 'forum_category' || currentView === 'forum_thread')) ? "default" : "ghost"}
        className={`justify-start text-sm font-medium 
          ${currentView === item.id || (item.id === 'forum' && (currentView === 'forum_category' || currentView === 'forum_thread')) ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
          ${isMobile ? 'w-full' : 'px-3 py-2'}`}
        onClick={handleClick}
      >
        <Icon className="h-4 w-4 mr-2" />
        {item.label}
      </Button>
    );

    return isMobile ? <SheetClose asChild>{buttonContent}</SheetClose> : buttonContent;
  };

  const NavDropdownItem = ({ item, isMobile = false }) => {
    const MainIcon = item.icon;
    const isActive = item.children.some(child => child.id === currentView) || currentView === item.id;
    const [isSubmenuOpen, setIsSubmenuOpen] = React.useState(false);

    if (isMobile) {
      return (
        <div className="w-full">
          <Button
            variant={isActive && !isSubmenuOpen ? "secondary" : "ghost"}
            className={`justify-between text-sm font-medium w-full px-3 py-2 
              ${isActive && !isSubmenuOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
          >
            <div className="flex items-center">
              <MainIcon className="h-4 w-4 mr-2" />
              {item.label}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isSubmenuOpen ? 'rotate-180' : ''}`} />
          </Button>
          {isSubmenuOpen && (
            <div className="pl-4 mt-1 space-y-1 border-l-2 border-gray-200 ml-3">
              {item.children.map(child => {
                const ChildIcon = child.icon;
                return (
                  <SheetClose asChild key={child.id}>
                    <Button
                      variant={currentView === child.id ? "default" : "ghost"}
                      className={`justify-start text-sm font-medium w-full 
                        ${currentView === child.id ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}
                      onClick={() => {
                        setCurrentView(child.id);
                        setMobileMenuOpen(false); 
                      }}
                    >
                      <ChildIcon className="h-4 w-4 mr-2" />
                      {child.label}
                    </Button>
                  </SheetClose>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            className={`justify-start text-sm font-medium px-3 py-2
            ${isActive ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
          >
            <MainIcon className="h-4 w-4 mr-2" />
            {item.label}
            <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" sideOffset={5}>
          <DropdownMenuGroup>
            {item.children.map(child => {
              const ChildIcon = child.icon;
              return (
                <DropdownMenuItem key={child.id} onClick={() => setCurrentView(child.id)}
                  className={currentView === child.id ? 'bg-gray-100' : ''}
                >
                  <ChildIcon className="h-4 w-4 mr-2" />
                  {child.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-4">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-bold text-gradient">ServiceHub</h2>
                     <SheetClose asChild>
                        <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
                     </SheetClose>
                  </div>
                  <nav className="flex flex-col space-y-1.5">
                    {navigation.map((item) => (
                      item.children ? 
                      <NavDropdownItem key={item.id} item={item} isMobile={true} /> :
                      <NavItem key={item.id} item={item} isMobile={true} />
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              <h1 className="text-2xl font-bold text-gradient">ServiceHub</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex bg-gradient-to-r from-blue-500 to-green-500 text-white">
                {user?.userType === 'advertiser' ? 'Advertiser' : 'Service Pro'}
              </Badge>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                item.children ? 
                <NavDropdownItem key={item.id} item={item} /> :
                <NavItem key={item.id} item={item} />
              ))}
            </nav>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCurrentView('messages')}
              >
                <MessageCircle className="h-5 w-5" />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadMessages}
                  </span>
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
                onClick={() => setCurrentView('notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 h-auto">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden xl:block text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4 text-gray-500 hidden xl:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center xl:hidden">
                     <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {user?.name}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="hidden xl:block">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="xl:hidden"/>
                   <DropdownMenuItem onClick={() => setCurrentView('messages')} className="sm:hidden">
                     <MessageCircle className="mr-2 h-4 w-4" />
                     <span>Messages</span>
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setCurrentView('notifications')} className="sm:hidden">
                     <Bell className="mr-2 h-4 w-4" />
                     <span>Notifications</span>
                      {unreadNotifications > 0 && ( <Badge variant="destructive" className="ml-auto">{unreadNotifications}</Badge> )}
                   </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentView('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView('settings')}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <motion.main 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default Layout;
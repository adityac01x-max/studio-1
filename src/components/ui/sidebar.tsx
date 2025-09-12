
"use client"

import * as React from "react"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarContextProps {
  isCollapsed: boolean
  isMobile: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

type SidebarProviderProps = React.PropsWithChildren<{
  defaultCollapsed?: boolean
}>

function SidebarProvider({
  children,
  defaultCollapsed = false,
}: SidebarProviderProps) {
  const isMobile = useIsMobile()
  const [isCollapsed, setCollapsed] = React.useState(
    isMobile ? true : defaultCollapsed
  )

  React.useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setCollapsed, isMobile: !!isMobile }}
    >
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.ComponentProps<"aside"> {
  collapsible?: "icon" | "button"
}

const Sidebar = React.forwardRef<React.ElementRef<"aside">, SidebarProps>(
  ({ className, children, collapsible = "button", ...props }, ref) => {
    const { isCollapsed, isMobile } = useSidebar()
    return (
      <aside
        ref={ref}
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out",
          !isMobile && (isCollapsed ? "w-16" : "w-64"),
          isMobile && "w-64",
          isMobile && isCollapsed && "hidden",
          className
        )}
        {...props}
      >
        {children}
        {collapsible && !isMobile && (
          <div className="mt-auto">
            {collapsible === "button" ? (
              <SidebarCollapseButton />
            ) : (
              <SidebarCollapseIcon />
            )}
          </div>
        )}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-16 shrink-0 items-center px-4", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-grow overflow-y-auto", className)}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-auto flex flex-col gap-y-1 border-t px-3 py-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"


const SidebarMenu = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-y-1 px-3 py-4", className)}
      {...props}
    />
  )
})
SidebarMenu.displayName = "SidebarMenu"

function SidebarMenuItem({
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "role">) {
  const { isCollapsed } = useSidebar()
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right">
          {
            React.Children.map(
              children,
              (child) =>
                React.isValidElement(child) &&
                (child.props.tooltip?.children || child.props.children)
            )[0]
          }
        </TooltipContent>
      </Tooltip>
    )
  }
  return <div {...props}>{children}</div>
}

type SidebarMenuButtonProps = Omit<ButtonProps, "children"> & {
  children?:
    | React.ReactNode
    | ((props: { isCollapsed: boolean }) => React.ReactNode)
  isActive?: boolean
  tooltip?: React.ComponentProps<typeof TooltipContent>
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      className,
      children,
      variant = "ghost",
      isActive = false,
      ...props
    },
    ref
  ) => {
    const { isCollapsed } = useSidebar()
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "h-10 w-full justify-start",
          isActive && "bg-primary/10 text-primary hover:bg-primary/20",
          className
        )}
        {...props}
      >
        {typeof children === "function" ? children({ isCollapsed }) : children}
        {!isCollapsed &&
          React.Children.map(
            children,
            (child) =>
              React.isValidElement(child) &&
              child.type === "span" && (
                <span className="sr-only">{child}</span>
              )
          )}
      </Button>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarInset = React.forwardRef<
  React.ElementRef<"main">,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  const { isCollapsed, isMobile } = useSidebar()
  return (
    <main
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-in-out",
        !isMobile && (isCollapsed ? "pl-16" : "pl-64"),
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

function SidebarCollapseButton(props: React.ComponentProps<"div">) {
  const { isCollapsed, setCollapsed } = useSidebar()
  return (
    <div {...props}>
      <div className="px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
          <span className={cn(isCollapsed ? "sr-only" : "ml-2")}>
            Collapse
          </span>
        </Button>
      </div>
    </div>
  )
}

function SidebarCollapseIcon() {
  const { isCollapsed, setCollapsed } = useSidebar()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-center"
            onClick={() => setCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
            <span className="sr-only">Toggle Collapse</span>
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">
        {isCollapsed ? "Expand" : "Collapse"}
      </TooltipContent>
    </Tooltip>
  )
}

export {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
}

"use client"

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import {
  GithubIcon,
  Logo,
} from "@/components/icons";

export const Navbar = () => {
  const { user, signOut } = useAuthStore();
  const { addNotification } = useUIStore();

  const handleLogout = async () => {
    try {
      await signOut();
      addNotification({
        type: 'success',
        title: 'Logout realizado',
        message: 'Você foi desconectado com sucesso'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro no logout',
        message: 'Não foi possível desconectar'
      });
    }
  };

  return (
    <HeroUINavbar maxWidth="xl" position="sticky" className="bg-background/70 backdrop-blur-md border-b border-divider">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Logo />
            <p className="font-bold text-inherit text-primary">Create Hack G17</p>
          </NextLink>
        </NavbarBrand>
        {user && (
          <ul className="hidden lg:flex gap-4 justify-start ml-6">
            {siteConfig.navItems.map((item) => (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    linkStyles({ color: "foreground" }),
                    "data-[active=true]:text-primary data-[active=true]:font-medium hover:text-primary transition-colors",
                  )}
                  href={item.href}
                >
                  {item.label}
                </NextLink>
              </NavbarItem>
            ))}
          </ul>
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500 hover:text-primary transition-colors" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        
        {user && (
          <NavbarItem className="hidden md:flex">
            <Button
              onClick={handleLogout}
              className="text-sm font-normal"
              color="danger"
              variant="flat"
              size="sm"
            >
              Sair
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal aria-label="Github" href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        {user && <NavbarMenuToggle />}
      </NavbarContent>

      {user && (
        <NavbarMenu className="bg-background/95 backdrop-blur-md">
          <div className="mx-4 mt-2 flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <NextLink
                  className={clsx(
                    "w-full text-lg",
                    index === siteConfig.navMenuItems.length - 1
                      ? "text-danger hover:text-danger-600"
                      : "text-foreground hover:text-primary"
                  )}
                  href={item.href}
                  onClick={item.label === "Sair" ? handleLogout : undefined}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            ))}
          </div>
        </NavbarMenu>
      )}
    </HeroUINavbar>
  );
};

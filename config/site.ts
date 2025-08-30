export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Create Hack G17",
  description: "Plataforma de gestão e métricas para atividades filantrópicas",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Atividades",
      href: "/activities",
    },
    {
      label: "Métricas",
      href: "/metrics",
    },
    {
      label: "Mapa",
      href: "/map",
    },
    {
      label: "Sobre",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Atividades",
      href: "/activities",
    },
    {
      label: "Métricas",
      href: "/metrics",
    },
    {
      label: "Mapa",
      href: "/map",
    },
    {
      label: "Perfil",
      href: "/profile",
    },
    {
      label: "Configurações",
      href: "/settings",
    },
    {
      label: "Ajuda",
      href: "/help",
    },
    {
      label: "Sair",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/create-hack-g17",
    docs: "/about",
    support: "/help",
  },
};

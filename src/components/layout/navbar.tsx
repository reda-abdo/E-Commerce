"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Loader,
  ShoppingCart,
  Bookmark,
  LogOutIcon,
  Menu,
  X,
  User,
  Search
} from "lucide-react";
import { Button } from "@/components";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components";
import { cn } from "@/lib/utils";
import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "@/contexts/cartContext";
import { signOut, useSession } from "next-auth/react";
import { apiServices } from "@/services/api";

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, isLoading } = useContext(CartContext);
  const [isCartCount, setIsCartCount] = useState(cartCount)

  const { data, status } = useSession();

  useEffect(() => {
    if (data?.accessToken) {
      async function handelCount() {
        const datas = await apiServices.grtUserCart(data!.accessToken);
        setIsCartCount(datas!.numOfCartItems)
      }
      handelCount();
    }
  }, [cartCount || data?.expires]);


  const navItems = [
    { href: "/products", label: "Products" },
    { href: "/brands", label: "Brands" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto sm:px-20 md:px-0 ">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center pl-2 space-x-1">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                T
              </span>
            </div>
            <span className="font-bold text-xl">TechMart </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => {
                const isActive =
                  item.href == "/"
                    ? pathname == "/"
                    : pathname.startsWith(item.href);

                return (
                  <NavigationMenuItem key={item.href}>
                    <Link href={item.href}>
                      <NavigationMenuLink
                        className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50", isActive ? "bg-primary text-primary-foreground shadow-md font-semibold" : "bg-background hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")} >
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1">
            {/* Mobile Search */}
            {/* <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search </span>
            </Button> */}
            {status == "loading" ? (
              "Loading...."
            ) : status == "authenticated" ? (
              <>
                {/* User Account */}
                {/* <Link href="">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                </Link> */}

                {/* Shopping Cart */}
                {/* Wish List */}
                <Link href={"/wishList"}>
                  <Bookmark className="h-5 w-5 text-stone-600" />
                </Link>
                <Link href={"/cart"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer" >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      {isLoading ? (
                        <Loader className=" animate-spin" />
                      ) : (
                        isCartCount
                      )}
                    </span>
                    <span className="sr-only">Shopping cart</span>
                  </Button>
                </Link>
                <div className="flex gap-2 ms-3 items-center">
                  <p className="">Hi {data.user.name?.split(" ", 1)}</p>
                  <Button onClick={() => signOut()} variant="ghost" size="icon">
                    <LogOutIcon className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </div>
              </>
            ) : (<div className="flex gap-2">
              <Link href={"/auth/login"}>
                <Button> Login</Button>
              </Link>

              <Link href={"/auth/register"}>
                <Button> Register</Button>
              </Link>
            </div>

            )}

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden  absolute w-full border-t bg-background">
          <div className="container mx-auto  px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href === "/products" &&
                    pathname.startsWith("/products"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg text-sm font-medium   transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
